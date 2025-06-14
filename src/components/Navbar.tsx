'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Users, BookOpen, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { ThemeSwitcher } from './ThemeSwitcher'; // Import the new ThemeSwitcher

// --- Navigation items configuration ---
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Studio', href: '/studio', icon: BookOpen },
  { name: 'User Management', href: '/users', icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

    useEffect(() => {
      if (isMobileNavOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isMobileNavOpen, isMobile]);

    const handleLinkClick = () => {
      if (isMobile) {
        setIsMobileNavOpen(false);
      }
    };

    return (
      <>
        {/* ... (Your mobile hamburger and overlay code remains the same) ... */}

        {isSignedIn && (
          <aside
            id="sidebar"
            className={clsx(
              // Use dark: equivalent classes for dark mode
              "h-screen bg-zinc-100 dark:bg-zinc-900/90 backdrop-blur-xl text-zinc-800 dark:text-zinc-100 flex flex-col z-50 transition-all duration-300 ease-in-out",
              "md:relative md:translate-x-0 md:border-r md:border-zinc-200 dark:md:border-zinc-800",
              isCollapsed ? "md:w-20" : "md:w-64",
              "fixed top-0 left-0",
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )}
            aria-label="Sidebar"
          >
            <div className="flex flex-col h-full">
              <div className={clsx("flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 h-[68px]")}>
                <div className={clsx("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
                  <Home className="w-7 h-7 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                  <span className={clsx("font-extrabold text-xl tracking-wide text-zinc-900 dark:text-white", isCollapsed && "md:hidden")}>SaaS</span>
                </div>
                <button
                  className="hidden md:block p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-2 py-4 px-2">
                {navItems.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    onClick={handleLinkClick}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-base font-medium',
                      pathname.startsWith(href)
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-700/80 dark:to-indigo-400/60 text-white shadow-lg'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={clsx(isCollapsed && "md:hidden")}>{name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
                {/* Add the ThemeSwitcher here */}
                <div className={clsx("mb-4", isCollapsed && "flex justify-center")}>
                  <ThemeSwitcher />
                </div>
                <div className={clsx('flex items-center gap-3 px-1 py-1 rounded-xl', isCollapsed && "justify-center")}>
                  <UserButton afterSignOutUrl="/sign-in" />
                  <div className={clsx("flex flex-col", isCollapsed && "md:hidden")}>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">My Account</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </>
    );
  }