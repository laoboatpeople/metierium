import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/attempts
 * Save a completed exam attempt with per-question answers.
 * Body: {
 *   tradeId: string,
 *   score: number,          // 0-100
 *   totalQuestions: number,
 *   correctCount: number,
 *   timeSpent: number,      // seconds
 *   difficulty?: string,    // EASY | MEDIUM | HARD | '' (mixed)
 *   reviewMode?: boolean,
 *   answers: [{ questionId, userAnswer, isCorrect }]
 * }
 */
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { tradeId, score, totalQuestions, correctCount, timeSpent, difficulty, reviewMode, answers } = req.body;

    if (!tradeId || typeof score !== 'number' || !Array.isArray(answers)) {
      res.status(400).json({ message: 'tradeId, score, and answers[] are required' });
      return;
    }

    const attempt = await prisma.examAttempt.create({
      data: {
        userId: user.id,
        tradeId,
        score,
        totalQuestions: totalQuestions ?? answers.length,
        correctCount: correctCount ?? answers.filter((a: any) => a.isCorrect).length,
        timeSpent: timeSpent ?? 0,
        difficulty: difficulty || null,
        reviewMode: reviewMode ?? false,
        answers: {
          create: answers
            .filter((a: any) => a.questionId)
            .map((a: any) => ({
              questionId: a.questionId,
              userAnswer: String(a.userAnswer ?? ''),
              isCorrect: !!a.isCorrect,
            })),
        },
      },
      select: { id: true, completedAt: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'EXAM_COMPLETED',
        details: { tradeId, score, totalQuestions, attemptId: attempt.id },
        ipAddress: req.ip,
      },
    }).catch(() => {}); // non-blocking

    res.status(201).json({ id: attempt.id, completedAt: attempt.completedAt });
  } catch (err) {
    console.error('[Attempts] Save error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/attempts
 * List the current user's attempts (most recent first).
 * Query: ?limit=20&tradeId=xxx
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const tradeId = req.query.tradeId as string | undefined;

    const attempts = await prisma.examAttempt.findMany({
      where: { userId: user.id, ...(tradeId ? { tradeId } : {}) },
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        trade: { select: { code: true, name: true, nameFr: true } },
      },
    });

    res.json({ data: attempts });
  } catch (err) {
    console.error('[Attempts] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/attempts/stats
 * Aggregated stats for the current user (dashboard).
 * Query: ?tradeId=xxx (optional)
 */
router.get('/stats', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const tradeId = req.query.tradeId as string | undefined;

    const attempts = await prisma.examAttempt.findMany({
      where: { userId: user.id, reviewMode: false, ...(tradeId ? { tradeId } : {}) },
      orderBy: { completedAt: 'desc' },
      include: { trade: { select: { code: true, name: true, nameFr: true } } },
    });

    if (attempts.length === 0) {
      res.json({ totalExams: 0, totalAttempts: 0, averageScore: 0, passRate: 0, studyStreak: 0, byExam: [] });
      return;
    }

    const totalAttempts = attempts.length;
    const avgScore = Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts);
    const passedCount = attempts.filter((a) => a.score >= 70).length;
    const passRate = Math.round((passedCount / totalAttempts) * 100);

    // Group by trade
    const byTradeMap = new Map<string, typeof attempts>();
    for (const a of attempts) {
      const arr = byTradeMap.get(a.tradeId) || [];
      arr.push(a);
      byTradeMap.set(a.tradeId, arr);
    }

    const byExam = Array.from(byTradeMap.entries()).map(([tid, arr]) => {
      const scores = arr.map((a) => a.score);
      const passed = arr.filter((a) => a.score >= 70).length;
      return {
        examId: tid,
        examCode: arr[0].trade.code,
        examName: arr[0].trade.nameFr || arr[0].trade.name,
        totalAttempts: arr.length,
        averageScore: Math.round(scores.reduce((s, v) => s + v, 0) / arr.length),
        bestScore: Math.max(...scores),
        lastScore: arr[0].score,
        passedCount: passed,
        passRate: Math.round((passed / arr.length) * 100),
      };
    });

    // Study streak — consecutive days with at least one attempt ending today/yesterday
    const daySet = new Set(attempts.map((a) => a.completedAt.toISOString().slice(0, 10)));
    let streak = 0;
    const cursor = new Date();
    // Allow streak to count from today or yesterday
    if (!daySet.has(cursor.toISOString().slice(0, 10))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (daySet.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    res.json({
      totalExams: byExam.length,
      totalAttempts,
      averageScore: avgScore,
      passRate,
      studyStreak: streak,
      byExam,
    });
  } catch (err) {
    console.error('[Attempts] Stats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
