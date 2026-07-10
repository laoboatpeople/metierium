import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/questions
 * Return questions filtered by trade, chapter, difficulty, type, and locale.
 * FREE users get only chapter 1 questions.
 *
 * Query params:
 *   - tradeId    (string, required): The trade ID
 *   - chapterId  (string, optional): Filter by chapter
 *   - difficulty (string, optional): Filter by difficulty (EASY, MEDIUM, HARD)
 *   - type       (string, optional): Filter by type (MCQ, TRUEFALSE)
 *   - locale     (string, default "fr"): Language locale
 *   - limit      (number, default 10): Max questions to return
 *   - offset     (number, default 0): Pagination offset
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, chapterId, difficulty, type, locale } = req.query;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = Math.max(0, parseInt(req.query.offset as string) || 0);

    if (!tradeId) {
      res.status(400).json({ message: 'tradeId query parameter is required' });
      return;
    }

    const user = (req as any).user;
    const isFree = !user || user.plan === 'FREE';

    const where: Record<string, unknown> = {
      tradeId: tradeId as string,
    };

    // FREE users: only chapter 1
    if (isFree && !chapterId) {
      // Get the first chapter for this trade
      const firstChapter = await prisma.chapter.findFirst({
        where: { tradeId: tradeId as string },
        orderBy: { number: 'asc' },
        select: { id: true },
      });
      if (firstChapter) where.chapterId = firstChapter.id;
    }

    if (chapterId) where.chapterId = chapterId as string;
    if (difficulty) where.difficulty = difficulty as string;
    if (type) where.type = type as string;
    if (locale) where.locale = locale as string;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          tradeId: true,
          chapterId: true,
          type: true,
          difficulty: true,
          question: true,
          options: true,
          answer: true,
          explanation: true,
          locale: true,
          createdAt: true,
        },
      }),
      prisma.question.count({ where }),
    ]);

    res.json({
      data: questions,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[Questions] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/questions/:id
 * Get a single question by ID.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: {
        trade: { select: { code: true, name: true, nameFr: true } },
        chapter: { select: { number: true, name: true, nameFr: true } },
      },
    });

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.json(question);
  } catch (err) {
    console.error('[Questions] Get error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
