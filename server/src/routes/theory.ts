import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/theory
 * Return chapters with theory content for a given trade and locale.
 * FREE users get only chapter 1. PAID users get all chapters.
 *
 * Query params:
 *   - tradeId (string, required): The trade ID
 *   - locale  (string, default "fr"): Language locale ("fr" or "en")
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, locale } = req.query;

    if (!tradeId) {
      res.status(400).json({ message: 'tradeId query parameter is required' });
      return;
    }

    const lang = (locale as string) || 'fr';
    const user = (req as any).user;
    const isFree = !user || user.plan === 'FREE';

    const chapters = await prisma.chapter.findMany({
      where: {
        tradeId: tradeId as string,
        ...(lang === 'en' ? { theoryContentEn: { not: null } } : { theoryContent: { not: null } }),
        ...(isFree ? { number: 1 } : {}),
      },
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        name: true,
        nameFr: true,
        theoryContent: true,
        theoryContentEn: true,
        tradeId: true,
        _count: { select: { questions: true } },
      },
    });

    const mapped = chapters.map((ch: any) => ({
      id: ch.id,
      number: ch.number,
      name: lang === 'fr' ? (ch.nameFr || ch.name) : ch.name,
      theoryContent: lang === 'en' ? (ch.theoryContentEn || ch.theoryContent) : ch.theoryContent,
      tradeId: ch.tradeId,
      questionCount: (ch as any)._count?.questions || 0,
      hasTheory: !!(lang === 'en' ? (ch.theoryContentEn || ch.theoryContent) : ch.theoryContent),
    }));

    res.json({ data: mapped, plan: user?.plan || 'FREE' });
  } catch (err) {
    console.error('[Theory] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
