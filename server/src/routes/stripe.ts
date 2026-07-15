import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import stripe, { Stripe } from '../config/stripe';

const router = Router();

type PlanType = 'essential' | 'pro' | 'lifetime';

const PLAN_PRICES: Record<PlanType, { priceId: string; label: string }> = {
  essential: { priceId: env.STRIPE_ESSENTIAL_PRICE_ID, label: 'ESSENTIEL' },
  pro: { priceId: env.STRIPE_PRO_PRICE_ID, label: 'PRO' },
  lifetime: { priceId: env.STRIPE_LIFETIME_PRICE_ID, label: 'LIFETIME' },
};

/**
 * POST /api/stripe/create-checkout-session
 * Creates a Stripe Checkout session for essential ($29/mois), pro ($49/mois) or lifetime ($559).
 * Optionally accepts a tradeId for plan locking.
 */
router.post('/create-checkout-session', authenticate, async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const { plan, tradeId } = req.body;
  if (!plan || !['essential', 'pro', 'lifetime'].includes(plan)) {
    res.status(400).json({ message: 'Invalid plan. Must be "essential", "pro" or "lifetime".' });
    return;
  }

  const planConfig = PLAN_PRICES[plan as PlanType];

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // If a tradeId is provided for essential plan, verify it exists
  if (tradeId) {
    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    if (!trade) {
      res.status(400).json({ message: 'Invalid trade selected.' });
      return;
    }
  }

  // For essential plan, tradeId is required
  if (plan === 'essential' && !tradeId) {
    res.status(400).json({ message: 'Trade selection is required for the essential plan.' });
    return;
  }

  try {
    const mode = plan === 'lifetime' ? 'payment' : 'subscription';
    const metadata: Record<string, string> = {
      userId: user.id,
      plan: planConfig.label,
    };
    if (tradeId) {
      metadata.tradeId = tradeId;
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      metadata,
      success_url: `${env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
      customer_email: user.email,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(`[Stripe] Checkout session created for user ${user.id} (${plan}): ${session.id}`);

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create-checkout-session error:', err);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/webhook
 * Handles Stripe events using raw body stored in req.rawBody (set via verify callback in index.ts).
 */
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const sig = req.headers['stripe-signature'] as string;
  const rawBody = (req as any).rawBody;

  if (!rawBody) {
    res.status(400).json({ message: 'Missing raw body for webhook verification' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Stripe] Webhook signature verification failed:', err.message);
    res.status(400).json({ message: 'Invalid signature' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const tradeId = session.metadata?.tradeId;

        if (!userId) {
          console.warn('[Stripe] Webhook: missing userId in session metadata');
          break;
        }

        const now = new Date();
        const periodEnd = plan === 'LIFETIME'
          ? new Date('2099-12-31')
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const dbPlan = plan === 'LIFETIME' ? 'LIFETIME' : plan === 'PRO' ? 'MONTHLY' : 'MONTHLY';

        // Upsert subscription
        const existing = await prisma.subscription.findFirst({
          where: { userId, status: 'ACTIVE' },
        });

        const data: any = {
          userId,
          plan: dbPlan,
          status: 'ACTIVE',
          stripeSubId: (session.subscription as string) || session.id,
          currentPeriod: periodEnd,
        };

        // Lock trade for essential plan
        if (tradeId) {
          data.tradeId = tradeId;
        }

        if (existing) {
          await prisma.subscription.update({ where: { id: existing.id }, data });
        } else {
          await prisma.subscription.create({ data });
        }

        // Also update the User's plan and subStatus
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: dbPlan,
            subStatus: 'ACTIVE',
          },
        });

        // Store the Stripe customer ID on the User
        if (session.customer) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeId: session.customer as string },
          });
        }

        console.log(`[Stripe] ${dbPlan} subscription created/updated for user ${userId}`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubId: invoice.subscription as string },
          });
          if (sub) {
            const periodEnd = new Date((invoice.lines?.data[0]?.period?.end ?? Date.now() / 1000) * 1000);
            await prisma.subscription.update({
              where: { id: sub.id },
              data: {
                status: 'ACTIVE',
                currentPeriod: periodEnd,
              },
            });
            console.log(`[Stripe] Invoice paid for subscription ${invoice.subscription}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription;
        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubId: stripeSub.id },
        });
        if (existingSub) {
          const status = stripeSub.status === 'active' ? 'ACTIVE'
            : stripeSub.status === 'past_due' ? 'PAST_DUE'
            : 'CANCELLED';
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status,
              currentPeriod: new Date(stripeSub.current_period_end * 1000),
            },
          });
          console.log(`[Stripe] Subscription ${stripeSub.id} updated to ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription.findFirst({
          where: { stripeSubId: deletedSub.id },
        });
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { status: 'CANCELLED' },
          });
          console.log(`[Stripe] Subscription ${deletedSub.id} cancelled`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        const failedSub = await prisma.subscription.findFirst({
          where: { stripeSubId: failedInvoice.subscription as string },
        });
        if (failedSub) {
          await prisma.subscription.update({
            where: { id: failedSub.id },
            data: { status: 'PAST_DUE' },
          });
          console.log(`[Stripe] Payment failed for subscription ${failedInvoice.subscription}`);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe] Webhook handler error:', err);
    res.status(500).json({ message: 'Webhook handler error' });
  }
});

/**
 * POST /api/stripe/create-portal-session
 * Creates a Stripe Customer Portal session for managing subscription.
 */
router.post('/create-portal-session', authenticate, async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const stripeCustomerId = user.stripeId;

  if (!stripeCustomerId) {
    res.status(400).json({ message: 'No Stripe customer found. Please subscribe first.' });
    return;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${env.FRONTEND_URL}/profile`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create-portal-session error:', err);
    res.status(500).json({ message: 'Failed to create portal session' });
  }
});

export default router;
