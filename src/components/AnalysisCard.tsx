'use client';

import { AnalysisResult } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface AnalysisCardProps {
  analysis: AnalysisResult;
  className?: string;
}

export default function AnalysisCard({
  analysis,
  className = '',
}: AnalysisCardProps) {
  return (
    <Card
      padding="md"
      className={`animate-fade-in-up space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <span className="text-lg">🔍</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-display)]">
            AI Analysis Complete
          </h3>
          <p className="text-[11px] text-neutral-500">
            Confidence: {Math.round((analysis.confidence || 0.85) * 100)}%
          </p>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Face Shape */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
            Face Shape
          </p>
          <p className="text-sm font-semibold text-neutral-100 capitalize">
            {analysis.faceShape}
          </p>
        </div>

        {/* Skin Tone */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
            Skin Tone
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white/10 shrink-0"
              style={{ backgroundColor: analysis.skinToneHex || '#D4A574' }}
            />
            <p className="text-sm font-semibold text-neutral-100 capitalize">
              {analysis.skinTone}
            </p>
          </div>
        </div>

        {/* Hair Type */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
            Hair Type
          </p>
          <p className="text-sm font-semibold text-neutral-100 capitalize">
            {analysis.hairType}
          </p>
        </div>

        {/* Facial Hair */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 space-y-1.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
            Facial Hair
          </p>
          <p className="text-sm font-semibold text-neutral-100 capitalize">
            {analysis.facialHair}
          </p>
        </div>
      </div>

      {/* AI Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
            AI Recommendations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.recommendations.map((rec, i) => (
              <Badge key={i} variant="primary" size="sm">
                💡 {rec}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
