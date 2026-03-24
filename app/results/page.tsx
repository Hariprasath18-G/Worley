'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import AssetSummaryBar from '@/components/AssetSummaryBar';
import DecisionFlowDiagram from '@/components/DecisionFlowDiagram';
import PathwayCard from '@/components/PathwayCard';
import PathwayCharts from '@/components/PathwayCharts';
import ESGSummary from '@/components/ESGSummary';
import ComparisonMatrix from '@/components/ComparisonMatrix';
import RecommendationPanel from '@/components/RecommendationPanel';
import NextStepsPanel from '@/components/NextStepsPanel';
import PrecedentPanel from '@/components/PrecedentPanel';
import ActionBar from '@/components/ActionBar';
import ResultsTabs from '@/components/ResultsTabs';
import { useAppContext } from '@/lib/context';
import { PATHWAY_COLOR_MAP } from '@/lib/types';
import { exportAsJSON, exportAsPrintablePDF } from '@/lib/reportExporter';

/**
 * Screen 3: Scenario Comparison (THE MAIN SCREEN).
 * Displays all sections: Decision flow, pathway cards, charts, ESG, comparison,
 * recommendation, next steps, precedents, and action bar.
 */
export default function ResultsPage() {
  const router = useRouter();
  const { assetProfile, analysisResult, isHydrated, clearAll } = useAppContext();
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [analysisDuration, setAnalysisDuration] = useState<number | null>(null);

  // Redirect if no data (wait for hydration first)
  useEffect(() => {
    if (!isHydrated) return;
    if (!assetProfile || !analysisResult) {
      router.replace('/');
    }
  }, [isHydrated, assetProfile, analysisResult, router]);

  // Read analysis duration from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('tp_analysisDuration');
      if (stored) setAnalysisDuration(parseInt(stored, 10));
    } catch { /* noop */ }
  }, []);

  const handleEditAsset = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleStartNew = useCallback(() => {
    clearAll();
    router.push('/');
  }, [clearAll, router]);

  const generatedAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const handleExportPDF = useCallback(() => {
    if (!assetProfile || !analysisResult) return;
    exportAsPrintablePDF({ assetProfile, analysisResult, generatedAt });
    setExportToast('Report opened in new tab — use Print to save as PDF');
    setTimeout(() => setExportToast(null), 4000);
  }, [assetProfile, analysisResult, generatedAt]);

  const handleExportJSON = useCallback(() => {
    if (!assetProfile || !analysisResult) return;
    exportAsJSON({ assetProfile, analysisResult, generatedAt });
    setExportToast('JSON report downloaded');
    setTimeout(() => setExportToast(null), 3000);
  }, [assetProfile, analysisResult, generatedAt]);

  if (!isHydrated || !assetProfile || !analysisResult) return null;

  const pathwaysWithColors = analysisResult.pathways.map((pathway) => {
    const colorMap = PATHWAY_COLOR_MAP[pathway.pathwayName];
    return {
      pathway,
      accentColor: colorMap?.accent || '#8B8D8F',
    };
  });

  const durationSeconds = analysisDuration ? (analysisDuration / 1000).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-worley-surface pb-24">
      {/* Section A: Asset Summary Bar */}
      <AssetSummaryBar asset={assetProfile} onEditAsset={handleEditAsset} />

      <ResultsTabs pathways={analysisResult.pathways}>
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8">
          {/* Speed indicator */}
          {durationSeconds && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5" role="status">
              <Clock className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Analysis completed in {durationSeconds}s</span>
                <span className="mx-2 text-emerald-400">|</span>
                <span className="text-emerald-600">Traditional manual analysis takes 2-4 weeks for equivalent multi-pathway comparison</span>
              </p>
            </div>
          )}

          {/* Section A2: Decision Flow Diagram */}
          <DecisionFlowDiagram />

          {/* Section B: Pathway Overview Cards */}
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {pathwaysWithColors.map(({ pathway, accentColor }) => (
                <PathwayCard
                  key={pathway.pathwayName}
                  pathway={pathway}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </section>

          {/* Section B2: Visual Charts */}
          <PathwayCharts pathways={analysisResult.pathways} />

          {/* Section B3: ESG Impact Assessment */}
          <ESGSummary pathways={analysisResult.pathways} />

          {/* Section C: Comparison Matrix */}
          <ComparisonMatrix pathways={analysisResult.pathways} />

          {/* Section D: Recommendation Panel */}
          <RecommendationPanel recommendation={analysisResult.recommendation} />

          {/* Section D2: Recommended Next Steps */}
          <NextStepsPanel pathways={analysisResult.pathways} />

          {/* Section E: Precedent Studies Panel */}
          <PrecedentPanel precedentStudies={analysisResult.precedentStudies} />
        </div>
      </ResultsTabs>

      {/* Section F: Action Bar */}
      <ActionBar
        onStartNew={handleStartNew}
        onExportPDF={handleExportPDF}
        onExportJSON={handleExportJSON}
      />

      {/* Export toast */}
      {exportToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-worley-teal px-6 py-3 text-sm font-medium text-white shadow-lg"
        >
          {exportToast}
        </div>
      )}
    </div>
  );
}
