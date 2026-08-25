import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/admin/tutor-feedback
 * Admin-only list of AI tutor feedback (thumbs up/down + comments).
 * Auth: authenticate is applied at the mount point; role check here.
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }
    const feedbacks = await prisma.tutorFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        user: { select: { id: true, name: true, email: true } },
        message: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            session: { select: { id: true, topic: true } },
          },
        },
      },
    });
    res.json({ data: feedbacks });
  } catch (err) {
    console.error('[Tutor Feedback Admin Error]', err);
    res.status(500).json({ message: 'Failed to load tutor feedback' });
  }
});

/**
 * DELETE /api/admin/tutor-feedback/:id
 * Admin-only deletion of a tutor feedback entry.
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Feedback id is required' });
      return;
    }
    await prisma.tutorFeedback.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[Tutor Feedback Admin Delete Error]', err);
    res.status(500).json({ message: 'Failed to delete tutor feedback' });
  }
});

export default router;
