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
      totalTrades,
      totalChapters,
      totalQuestions,
      activeSubscriptions,
      userGrowth,
      questionsByDifficulty,
      questionsByTradeRaw,
      questionsByLocaleRaw,
      planDistributionRaw,
      lastRegisteredUsers,
      recentSubscriptions,
      recentContactMessages,
      recentQuestionsAdded,
      activeUsersTodayRaw,
      totalExamsTaken,
      allAttempts,
      recentExamAttempts,
      recentAnsweredQuestions,
      topFailedQuestionsRaw,
      recentChatSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trade.count(),
      prisma.chapter.count(),
      prisma.question.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      // userGrowth for selected period — group by created date
      prisma.$queryRawUnsafe<Array<{ day: string; count: bigint }>>(
        `SELECT DATE("createdAt") as day, COUNT(*)::int as count FROM "User" WHERE "createdAt" >= $1::timestamp GROUP BY DATE("createdAt") ORDER BY day`,
        startDate.toISOString()
      ).catch(() => []),
      // questions by difficulty
      prisma.$queryRawUnsafe<Array<{ difficulty: string; count: bigint }>>(
        `SELECT "difficulty", COUNT(*)::int as count FROM "Question" GROUP BY "difficulty"`
      ).catch(() => []),
      // questions by trade
      prisma.$queryRawUnsafe<Array<{ code: string; name: string; "nameFr": string; count: bigint }>>(
        `SELECT t."code", t."name", t."nameFr", COUNT(q."id")::int as count FROM "Trade" t LEFT JOIN "Question" q ON q."tradeId" = t."id" GROUP BY t."code", t."name", t."nameFr" ORDER BY count DESC`
      ).catch(() => []),
      // questions by locale
      prisma.$queryRawUnsafe<Array<{ locale: string; count: bigint }>>(
        `SELECT "locale", COUNT(*)::int as count FROM "Question" GROUP BY "locale"`
      ).catch(() => []),
      // plan distribution
      prisma.$queryRawUnsafe<Array<{ plan: string; count: bigint }>>(
        `SELECT "plan", COUNT(*)::int as count FROM "User" GROUP BY "plan"`
      ).catch(() => []),
      // last 15 registered users
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          role: true,
          createdAt: true,
        },
      }),
      // recent subscriptions — last 10 with user info
      prisma.subscription.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { id: true, name: true, email: true, plan: true } },
        },
      }),
      // recent contact messages — last 10
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          direction: true,
          status: true,
          createdAt: true,
        },
      }),
      // recent questions added — last 10
      prisma.question.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          question: true,
          difficulty: true,
          locale: true,
          createdAt: true,
          chapter: { select: { name: true, nameFr: true, trade: { select: { code: true } } } },
        },
      }),
      // active users today — distinct users with real activity (exams/answered questions, tutor chats)
      prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(DISTINCT uid)::int as count FROM (
           SELECT "userId" as uid FROM "ExamAttempt" WHERE "completedAt" >= $1::timestamp
           UNION
           SELECT s."userId" as uid FROM "ChatMessage" m JOIN "ChatSession" s ON m."sessionId" = s.id WHERE m."createdAt" >= $1::timestamp
         ) active`,
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      ).catch(() => [{ count: BigInt(0) }]),
      // total exams taken (learning tracking)
      prisma.examAttempt.count().catch(() => 0),
      // all attempts for pass rate
      prisma.examAttempt.findMany({ where: { reviewMode: false }, select: { score: true } }).catch(() => []),
      // recent exam attempts — last 15 with user + trade
      prisma.examAttempt.findMany({
        orderBy: { completedAt: 'desc' },
        take: 15,
        include: {
          user: { select: { id: true, name: true, email: true } },
          trade: { select: { code: true, name: true, nameFr: true } },
        },
      }).catch(() => []),
      // recent answered questions — last 25 individual answers
      prisma.examAttemptQuestion.findMany({
        orderBy: { attempt: { completedAt: 'desc' } },
        take: 25,
        include: {
          question: { select: { id: true, question: true, difficulty: true } },
          attempt: {
            select: {
              completedAt: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }).catch(() => []),
      // top failed questions — lowest pass rate
      prisma.question.findMany({
        select: {
          id: true,
          question: true,
          difficulty: true,
          _count: { select: { attemptAnswers: true } },
          attemptAnswers: { where: { isCorrect: true }, select: { id: true } },
        },
        take: 200,
      }).catch(() => []),
      // recent tutor chat sessions — last 15 with user + message count
      prisma.chatSession.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 15,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { messages: true } },
        },
      }).catch(() => []),
    ]);

    // Process user growth
    const userGrowthArray = Array.isArray(userGrowth)
      ? (userGrowth as Array<{ day: string; count: bigint }>).map((r) => ({
          date: r.day,
          count: Number(r.count),
        }))
      : [];

    const newUsersThisPeriod = userGrowthArray.reduce((sum, g) => sum + g.count, 0);

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

    // Questions by trade
    const questionsByTrade = (questionsByTradeRaw as Array<{ code: string; name: string; nameFr: string; count: bigint }>).map((r) => ({
      code: r.code,
      name: r.name,
      nameFr: r.nameFr,
      count: Number(r.count),
    }));

    // Questions by locale
    const localeMap: Record<string, number> = { fr: 0, en: 0 };
    if (Array.isArray(questionsByLocaleRaw)) {
      for (const row of questionsByLocaleRaw as Array<{ locale: string; count: bigint }>) {
        const key = (row.locale || 'fr').toLowerCase();
        localeMap[key] = Number(row.count);
      }
    }

    // Plan distribution
    const planDistribution: Record<string, number> = { FREE: 0, MONTHLY: 0, YEARLY: 0, LIFETIME: 0 };
    if (Array.isArray(planDistributionRaw)) {
      for (const row of planDistributionRaw as Array<{ plan: string; count: bigint }>) {
        const key = row.plan?.toUpperCase() || 'FREE';
        if (key in planDistribution) {
          planDistribution[key] = Number(row.count);
        }
      }
    }

    // Revenue by month - from subscriptions
    const subsLast12Months = await prisma.subscription.findMany({
      where: { createdAt: { gte: twelveMonthsAgo }, status: 'ACTIVE' },
      select: { plan: true, createdAt: true },
    });

    const planAmount: Record<string, number> = { FREE: 0, MONTHLY: 2999, YEARLY: 9900, LIFETIME: 19900 };
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

    const totalRevenue = revenueByMonth.reduce((sum, r) => sum + r.amount, 0);

    // Recent activity — last 20 entries from user creation/subscriptions
    const recentActivity = lastRegisteredUsers.map((u) => ({
      id: u.id,
      action: 'USER_REGISTERED',
      createdAt: u.createdAt.toISOString(),
      user: u.name ? { name: u.name, email: u.email } : { name: u.email, email: u.email },
      details: { plan: u.plan },
    }));

    // Active users today
    const activeUsersToday = Number(activeUsersTodayRaw?.[0]?.count ?? 0);

    // ─── Learning tracking ─────────────────────────────────
    const overallPassRate = allAttempts.length > 0
      ? Math.round((allAttempts.filter((a: { score: number }) => a.score >= 60).length / allAttempts.length) * 100)
      : 0;

    const recentAttempts = (recentExamAttempts as any[]).map((a) => ({
      id: a.id,
      score: a.score,
      totalQuestions: a.totalQuestions,
      correctCount: a.correctCount,
      completedAt: a.completedAt.toISOString(),
      user: { id: a.user.id, name: a.user.name, email: a.user.email },
      trade: { code: a.trade.code, name: a.trade.name, nameFr: a.trade.nameFr },
    }));

    const recentAnswers = (recentAnsweredQuestions as any[]).map((aq) => ({
      id: aq.id,
      userAnswer: aq.userAnswer,
      isCorrect: aq.isCorrect,
      question: { id: aq.question.id, text: aq.question.question.slice(0, 100), difficulty: aq.question.difficulty },
      user: aq.attempt.user ? { id: aq.attempt.user.id, name: aq.attempt.user.name, email: aq.attempt.user.email } : null,
      completedAt: aq.attempt.completedAt.toISOString(),
    }));

    const topFailedQuestions = (topFailedQuestionsRaw as any[])
      .map((q) => {
        const total = q._count.attemptAnswers;
        const correct = q.attemptAnswers.length;
        return {
          id: q.id,
          question: q.question.slice(0, 120),
          difficulty: q.difficulty,
          passRate: total > 0 ? Math.round((correct / total) * 100) : 100,
          totalAttempts: total,
        };
      })
      .filter((q) => q.totalAttempts >= 2)
      .sort((a, b) => a.passRate - b.passRate)
      .slice(0, 10);

    const recentChats = (recentChatSessions as any[]).map((cs) => ({
      id: cs.id,
      topic: cs.topic ?? 'Conversation tuteur',
      user: cs.user ? { name: cs.user.name, email: cs.user.email } : null,
      messageCount: cs._count?.messages ?? 0,
      updatedAt: cs.updatedAt.toISOString(),
    }));

    res.json({
      totalUsers,
      totalTrades,
      totalChapters,
      totalQuestions,
      activeSubscriptions,
      newUsersThisPeriod,
      totalRevenue,
      activeUsersToday,
      totalExamsTaken,
      overallPassRate,
      recentAttempts,
      recentAnswers,
      topFailedQuestions,
      recentChats,
      planDistribution,
      userGrowth: userGrowthArray,
      revenueByMonth,
      questionsByDifficulty: difficultyMap,
      questionsByTrade,
      questionsByLocale: localeMap,
      recentActivity,
      recentSubscriptions: recentSubscriptions.map((s) => ({
        id: s.id,
        plan: s.plan,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
        user: { id: s.user.id, name: s.user.name, email: s.user.email, plan: s.user.plan },
      })),
      recentContactMessages: recentContactMessages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message.slice(0, 120),
        direction: m.direction,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
      })),
      recentQuestionsAdded: recentQuestionsAdded.map((q) => ({
        id: q.id,
        question: q.question.slice(0, 100),
        difficulty: q.difficulty,
        locale: q.locale,
        createdAt: q.createdAt.toISOString(),
        chapter: q.chapter ? { name: q.chapter.name, nameFr: q.chapter.nameFr, tradeCode: q.chapter.trade.code } : null,
      })),
      lastRegisteredUsers: lastRegisteredUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        plan: u.plan,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('[Analytics] Dashboard error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/admin/analytics/active-today
 * Last 10 users active today (exams or tutor chats since midnight).
 */
router.get('/active-today', async (_req: Request, res: Response): Promise<void> => {
  try {
    const midnight = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

    const rows = await prisma.$queryRawUnsafe<
      Array<{ id: string; name: string | null; email: string; lastActive: Date; activity: string }>
    >(
      `SELECT u.id, u.name, u.email,
              MAX(a.last_active) AS "lastActive",
              MAX(a.activity)    AS activity
       FROM (
         SELECT "userId" AS uid, MAX("completedAt") AS last_active, 'exam' AS activity
         FROM "ExamAttempt" WHERE "completedAt" >= $1::timestamp
         GROUP BY "userId"
         UNION ALL
         SELECT s."userId" AS uid, MAX(m."createdAt") AS last_active, 'chat' AS activity
         FROM "ChatMessage" m JOIN "ChatSession" s ON m."sessionId" = s.id
         WHERE m."createdAt" >= $1::timestamp
         GROUP BY s."userId"
       ) a
       JOIN "User" u ON u.id = a.uid
       GROUP BY u.id, u.name, u.email
       ORDER BY "lastActive" DESC
       LIMIT 10`,
      midnight
    ).catch(() => []);

    res.json({
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        activity: r.activity,
        lastActive: new Date(r.lastActive).toISOString(),
      })),
    });
  } catch (err) {
    console.error('[Analytics] Active-today error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
