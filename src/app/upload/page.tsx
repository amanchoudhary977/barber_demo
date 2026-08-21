'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '@/context/FlowContext';
import { StyleOption, AnalysisResult } from '@/types';
import { getRecommendedStyles } from '@/lib/styles-data';

import PhotoUploader from '@/components/PhotoUploader';
import AnalysisCard from '@/components/AnalysisCard';
import StyleSelector from '@/components/StyleSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ErrorDialog from '@/components/ui/ErrorDialog';

export default function UploadPage() {
  const router = useRouter();
  const {
    step,
    image,
    fileName,
    analysis,
    error,
    setImage,
    setAnalysis,
    setStep,
    setError,
    setSelectedStyle,
    setGeneratedImage,
    resetToUpload,
  } = useFlow();

  // ── Guard: recover from stale states on page refresh ──
  useEffect(() => {
    // If stuck in 'analyzing' or 'generating' with no in-flight request, revert
    if (step === 'analyzing' && image) {
      setStep('upload');
    } else if (step === 'generating' && analysis) {
      setStep('selecting');
    } else if (step === 'preview') {
      // If on /upload but step is 'preview', redirect to /results
      router.replace('/results');
    } else if (step !== 'upload' && !image) {
      // No image but past the upload step — reset
      resetToUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 1: Handle image selection ──────────────────
  const handleImageSelect = useCallback(
    (base64: string, fileName: string) => {
      setImage(base64, fileName);
    },
    [setImage]
  );

  // ── Step 2: Trigger Gemini analysis ─────────────────
  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    setStep('analyzing');
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const text = await response.text();
      let data: { success?: boolean; data?: AnalysisResult; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        console.error('API /api/analyze non-JSON response:', text);
        setError(`Server error (${response.status}): ${text.substring(0, 150)}`);
        setStep('upload');
        return;
      }

      if (!data.success || !data.data) {
        setError(data.error || 'Analysis failed. Please try again.');
        setStep('upload');
        return;
      }

      setAnalysis(data.data);
      // step is automatically set to 'results' by setAnalysis
    } catch (err) {
      console.error('Analysis request error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Network error. Please check your connection and try again.'
      );
      setStep('upload');
    }
  }, [image, setStep, setError, setAnalysis]);

  // ── Step 3: Handle style selection ──────────────────
  const handleProceedToStyles = useCallback(() => {
    setStep('selecting');
  }, [setStep]);

  // ── Step 4: Trigger image generation ────────────────
  const handleStyleSelect = useCallback(
    async (style: StyleOption) => {
      if (!image || !analysis) return;

      setSelectedStyle(style);
      setStep('generating');
      setError(null);

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image,
            styleId: style.id,
            analysis,
          }),
        });

        const text = await response.text();
        let data: { success?: boolean; data?: { generatedImage: string }; error?: string };
        try {
          data = JSON.parse(text);
        } catch {
          console.error('API /api/generate non-JSON response:', text);
          setError(`Server error (${response.status}): ${text.substring(0, 150)}`);
          setStep('selecting');
          return;
        }

        if (!data.success || !data.data?.generatedImage) {
          setError(data.error || 'Generation failed. Please try again.');
          setStep('selecting');
          return;
        }

        setGeneratedImage(data.data.generatedImage);
        // step is automatically set to 'preview' by setGeneratedImage
        router.push('/results');
      } catch (err) {
        console.error('Generation request error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Network error. Please check your connection and try again.'
        );
        setStep('selecting');
      }
    },
    [image, analysis, setSelectedStyle, setStep, setError, setGeneratedImage, router]
  );

  // ── Derive recommended style IDs from analysis ─────
  const recommendedIds = analysis
    ? getRecommendedStyles(analysis.recommendations).map((s) => s.id)
    : [];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* ── Progress Indicator ─────────────────────── */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {[
            { key: 'upload', label: 'Upload', num: 1 },
            { key: 'analyze', label: 'Analyze', num: 2 },
            { key: 'style', label: 'Style', num: 3 },
            { key: 'generate', label: 'Preview', num: 4 },
          ].map((s, i) => {
            const isActive =
              (s.key === 'upload' && (step === 'upload')) ||
              (s.key === 'analyze' && (step === 'analyzing' || step === 'results')) ||
              (s.key === 'style' && step === 'selecting') ||
              (s.key === 'generate' && (step === 'generating' || step === 'preview'));
            const isPast =
              (s.key === 'upload' && step !== 'upload') ||
              (s.key === 'analyze' && ['selecting', 'generating', 'preview'].includes(step)) ||
              (s.key === 'style' && ['generating', 'preview'].includes(step));

            return (
              <div key={s.key} className="flex items-center gap-2 sm:gap-3">
                {i > 0 && (
                  <div
                    className={`w-6 sm:w-10 h-px transition-colors duration-300 ${
                      isPast ? 'bg-primary-500' : 'bg-white/10'
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/30'
                          : isPast
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-white/5 text-neutral-600'
                      }
                    `}
                  >
                    {isPast ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium hidden sm:inline transition-colors duration-300 ${
                      isActive
                        ? 'text-primary-300'
                        : isPast
                        ? 'text-neutral-500'
                        : 'text-neutral-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Error Banner ───────────────────────────── */}
        {error && (
          <Card padding="sm" className="animate-fade-in border-error/20 !bg-error/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-error">Something went wrong</p>
                <p className="text-xs text-error/80 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-error/60 hover:text-error transition-colors p-1 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Card>
        )}

        {/* ── Step: Upload ───────────────────────────── */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-white">
                Upload Your Photo
              </h1>
              <p className="text-sm text-neutral-500">
                We&apos;ll analyze your features and recommend the best styles
              </p>
            </div>

            <PhotoUploader
              currentImage={image}
              currentFileName={fileName}
              onImageSelect={handleImageSelect}
              onRemove={resetToUpload}
            />

            {image && (
              <div className="flex justify-center animate-fade-in pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAnalyze}
                  icon={<span>🔍</span>}
                >
                  Analyze My Face
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Step: Analyzing ────────────────────────── */}
        {step === 'analyzing' && (
          <div className="py-12">
            <LoadingSpinner mode="analyzing" />
          </div>
        )}

        {/* ── Step: Analysis Results ─────────────────── */}
        {step === 'results' && analysis && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-white">
                Your Analysis Results
              </h1>
              <p className="text-sm text-neutral-500">
                Here&apos;s what our AI found — now pick a style to preview!
              </p>
            </div>

            {/* Photo + Analysis side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Uploaded photo */}
              {image && (
                <Card padding="sm" className="animate-fade-in-up">
                  <div className="rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900">
                    <img
                      src={image}
                      alt="Your uploaded photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              )}

              {/* Analysis */}
              <AnalysisCard analysis={analysis} />
            </div>

            <div className="flex justify-center animate-fade-in delay-300">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToStyles}
                icon={<span>✂️</span>}
              >
                Choose a Style
              </Button>
            </div>
          </div>
        )}

        {/* ── Step: Style Selection ───────────────────── */}
        {step === 'selecting' && analysis && (
          <StyleSelector
            onSelect={handleStyleSelect}
            recommendedStyleIds={recommendedIds}
          />
        )}

        {/* ── Step: Generating ───────────────────────── */}
        {step === 'generating' && (
          <div className="py-12">
            <LoadingSpinner mode="generating" />
          </div>
        )}

        {/* ── Start Over ────────────────────────────── */}
        {step !== 'analyzing' && step !== 'generating' && step !== 'upload' && (
          <div className="flex justify-center pt-4">
            <Button variant="ghost" size="sm" onClick={resetToUpload}>
              ← Start Over with New Photo
            </Button>
          </div>
        )}
      </div>

      {/* ── Diagnostic Error Dialog Modal ──────────── */}
      <ErrorDialog
        isOpen={Boolean(error)}
        title="Processing Error"
        error={error}
        onClose={() => setError(null)}
        onRetry={image ? handleAnalyze : undefined}
      />
    </div>
  );
}
