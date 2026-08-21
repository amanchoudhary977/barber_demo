'use client';

import { useCallback, useRef, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PhotoUploaderProps {
  onImageSelect: (base64: string, fileName: string) => void;
  isDisabled?: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function PhotoUploader({
  onImageSelect,
  isDisabled = false,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreview(base64);
        setFileName(file.name);
        onImageSelect(base64, file.name);
      };
      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDisabled) setIsDragging(true);
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (isDisabled) return;

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [isDisabled, processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Reset so the same file can be re-selected
      e.target.value = '';
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileName(null);
    setError(null);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      {!preview ? (
        /* ── Upload Zone ──────────────────────────── */
        <Card padding="none" className="overflow-hidden">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isDisabled && fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-4
              p-8 sm:p-12 cursor-pointer
              border-2 border-dashed rounded-2xl
              transition-all duration-300
              ${
                isDragging
                  ? 'border-primary-400 bg-primary-500/5 scale-[1.01]'
                  : 'border-white/10 hover:border-primary-500/40 hover:bg-white/[0.02]'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {/* Icon */}
            <div
              className={`
                w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${isDragging ? 'bg-primary-500/15 scale-110' : 'bg-white/5'}
              `}
            >
              <svg
                className={`w-8 h-8 transition-colors duration-300 ${
                  isDragging ? 'text-primary-400' : 'text-neutral-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <p className="text-sm font-medium text-neutral-200">
                {isDragging ? 'Drop your photo here' : 'Upload your photo'}
              </p>
              <p className="text-xs text-neutral-500">
                <span className="sm:hidden">Tap to upload your photo</span>
                <span className="hidden sm:inline">Drag & drop or click to browse</span>
              </p>
              <p className="text-[10px] text-neutral-600">
                JPG, PNG, or WebP • Max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>

            {/* Tips */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['Front-facing', 'Good lighting', 'Clear face'].map((tip) => (
                <span
                  key={tip}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-white/5 text-neutral-400 border border-white/5"
                >
                  ✓ {tip}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInput}
            className="hidden"
            id="photo-upload-input"
          />
        </Card>
      ) : (
        /* ── Preview ──────────────────────────────── */
        <Card padding="sm" className="space-y-4">
          <div className="relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-square bg-neutral-900">
            <img
              src={preview}
              alt="Uploaded photo preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

            {/* File name */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs text-white/80 font-medium truncate max-w-[60%]">
                {fileName}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 px-1 animate-fade-in">
          <svg
            className="w-4 h-4 text-error shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-xs text-error">{error}</p>
        </div>
      )}
    </div>
  );
}
