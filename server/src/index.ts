import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { prisma } from './config/database';

// Middleware
import { authenticate } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import tradesRoutes from './routes/trades';
import theoryRoutes from './routes/theory';
import questionsRoutes from './routes/questions';
import stripeRoutes from './routes/stripe';
import adminRoutes from './routes/admin';
import turnstileRoutes from './routes/turnstile';
import tutorRoutes from './routes/tutor';
import settingsRoutes from './routes/settings';
import contactRoutes from './routes/contact';
import contactAdminRoutes from './routes/contactAdmin';
import newsletterRoutes from './routes/newsletter';
import subscriptionsRoutes from './routes/subscriptions';
import analyticsRoutes from './routes/analytics';

const app = express();

// ─── Security middleware ────────────────────────────────────────

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// ─── Rate limiting ──────────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);

// Per-route rate limiting for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { message: 'Trop de tentatives. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password'], authLimiter);

// ─── Body parsing ───────────────────────────────────────────────
// Stripe webhook needs raw body for signature verification.
// We store the raw body via verify callback for the webhook handler.
app.use(express.json({
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  },
}));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ───────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (err) {
    console.error('[Health Check] DB connectivity failed:', err);
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
});

// Also serve under /api/health for the health-check cron
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (err) {
    console.error('[Health Check] DB connectivity failed:', err);
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
});

// ─── API routes ─────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/turnstile', turnstileRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', settingsRoutes);

// Contact routes — public contact form submission
app.use('/api/contact', contactRoutes);

// Contact admin routes — admin-only contact message management
app.use('/api/admin/contact-messages', contactAdminRoutes);

// Newsletter admin routes — admin-only subscriber management
app.use('/api/admin/newsletter', newsletterRoutes);

// Subscriptions admin routes — admin-only subscription management
app.use('/api/admin/subscriptions', subscriptionsRoutes);

// Analytics admin routes — admin-only analytics data
app.use('/api/admin/analytics', analyticsRoutes);

// ─── 404 handler ────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global error handler ───────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start server ─────────────────────────────────────────────

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Metierium API running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// Allow long-running AI requests
server.timeout = 300000; // 5 minutes

// ─── Graceful shutdown ─────────────────────────────────────────

process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received — shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason: Error | any) => {
  console.error('[Unhandled Rejection]', reason);
  console.log('Triggering graceful shutdown due to unhandled rejection');
  server.close();
  prisma.$disconnect().then(() => process.exit(1)).catch(() => process.exit(1));
});
