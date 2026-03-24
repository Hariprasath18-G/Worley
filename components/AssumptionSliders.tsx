'use client';

import { RotateCcw, Info } from 'lucide-react';
import type { SensitivityAssumptions } from '@/lib/types';
import { SENSITIVITY_SLIDER_CONFIGS, DEFAULT_SENSITIVITY_ASSUMPTIONS } from '@/lib/types';

interface AssumptionSlidersProps {
  assumptions: SensitivityAssumptions;
  onChange: (assumptions: SensitivityAssumptions) => void;
}

export default function AssumptionSliders({ assumptions, onChange }: AssumptionSlidersProps) {
  const handleSliderChange = (key: keyof SensitivityAssumptions, value: number) => {
    onChange({ ...assumptions, [key]: value });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_SENSITIVITY_ASSUMPTIONS });
  };

  const isDefault = SENSITIVITY_SLIDER_CONFIGS.every(
    (c) => assumptions[c.key] === c.defaultValue,
  );

  return (
    <div className="rounded-xl border border-worley-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-worley-text-primary">Assumptions</h3>
        <button
          onClick={handleReset}
          disabled={isDefault}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-worley-teal-primary transition-colors hover:bg-worley-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-5">
        {SENSITIVITY_SLIDER_CONFIGS.map((config) => {
          const value = assumptions[config.key];
          const displayValue =
            config.key === 'capexBudgetFactor'
              ? `${value.toFixed(1)}${config.unit}`
              : `${value}${config.unit.startsWith('%') || config.unit.startsWith('\u00d7') ? '' : ' '}${config.unit}`;

          return (
            <div key={config.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor={`slider-${config.key}`}
                    className="text-sm font-medium text-worley-text-secondary"
                  >
                    {config.label}
                  </label>
                  <span title={config.description} className="cursor-help">
                    <Info className="h-3.5 w-3.5 text-worley-text-muted" />
                  </span>
                </div>
                <span className="text-sm font-semibold text-worley-teal-primary">
                  {displayValue}
                </span>
              </div>
              <input
                id={`slider-${config.key}`}
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={value}
                onChange={(e) => handleSliderChange(config.key, parseFloat(e.target.value))}
                aria-label={config.label}
                aria-valuemin={config.min}
                aria-valuemax={config.max}
                aria-valuenow={value}
                className="w-full cursor-pointer accent-worley-teal-primary"
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-worley-text-muted">
                <span>{config.min}{config.unit.startsWith('$') ? '' : ''}</span>
                <span>{config.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
