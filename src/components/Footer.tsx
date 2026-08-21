export default function Footer() {
  return (
    <footer className="mt-auto border-t border-glass-border bg-background/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-3.5 h-3.5 text-white"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              </svg>
            </div>
            <span className="text-sm font-semibold font-[family-name:var(--font-display)] text-neutral-400">
              StyleGenius
            </span>
          </div>

          {/* Info */}
          <p className="text-xs text-neutral-600 text-center">
            AI-powered grooming recommendations • Powered by Gemini
          </p>

          {/* Copyright */}
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} StyleGenius
          </p>
        </div>
      </div>
    </footer>
  );
}
