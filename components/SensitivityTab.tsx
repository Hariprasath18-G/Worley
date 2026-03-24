'use client';

import { useState, useMemo } from 'react';
import type { PathwayScenario, SensitivityAssumptions } from '@/lib/types';
import { DEFAULT_SENSITIVITY_ASSUMPTIONS } from '@/lib/types';
import { computePathwayScores, computeBaselineScores } from '@/lib/sensitivityScoring';
import AssumptionSliders from './AssumptionSliders';
import SensitivityCharts from './SensitivityCharts';
import AIBadge from './AIBadge';

interface SensitivityTabProps {
  pathways: PathwayScenario[];
}

export default function SensitivityTab({ pathways }: SensitivityTabProps) {
  const [assumptions, setAssumptions] = useState<SensitivityAssumptions>(
    () => ({ ...DEFAULT_SENSITIVITY_ASSUMPTIONS }),
  );

  const baselineScores = useMemo(
    () => computeBaselineScores(pathways),
    [pathways],
  );

  const scores = useMemo(
    () => {
      const raw = computePathwayScores(pathways, assumptions);
      // Recompute deltas against baseline
      return raw.map((s) => {
        const bl = baselineScores.find((b) => b.pathwayName === s.pathwayName);
        return { ...s, delta: bl ? s.score - bl.score : 0 };
      });
    },
    [pathways, assumptions, baselineScores],
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-[22px] font-semibold text-worley-text-primary">What-If Analysis</h2>
        <AIBadge />
      </div>
      <div className="mb-1 h-1 w-16 bg-worley-orange" aria-hidden="true" />
      <p className="mb-6 text-sm text-worley-text-secondary">
        Adjust assumptions to see how pathway attractiveness changes in real-time.
      </p>

      {/* Two-column layout: sliders left, charts right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AssumptionSliders assumptions={assumptions} onChange={setAssumptions} />
        </div>
        <div className="lg:col-span-2">
          <SensitivityCharts scores={scores} baselineScores={baselineScores} />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 rounded-lg border border-worley-border bg-worley-surface px-4 py-3 text-xs text-worley-text-muted">
        Disclaimer: Scores are derived from an indicative weighting model and the assumptions above.
        They are intended to support exploratory analysis only and do not constitute engineering or
        financial advice. Always validate with detailed feasibility studies.
      </p>
    </div>
  );
}
