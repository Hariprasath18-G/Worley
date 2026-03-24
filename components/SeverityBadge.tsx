'use client';

interface SeverityBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  label?: string;
}

const LEVEL_STYLES: Record<string, string> = {
  Low: 'bg-worley-teal',
  Medium: 'bg-worley-amber',
  High: 'bg-worley-red',
};

/**
 * Reusable severity/confidence pill badge.
 * Low = teal, Medium = amber, High = red.
 */
export default function SeverityBadge({ level, label }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${LEVEL_STYLES[level] || 'bg-worley-text-muted'}`}
    >
      {label ? `${label}: ${level}` : level}
    </span>
  );
}
