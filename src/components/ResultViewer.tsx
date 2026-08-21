'use client';

import { useState } from 'react';
import { StyleOption } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ResultViewerProps {
  originalImage: string;
  generatedImage: string;
  style: StyleOption;
  onTryAnother: () => void;
  onDownload: () => void;
}

type ViewMode = 'side-by-side' | 'slider' | 'toggle';
type ViewAngle = 'front' | 'side' | 'back';

export default function ResultViewer({
  originalImage,
  generatedImage,
  style,
  onTryAnother,
  onDownload,
}: ResultViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [angle, setAngle] = useState<ViewAngle>('front');
  const [showOriginal, setShowOriginal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = rect.width > 0 ? (x / rect.width) * 100 : 50;
    setSliderPosition(Math.max(1, Math.min(99, pct)));
  };

  const generatedSrc = generatedImage.startsWith('data:') || generatedImage.startsWith('http')
    ? generatedImage
    : `data:image/jpeg;base64,${generatedImage}`;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-white">
          Your New Look ✨
        </h2>
        <p className="text-xs text-neutral-500">
          {style.emoji} {style.name} — 360° Barber Reference
        </p>
      </div>

      {/* ── 360 Angle Selector ──────────────────────── */}
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-900/90 border border-primary-500/30 shadow-lg shadow-primary-950/40">
          {[
            { key: 'front' as ViewAngle, label: 'Front (AI Preview)', icon: '👤', desc: 'Your Face Swapped' },
            { key: 'side' as ViewAngle, label: 'Side View', icon: '📐', desc: 'Fade / Taper Profile' },
            { key: 'back' as ViewAngle, label: 'Back View', icon: '🔄', desc: 'Neckline & Blend' },
          ].map((item) => {
            const isSelected = angle === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setAngle(item.key)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl
                  transition-all duration-250 cursor-pointer
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-900/40 scale-[1.02]'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-neutral-400 text-center">
          {angle === 'front' && '✨ AI-Generated Preview with your face on this haircut'}
          {angle === 'side' && '📐 Show this exact side fade angle to your barber'}
          {angle === 'back' && '🔄 Show this exact back blend & neckline to your barber'}
        </p>
      </div>

      {/* ── Front View (AI Face Swap Comparison) ────── */}
      {angle === 'front' && (
        <div className="space-y-4 animate-fade-in">
          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              {[
                { key: 'side-by-side' as ViewMode, label: 'Side by Side', icon: '⬜⬜' },
                { key: 'slider' as ViewMode, label: 'Slider', icon: '↔️' },
                { key: 'toggle' as ViewMode, label: 'Toggle', icon: '🔄' },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${
                      viewMode === mode.key
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                    }
                  `}
                >
                  {mode.icon} <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Card padding="sm" glow>
            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Original */}
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium text-center">
                    Before (Original)
                  </p>
                  <div className="rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900">
                    <img
                      src={originalImage}
                      alt="Original photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Generated */}
                <div className="space-y-2">
                  <p className="text-[10px] text-primary-400 uppercase tracking-wider font-medium text-center">
                    After — {style.name} (Front)
                  </p>
                  <div className="rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900 ring-1 ring-primary-500/20">
                    <img
                      src={generatedSrc}
                      alt={`Generated ${style.name} preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'slider' && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-medium px-1">
                  <span>Before</span>
                  <span className="text-primary-400">After — {style.name}</span>
                </div>
                <div
                  className="relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] bg-neutral-900 cursor-ew-resize select-none"
                  onMouseMove={handleSliderMove}
                  onTouchMove={handleSliderMove}
                >
                  <img
                    src={generatedSrc}
                    alt={`Generated ${style.name} preview`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={originalImage}
                      alt="Original photo"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ minWidth: `${10000 / Math.max(1, sliderPosition)}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg z-10"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'toggle' && (
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium text-center">
                  {showOriginal ? 'Before' : `After — ${style.name}`}
                </p>
                <div
                  className="relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] bg-neutral-900 cursor-pointer"
                  onClick={() => setShowOriginal(!showOriginal)}
                >
                  <img
                    src={showOriginal ? originalImage : generatedSrc}
                    alt={showOriginal ? 'Original photo' : `Generated ${style.name} preview`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center">
                    <span className="px-3 py-1 text-[10px] font-medium rounded-full bg-black/50 backdrop-blur-sm text-white/70">
                      Tap to {showOriginal ? 'see result' : 'see original'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Side View (Barber Reference) ─────────────── */}
      {angle === 'side' && (
        <Card padding="sm" glow className="animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-primary-400">
                {style.name} — Side Profile & Taper Guide
              </p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                Barber Reference
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] bg-neutral-900">
              <img
                src={style.sideUrl}
                alt={`${style.name} side profile`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="text-xs font-medium text-white">
                  📐 Show this exact side fade angle to your barber
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Clean side profile reference with precise fade height and temple taper.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Back View (Barber Reference) ─────────────── */}
      {angle === 'back' && (
        <Card padding="sm" glow className="animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-primary-400">
                {style.name} — Back View & Neckline Guide
              </p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                Barber Reference
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] bg-neutral-900">
              <img
                src={style.backUrl}
                alt={`${style.name} back neckline view`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="text-xs font-medium text-white">
                  🔄 Show this exact back blend & neckline to your barber
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Precision taper neckline and crown blend guidelines.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button variant="primary" size="lg" onClick={onDownload} icon={<span>📥</span>}>
          Download Result
        </Button>
        <Button variant="secondary" size="lg" onClick={onTryAnother} icon={<span>🔄</span>}>
          Try Another Style
        </Button>
      </div>
    </div>
  );
}
