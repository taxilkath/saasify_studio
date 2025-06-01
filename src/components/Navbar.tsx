'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, LayoutDashboard, Users, Settings, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  // { name: 'Search', href: '/search', icon: Search },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Studio', href: '/studio', icon: BookOpen },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-zinc-900 text-zinc-100 flex flex-col py-6 px-4 border-r border-zinc-800">
      <div className="mb-8 flex items-center gap-2 px-2">
        <Home className="w-6 h-6 text-indigo-400" />
        <span className="font-bold text-lg tracking-wide">SaaS Studio</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              pathname.startsWith(href)
                ? 'bg-zinc-800 text-indigo-400 font-semibold'
                : 'hover:bg-zinc-800 text-zinc-200'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
} 