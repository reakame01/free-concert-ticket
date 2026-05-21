'use client';

import {
  ArrowLeftRight,
  Clock,
  Home,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/context/app-store';
import { clearAccessMode } from '@/lib/access-mode';
import { clearToken } from '@/lib/auth';
import type { AccessMode } from '@/types/access-mode';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: AccessMode[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/home',
    icon: <Home className="h-5 w-5" strokeWidth={1.5} />,
    roles: ['ADMIN', 'USER'],
  },
  {
    label: 'History',
    href: '/history',
    icon: <Clock className="h-5 w-5" strokeWidth={1.5} />,
    roles: ['ADMIN'],
  },
];

export const SideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { accessMode, switchRole } = useAppStore();

  const handleLogout = () => {
    clearToken();
    clearAccessMode();
    router.push('/');
  };

  const handleSwitchRole = () => {
    switchRole();
    if (pathname === '/history') {
      router.push('/home');
    }
  };

  const switchLabel =
    accessMode === 'ADMIN' ? 'Switch to user' : 'Switch to Admin';

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(accessMode),
  );

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname.startsWith('/home/');
    }
    return pathname === href;
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col border-r border-gray-200 bg-white lg:w-64">
      <div className="border-b border-gray-100 px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {accessMode === 'ADMIN' ? 'Admin' : 'User'}
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'bg-sky-50 text-brand'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleSwitchRole}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeftRight className="h-5 w-5" strokeWidth={1.5} />
          {switchLabel}
        </button>
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
};
