import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { sendTutorFeedbackNotification } from '../lib/email';

const router = Router();

/**
 * POST /api/theory/feedback
 * Submit (or update) thumbs up/down feedback on a theory chapter.
 * Auth: authenticate is required (student-facing).
 */
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = (req as Request & { user: { id: string; email: string; name?: string | null } }).user;
  const { chapterId, rating, comment } = req.body as {
    chapterId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  if (typeof chapterId !== 'string' || chapterId.length === 0 || chapterId.length > 64) {
    res.status(400).json({ message: 'chapterId is required' });
    return;
  }
  if (rating !== 'up' && rating !== 'down') {
    res.status(400).json({ message: 'rating must be "up" or "down"' });
    return;
  }
  if (comment !== undefined && (typeof comment !== 'string' || comment.length > 2000)) {
    res.status(400).json({ message: 'comment must be a string (max 2000 chars)' });
    return;
  }

  try {
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId },
      select: {
        id: true,
        number: true,
        name: true,
        nameFr: true,
        trade: { select: { code: true, name: true, nameFr: true } },
      },
    });
    if (!chapter) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }

    const feedback = await prisma.tutorFeedback.upsert({
      where: { chapterId_userId: { chapterId, userId: user.id } },
      create: { chapterId, userId: user.id, source: 'theory', rating, comment: comment || null },
      // Never wipe an existing comment with an empty one — only update rating
      update: { rating, source: 'theory', ...(comment ? { comment } : {}) },
    });

    // Track last activity (feedback = user activity)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    // Fire-and-forget notification email to site owner
    sendTutorFeedbackNotification({
      siteName: 'Metierium',
      adminUrl: 'https://metierium.com',
      rating,
      comment: comment || null,
      userEmail: user.email,
      userName: user.name ?? null,
      messagePreview: `[Théorie] ${chapter.trade.name} — ${chapter.number}. ${chapter.name}`,
      sessionTopic: null,
    }).catch(() => {});

    res.json({ data: feedback });
  } catch (err) {
    console.error('[Theory Feedback Error]', err);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

/**
 * GET /api/theory/feedback?chapterId=
 * Get the current user's feedback for a chapter (restore icon state on mount).
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const chapterId = req.query.chapterId;

  if (typeof chapterId !== 'string' || chapterId.length === 0) {
    res.status(400).json({ message: 'chapterId is required' });
    return;
  }

  try {
    const feedback = await prisma.tutorFeedback.findFirst({
      where: { chapterId, userId, source: 'theory' },
      select: { id: true, rating: true, comment: true },
    });
    res.json({ data: feedback });
  } catch (err) {
    console.error('[Theory Feedback Error]', err);
    res.status(500).json({ message: 'Failed to load feedback' });
  }
});

export default router;
