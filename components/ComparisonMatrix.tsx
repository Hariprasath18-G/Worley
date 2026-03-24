'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { PathwayScenario } from '@/lib/types';
import { DIMENSION_LABELS, PATHWAY_COLOR_MAP } from '@/lib/types';
import AIBadge from './AIBadge';

interface ComparisonMatrixProps {
  pathways: PathwayScenario[];
}

/**
 * Five-dimension x four-pathway comparison table.
 * Desktop: full table. Tablet: scrollable table. Mobile: accordion per pathway.
 */
export default function ComparisonMatrix({ pathways }: ComparisonMatrixProps) {
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);

  if (!pathways || pathways.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-worley-text-muted border border-worley-border">
        No comparison data available
      </div>
    );
  }

  return (
    <section className="mt-8">
      {/* Section heading */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-[22px] font-semibold text-worley-text-primary">Detailed Comparison</h2>
        <AIBadge />
      </div>
      <div className="mb-4 h-1 w-16 bg-worley-orange" aria-hidden="true" />

      {/* Expand/Collapse toggle */}
      <button
        type="button"
        onClick={() => setIsTableExpanded(!isTableExpanded)}
        className="mb-4 flex items-center gap-2 rounded-lg border border-worley-border bg-white px-4 py-2 text-sm font-medium text-worley-text-secondary transition-colors hover:border-worley-orange hover:text-worley-orange"
        aria-expanded={isTableExpanded}
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${isTableExpanded ? 'rotate-180' : ''}`}
        />
        {isTableExpanded ? 'Collapse detailed comparison' : 'Expand detailed comparison'}
      </button>

      {/* Collapsible container */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isTableExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >

      {/* Desktop/Tablet: Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-worley-border">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-worley-orange">
                <th className="w-[200px] border-b border-white/20 px-4 py-3 text-left text-sm font-semibold text-white">
                  Dimension
                </th>
                {pathways.map((pathway) => {
                  return (
                    <th
                      key={pathway.pathwayName}
                      className="border-b border-white/20 px-4 py-3 text-left text-sm font-semibold text-white"
                    >
                      {pathway.pathwayName}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {DIMENSION_LABELS.map((dimension, rowIdx) => (
                <tr
                  key={dimension.key}
                  className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-worley-surface'}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap border-b border-worley-border px-4 py-4 text-left align-top text-sm font-medium text-worley-text-secondary"
                  >
                    {dimension.label}
                  </th>
                  {pathways.map((pathway) => {
                    const value = pathway[dimension.key];
                    return (
                      <td
                        key={`${pathway.pathwayName}-${dimension.key}`}
                        className="border-b border-worley-border px-4 py-4 align-top text-sm leading-relaxed text-worley-text-primary"
                      >
                        {value || (
                          <span className="italic text-worley-text-muted">Data unavailable</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-worley-text-muted lg:hidden">
          Scroll to see all pathways →
        </p>
      </div>

      {/* Mobile: Accordion */}
      <div className="md:hidden">
        {pathways.map((pathway) => {
          const colorMap = PATHWAY_COLOR_MAP[pathway.pathwayName];
          const isOpen = expandedPathway === pathway.pathwayName;

          return (
            <div key={pathway.pathwayName} className="mb-2">
              <button
                type="button"
                onClick={() =>
                  setExpandedPathway(isOpen ? null : pathway.pathwayName)
                }
                className="flex w-full items-center justify-between rounded-t-xl bg-white px-4 py-3 text-left border border-worley-border"
                aria-expanded={isOpen}
                aria-controls={`accordion-${pathway.pathwayName.replace(/\s+/g, '-')}`}
                style={{ borderLeft: `4px solid ${colorMap?.accent || '#718096'}` }}
              >
                <span className="text-base font-semibold text-worley-text-primary">
                  {pathway.pathwayName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-worley-text-muted transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={`accordion-${pathway.pathwayName.replace(/\s+/g, '-')}`}
                role="region"
                aria-labelledby={pathway.pathwayName}
                className={`overflow-hidden transition-all duration-400 ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {DIMENSION_LABELS.map((dimension, idx) => (
                  <div
                    key={dimension.key}
                    className={`bg-white px-4 py-3 ${
                      idx < DIMENSION_LABELS.length - 1 ? 'border-b border-worley-border' : ''
                    }`}
                    style={{ borderLeft: `4px solid ${colorMap?.accent || '#718096'}` }}
                  >
                    <p className="mb-1 text-sm font-medium text-worley-orange">
                      {dimension.label}
                    </p>
                    <p className="text-sm leading-relaxed text-worley-text-primary">
                      {pathway[dimension.key] || (
                        <span className="italic text-worley-text-muted">Data unavailable</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      </div>{/* End collapsible container */}
    </section>
  );
}
