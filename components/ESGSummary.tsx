'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AIBadge from './AIBadge';
import { PATHWAY_COLOR_MAP } from '@/lib/types';
import type { PathwayScenario } from '@/lib/types';

interface ESGSummaryProps {
  pathways: PathwayScenario[];
}

/** Parse a midpoint % from strings like "70–85%" or "50-70%" */
function parseEmissionsPercent(s: string): number {
  const nums = s.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map(Number);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Derive a social score (0-100) from the socialImpact text */
function deriveSocialScore(text: string): number {
  const lower = text.toLowerCase();
  if (lower.includes('severe') || lower.includes('eliminated') || lower.includes('all ')) return 20;
  if (lower.includes('significant') || lower.includes('60%') || lower.includes('redundant')) return 40;
  if (lower.includes('moderate') || lower.includes('70%')) return 65;
  if (lower.includes('minimal') || lower.includes('new roles')) return 85;
  return 55;
}

/** Simple ring gauge SVG */
function ScoreRing({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="13"
        fontWeight="700"
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-right text-xs font-medium text-worley-text-secondary">{label}</span>
      <div className="h-2.5 flex-1 rounded-full bg-gray-100">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-xs font-semibold" style={{ color }}>{Math.round(score)}</span>
    </div>
  );
}

function esgGrade(score: number): { grade: string; label: string } {
  if (score >= 80) return { grade: 'A', label: 'Strong ESG alignment' };
  if (score >= 65) return { grade: 'B', label: 'Good ESG profile' };
  if (score >= 50) return { grade: 'C', label: 'Moderate ESG impact' };
  if (score >= 35) return { grade: 'D', label: 'Significant ESG concerns' };
  return { grade: 'E', label: 'High ESG risk' };
}

export default function ESGSummary({ pathways }: ESGSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const pathwayScores = pathways.map((pw) => {
    const envScore = parseEmissionsPercent(pw.emissionsReduction);
    const socialScore = deriveSocialScore(pw.socialImpact);
    const overall = envScore * 0.55 + socialScore * 0.45;
    const colorMap = PATHWAY_COLOR_MAP[pw.pathwayName];

    return {
      name: pw.pathwayName,
      envScore,
      socialScore,
      overall,
      color: colorMap?.accent || '#8B8D8F',
      emissionsText: pw.emissionsSummary,
      socialText: pw.socialImpact,
      grade: esgGrade(overall),
    };
  });

  // Sort by overall ESG score (highest first) for the summary
  const sorted = [...pathwayScores].sort((a, b) => b.overall - a.overall);
  const best = sorted[0];

  return (
    <section
      className="mt-8 rounded-xl border border-worley-border bg-white"
      role="region"
      aria-label="ESG Impact Assessment"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-worley-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S6.42 3.5 10 3.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill="#059669" />
              <path d="M10 5.5c-.83 0-1.5.67-1.5 1.5v3c0 .41.17.79.44 1.06l2 2a1.49 1.49 0 002.12-2.12L11.5 9.38V7c0-.83-.67-1.5-1.5-1.5z" fill="#059669" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-worley-text-primary">ESG Impact Assessment</h2>
            <p className="text-xs text-worley-text-muted">Environmental &amp; Social Governance scoring per pathway</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AIBadge />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-worley-text-secondary hover:bg-gray-50"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`overflow-hidden transition-all duration-400 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {/* Summary banner */}
        <div className="border-b border-worley-border bg-emerald-50/50 px-5 py-3">
          <p className="text-sm text-worley-text-secondary">
            <span className="font-semibold" style={{ color: best.color }}>{best.name}</span>
            {' '}scores highest overall ESG rating ({best.grade.grade} — {best.grade.label}) with {Math.round(best.envScore)}% emissions reduction and {best.grade.grade === 'A' || best.grade.grade === 'B' ? 'positive' : 'manageable'} social impact profile.
          </p>
        </div>

        {/* Pathway ESG cards */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {pathwayScores.map((pw) => (
            <div
              key={pw.name}
              className="rounded-lg border border-worley-border p-4"
              style={{ borderTopColor: pw.color, borderTopWidth: '3px' }}
            >
              {/* Pathway name + overall score ring */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-worley-text-primary">{pw.name}</h3>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: pw.color }}
                  >
                    Grade {pw.grade.grade}
                  </span>
                </div>
                <ScoreRing score={pw.overall} color={pw.color} />
              </div>

              {/* Score breakdown bars */}
              <div className="space-y-2">
                <ScoreBar label="Env" score={pw.envScore} color="#059669" />
                <ScoreBar label="Social" score={pw.socialScore} color="#0B7B8B" />
              </div>

              {/* Grade label */}
              <p className="mt-3 text-xs text-worley-text-muted">{pw.grade.label}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="border-t border-worley-border px-5 py-3">
          <p className="text-xs text-worley-text-muted">
            ESG scores are indicative benchmarks derived from AI-generated emissions and social impact analysis. Environmental score reflects estimated emissions reduction percentage. Social score is derived from workforce impact assessment. Scores require validation by ESG specialists.
          </p>
        </div>
      </div>
    </section>
  );
}
