import StripeLib from 'stripe';
import { env } from './env';

let stripe: StripeLib | null = null;

try {
  if (env.STRIPE_SECRET_KEY) {
    stripe = new StripeLib(env.STRIPE_SECRET_KEY);
  }
} catch {
  console.warn('[Stripe] Failed to initialize — check STRIPE_SECRET_KEY');
}

export default stripe;
export { StripeLib as Stripe };
