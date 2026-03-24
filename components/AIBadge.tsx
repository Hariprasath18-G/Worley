'use client';

import { Sparkles } from 'lucide-react';

/**
 * Reusable "AI generated" teal pill badge.
 * Displayed on all AI-generated content sections.
 */
export default function AIBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-worley-teal px-2 py-0.5 text-xs font-medium text-white"
      aria-label="This content is AI generated"
    >
      <Sparkles className="h-3 w-3" />
      AI generated
    </span>
  );
}
