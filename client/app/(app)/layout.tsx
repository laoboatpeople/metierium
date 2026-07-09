'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookMarked,
  BookOpen,
  MessageSquare,
  CreditCard,
  User,
  GraduationCap,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const NAV_ITEMS = [
  { href: '/app', label: 'dashboard', icon: LayoutDashboard },
  { href: '/theory', label: 'theory', icon: BookMarked },
  { href: '/exams', label: 'exams', icon: BookOpen },
  { href: '/tutor', label: 'aiTutor', icon: MessageSquare },
  { href: '/pricing', label: 'pricing', icon: CreditCard },
  { href: '/profile', label: 'profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUser();
  }, [router]);

  async function fetchUser() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <GraduationCap size={32} className="text-blue animate-pulse" />
          <p className="text-text-secondary text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary text-text-primary">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0A0E1A] border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link href="/app" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">Metierium</span>
            </Link>
            <button
              className="lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue/10 text-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                  }`}
                >
                  <Icon size={18} />
                  <span>{t(item.label)}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}

            {/* Admin link - only for admin users */}
            {user?.role === 'admin' && (
              <Link
                href="/app/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/app/admin')
                    ? 'bg-blue/10 text-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                }`}
              >
                <Shield size={18} />
                <span>Admin</span>
                {pathname.startsWith('/app/admin') && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )}
          </nav>

          {/* User section */}
          <div className="border-t border-border px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center">
                <User size={14} className="text-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-tertiary truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-blue hover:bg-blue/5 transition-colors mb-1"
            >
              <span className="text-xs font-mono w-5 h-5 flex items-center justify-center rounded border border-border">
                {locale === 'fr' ? 'FR' : 'EN'}
              </span>
              <span>{t('language')}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-red hover:bg-red/5 transition-colors"
            >
              <LogOut size={16} />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-primary border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
