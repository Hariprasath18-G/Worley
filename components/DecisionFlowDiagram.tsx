'use client';

import { PATHWAY_COLOR_MAP } from '@/lib/types';

/**
 * Decision Flow Diagram — SVG visualization showing the
 * Ageing Asset → Optimize / Repurpose / Decommission decision paths
 * with a Stranded Capital Risk Window overlay.
 * Matches the challenge card's key visual.
 */
export default function DecisionFlowDiagram() {
  const ccsColor = PATHWAY_COLOR_MAP['Optimize + CCS']?.accent || '#025966';
  const h2Color = PATHWAY_COLOR_MAP['Repurpose to Green Hydrogen']?.accent || '#2DB3C7';
  const bioColor = PATHWAY_COLOR_MAP['Repurpose to Biofuels']?.accent || '#0B7B8B';
  const decommColor = PATHWAY_COLOR_MAP['Full Decommission']?.accent || '#8B8D8F';

  return (
    <section className="mt-8" role="img" aria-label="Decision flow diagram showing transition pathways from ageing asset to optimize, repurpose, or decommission options with stranded capital risk window">
      <h2 className="mb-4 text-lg font-semibold text-worley-text-primary">
        Transition Decision Framework
      </h2>
      <div className="overflow-x-auto rounded-xl border border-worley-border bg-white p-4 md:p-6">
        <svg
          viewBox="0 0 880 340"
          className="mx-auto w-full max-w-[880px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Stranded capital risk hatch pattern */}
            <pattern id="riskHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#E87722" strokeWidth="2" opacity="0.25" />
            </pattern>
            {/* Arrow marker */}
            <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#4B5563" />
            </marker>
            <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#E87722" />
            </marker>
          </defs>

          {/* AGEING ASSET box */}
          <rect x="20" y="135" width="160" height="70" rx="8" fill="#F8F9FA" stroke="#D1D5DB" strokeWidth="1.5" />
          <text x="100" y="164" textAnchor="middle" className="text-sm" fill="#374151" fontWeight="600" fontSize="14">Ageing</text>
          <text x="100" y="184" textAnchor="middle" className="text-sm" fill="#374151" fontWeight="600" fontSize="14">Asset</text>

          {/* Main arrow from asset → decision hub */}
          <line x1="180" y1="170" x2="270" y2="170" stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrowHead)" />

          {/* DECISION HUB diamond */}
          <polygon points="310,170 350,130 390,170 350,210" fill="#FFF7ED" stroke="#E87722" strokeWidth="2" />
          <text x="350" y="175" textAnchor="middle" fill="#E87722" fontWeight="600" fontSize="11">Decision</text>

          {/* === PATHWAY BRANCHES === */}

          {/* Branch 1: Optimize + CCS (top) */}
          <line x1="390" y1="155" x2="490" y2="65" stroke={ccsColor} strokeWidth="2" markerEnd="url(#arrowHead)" />
          <rect x="500" y="35" width="200" height="60" rx="8" fill={ccsColor} opacity="0.1" stroke={ccsColor} strokeWidth="1.5" />
          <text x="600" y="60" textAnchor="middle" fill={ccsColor} fontWeight="600" fontSize="13">Optimize + CCS</text>
          <text x="600" y="78" textAnchor="middle" fill="#6B7280" fontSize="11">Continue with carbon capture</text>

          {/* Branch 2: Repurpose (middle) — splits into H2 and Biofuels */}
          <line x1="390" y1="170" x2="490" y2="170" stroke="#0B7B8B" strokeWidth="2" markerEnd="url(#arrowHead)" />
          <rect x="500" y="125" width="200" height="90" rx="8" fill="#F0FDFA" stroke="#0B7B8B" strokeWidth="1.5" />
          <text x="600" y="150" textAnchor="middle" fill="#0B7B8B" fontWeight="600" fontSize="13">Repurpose</text>
          {/* Sub-paths */}
          <circle cx="538" cy="173" r="4" fill={h2Color} />
          <text x="548" y="177" fill={h2Color} fontSize="11" fontWeight="500">Green Hydrogen</text>
          <circle cx="538" cy="195" r="4" fill={bioColor} />
          <text x="548" y="199" fill={bioColor} fontSize="11" fontWeight="500">Biofuels</text>

          {/* Branch 3: Decommission (bottom) */}
          <line x1="390" y1="185" x2="490" y2="275" stroke={decommColor} strokeWidth="2" markerEnd="url(#arrowHead)" />
          <rect x="500" y="245" width="200" height="60" rx="8" fill="#F9FAFB" stroke={decommColor} strokeWidth="1.5" />
          <text x="600" y="270" textAnchor="middle" fill={decommColor} fontWeight="600" fontSize="13">Full Decommission</text>
          <text x="600" y="288" textAnchor="middle" fill="#6B7280" fontSize="11">Dismantling &amp; remediation</text>

          {/* === STRANDED CAPITAL RISK WINDOW === */}
          <rect x="720" y="30" width="140" height="280" rx="8" fill="url(#riskHatch)" stroke="#E87722" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="790" y="55" textAnchor="middle" fill="#E87722" fontWeight="700" fontSize="12">Stranded</text>
          <text x="790" y="72" textAnchor="middle" fill="#E87722" fontWeight="700" fontSize="12">Capital</text>
          <text x="790" y="89" textAnchor="middle" fill="#E87722" fontWeight="700" fontSize="12">Risk Window</text>

          {/* Risk arrows from each pathway to risk window */}
          <line x1="700" y1="65" x2="718" y2="65" stroke="#E87722" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowOrange)" />
          <line x1="700" y1="170" x2="718" y2="170" stroke="#E87722" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowOrange)" />
          <line x1="700" y1="275" x2="718" y2="275" stroke="#E87722" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowOrange)" />

          {/* Risk severity labels */}
          <text x="790" y="140" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="500">Medium</text>
          <text x="790" y="175" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="600">Medium–High</text>
          <text x="790" y="260" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="600">High</text>

          {/* Legend */}
          <rect x="20" y="300" width="8" height="8" rx="1" fill="url(#riskHatch)" stroke="#E87722" strokeWidth="0.5" />
          <text x="34" y="308" fill="#6B7280" fontSize="10">= Stranded capital exposure zone — delayed decisions increase write-down risk</text>
        </svg>
      </div>
    </section>
  );
}
