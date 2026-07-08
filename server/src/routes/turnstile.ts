import { Router, Request, Response } from 'express';
import { env } from '../config/env';

const router = Router();

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * POST /api/turnstile/verify
 * Validates a Turnstile token server-side.
 * Body: { token: string }
 */
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      res.status(500).json({ message: 'Turnstile not configured' });
      return;
    }

    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);

    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
    });

    const data = await verifyRes.json() as { success?: boolean; 'error-codes'?: string[] };

    if (data.success === true) {
      res.json({ success: true });
    } else {
      res.status(400).json({
        success: false,
        message: 'Turnstile verification failed',
        errorCodes: data['error-codes'] || [],
      });
    }
  } catch (err) {
    console.error('[Turnstile] Verify error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
