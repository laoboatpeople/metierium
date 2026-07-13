import { Router, Request, Response } from 'express';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// In-memory newsletter subscribers store (persisted to process memory only)
// For production, add a NewsletterSubscription model to Prisma schema.
interface Subscriber {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  subscribedAt: string;
}

let subscribers: Subscriber[] = [];
let nextId = 1;

/**
 * GET /api/admin/newsletter/subscribers
 * Admin-only. Returns all newsletter subscribers.
 */
router.get('/subscribers', authenticate, requireRoles('ADMIN'), async (_req: Request, res: Response): Promise<void> => {
  res.json({ subscribers });
});

/**
 * POST /api/admin/newsletter/subscribers
 * Admin-only. Manually add a subscriber.
 */
router.post('/subscribers', authenticate, requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    // Check existing
    const existing = subscribers.find((s) => s.email === trimmed);
    if (existing) {
      if (existing.status === 'ACTIVE') {
        res.json({ success: true, subscriber: existing });
        return;
      }
      existing.status = 'ACTIVE';
      res.json({ success: true, subscriber: existing });
      return;
    }

    const subscriber: Subscriber = {
      id: String(nextId++),
      email: trimmed,
      status: 'ACTIVE',
      subscribedAt: new Date().toISOString(),
    };
    subscribers.push(subscriber);

    res.json({ success: true, subscriber });
  } catch (err) {
    console.error('[Newsletter] Create error:', err);
    res.status(500).json({ error: 'Failed to add subscriber.' });
  }
});

/**
 * PATCH /api/admin/newsletter/subscribers/:id
 * Admin-only. Update subscriber status.
 */
router.patch('/subscribers/:id', authenticate, requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'ACTIVE' && status !== 'UNSUBSCRIBED') {
      res.status(400).json({ error: 'Status must be ACTIVE or UNSUBSCRIBED.' });
      return;
    }

    const subscriber = subscribers.find((s) => s.id === id);
    if (!subscriber) {
      res.status(404).json({ error: 'Subscriber not found.' });
      return;
    }

    subscriber.status = status;
    res.json({ success: true, subscriber });
  } catch (err) {
    console.error('[Newsletter] Update error:', err);
    res.status(500).json({ error: 'Failed to update subscriber.' });
  }
});

/**
 * DELETE /api/admin/newsletter/subscribers/:id
 * Admin-only. Delete a subscriber.
 */
router.delete('/subscribers/:id', authenticate, requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = subscribers.findIndex((s) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Subscriber not found.' });
      return;
    }

    subscribers.splice(index, 1);
    res.json({ success: true });
  } catch (err) {
    console.error('[Newsletter] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete subscriber.' });
  }
});

export default router;
