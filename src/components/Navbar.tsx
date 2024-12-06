'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { ClientWalletButton } from './ClientWalletProvider';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/trade', label: 'Trade' },
    { href: '/pools', label: 'Pools' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            Sol<span className="text-primary">swap</span>
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <ClientWalletButton />
        </div>
      </div>
    </nav>
  );
}
