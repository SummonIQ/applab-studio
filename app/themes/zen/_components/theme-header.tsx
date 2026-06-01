'use client';

import { Menu, RockingChair, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ThemeHeaderProps {
  themeName: string;
  navItems?: { label: string; href: string }[];
}

export function ThemeHeader({ themeName, navItems = [] }: ThemeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultNavItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const items = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-20 after:h-px after:bg-gradient-to-r after:from-pink-400/25 after:via-fuchsia-400/25 after:to-cyan-400/25">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            height: '200%',
            background:
              'linear-gradient(to bottom, rgb(255 255 255 / 0.5) 0%, rgb(255 255 255 / 0) 50%)',
            backdropFilter: 'blur(22px) saturate(160%) brightness(1.05)',
            WebkitBackdropFilter: 'blur(22px) saturate(160%) brightness(1.05)',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 50%, transparent 50%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 50%, transparent 50%, transparent 100%)',
          }}
        />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link href="#" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600">
                <RockingChair
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {themeName}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
            {items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-transparent px-3.5 py-1.5 text-sm font-semibold backdrop-blur-lg shadow-sm transition-all duration-300 hover:shadow-lg"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.995), rgba(255,255,255,0.96)) padding-box, linear-gradient(to right, rgba(147,51,234,0.8), rgba(217,70,239,0.8), rgba(236,72,153,0.8)) border-box',
              }}
            >
              <span className="relative z-10 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Get Started
              </span>
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden relative z-10 mx-auto max-w-6xl px-4 pb-3">
            <div className="space-y-1 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-sm">
              {items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent px-3.5 py-1.5 text-sm font-semibold backdrop-blur-lg shadow-sm"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.995), rgba(255,255,255,0.96)) padding-box, linear-gradient(to right, rgba(147,51,234,0.8), rgba(217,70,239,0.8), rgba(236,72,153,0.8)) border-box',
                }}
              >
                <span className="relative z-10 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  Get Started
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
