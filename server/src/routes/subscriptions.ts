import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN'));

// Plan prices in cents (CAD)
const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  MONTHLY: 2999,
  LIFETIME: 19900,
};

/**
 * GET /api/admin/subscriptions
 * Returns dashboard data: stats + paginated subscription list + recent transactions.
 * Query: ?page=1&limit=10&status=ACTIVE&plan=MONTHLY&search=
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.status) {
      const validStatuses = ['ACTIVE', 'PAST_DUE', 'CANCELLED'];
      if (validStatuses.includes(req.query.status as string)) {
        where.status = req.query.status;
      }
    }

    if (req.query.plan) {
      const validPlans = ['FREE', 'MONTHLY', 'LIFETIME'];
      if (validPlans.includes(req.query.plan as string)) {
        where.plan = req.query.plan;
      }
    }

    // Fetch all subscriptions (for stats) and paginated slice
    const [allSubscriptions, paginatedSubscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.subscription.count({ where }),
    ]);

    // Compute stats
    const totalActive = allSubscriptions.filter((s) => s.status === 'ACTIVE').length;
    const activeSubscriptions = allSubscriptions.filter((s) => s.status === 'ACTIVE');
    const monthlySubs = activeSubscriptions.filter((s) => s.plan === 'MONTHLY').length;
    const lifetimeSubs = activeSubscriptions.filter((s) => s.plan === 'LIFETIME').length;
    const monthlyRevenue = (monthlySubs * PLAN_PRICES.MONTHLY) / 100;
    const yearlyRevenue = (lifetimeSubs * PLAN_PRICES.LIFETIME) / 100;
    const totalCancelled = allSubscriptions.filter((s) => s.status === 'CANCELLED').length;
    const churnRate = allSubscriptions.length > 0
      ? Math.round((totalCancelled / allSubscriptions.length) * 10000) / 100
      : 0;

    // Transform subscriptions
    const subscriptions = paginatedSubscriptions.map((sub) => ({
      id: sub.id,
      userId: sub.userId,
      user: { name: sub.user.name, email: sub.user.email },
      plan: sub.plan as 'FREE' | 'MONTHLY' | 'LIFETIME',
      status: sub.status,
      startedAt: sub.createdAt.toISOString(),
      renewsAt: sub.currentPeriod ? sub.currentPeriod.toISOString() : sub.createdAt.toISOString(),
      amount: (PLAN_PRICES[sub.plan] ?? 0) / 100,
      cancelAtPeriodEnd: false,
      stripeSubId: sub.stripeSubId,
      stripeCustomerId: null,
    }));

    res.json({
      totalActive,
      monthlyRevenue,
      yearlyRevenue,
      churnRate,
      subscriptions,
      totalCount: total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[Subscriptions] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/subscriptions/:id
 * Cancel a subscription (soft — sets status to CANCELLED).
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id: req.params.id } });
    if (!subscription) {
      res.status(404).json({ message: 'Subscription not found' });
      return;
    }

    await prisma.subscription.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    console.error('[Subscriptions] Cancel error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
