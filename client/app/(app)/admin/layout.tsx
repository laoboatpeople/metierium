'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  HelpCircle,
  Users,
  GraduationCap,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Shield,
  Bell,
  MessageSquare,
  Settings,
  Mail,
  CreditCard,
  BarChart3,
  Sparkles,
  UserCircle,
} from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();

  const ADMIN_NAV_ITEMS = [
    { href: '/app/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/admin/trades', label: t('adminNavTrades'), icon: Briefcase },
    { href: '/app/admin/chapters', label: 'Chapitres', icon: BookOpen },
    { href: '/app/admin/questions', label: 'Questions', icon: HelpCircle },
    { href: '/app/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/app/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/app/admin/contact-messages', label: 'Contact', icon: MessageSquare },
    { href: '/app/admin/settings', label: 'Settings', icon: Settings },
    { href: '/app/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/app/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/app/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/app/admin/ai-generator', label: 'AI Generator', icon: Sparkles },
    { href: '/app/admin/profile', label: 'Profile', icon: UserCircle },
  ];

  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      router.push('/auth/login');
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.role === 'admin') {
        setAuthorized(true);
      } else {
        router.push('/app');
      }
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Shield size={32} className="text-[#3B82F6] animate-pulse" />
          <p className="text-[#94A3B8] text-sm">{t('adminCheckingAccess')}</p>
        </div>
      </div>
    );
  }

  if (!authorized || !user) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0F1525] border-r border-[#2D3A52] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D3A52]">
            <Link href="/app/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[#F8FAFC]">Admin</span>
            </Link>
            <button
              className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC]"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/app/admin'
                  ? pathname === '/app/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#243047]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Back to app */}
          <div className="px-3 mb-2">
            <Link
              href="/app"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#243047] transition-colors"
            >
              <GraduationCap size={18} />
              <span>{t('adminBackToApp')}</span>
            </Link>
          </div>

          {/* User section */}
          <div className="border-t border-[#2D3A52] px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                <Users size={14} className="text-[#3B82F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">{user.name}</p>
                <p className="text-xs text-[#64748B] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors"
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
        <header className="sticky top-0 z-30 bg-[#0A0E1A] border-b border-[#2D3A52]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium rounded border border-[#3B82F6]/20">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
