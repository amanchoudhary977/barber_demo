import Link from 'next/link';

const FEATURES = [
  {
    icon: '📸',
    title: 'Upload Your Photo',
    description: 'Snap a selfie or upload any clear, front-facing photo to get started.',
  },
  {
    icon: '🔍',
    title: 'AI Face Analysis',
    description: 'Our AI detects your face shape, skin tone, and features to recommend the best styles.',
  },
  {
    icon: '✂️',
    title: 'Preview Styles',
    description: 'See realistic AI-generated previews of hairstyles and beard styles on your own photo.',
  },
];

const STYLES_PREVIEW = [
  { emoji: '💇', name: 'Textured Crop' },
  { emoji: '💈', name: 'Slick Back' },
  { emoji: '🧔', name: 'Full Beard' },
  { emoji: '😎', name: 'Designer Stubble' },
  { emoji: '⚡', name: 'Buzz Cut' },
  { emoji: '🎭', name: 'Goatee' },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full bg-accent-500/5 blur-[80px] pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            <span className="text-xs font-medium text-primary-300">
              AI-Powered Grooming
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-display)] tracking-tight leading-[1.1] animate-fade-in-up">
            <span className="text-white">Find Your Perfect </span>
            <span className="gradient-text">Style</span>
            <br />
            <span className="text-white">Before the Chair</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            Upload your photo. Our AI analyzes your face shape and features, then
            generates{' '}
            <span className="text-neutral-200 font-medium">
              realistic previews
            </span>{' '}
            of hairstyles and beard styles — so you know exactly what to ask for.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/upload"
              className="
                inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl
                bg-gradient-to-r from-primary-600 to-primary-500
                text-white shadow-xl shadow-primary-900/30
                hover:from-primary-500 hover:to-primary-400
                hover:shadow-2xl hover:shadow-primary-800/30
                transition-all duration-300
                active:scale-[0.97]
                animate-pulse-glow
              "
            >
              <span>✨</span>
              Try It Free
            </Link>
            <span className="text-xs text-neutral-600">
              No sign-up required
            </span>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-white">
              How It Works
            </h2>
            <p className="text-sm text-neutral-500">
              Three simple steps to your perfect look
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="
                  relative glass glass-hover rounded-2xl p-6 text-center
                  animate-fade-in-up
                "
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/15 text-[10px] font-bold text-primary-400 border border-primary-500/20">
                    {index + 1}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-4 mt-2">
                  {feature.icon}
                </div>

                <h3 className="text-sm font-semibold text-white mb-2 font-[family-name:var(--font-display)]">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Styles Preview ─────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-glass-border">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-white">
              Popular Styles
            </h2>
            <p className="text-sm text-neutral-500">
              Choose from our curated collection of trending looks
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
            {STYLES_PREVIEW.map((style, index) => (
              <div
                key={style.name}
                className="
                  glass glass-hover rounded-xl p-4 sm:p-5 text-center
                  animate-fade-in
                "
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="text-3xl mb-2">{style.emoji}</div>
                <p className="text-xs sm:text-sm font-medium text-neutral-200">
                  {style.name}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/upload"
              className="
                inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl
                glass glass-hover text-primary-300
                hover:text-primary-200
                transition-all duration-300
              "
            >
              View All Styles & Get Started
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
