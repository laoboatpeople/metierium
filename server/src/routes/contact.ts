import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

const FROM_EMAIL = 'Metierium <info@metierium.com>';

/**
 * POST /api/contact
 * Public endpoint — no auth required.
 * Sends a contact form submission via email + saves to DB.
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Contact] RESEND_API_KEY not configured');
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  const text = [
    `New contact form submission — ${name}`,
    '',
    '── Contact ──',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    '── Message ──',
    message,
  ].join('\n');

  try {
    // Send notification email via Resend (to info@metierium.com - works even without DNS verification)
    const fetchRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ['chuck.onekeo@gmail.com'],
        reply_to: email,
        subject: `[Metierium] Contact from ${name}`,
        text,
      }),
    });

    if (!fetchRes.ok) {
      const errBody = await fetchRes.text();
      console.error('[Contact] Resend error:', fetchRes.status, errBody);
      res.status(500).json({ error: 'Failed to send message' });
      return;
    }

    

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        direction: 'inbound',
        status: 'pending',
      },
    });

    res.json({ success: true, message: 'Votre message a été envoyé avec succès !' });
  } catch (err) {
    console.error('[Contact] Error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ─── Admin endpoints (authenticated) ─────────────────────

/**
 * GET /api/admin/contact-messages/conversations
 * List conversations with search + pagination.
 */
router.get('/admin/contact-messages/conversations', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const where: any = { direction: 'inbound' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, messages] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Group by email into conversations
    const convMap = new Map<string, { email: string; name: string; messageCount: number; pendingCount: number; lastActivityAt: string; messages: any[] }>();
    for (const msg of messages) {
      const key = msg.email;
      if (!convMap.has(key)) {
        convMap.set(key, {
          email: key,
          name: msg.name,
          messageCount: 0,
          pendingCount: 0,
          lastActivityAt: msg.createdAt.toISOString(),
          messages: [],
        });
      }
      const conv = convMap.get(key)!;
      conv.messageCount++;
      if (msg.status === 'pending') conv.pendingCount++;
      if (new Date(msg.createdAt) > new Date(conv.lastActivityAt)) {
        conv.lastActivityAt = msg.createdAt.toISOString();
      }
      conv.messages.push(msg);
    }

    const conversations = Array.from(convMap.values()).sort(
      (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );

    res.json({ conversations, total, totalPages: Math.ceil(total / limit), page });
  } catch (err) {
    console.error('[Contact] List error:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

/**
 * GET /api/admin/contact-messages/:email
 * Get thread for a specific conversation.
 */
router.get('/admin/contact-messages/:email', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const messages = await prisma.contactMessage.findMany({
      where: { email: email.toLowerCase().trim() },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages, email });
  } catch (err) {
    console.error('[Contact] Thread error:', err);
    res.status(500).json({ error: 'Failed to load thread' });
  }
});

/**
 * POST /api/admin/contact-messages/reply
 * Admin replies to a conversation.
 */
router.post('/admin/contact-messages/reply', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, message, parentId } = req.body;
    if (!email || !message) {
      res.status(400).json({ error: 'Email and message are required' });
      return;
    }

    const reply = await prisma.contactMessage.create({
      data: {
        name: 'Admin',
        email: email.toLowerCase().trim(),
        message: message.trim(),
        direction: 'outbound',
        status: 'replied',
        repliedBy: (req as any).user?.email || 'admin',
        repliedAt: new Date(),
      },
    });

    // Update all inbound messages for this email to "replied"
    await prisma.contactMessage.updateMany({
      where: { email: email.toLowerCase().trim(), direction: 'inbound', status: 'pending' },
      data: { status: 'replied', replyText: message.trim(), repliedAt: new Date() },
    });

    res.json({ success: true, reply });
  } catch (err) {
    console.error('[Contact] Reply error:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

/**
 * DELETE /api/admin/contact-messages/:id
 */
router.delete('/admin/contact-messages/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Delete message and its replies
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[Contact] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
