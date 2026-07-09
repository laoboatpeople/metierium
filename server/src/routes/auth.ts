import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';

const router = Router();

function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: name || null,
      },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        subscription: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      subStatus: user.subStatus,
      createdAt: user.createdAt,
      subscription: user.subscription[0] ?? null,
    });
  } catch (err) {
    console.error('[Auth] Me error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email requis' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether the email exists
      res.json({ message: "Si ce courriel existe, un lien de réinitialisation a été envoyé." });
      return;
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expiresAt,
      },
    });

    // Send email via Resend
    const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      const apiKey = env.RESEND_API_KEY;
      if (apiKey && apiKey !== 're_placeholder') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Metierium <info@metierium.com>',
            to: email,
            subject: 'Réinitialisation de mot de passe — Metierium',
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0A0E1A;color:#F8FAFC;border-radius:12px">
              <h1 style="color:#3B82F6;font-size:22px">Réinitialisation de mot de passe</h1>
              <p style="color:#94A3B8;line-height:1.5">Vous avez demandé la réinitialisation de votre mot de passe.</p>
              <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#3B82F6,#06B6D4);color:white;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0">Réinitialiser mon mot de passe</a>
              <p style="color:#64748B;font-size:12px">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez ce courriel.</p>
            </div>`,
          }),
        });
      }
    } catch (emailErr) {
      console.error('[Auth] Failed to send reset email:', emailErr);
      // Don't fail the request — user still gets success message
    }

    res.json({ message: "Si ce courriel existe, un lien de réinitialisation a été envoyé." });
  } catch (err) {
    console.error('[Auth] Forgot password error:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      res.status(400).json({ message: 'Tous les champs sont requis' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetToken !== token) {
      res.status(400).json({ message: 'Lien invalide ou expiré' });
      return;
    }

    if (!user.resetTokenExpires || new Date() > user.resetTokenExpires) {
      res.status(400).json({ message: 'Lien expiré. Veuillez refaire une demande.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error('[Auth] Reset password error:', err);
    res.status(500).json({ message: 'Erreur interne' });
  }
});

export default router;
