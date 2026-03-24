'use client';

import { Check } from 'lucide-react';

interface ProcessingStepsProps {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
}

const STEPS = [
  { num: 1, label: 'Reading asset profile', description: 'Structuring your asset data' },
  { num: 2, label: 'Generating pathway scenarios', description: 'Analysing four transition pathways' },
  { num: 3, label: 'Finding relevant precedent', description: 'Searching for similar prior studies' },
];

/**
 * Three-step vertical progress indicator with animations.
 * Active step pulses teal, completed steps show teal checkmark.
 */
export default function ProcessingSteps({ currentStep, completedSteps }: ProcessingStepsProps) {
  return (
    <div className="w-full">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.num);
        const isActive = currentStep === step.num && !isCompleted;
        const isPending = !isCompleted && !isActive;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.num} className="relative flex items-start gap-4">
            {/* Vertical connector line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-10 h-[calc(100%-16px)] w-0.5 transition-colors duration-400 ${
                  isCompleted ? 'bg-worley-teal' : 'bg-worley-border'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Step circle */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold transition-all duration-400 ${
                isCompleted
                  ? 'bg-worley-teal text-white'
                  : isActive
                    ? 'animate-step-pulse bg-worley-orange text-white'
                    : 'border-2 border-worley-input-border bg-transparent text-worley-text-muted'
              }`}
              aria-label={`Step ${step.num}: ${step.label} - ${isCompleted ? 'complete' : isActive ? 'in progress' : 'pending'}`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step.num}
            </div>

            {/* Step text */}
            <div className="min-h-[72px] pb-4 pt-1.5">
              <p
                className={`text-base font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? 'text-worley-text-secondary'
                    : isActive
                      ? 'text-worley-text-primary'
                      : 'text-worley-text-muted'
                }`}
              >
                {step.label}
              </p>
              <p
                className={`mt-0.5 text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'text-worley-text-muted'
                    : isActive
                      ? 'text-worley-text-secondary'
                      : 'text-worley-text-muted opacity-50'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
