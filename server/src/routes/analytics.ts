import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * GET /api/admin/analytics/dashboard
 * Full analytics for the admin dashboard.
 * Query: ?days=30
 */
router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const days = Math.min(365, Math.max(1, parseInt(req.query.days as string) || 30));
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [
      totalUsers,
      activeSubscriptions,
      totalExamsTaken,
      userGrowth,
      questionsByDifficulty,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(*) as count FROM "Question" WHERE "createdAt" >= $1`, [new Date(0).toISOString()]
      ).catch(() => [{ count: BigInt(0) }]),
      // userGrowth for selected period — group by created date
      prisma.$queryRawUnsafe<Array<{ day: string; count: bigint }>>(
        `SELECT DATE("createdAt") as day, COUNT(*)::int as count FROM "User" WHERE "createdAt" >= $1 GROUP BY DATE("createdAt") ORDER BY day`,
        [startDate.toISOString()]
      ).catch(() => []),
      // questions by difficulty
      prisma.$queryRawUnsafe<Array<{ difficulty: string; count: bigint }>>(
        `SELECT "difficulty", COUNT(*)::int as count FROM "Question" GROUP BY "difficulty"`
      ).catch(() => []),
    ]);

    // Process user growth
    const userGrowthArray = Array.isArray(userGrowth)
      ? (userGrowth as Array<{ day: string; count: bigint }>).map((r) => ({
          date: r.day,
          count: Number(r.count),
        }))
      : [];

    // Process questions by difficulty
    const difficultyMap: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
    if (Array.isArray(questionsByDifficulty)) {
      for (const row of questionsByDifficulty as Array<{ difficulty: string; count: bigint }>) {
        const key = row.difficulty?.toUpperCase() || 'MEDIUM';
        if (key in difficultyMap) {
          difficultyMap[key] = Number(row.count);
        }
      }
    }

    // Revenue by month - from subscriptions
    const subsLast12Months = await prisma.subscription.findMany({
      where: { createdAt: { gte: twelveMonthsAgo }, status: 'ACTIVE' },
      select: { plan: true, createdAt: true },
    });

    const planAmount: Record<string, number> = { FREE: 0, MONTHLY: 2999, LIFETIME: 19900 };
    const revenueMap: Record<string, { month: string; amount: number }> = {};
    for (const sub of subsLast12Months) {
      const monthKey = sub.createdAt.toISOString().slice(0, 7);
      if (!revenueMap[monthKey]) {
        revenueMap[monthKey] = { month: monthKey, amount: 0 };
      }
      revenueMap[monthKey].amount += planAmount[sub.plan] ?? 0;
    }
    const revenueByMonth = Object.values(revenueMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    // Recent activity — last 20 entries from user creation/subscriptions
    const recentActivity = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      totalUsers,
      activeSubscriptions,
      overallPassRate: 0,
      userGrowth: userGrowthArray,
      revenueByMonth,
      questionsByDifficulty: difficultyMap,
      passRateByExam: [],
      recentActivity: recentActivity.map((u) => ({
        id: u.id,
        action: 'USER_REGISTERED',
        createdAt: u.createdAt.toISOString(),
        user: u.name ? { name: u.name, email: u.email } : undefined,
      })),
    });
  } catch (err) {
    console.error('[Analytics] Dashboard error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
