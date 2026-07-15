import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

/**
 * Middleware to check if user has access to a specific trade.
 * Usage: router.get('/api/theory/:tradeId', requireTradeAccess, handler)
 * The tradeId is expected in req.params.tradeId or req.query.tradeId.
 */
export async function requireTradeAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const tradeId = req.params.tradeId || req.query.tradeId as string;
  if (!tradeId) {
    res.status(400).json({ message: 'Trade ID required' });
    return;
  }

  const userId = req.user!.id;

  // Check if user has an active subscription granting access to this trade
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    orderBy: { createdAt: 'desc' },
  });

  // LIFETIME or MONTHLY with null tradeId = access to ALL trades
  const hasAllAccess = activeSub && (
    activeSub.plan === 'LIFETIME' ||
    (activeSub.plan === 'MONTHLY' && !activeSub.tradeId)
  );

  // MONTHLY with specific tradeId = access to that trade only
  const hasTradeAccess = activeSub && activeSub.plan === 'MONTHLY' && activeSub.tradeId === tradeId;

  if (hasAllAccess || hasTradeAccess) {
    next();
    return;
  }

  // Free tier — allow limited access (check rate limit in actual route handler)
  next();
}

/**
 * Get user's current trade access configuration.
 * Returns which trade IDs the user has access to.
 */
export async function getUserTradeAccess(userId: string): Promise<{
  type: 'free' | 'single' | 'all';
  tradeId?: string;
}> {
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ['ACTIVE', 'CANCELLED'] },
      ...(false ? {} : {}), // placeholder for future filter
    },
    orderBy: { createdAt: 'desc' },
  });

  // For CANCELLED subscriptions, only grant access if within the billing period
  if (activeSub && activeSub.status === 'CANCELLED' && activeSub.currentPeriod) {
    if (new Date(activeSub.currentPeriod) < new Date()) {
      // Period expired — treat as free
      return { type: 'free' };
    }
  }

  if (!activeSub) {
    return { type: 'free' };
  }

  if (activeSub.plan === 'LIFETIME') {
    return { type: 'all' };
  }

  if (activeSub.plan === 'MONTHLY' && !activeSub.tradeId) {
    return { type: 'all' };
  }

  if (activeSub.plan === 'MONTHLY' && activeSub.tradeId) {
    return { type: 'single', tradeId: activeSub.tradeId };
  }

  return { type: 'free' };
}
