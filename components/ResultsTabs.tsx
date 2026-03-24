'use client';

import { useState } from 'react';
import type { PathwayScenario } from '@/lib/types';
import SensitivityTab from './SensitivityTab';

interface ResultsTabsProps {
  pathways: PathwayScenario[];
  children: React.ReactNode;
}

const TABS = ['Scenario Results', 'What-If Analysis'] as const;

export default function ResultsTabs({ pathways, children }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Results view"
        className="mx-auto mt-6 flex max-w-screen-xl gap-0 border-b border-worley-border px-4 md:px-6 lg:px-8"
      >
        {TABS.map((label, idx) => (
          <button
            key={label}
            role="tab"
            id={`tab-${idx}`}
            aria-selected={activeTab === idx}
            aria-controls={`tabpanel-${idx}`}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'border-b-2 border-worley-teal-primary text-worley-teal-primary'
                : 'text-worley-text-muted hover:text-worley-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 0 ? children : <SensitivityTab pathways={pathways} />}
      </div>
    </div>
  );
}
