'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProcessingSteps from '@/components/ProcessingSteps';
import { useAppContext } from '@/lib/context';
import { SAMPLE_ANALYSIS_RESULT } from '@/lib/sampleAnalysisResult';

/**
 * Screen 2: Processing / Loading.
 * Shows animated three-step progress then loads results.
 */
export default function AnalyzePage() {
  const router = useRouter();
  const {
    assetProfile,
    isHydrated,
    setAnalysisResult,
    setIsAnalyzing,
  } = useAppContext();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const hasStarted = useRef(false);

  const runAnalysis = useCallback(async () => {
    if (!assetProfile) return;

    setIsAnalyzing(true);
    const analysisStartTime = performance.now();

    // Step 1: Reading asset profile
    setCurrentStep(1);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCompletedSteps([1]);

    // Step 2: Generating pathway scenarios
    setCurrentStep(2);
    const step2Duration = 25000 + Math.random() * 5000; // 25-30 seconds
    await new Promise((resolve) => setTimeout(resolve, step2Duration));
    setCompletedSteps([1, 2]);

    // Step 3: Finding relevant precedent
    setCurrentStep(3);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCompletedSteps([1, 2, 3]);

    // Store result, record timing, and navigate
    const durationMs = Math.round(performance.now() - analysisStartTime);
    try { sessionStorage.setItem('tp_analysisDuration', String(durationMs)); } catch { /* noop */ }
    setAnalysisResult(SAMPLE_ANALYSIS_RESULT);
    setIsAnalyzing(false);
    router.push('/results');
  }, [assetProfile, setAnalysisResult, setIsAnalyzing, router]);

  // Wait for hydration, then redirect if no asset profile or start analysis
  useEffect(() => {
    if (!isHydrated) return;
    if (!assetProfile) {
      router.replace('/');
      return;
    }
    if (!hasStarted.current) {
      hasStarted.current = true;
      runAnalysis();
    }
  }, [isHydrated, assetProfile, runAnalysis, router]);

  if (!isHydrated || !assetProfile) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex justify-center">
          <Image
            src="/worley-logo.png"
            alt="Worley"
            width={64}
            height={51}
            className="h-[51px] w-auto"
          />
        </div>
        <h2 className="mb-10 text-center text-[22px] font-semibold text-worley-text-primary">
          Analyzing your asset
        </h2>

        <ProcessingSteps
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Loading dots */}
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="status"
          aria-label="Analysis in progress"
        >
          <div className="dot-bounce-1 h-2 w-2 rounded-full bg-worley-orange" />
          <div className="dot-bounce-2 h-2 w-2 rounded-full bg-worley-orange" />
          <div className="dot-bounce-3 h-2 w-2 rounded-full bg-worley-orange" />
        </div>

        <p className="mt-4 text-center text-sm text-worley-text-muted">
          Generating scenarios...
        </p>
      </div>
    </div>
  );
}
