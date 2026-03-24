'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppContext } from '@/lib/context';
import type { AssetProfile, AnalysisResult, AppContextValue } from '@/lib/types';

// --- Validation helpers for sessionStorage hydration ---
function isValidAssetProfile(data: unknown): data is AssetProfile {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.assetName === 'string' && typeof d.assetType === 'string';
}

function isValidAnalysisResult(data: unknown): data is AnalysisResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.pathways) && typeof d.recommendation === 'string' && Array.isArray(d.precedentStudies);
}

const STORAGE_KEYS = {
  ASSET_PROFILE: 'tp_assetProfile',
  ANALYSIS_RESULT: 'tp_analysisResult',
} as const;

/**
 * React Context provider wrapping the app.
 * Manages AssetProfile and AnalysisResult with sessionStorage backup.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [assetProfile, setAssetProfileState] = useState<AssetProfile | null>(null);
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount (with validation)
  useEffect(() => {
    try {
      const storedProfile = sessionStorage.getItem(STORAGE_KEYS.ASSET_PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (isValidAssetProfile(parsed)) {
          setAssetProfileState(parsed);
        } else {
          sessionStorage.removeItem(STORAGE_KEYS.ASSET_PROFILE);
        }
      }
      const storedResult = sessionStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULT);
      if (storedResult) {
        const parsed = JSON.parse(storedResult);
        if (isValidAnalysisResult(parsed)) {
          setAnalysisResultState(parsed);
        } else {
          sessionStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULT);
        }
      }
    } catch {
      // Ignore parse errors from corrupted storage
    }
    setIsHydrated(true);
  }, []);

  const setAssetProfile = useCallback((profile: AssetProfile) => {
    setAssetProfileState(profile);
    try {
      sessionStorage.setItem(STORAGE_KEYS.ASSET_PROFILE, JSON.stringify(profile));
    } catch {
      // Storage full or unavailable
    }
  }, []);

  const setAnalysisResult = useCallback((result: AnalysisResult) => {
    setAnalysisResultState(result);
    try {
      sessionStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULT, JSON.stringify(result));
    } catch {
      // Storage full or unavailable
    }
  }, []);

  const clearAll = useCallback(() => {
    setAssetProfileState(null);
    setAnalysisResultState(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ASSET_PROFILE);
      sessionStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULT);
    } catch {
      // Storage unavailable
    }
  }, []);

  const value: AppContextValue = {
    assetProfile,
    analysisResult,
    isAnalyzing,
    isHydrated,
    analysisError,
    setAssetProfile,
    setAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
    clearAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
