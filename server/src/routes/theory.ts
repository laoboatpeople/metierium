import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/theory/outline
 * Lightweight metadata for EVERY chapter (all trades) — NO theory content.
 * Used for the initial page render so the page loads fast. The heavy
 * theoryContent is fetched per-chapter on demand via /:chapterId/content.
 *
 * Query params:
 *   - locale (string, default "fr")
 */
router.get('/outline', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const lang = (req.query.locale as string) || 'fr';
    const chapters = await prisma.chapter.findMany({
      where: lang === 'en'
        ? { theoryContentEn: { not: null } }
        : { theoryContent: { not: null } },
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        name: true,
        nameFr: true,
        tradeId: true,
        _count: { select: { questions: true } },
      },
    });
    const mapped = chapters.map((ch: any) => ({
      id: ch.id,
      number: ch.number,
      name: lang === 'fr' ? (ch.nameFr || ch.name) : ch.name,
      tradeId: ch.tradeId,
      questionCount: ch._count?.questions || 0,
      hasTheory: true,
    }));
    res.json({ data: mapped });
  } catch (err) {
    console.error('[Theory] Outline error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/theory/all-content
 * Returns id + theoryContent for every chapter (all trades). Heavier than
 * /outline — only called when the user starts a full-text search, to build
 * the client-side search index on demand.
 *
 * Query params:
 *   - locale (string, default "fr")
 */
router.get('/all-content', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const lang = (req.query.locale as string) || 'fr';
    const chapters = await prisma.chapter.findMany({
      where: lang === 'en'
        ? { theoryContentEn: { not: null } }
        : { theoryContent: { not: null } },
      orderBy: { number: 'asc' },
      select: { id: true, theoryContent: true, theoryContentEn: true },
    });
    const mapped = chapters.map((ch: any) => ({
      id: ch.id,
      theoryContent: lang === 'en' ? (ch.theoryContentEn || ch.theoryContent) : ch.theoryContent,
    }));
    res.json({ data: mapped });
  } catch (err) {
    console.error('[Theory] All-content error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/theory/:chapterId/content
 * Returns the theory content for a SINGLE chapter (lazy on-demand load when
 * the user expands a chapter).
 *
 * Query params:
 *   - locale (string, default "fr")
 */
router.get('/:chapterId/content', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const lang = (req.query.locale as string) || 'fr';
    const chapter = await prisma.chapter.findUnique({
      where: { id: req.params.chapterId },
      select: { id: true, theoryContent: true, theoryContentEn: true },
    });
    if (!chapter) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }
    const content = lang === 'en' ? (chapter.theoryContentEn || chapter.theoryContent) : chapter.theoryContent;
    res.json({ data: { id: chapter.id, theoryContent: content } });
  } catch (err) {
    console.error('[Theory] Chapter content error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { plan: true, subStatus: true },
    });

    // Detect Pro: MONTHLY plan with no tradeId lock
    let userPlan: string = dbUser?.plan || 'FREE';
    if (userPlan === 'MONTHLY') {
      const activeSub = await prisma.subscription.findFirst({
        where: { userId: req.user!.id, status: { in: ['ACTIVE', 'CANCELLED'] } },
        orderBy: { createdAt: 'desc' },
      });
      if (activeSub && !activeSub.tradeId && (activeSub.status !== 'CANCELLED' || (activeSub.currentPeriod && new Date(activeSub.currentPeriod) > new Date()))) {
        userPlan = 'PRO';
      }
    }

    const chapters = await prisma.chapter.findMany({
      where: {
        tradeId: tradeId as string,
        ...(lang === 'en' ? { theoryContentEn: { not: null } } : { theoryContent: { not: null } }),
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

    res.json({ data: mapped, plan: userPlan });
  } catch (err) {
    console.error('[Theory] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
