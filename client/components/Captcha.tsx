'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile captcha widget.
 * Retries render until Turnstile API is available (script loads via next/script in auth layout).
 * Reserves visible space (min-height) so a missing/blocked widget is never invisible.
 * Shows an explicit error if the widget fails to load.
 * Falls back silently if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */
export default function Captcha({ onVerify, onExpire }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [failed, setFailed] = useState(false);
  const { t } = useLocale();

  const render = useCallback(() => {
    if (!containerRef.current || widgetId.current) return;
    const ts = (window as any).turnstile;
    if (!ts) {
      // Script not ready yet — keep retrying
      setTimeout(render, 500);
      return;
    }
    try {
      const tokenRef = { got: false };
      widgetId.current = ts.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          tokenRef.got = true;
          onVerify(token);
        },
        'expired-callback': () => onExpire?.(),
        'error-callback': () => setFailed(true),
        theme: 'dark',
      });
      // Invisible-mode widgets produce no token until execute() is called.
      // If the widget has not self-executed shortly after render, trigger it
      // explicitly (no-op for visible widgets: they render an iframe and wait
      // for user interaction, and are skipped via the iframe check below).
      window.setTimeout(() => {
        if (
          !tokenRef.got &&
          widgetId.current &&
          (window as any).turnstile &&
          !containerRef.current?.querySelector('iframe')
        ) {
          try {
            (window as any).turnstile.execute(widgetId.current);
          } catch {
            /* already executing or removed */
          }
        }
      }, 2500);
    } catch {
      setFailed(true);
    }
  }, [siteKey, onVerify, onExpire]);

  useEffect(() => {
    if (!siteKey) return;
    setFailed(false);
    render();

    return () => {
      if (widgetId.current && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetId.current);
        widgetId.current = undefined;
      }
    };
    // Intentionally single-run: render has its own retry logic via setTimeout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!siteKey) return null;

  return (
    <div className="flex flex-col items-center py-2">
      <div ref={containerRef} className="min-h-[65px] flex justify-center" />
      {failed && (
        <p className="text-xs text-red mt-1 text-center">{t('auth_captchaLoadError')}</p>
      )}
    </div>
  );
}
