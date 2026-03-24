'use client';

import { FlaskConical } from 'lucide-react';

interface SampleDataButtonProps {
  onLoadSample: () => void;
}

/**
 * "Try sample asset" button that pre-fills the form
 * with the Coastal Energy Refinery demo data.
 */
export default function SampleDataButton({ onLoadSample }: SampleDataButtonProps) {
  return (
    <button
      type="button"
      onClick={onLoadSample}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-worley-orange px-4 py-2.5 text-sm font-medium text-worley-orange transition-all duration-200 hover:bg-worley-teal-lightest hover:text-worley-orange-hover focus:outline-none focus:ring-2 focus:ring-worley-orange/30 focus:ring-offset-2 focus:ring-offset-white active:bg-worley-teal-lightest"
    >
      <FlaskConical className="h-5 w-5 transition-colors duration-200" />
      Try sample asset
    </button>
  );
}
