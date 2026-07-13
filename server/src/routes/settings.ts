import { Router, Request, Response } from 'express';
import { authenticate, requireRoles } from '../middleware/auth';
import { getSettings, updateSettings } from '../config/settings';

const router = Router();

// All settings routes require authentication + ADMIN role
router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * GET /api/admin/settings
 * Returns current platform settings.
 */
router.get('/settings', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ data: getSettings() });
  } catch (err) {
    console.error('[Settings] GET error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/settings
 * Update platform settings.
 * Body: partial settings object (any of the settings fields)
 */
router.put('/settings', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      orgName, orgEmail, timezone,
      passingScore, timeLimit, questionsPerSimulation, randomizeOrder,
      emailNotifications, welcomeEmail, reminderEmails,
      adminNewUserAlert, adminNotificationEmail,
      sessionTimeout, requireEmailVerification,
    } = req.body;

    const updates: Partial<import('../config/settings').AdminSettings> = {};

    if (orgName !== undefined) updates.orgName = orgName;
    if (orgEmail !== undefined) {
      if (typeof orgEmail !== 'string' || !orgEmail.includes('@')) {
        res.status(400).json({ message: 'Valid email is required for orgEmail' });
        return;
      }
      updates.orgEmail = orgEmail;
    }
    if (timezone !== undefined) updates.timezone = timezone;
    if (passingScore !== undefined) updates.passingScore = Number(passingScore);
    if (timeLimit !== undefined) updates.timeLimit = Number(timeLimit);
    if (questionsPerSimulation !== undefined) updates.questionsPerSimulation = Number(questionsPerSimulation);
    if (randomizeOrder !== undefined) updates.randomizeOrder = Boolean(randomizeOrder);
    if (emailNotifications !== undefined) updates.emailNotifications = Boolean(emailNotifications);
    if (welcomeEmail !== undefined) updates.welcomeEmail = Boolean(welcomeEmail);
    if (reminderEmails !== undefined) updates.reminderEmails = Boolean(reminderEmails);
    if (adminNewUserAlert !== undefined) updates.adminNewUserAlert = Boolean(adminNewUserAlert);
    if (adminNotificationEmail !== undefined) {
      if (typeof adminNotificationEmail !== 'string' || !adminNotificationEmail.includes('@')) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
      }
      updates.adminNotificationEmail = adminNotificationEmail;
    }
    if (sessionTimeout !== undefined) updates.sessionTimeout = Number(sessionTimeout);
    if (requireEmailVerification !== undefined) updates.requireEmailVerification = Boolean(requireEmailVerification);

    const updated = updateSettings(updates);
    res.json({ data: updated });
  } catch (err) {
    console.error('[Settings] PUT error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
