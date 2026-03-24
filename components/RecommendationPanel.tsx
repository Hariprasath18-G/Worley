'use client';

import { Info } from 'lucide-react';
import AIBadge from './AIBadge';

interface RecommendationPanelProps {
  recommendation: string;
}

/**
 * AI recommendation panel with teal left border and validation caveats.
 */
export default function RecommendationPanel({ recommendation }: RecommendationPanelProps) {
  if (!recommendation) {
    return (
      <div className="rounded-xl bg-white p-6 text-worley-text-muted border border-worley-border">
        No recommendation available
      </div>
    );
  }

  return (
    <section
      className="mt-8 rounded-xl border border-worley-border border-l-4 border-l-worley-orange bg-white p-6"
      role="region"
      aria-label="AI Recommendation"
    >
      {/* Banner */}
      <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-worley-border pb-4">
        <Info className="h-5 w-5 shrink-0 text-worley-teal" />
        <span className="text-sm font-medium text-worley-text-secondary">
          AI-generated preliminary assessment
        </span>
        <span className="rounded-full border border-worley-teal px-2 py-0.5 text-xs font-medium text-worley-teal">
          Requires consultant validation
        </span>
        <div className="ml-auto">
          <AIBadge />
        </div>
      </div>

      {/* Heading */}
      <h2 className="mb-3 text-[22px] font-semibold text-worley-text-primary">Recommendation</h2>

      {/* Body */}
      <p className="max-w-[800px] text-base leading-[1.7] text-worley-text-primary">
        {recommendation}
      </p>
    </section>
  );
}
