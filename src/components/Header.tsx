'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/30 group-hover:shadow-primary-800/40 transition-shadow duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-white"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-[family-name:var(--font-display)] tracking-tight text-white group-hover:text-primary-300 transition-colors duration-200">
              StyleGenius
            </span>
            <span className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase leading-none">
              AI Grooming
            </span>
          </div>
        </Link>

        {/* CTA */}
        <Link
          href="/upload"
          className="
            px-4 py-2 text-sm font-medium rounded-xl
            bg-gradient-to-r from-primary-600 to-primary-500
            text-white shadow-lg shadow-primary-900/20
            hover:from-primary-500 hover:to-primary-400
            hover:shadow-primary-800/30
            transition-all duration-250
            active:scale-[0.97]
          "
        >
          Try Now
        </Link>
      </div>
    </header>
  );
}
