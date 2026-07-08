import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * GET /api/admin/users
 * List all users with their latest subscription.
 */
router.get('/users', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        subStatus: true,
        createdAt: true,
        updatedAt: true,
        subscription: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            plan: true,
            status: true,
            currentPeriod: true,
            createdAt: true,
          },
        },
      },
    });

    res.json({ data: users });
  } catch (err) {
    console.error('[Admin] List users error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/admin/trades
 * List all trades with chapters count.
 */
router.get('/trades', async (_req: Request, res: Response): Promise<void> => {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    });

    res.json({ data: trades });
  } catch (err) {
    console.error('[Admin] List trades error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/admin/trades
 * Create a new trade.
 * Body: { code, name, nameFr, description? }
 */
router.post('/trades', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, nameFr, description } = req.body;

    if (!code || !name || !nameFr) {
      res.status(400).json({ message: 'code, name, and nameFr are required' });
      return;
    }

    const existing = await prisma.trade.findUnique({ where: { code } });
    if (existing) {
      res.status(409).json({ message: 'Trade with this code already exists' });
      return;
    }

    const trade = await prisma.trade.create({
      data: { code, name, nameFr, description },
    });

    res.status(201).json(trade);
  } catch (err) {
    console.error('[Admin] Create trade error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/trades/:id
 * Update an existing trade.
 */
router.put('/trades/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, name, nameFr, description } = req.body;

    const existing = await prisma.trade.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    // If code is being changed, check uniqueness
    if (code && code !== existing.code) {
      const codeConflict = await prisma.trade.findUnique({ where: { code } });
      if (codeConflict) {
        res.status(409).json({ message: 'Another trade with this code already exists' });
        return;
      }
    }

    const trade = await prisma.trade.update({
      where: { id },
      data: {
        ...(code !== undefined && { code }),
        ...(name !== undefined && { name }),
        ...(nameFr !== undefined && { nameFr }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(trade);
  } catch (err) {
    console.error('[Admin] Update trade error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/admin/chapters
 * Create a new chapter with theoryContent.
 * Body: { tradeId, number, name, nameFr, theoryContent }
 */
router.post('/chapters', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, number, name, nameFr, theoryContent } = req.body;

    if (!tradeId || number === undefined || !name || !nameFr) {
      res.status(400).json({ message: 'tradeId, number, name, and nameFr are required' });
      return;
    }

    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    if (!trade) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    const chapter = await prisma.chapter.create({
      data: {
        tradeId,
        number,
        name,
        nameFr,
        theoryContent: theoryContent || null,
      },
    });

    res.status(201).json(chapter);
  } catch (err) {
    console.error('[Admin] Create chapter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/chapters/:id
 * Update an existing chapter.
 */
router.put('/chapters/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tradeId, number, name, nameFr, theoryContent } = req.body;

    const existing = await prisma.chapter.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...(tradeId !== undefined && { tradeId }),
        ...(number !== undefined && { number }),
        ...(name !== undefined && { name }),
        ...(nameFr !== undefined && { nameFr }),
        ...(theoryContent !== undefined && { theoryContent }),
      },
    });

    res.json(chapter);
  } catch (err) {
    console.error('[Admin] Update chapter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/admin/questions
 * Create a new question.
 * Body: { tradeId, chapterId?, type, difficulty, question, options, answer, explanation?, locale }
 */
router.post('/questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, chapterId, type, difficulty, question, options, answer, explanation, locale } = req.body;

    if (!tradeId || !question || !answer) {
      res.status(400).json({ message: 'tradeId, question, and answer are required' });
      return;
    }

    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    if (!trade) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    if (chapterId) {
      const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
      if (!chapter) {
        res.status(404).json({ message: 'Chapter not found' });
        return;
      }
    }

    const q = await prisma.question.create({
      data: {
        tradeId,
        chapterId: chapterId || null,
        type: type || 'MCQ',
        difficulty: difficulty || 'MEDIUM',
        question,
        options: options || null,
        answer,
        explanation: explanation || null,
        locale: locale || 'fr',
      },
    });

    res.status(201).json(q);
  } catch (err) {
    console.error('[Admin] Create question error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/questions/:id
 * Update an existing question.
 */
router.put('/questions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tradeId, chapterId, type, difficulty, question, options, answer, explanation, locale } = req.body;

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    const q = await prisma.question.update({
      where: { id },
      data: {
        ...(tradeId !== undefined && { tradeId }),
        ...(chapterId !== undefined && { chapterId: chapterId || null }),
        ...(type !== undefined && { type }),
        ...(difficulty !== undefined && { difficulty }),
        ...(question !== undefined && { question }),
        ...(options !== undefined && { options }),
        ...(answer !== undefined && { answer }),
        ...(explanation !== undefined && { explanation }),
        ...(locale !== undefined && { locale }),
      },
    });

    res.json(q);
  } catch (err) {
    console.error('[Admin] Update question error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
