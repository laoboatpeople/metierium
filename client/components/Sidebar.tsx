'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookMarked,
  BookOpen,
  BarChart3,
  HelpCircle,
  Newspaper,
  MessageSquare,
  CreditCard,
  User,
  GraduationCap,
  LogOut,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
{ href: '/app', label: 'Tableau de bord', icon: LayoutDashboard },
{ href: '/theory', label: 'Théorie', icon: BookMarked },
{ href: '/exams', label: 'Examens', icon: BookOpen },
{ href: '/stats', label: 'Statistiques', icon: BarChart3 },
{ href: '/faq', label: 'FAQ', icon: HelpCircle },
{ href: '/blog', label: 'Blog', icon: Newspaper },
{ href: '/tutor', label: 'Tuteur IA', icon: MessageSquare },
{ href: '/subscription', label: 'Abonnement', icon: CreditCard },
{ href: '/profile', label: 'Profil', icon: User },
];

export function Sidebar({ onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <nav className="flex flex-col h-full bg-[#0A0E1A] border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary leading-none">Metierium</p>
            <p className="text-[10px] text-text-tertiary mt-0.5">Préparation aux examens</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {(() => {
          const activeHref = [...NAV_ITEMS]
            .sort((a, b) => b.href.length - a.href.length)
            .find(({ href }) => pathname === href || pathname.startsWith(`${href}/`))?.href;

          return NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue/10 text-blue border border-blue/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                }`}
              >
                <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
                {label}
              </Link>
            );
          });
        })()}
      </div>

      {/* Footer user */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center">
            <User size={14} className="text-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.name ?? 'Utilisateur'}
            </p>
            <p className="text-xs text-text-tertiary truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full mt-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-red hover:bg-red/5 transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
