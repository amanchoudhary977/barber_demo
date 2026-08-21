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

export default function ResultViewer({
  originalImage,
  generatedImage,
  style,
  onTryAnother,
  onDownload,
}: ResultViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [showOriginal, setShowOriginal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = rect.width > 0 ? (x / rect.width) * 100 : 50;
    setSliderPosition(Math.max(1, Math.min(99, pct)));
  };

  const generatedSrc = generatedImage.startsWith('data:')
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
          {style.emoji} {style.name} — AI-Generated Preview
        </p>
      </div>

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

      {/* Image Display */}
      <Card padding="sm" glow>
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Original */}
            <div className="space-y-2">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium text-center">
                Before
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
                After — {style.name}
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
              {/* Generated (full background) */}
              <img
                src={generatedSrc}
                alt={`Generated ${style.name} preview`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Original (clipped) */}
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
              {/* Slider line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Handle */}
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
              {/* Tap hint */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center">
                <span className="px-3 py-1 text-[10px] font-medium rounded-full bg-black/50 backdrop-blur-sm text-white/70">
                  Tap to {showOriginal ? 'see result' : 'see original'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
