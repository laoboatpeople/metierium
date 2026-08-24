/**
 * Cloudflare Turnstile — shared server-side siteverify.
 * Fail-closed: a missing secret or a missing/invalid token is ALWAYS refused.
 * Never skip verification silently (that would leave forms open to bots).
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false; // fail-closed: captcha not configured -> refuse
  if (typeof token !== 'string' || token.length < 10) return false; // fail-closed: missing/short token -> refuse

  try {
    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) return false;

    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
