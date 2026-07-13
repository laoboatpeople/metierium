'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AI Generator redirect — sends admin to the Questions page
 * where they can use AI-powered question generation.
 */
export default function AIGeneratorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/admin/questions');
  }, [router]);

  return null;
}
