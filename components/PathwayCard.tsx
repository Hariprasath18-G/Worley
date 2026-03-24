'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { PathwayScenario, SeverityLevel } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import AIBadge from './AIBadge';

interface PathwayCardProps {
  pathway: PathwayScenario;
  accentColor: string;
}

const METRICS_KEYS: { key: keyof PathwayScenario; label: string }[] = [
  { key: 'capexRange', label: 'Est. CAPEX' },
  { key: 'emissionsReduction', label: 'Emissions reduction' },
  { key: 'timeline', label: 'Timeline' },
];

/** Parse numeric percentage midpoint from "70–85%" → 77.5 */
function parseEmissionsPercent(text: string): number {
  const nums = text.match(/[\d.]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/** Parse severity prefix from stranded capital risk text */
function parseStrandedCapitalSeverity(text: string): SeverityLevel {
  const lower = text.toLowerCase();
  if (lower.startsWith('high')) return 'High';
  if (lower.startsWith('medium')) return 'Medium';
  return 'Low';
}

/** SVG circular progress ring */
function EmissionsRing({ percentage, color }: { percentage: number; color: string }) {
  const radius = 16;
  const stroke = 3;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="shrink-0" aria-hidden="true">
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

/**
 * Individual pathway card with metrics, severity badges, emissions ring, and expand/collapse detail.
 */
export default function PathwayCard({ pathway, accentColor }: PathwayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = `detail-${pathway.pathwayName.replace(/\s+/g, '-').toLowerCase()}`;
  const emissionsPercent = parseEmissionsPercent(pathway.emissionsReduction);

  return (
    <article
      className="group overflow-hidden rounded-xl border border-worley-border bg-white shadow-card transition-all duration-200 hover:border-worley-orange/30 hover:shadow-card-hover"
    >
      {/* Accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />

      {/* Card body */}
      <div className="p-5">
        {/* Header: title + AI badge */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-worley-text-primary">{pathway.pathwayName}</h3>
          <AIBadge />
        </div>
        <p className="mb-4 text-sm text-worley-text-secondary">{pathway.subtitle}</p>

        {/* Key metrics */}
        <div className="flex flex-col gap-3">
          {METRICS_KEYS.map((metric, idx) => (
            <div
              key={metric.key}
              className={`flex items-center justify-between py-1 ${
                idx < METRICS_KEYS.length - 1 ? 'border-b border-worley-border' : ''
              }`}
            >
              <span className="text-sm text-worley-text-muted">{metric.label}</span>
              {metric.key === 'emissionsReduction' ? (
                <span className="flex items-center gap-2 text-sm font-medium text-worley-text-primary">
                  <EmissionsRing percentage={emissionsPercent} color={accentColor} />
                  {pathway[metric.key] as string}
                </span>
              ) : (
                <span className="text-sm font-medium text-worley-text-primary">
                  {pathway[metric.key] as string}
                </span>
              )}
            </div>
          ))}

          {/* Regulatory complexity */}
          <div className="flex items-center justify-between border-b border-worley-border py-1">
            <span className="text-sm text-worley-text-muted">Regulatory complexity</span>
            <SeverityBadge level={pathway.regulatoryComplexity} />
          </div>

          {/* Stranded Capital Risk */}
          {pathway.strandedCapitalRisk && (
            <div className="flex items-center justify-between py-1" data-testid="stranded-capital-risk">
              <span className="text-sm text-worley-text-muted">Stranded capital risk</span>
              <SeverityBadge level={parseStrandedCapitalSeverity(pathway.strandedCapitalRisk)} />
            </div>
          )}
        </div>

        {/* Confidence indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-worley-text-muted">AI Confidence</span>
          <SeverityBadge level={pathway.confidence} />
        </div>

        {/* View details button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 border-t border-worley-border pt-3 text-sm font-medium text-worley-orange transition-colors duration-200 hover:text-worley-orange-hover"
          aria-expanded={isExpanded}
          aria-controls={detailId}
        >
          {isExpanded ? 'Hide details' : 'View details'}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded detail */}
        <div
          id={detailId}
          role="region"
          aria-label={`Detailed narrative for ${pathway.pathwayName}`}
          className={`overflow-hidden transition-all duration-400 ${
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="pt-3 text-sm leading-relaxed text-worley-text-secondary">
            {pathway.detailedNarrative}
          </p>
        </div>
      </div>
    </article>
  );
}
