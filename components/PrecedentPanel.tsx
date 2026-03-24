'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import type { PrecedentStudy } from '@/lib/types';
import AIBadge from './AIBadge';

interface PrecedentPanelProps {
  precedentStudies: PrecedentStudy[];
}

/**
 * Collapsible precedent studies section.
 * Collapsed by default to reduce information overload.
 */
export default function PrecedentPanel({ precedentStudies }: PrecedentPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!precedentStudies || precedentStudies.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      {/* Section header (collapsible trigger) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-xl border border-worley-border bg-white px-4 py-4 text-left transition-colors duration-200 hover:bg-worley-surface md:px-6"
        aria-expanded={isExpanded}
        aria-controls="precedent-content"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 shrink-0 text-worley-text-secondary" />
          <h3 className="text-lg font-semibold text-worley-text-primary">
            Relevant precedent from prior studies
          </h3>
          <span className="hidden sm:inline-flex">
            <AIBadge />
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-worley-text-muted transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded content */}
      <div
        id="precedent-content"
        role="region"
        aria-label="Precedent study details"
        className={`overflow-hidden transition-all duration-400 ${
          isExpanded ? 'mt-4 max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {precedentStudies.map((study, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-worley-border bg-white p-4 md:p-5"
            >
              {/* Reference */}
              <h4 className="mb-2 text-base font-semibold text-worley-text-primary">
                {study.reference}
              </h4>

              {/* Finding summary */}
              <p className="mb-3 text-sm leading-relaxed text-worley-text-secondary">
                {study.findingSummary}
              </p>

              {/* Assumptions */}
              <div className="mb-2">
                <span className="block text-xs font-medium uppercase tracking-[0.05em] text-worley-text-muted">
                  Key assumptions
                </span>
                <p className="mt-1 text-sm text-worley-text-secondary">{study.assumptions}</p>
              </div>

              {/* Relevance */}
              <div className="mb-3">
                <span className="block text-xs font-medium uppercase tracking-[0.05em] text-worley-text-muted">
                  Relevance to current asset
                </span>
                <p className="mt-1 text-sm text-worley-text-secondary">{study.relevance}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
