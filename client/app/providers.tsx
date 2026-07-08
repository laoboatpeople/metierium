'use client';

import { LocaleProvider } from '@/src/contexts/LocaleContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
