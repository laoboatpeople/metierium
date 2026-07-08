import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

/**
 * GET /api/theory
 * Return chapters with theory content for a given trade and locale.
 *
 * Query params:
 *   - tradeId (string, required): The trade ID
 *   - locale  (string, default "fr"): Language locale ("fr" or "en")
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tradeId, locale } = req.query;

    if (!tradeId) {
      res.status(400).json({ message: 'tradeId query parameter is required' });
      return;
    }

    const lang = (locale as string) || 'fr';

    const chapters = await prisma.chapter.findMany({
      where: {
        tradeId: tradeId as string,
        theoryContent: { not: null },
      },
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        name: lang === 'fr' ? true : false,
        nameFr: lang === 'fr' ? false : true,
        theoryContent: true,
        tradeId: true,
      },
    });

    // Map fields so the response always uses `name` (the locale column mapped into it)
    const mapped = chapters.map((ch) => ({
      id: ch.id,
      number: ch.number,
      name: lang === 'fr' ? ch.name : ch.nameFr || ch.name,
      theoryContent: ch.theoryContent,
      tradeId: ch.tradeId,
    }));

    res.json({ data: mapped });
  } catch (err) {
    console.error('[Theory] List error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
