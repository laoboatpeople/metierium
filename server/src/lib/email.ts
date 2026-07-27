import nodemailer from 'nodemailer';
import { env } from '../config/env';

/* ── Transporter Resend via SMTP ── */

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!env.RESEND_API_KEY || env.RESEND_API_KEY === 're_placeholder') {
    console.warn('[Email] RESEND_API_KEY not configured — emails disabled');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: env.RESEND_API_KEY,
    },
  });
  return transporter;
}

const FROM = 'Metierium <noreply@metierium.com>';

/* ── Plan labels ── */

const PLAN_LABELS: Record<string, { fr: string; en: string }> = {
  FREE: { fr: 'Gratuit', en: 'Free' },
  MONTHLY: { fr: 'Mensuel (Pro)', en: 'Monthly (Pro)' },
  LIFETIME: { fr: 'À vie', en: 'Lifetime' },
};

function planLabel(plan: string, lang: 'fr' | 'en'): string {
  return PLAN_LABELS[plan]?.[lang] ?? plan;
}

/* ── Plan change confirmation email (bilingual FR/EN) ── */

export async function sendPlanChangeEmail(opts: {
  to: string;
  userName: string | null;
  oldPlan: string;
  newPlan: string;
  source: 'admin' | 'stripe';
}): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  const { to, userName, oldPlan, newPlan, source } = opts;
  const name = userName || 'Bonjour';
  const isUpgrade = newPlan !== 'FREE';
  const oldFr = planLabel(oldPlan, 'fr');
  const newFr = planLabel(newPlan, 'fr');
  const oldEn = planLabel(oldPlan, 'en');
  const newEn = planLabel(newPlan, 'en');

  const subject = isUpgrade
    ? `✅ Votre abonnement Metierium a été mis à niveau — ${newFr}`
    : `Votre abonnement Metierium a été modifié — ${newFr}`;

  const sourceFr = source === 'admin' ? 'par notre équipe' : 'depuis votre espace client';
  const sourceEn = source === 'admin' ? 'by our team' : 'from your account';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0E1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1A2035;border-radius:16px;overflow:hidden;border:1px solid #2D3A52;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#3B82F6,#06B6D4);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Metierium</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Confirmation de changement de plan</p>
          </td>
        </tr>
        <!-- Body FR -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 16px;color:#F8FAFC;font-size:15px;">${name},</p>
            <p style="margin:0 0 16px;color:#94A3B8;font-size:14px;line-height:1.6;">
              Votre abonnement a été modifié ${sourceFr}. Voici le résumé :
            </p>
            <!-- Plan change box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px;border:1px solid #2D3A52;margin:0 0 24px;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <span style="color:#64748B;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Ancien plan</span><br>
                  <span style="color:#94A3B8;font-size:18px;font-weight:600;">${oldFr}</span>
                </td>
                <td style="padding:20px 8px;text-align:center;width:40px;">
                  <span style="color:#3B82F6;font-size:24px;">→</span>
                </td>
                <td style="padding:20px 24px;text-align:center;">
                  <span style="color:#3B82F6;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Nouveau plan</span><br>
                  <span style="color:#F8FAFC;font-size:18px;font-weight:700;">${newFr}</span>
                </td>
              </tr>
            </table>
            ${isUpgrade ? `
            <p style="margin:0 0 16px;color:#94A3B8;font-size:14px;line-height:1.6;">
              🎉 Vous avez maintenant accès à <strong style="color:#F8FAFC;">tous les métiers</strong>, 
              <strong style="color:#F8FAFC;">tous les chapitres de théorie</strong> et 
              <strong style="color:#F8FAFC;">toutes les banques de questions</strong>.
            </p>` : `
            <p style="margin:0 0 16px;color:#94A3B8;font-size:14px;line-height:1.6;">
              Votre accès est maintenant limité au plan ${newFr}. 
              Vous pouvez vous réabonner à tout moment depuis la page 
              <a href="${env.FRONTEND_URL}/pricing" style="color:#3B82F6;text-decoration:none;">Tarification</a>.
            </p>`}
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="background:linear-gradient(135deg,#3B82F6,#06B6D4);border-radius:8px;padding:12px 32px;">
                  <a href="${env.FRONTEND_URL}/pricing" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
                    Voir mon abonnement →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Separator -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #2D3A52;margin:0;"></td></tr>
        <!-- Body EN -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 12px;color:#64748B;font-size:13px;line-height:1.6;">
              <em>English version:</em> Your subscription was changed ${sourceEn}. 
              ${oldEn} → <strong>${newEn}</strong>.
              ${isUpgrade
                ? 'You now have access to all trades, all theory chapters, and all question banks.'
                : `Your access is now limited to the ${newEn} plan. You can resubscribe anytime from the Pricing page.`}
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#111827;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#64748B;font-size:12px;">
              Metierium — Préparation aux examens des métiers de la construction au Québec<br>
              <a href="${env.FRONTEND_URL}" style="color:#3B82F6;text-decoration:none;">metierium.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await t.sendMail({ from: FROM, to, subject, html });
    console.log(`[Email] Plan change confirmation sent to ${to}: ${oldPlan} → ${newPlan}`);
  } catch (err) {
    console.error(`[Email] Failed to send plan change email to ${to}:`, err);
  }
}
