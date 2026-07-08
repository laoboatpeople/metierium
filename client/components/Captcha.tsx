'use client';

import { useEffect, useRef, useCallback } from 'react';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile captcha widget.
 * Retries render until Turnstile API is available (script loads via next/script in auth layout).
 * Falls back silently if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */
export default function Captcha({ onVerify, onExpire }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const render = useCallback(() => {
    if (!containerRef.current || widgetId.current) return;
    const ts = (window as any).turnstile;
    if (!ts) {
      // Script not ready yet — keep retrying
      setTimeout(render, 500);
      return;
    }
    widgetId.current = ts.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onVerify(token),
      'expired-callback': () => onExpire?.(),
      theme: 'dark',
    });
  }, [siteKey, onVerify, onExpire]);

  useEffect(() => {
    if (!siteKey) return;
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
    <div className="flex justify-center py-2">
      <div ref={containerRef} />
    </div>
  );
}
