import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { authenticate, requireRoles } from '../middleware/auth';
import { sendPlanChangeEmail } from '../lib/email';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * GET /api/admin/stats
 * Return quick counts for the admin dashboard.
 */
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalTrades, totalChapters, totalQuestions] = await Promise.all([
      prisma.user.count(),
      prisma.trade.count(),
      prisma.chapter.count(),
      prisma.question.count(),
    ]);
    res.json({ totalUsers, totalTrades, totalChapters, totalQuestions });
  } catch (err) {
    console.error('[Admin] Stats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
 * GET /api/admin/users/:id
 * Get a single user with full details: subscriptions, contact messages.
 */
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        subStatus: true,
        stripeId: true,
        createdAt: true,
        updatedAt: true,
        subscription: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            plan: true,
            status: true,
            stripeSubId: true,
            currentPeriod: true,
            createdAt: true,
            updatedAt: true,
            tradeId: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Contact messages matching this user's email
    const contactMessages = await prisma.contactMessage.findMany({
      where: { email: { equals: user.email, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        message: true,
        direction: true,
        status: true,
        createdAt: true,
      },
    });

    // Enrich subscriptions with trade names
    const tradeIds = [...new Set(user.subscription.map((s) => s.tradeId).filter(Boolean))] as string[];
    const trades = tradeIds.length > 0
      ? await prisma.trade.findMany({
          where: { id: { in: tradeIds } },
          select: { id: true, code: true, name: true, nameFr: true },
        })
      : [];
    const tradeMap = new Map(trades.map((t) => [t.id, t]));

    const subscriptions = user.subscription.map((s) => ({
      ...s,
      trade: s.tradeId ? tradeMap.get(s.tradeId) ?? null : null,
    }));

    res.json({
      ...user,
      subscriptions,
      contactMessages,
      stats: {
        totalSubscriptions: user.subscription.length,
        activeSubscriptions: user.subscription.filter((s) => s.status === 'ACTIVE').length,
        contactMessageCount: contactMessages.length,
        accountAgeDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000),
      },
    });
  } catch (err) {
    console.error('[Admin] Get user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/admin/users
 * Create a new user.
 * Body: { name, email, password, role?, plan? }
 */
router.post('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, plan } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'email and password are required' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: 'A user with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
        plan: plan || 'FREE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        subStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error('[Admin] Create user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update an existing user.
 * Body: { name?, email?, password?, role?, plan? }
 */
router.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password, role, plan } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // If email is being changed, check uniqueness
    if (email && email !== existing.email) {
      const emailConflict = await prisma.user.findUnique({ where: { email } });
      if (emailConflict) {
        res.status(409).json({ message: 'Another user with this email already exists' });
        return;
      }
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (plan !== undefined) data.plan = plan;
    if (password) data.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        subStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send plan change confirmation email if plan was modified
    if (plan !== undefined && plan !== existing.plan) {
      await sendPlanChangeEmail({
        to: user.email,
        userName: user.name,
        oldPlan: existing.plan,
        newPlan: plan,
        source: 'admin',
      });
    }

    res.json(user);
  } catch (err) {
    console.error('[Admin] Update user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user.
 */
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent self-deletion
    if (req.user && req.user.id === id) {
      res.status(400).json({ message: 'You cannot delete your own account' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('[Admin] Delete user error:', err);
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
 * DELETE /api/admin/trades/:id
 * Delete a trade and all its chapters/questions (cascade).
 */
router.delete('/trades/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.trade.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    // Delete children first (no cascade in schema)
    await prisma.question.deleteMany({ where: { tradeId: id } });
    await prisma.chapter.deleteMany({ where: { tradeId: id } });
    await prisma.trade.delete({ where: { id } });

    res.json({ message: 'Trade deleted' });
  } catch (err) {
    console.error('[Admin] Delete trade error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/admin/chapters
 * List all chapters, optionally filtered by tradeId.
 */
router.get('/chapters', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId } = req.query;
    const chapters = await prisma.chapter.findMany({
      where: tradeId ? { tradeId: tradeId as string } : undefined,
      orderBy: [{ tradeId: 'asc' }, { number: 'asc' }],
      include: {
        trade: { select: { code: true, name: true, nameFr: true } },
        _count: { select: { questions: true } },
      },
    });

    res.json({ data: chapters });
  } catch (err) {
    console.error('[Admin] List chapters error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/admin/questions
 * List all questions, optionally filtered by tradeId/chapterId.
 */
router.get('/questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, chapterId } = req.query;
    const where: Record<string, string> = {};
    if (tradeId) where.tradeId = tradeId as string;
    if (chapterId) where.chapterId = chapterId as string;

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        chapter: { select: { id: true, name: true, nameFr: true, number: true } },
        trade: { select: { id: true, code: true, name: true, nameFr: true } },
      },
    });

    res.json({ data: questions });
  } catch (err) {
    console.error('[Admin] List questions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/questions/:id
 * Delete a single question.
 */
router.delete('/questions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    await prisma.question.delete({ where: { id } });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error('[Admin] Delete question error:', err);
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
