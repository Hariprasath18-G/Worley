'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Plus, FileText, FileJson, ChevronDown } from 'lucide-react';

interface ActionBarProps {
  onStartNew: () => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
}

/**
 * Fixed bottom action bar with Export (PDF/JSON dropdown) and Start New buttons.
 */
export default function ActionBar({ onStartNew, onExportPDF, onExportJSON }: ActionBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleExportPDF = useCallback(() => {
    setIsDropdownOpen(false);
    onExportPDF();
  }, [onExportPDF]);

  const handleExportJSON = useCallback(() => {
    setIsDropdownOpen(false);
    onExportJSON();
  }, [onExportJSON]);

  return (
    <nav
      role="navigation"
      aria-label="Results actions"
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-worley-border bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex w-full max-w-screen-xl flex-col-reverse gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:px-8">
        {/* Export report (dropdown) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-worley-border bg-transparent px-6 py-2.5 text-base font-medium text-worley-text-secondary transition-all duration-200 hover:border-worley-text-secondary hover:text-worley-text-primary active:bg-worley-surface sm:w-auto"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <Download className="h-5 w-5" />
            Export report
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-worley-border bg-white shadow-lg sm:left-auto sm:right-0 sm:w-56">
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-worley-text-primary transition-colors hover:bg-worley-surface"
              >
                <FileText className="h-4 w-4 text-worley-orange" />
                <div>
                  <span className="font-medium">Print / Save as PDF</span>
                  <span className="block text-xs text-worley-text-muted">Opens printable report</span>
                </div>
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex w-full items-center gap-3 border-t border-worley-border px-4 py-3 text-left text-sm text-worley-text-primary transition-colors hover:bg-worley-surface"
              >
                <FileJson className="h-4 w-4 text-worley-teal" />
                <div>
                  <span className="font-medium">Download JSON</span>
                  <span className="block text-xs text-worley-text-muted">Structured data file</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Start new assessment (primary) */}
        <button
          type="button"
          onClick={onStartNew}
          className="flex items-center justify-center gap-2 rounded-lg bg-worley-orange px-6 py-2.5 text-base font-semibold text-white transition-all duration-200 hover:bg-worley-orange-hover active:scale-[0.98] active:bg-worley-orange-active focus:outline-none focus:ring-2 focus:ring-worley-orange focus:ring-offset-2 focus:ring-offset-white"
        >
          <Plus className="h-5 w-5" />
          Start new assessment
        </button>
      </div>
    </nav>
  );
}
