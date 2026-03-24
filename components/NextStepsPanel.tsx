'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AIBadge from './AIBadge';
import { PATHWAY_COLOR_MAP } from '@/lib/types';
import type { PathwayScenario } from '@/lib/types';

interface NextStepsPanelProps {
  pathways: PathwayScenario[];
}

/** Default next steps per pathway type — used as fallback if AI doesn't provide them */
const DEFAULT_NEXT_STEPS: Record<string, { steps: string[]; timeframe: string }> = {
  'Optimize + CCS': {
    timeframe: '0–6 months',
    steps: [
      'Commission pre-FEED study for CCS integration scope and plot plan assessment',
      'Engage CO2 transport and storage operators to confirm capacity and connection timelines',
      'Apply for Industrial Carbon Capture business model / UK ETS funding support',
      'Conduct FCC unit remaining-life assessment and CCS-ready overhaul feasibility before 2028 deadline',
      'Initiate Environmental Impact Assessment scoping for CO2 pipeline and injection infrastructure',
    ],
  },
  'Repurpose to Green Hydrogen': {
    timeframe: '0–6 months',
    steps: [
      'Commission pre-FEED for electrolyser sizing, placement, and water treatment requirements',
      'Engage National Grid ESO on grid connection capacity and upgrade timeline',
      'Develop hydrogen offtake strategy — engage potential industrial buyers and transport operators',
      'Initiate workforce transition planning and skills gap analysis for hydrogen operations',
      'Submit expression of interest for UK Hydrogen Production Business Model allocation',
    ],
  },
  'Repurpose to Biofuels': {
    timeframe: '0–6 months',
    steps: [
      'Secure preliminary feedstock supply agreements (UCO, tallow, waste fats) with quantity commitments',
      'Commission catalyst compatibility testing for bio-feedstock processing in existing hydrocracker',
      'Apply for RTFO registration and assess SAF mandate eligibility for production certificates',
      'Develop co-processing integration plan with phased conversion schedule',
      'Engage ISCC/RSB for feedstock sustainability certification pathway',
    ],
  },
  'Full Decommission': {
    timeframe: '0–6 months',
    steps: [
      'Commission Phase II environmental site investigation (soil, groundwater, asbestos survey)',
      'Develop comprehensive workforce transition package and social impact mitigation plan',
      'Engage Environment Agency on remediation strategy, endpoint criteria, and permit surrender',
      'Assess post-remediation site value and engage local authority on redevelopment planning status',
      'Initiate TUPE consultation and collective redundancy notification process',
    ],
  },
};

export default function NextStepsPanel({ pathways }: NextStepsPanelProps) {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(
    pathways[0]?.pathwayName || null
  );

  return (
    <section
      className="mt-8 rounded-xl border border-worley-border bg-white"
      role="region"
      aria-label="Recommended Next Steps"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-worley-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 3L3 10l7 7 7-7-7-7z" stroke="#E87722" strokeWidth="1.5" fill="none" />
              <path d="M10 7v4m0 2h.01" stroke="#E87722" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-worley-text-primary">Recommended Next Steps</h2>
            <p className="text-xs text-worley-text-muted">Immediate actions to advance each pathway — bridging strategy to execution</p>
          </div>
        </div>
        <AIBadge />
      </div>

      {/* Pathway accordions */}
      <div className="divide-y divide-worley-border">
        {pathways.map((pw, idx) => {
          const colorMap = PATHWAY_COLOR_MAP[pw.pathwayName];
          const color = colorMap?.accent || '#8B8D8F';
          const isOpen = expandedPathway === pw.pathwayName;
          const nextSteps = pw.nextSteps || DEFAULT_NEXT_STEPS[pw.pathwayName]?.steps || [];
          const timeframe = DEFAULT_NEXT_STEPS[pw.pathwayName]?.timeframe || '0–6 months';

          return (
            <div key={pw.pathwayName}>
              <button
                type="button"
                onClick={() => setExpandedPathway(isOpen ? null : pw.pathwayName)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
                aria-expanded={isOpen}
                aria-controls={`next-steps-${idx}`}
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="flex-1 text-sm font-semibold text-worley-text-primary">
                  {pw.pathwayName}
                </span>
                <span className="mr-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-worley-text-secondary">
                  {timeframe}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-worley-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                id={`next-steps-${idx}`}
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <ol className="mx-5 mb-5 space-y-3 border-l-2 pl-4" style={{ borderColor: color }}>
                  {nextSteps.map((step, stepIdx) => (
                    <li key={stepIdx} className="relative pl-3">
                      <div
                        className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white"
                        style={{ borderColor: color }}
                      />
                      <p className="text-sm leading-relaxed text-worley-text-primary">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-worley-border px-5 py-3">
        <p className="text-xs text-worley-text-muted">
          Next steps are indicative recommendations for further assessment. Execution requires detailed feasibility studies, stakeholder consultation, and engineering validation.
        </p>
      </div>
    </section>
  );
}
