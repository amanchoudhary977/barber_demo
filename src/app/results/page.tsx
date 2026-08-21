'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/FlowContext';
import ResultViewer from '@/components/ResultViewer';
import Button from '@/components/ui/Button';

export default function ResultsPage() {
  const router = useRouter();
  const {
    image,
    generatedImage,
    selectedStyle,
    analysis,
    resetToStyleSelect,
    resetToUpload,
  } = useFlow();

  // Redirect if no data is available (e.g., direct URL access)
  useEffect(() => {
    if (!image || !generatedImage || !selectedStyle) {
      router.replace('/upload');
    }
  }, [image, generatedImage, selectedStyle, router]);

  // ── Download handler ─────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!generatedImage || !selectedStyle) return;

    const link = document.createElement('a');
    link.href = generatedImage.startsWith('data:')
      ? generatedImage
      : `data:image/jpeg;base64,${generatedImage}`;
    link.download = `stylegenius-${selectedStyle.id}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, selectedStyle]);

  // ── Try another style ────────────────────────────────
  const handleTryAnother = useCallback(() => {
    resetToStyleSelect();
    router.push('/upload');
  }, [resetToStyleSelect, router]);

  // ── Start fresh ──────────────────────────────────────
  const handleStartFresh = useCallback(() => {
    resetToUpload();
    router.push('/upload');
  }, [resetToUpload, router]);

  // Guard: don't render until data is available
  if (!image || !generatedImage || !selectedStyle || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-4xl">✨</div>
          <p className="text-sm text-neutral-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Result Viewer */}
        <ResultViewer
          originalImage={image}
          generatedImage={generatedImage}
          style={selectedStyle}
          onTryAnother={handleTryAnother}
          onDownload={handleDownload}
        />

        {/* Additional Actions */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-glass-border">
          {/* Analysis summary reminder */}
          <div className="glass rounded-xl p-4 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                style={{ backgroundColor: analysis.skinToneHex || '#D4A574' }}
              />
              <p className="text-xs text-neutral-400">
                <span className="text-neutral-200 font-medium capitalize">
                  {analysis.faceShape}
                </span>{' '}
                face •{' '}
                <span className="text-neutral-200 font-medium capitalize">
                  {analysis.skinTone}
                </span>{' '}
                skin tone •{' '}
                <span className="text-neutral-200 font-medium">
                  {selectedStyle.emoji} {selectedStyle.name}
                </span>
              </p>
            </div>
          </div>

          {/* Start over */}
          <Button variant="ghost" size="sm" onClick={handleStartFresh}>
            ← Start Over with New Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
