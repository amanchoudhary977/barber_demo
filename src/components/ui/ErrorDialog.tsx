'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ErrorDialogProps {
  isOpen: boolean;
  title?: string;
  error: string | null;
  onClose: () => void;
  onRetry?: () => void;
}

export default function ErrorDialog({
  isOpen,
  title = 'Something went wrong',
  error,
  onClose,
  onRetry,
}: ErrorDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !error) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-error/30 bg-neutral-900 shadow-2xl shadow-error/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-error/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-error/20 text-error">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-[family-name:var(--font-display)]">
                {title}
              </h3>
              <p className="text-xs text-error/80">Diagnostic Error Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-300">
            An issue occurred during processing. Here is the exact diagnostic information:
          </p>

          {/* Raw Error Details Box */}
          <div className="relative rounded-xl bg-neutral-950 border border-white/10 p-4 font-mono text-xs text-neutral-200 overflow-x-auto max-h-48">
            <pre className="whitespace-pre-wrap break-words">{error}</pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>

          <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-3 text-xs text-neutral-400">
            💡 <span className="text-primary-300 font-medium">Quick Tip:</span> Check if your Gemini API key is valid or if your Colab Ngrok tunnel is running.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4 bg-white/[0.02]">
          <Button variant="secondary" size="md" onClick={onClose}>
            Dismiss
          </Button>
          {onRetry && (
            <Button variant="primary" size="md" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
