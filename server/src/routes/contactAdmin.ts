import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/admin/contact-messages/conversations
 *
 * Admin-only endpoint. Returns contact messages grouped as conversations.
 * Requires a valid admin Bearer token.
 */
router.get('/conversations', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const search = (req.query.search as string || '').trim().toLowerCase();

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'asc' },
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    });

    // Group messages by email (external senders = conversation keys)
    // Admin messages are matched to the closest external conversation by time
    const groups = new Map<string, {
      email: string;
      name: string;
      messages: Array<typeof messages[0] & { direction: string }>;
      lastActivityAt: Date;
      pendingCount: number;
    }>();

    // Separate external messages from messages sent TO the admin
    const externalMessages = messages.filter(m => m.direction !== 'outbound');
    const adminMessages = messages.filter(m => m.direction === 'outbound');

    for (const msg of externalMessages) {
      const key = msg.email.toLowerCase().trim();
      if (!groups.has(key)) {
        groups.set(key, {
          email: msg.email,
          name: msg.name,
          messages: [],
          lastActivityAt: msg.createdAt,
          pendingCount: 0,
        });
      }
      const group = groups.get(key)!;
      group.messages.push({ ...msg, direction: 'inbound' });
      if (msg.createdAt > group.lastActivityAt) group.lastActivityAt = msg.createdAt;
      if (msg.status === 'pending') group.pendingCount++;
    }

    // Match admin (outbound) messages to closest external conversation by time proximity
    for (const msg of adminMessages) {
      const adminTime = msg.createdAt.getTime();
      let bestGroup: any = null;
      let bestDiff = Infinity;

      for (const group of groups.values()) {
        for (const groupMsg of group.messages) {
          const diff = Math.abs(groupMsg.createdAt.getTime() - adminTime);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestGroup = group;
          }
        }
      }

      if (bestGroup) {
        bestGroup.messages.push({ ...msg, direction: 'outbound' });
        if (msg.createdAt > bestGroup.lastActivityAt) {
          bestGroup.lastActivityAt = msg.createdAt;
        }
      } else {
        // Orphan admin message — standalone conversation
        const key = msg.email.toLowerCase().trim();
        if (!groups.has(key)) {
          groups.set(key, {
            email: msg.email,
            name: msg.name,
            messages: [],
            lastActivityAt: msg.createdAt,
            pendingCount: 0,
          });
        }
        groups.get(key)!.messages.push({ ...msg, direction: 'outbound' });
      }
    }

    // Sort each conversation's messages chronologically
    for (const group of groups.values()) {
      group.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    // Sort conversations by most recent activity first
    const allConversations = Array.from(groups.values())
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());

    const total = allConversations.length;
    const totalPages = Math.ceil(total / limit);

    // Paginate
    const paginated = allConversations.slice(offset, offset + limit);

    const conversations = paginated.map(g => ({
      email: g.email,
      name: g.name,
      messageCount: g.messages.length,
      pendingCount: g.pendingCount,
      lastActivityAt: g.lastActivityAt.toISOString(),
      messages: g.messages.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message,
        direction: m.direction,
        replyText: m.replyText,
        repliedAt: m.repliedAt?.toISOString() ?? null,
        repliedBy: m.repliedBy,
        createdAt: m.createdAt.toISOString(),
        status: m.status,
      })),
    }));

    res.json({ conversations, page, limit, total, totalPages });
  } catch (err) {
    console.error('[ContactAdmin] Conversations list error:', err);
    res.status(500).json({ error: 'Failed to load conversations.' });
  }
});

/**
 * PATCH /api/admin/contact-messages/:id/reply
 *
 * Admin-only endpoint. Marks a contact message as replied with the given reply text.
 * Requires a valid admin Bearer token.
 */
router.patch('/:id/reply', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || typeof replyText !== 'string') {
      res.status(400).json({ error: 'replyText is required and must be a string.' });
      return;
    }

    const original = await prisma.contactMessage.findUnique({ where: { id } });
    if (!original) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        replyText: replyText.trim(),
        repliedAt: new Date(),
        repliedBy: user.id,
        status: 'replied',
      },
    });

    res.json({ success: true, message: updated });
  } catch (err) {
    console.error('[ContactAdmin] Reply error:', err);
    res.status(500).json({ error: 'Failed to mark message as replied.' });
  }
});

/**
 * DELETE /api/admin/contact-messages/conversation/:email
 *
 * Admin-only endpoint. Deletes all contact messages for a conversation
 * identified by the external user's email. Requires a valid admin Bearer token.
 */
router.delete('/conversation/:email', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);

    await prisma.contactMessage.deleteMany({
      where: { email: { equals: decodedEmail, mode: 'insensitive' } },
    });

    res.json({ success: true, deletedEmail: decodedEmail });
  } catch (err) {
    console.error('[ContactAdmin] Delete conversation error:', err);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

/**
 * DELETE /api/admin/contact-messages/:id
 *
 * Admin-only endpoint. Deletes a contact message by ID.
 * Requires a valid admin Bearer token.
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('[ContactAdmin] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete contact message.' });
  }
});

export default router;
