'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  /** The type of loading operation — controls the message sequence */
  mode?: 'analyzing' | 'generating';
  /** Optional custom message to override the auto-cycling messages */
  message?: string;
  className?: string;
}

const ANALYSIS_MESSAGES = [
  { text: 'Scanning your photo...', icon: '📸' },
  { text: 'Detecting face shape...', icon: '🔍' },
  { text: 'Analyzing skin tone...', icon: '🎨' },
  { text: 'Evaluating features...', icon: '✨' },
  { text: 'Generating recommendations...', icon: '💡' },
];

const GENERATION_MESSAGES = [
  { text: 'Preparing your style preview...', icon: '🎭' },
  { text: 'AI is crafting your new look...', icon: '✂️' },
  { text: 'Blending realistically...', icon: '🪄' },
  { text: 'Refining the details...', icon: '🔬' },
  { text: 'Adding finishing touches...', icon: '💫' },
  { text: 'Almost there — perfecting the result...', icon: '🎯' },
  { text: 'Just a few more seconds...', icon: '⏳' },
];

export default function LoadingSpinner({
  mode = 'analyzing',
  message,
  className = '',
}: LoadingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = mode === 'analyzing' ? ANALYSIS_MESSAGES : GENERATION_MESSAGES;

  // Cycle through messages
  useEffect(() => {
    if (message) return; // Don't cycle if custom message is provided

    const interval = mode === 'analyzing' ? 2000 : 3500;

    const timer = setInterval(() => {
      setMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, interval);

    return () => clearInterval(timer);
  }, [mode, message, messages.length]);

  const currentMessage = message
    ? { text: message, icon: '⏳' }
    : messages[messageIndex];

  const progress = ((messageIndex + 1) / messages.length) * 100;

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Animated spinner ring */}
      <div className="relative w-20 h-20">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-40" />

        {/* Spinning ring */}
        <svg
          className="w-20 h-20 animate-spin-slow"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="rgba(168, 162, 158, 0.15)"
            strokeWidth="3"
          />
          <path
            d="M40 6 A34 34 0 0 1 74 40"
            stroke="url(#spinner-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e5a540" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float">
          {currentMessage.icon}
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-3 max-w-xs">
        <p
          key={messageIndex}
          className="text-sm text-neutral-200 font-medium animate-fade-in"
        >
          {currentMessage.text}
        </p>

        {/* Progress bar */}
        {!message && (
          <div className="w-48 mx-auto">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1.5 font-mono">
              Step {messageIndex + 1} of {messages.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
