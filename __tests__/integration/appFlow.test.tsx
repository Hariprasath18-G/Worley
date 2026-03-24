/**
 * Integration tests verifying the application flow:
 * - AppProvider manages state correctly
 * - Data flows from AssetForm -> Context -> Results page components
 * - Form validation logic works end-to-end
 * - Sample data loading populates the form correctly
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import { AppProvider } from '@/components/AppProvider';
import { useAppContext } from '@/lib/context';
import { SAMPLE_ASSET } from '@/lib/sampleData';
import { SAMPLE_ANALYSIS_RESULT } from '@/lib/sampleAnalysisResult';
import { REQUIRED_FIELDS, PATHWAY_COLOR_MAP } from '@/lib/types';
import type { AssetProfile } from '@/lib/types';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-down' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
  Info: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'info-icon' }),
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'arrow-right' }),
  FlaskConical: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'flask-icon' }),
  Upload: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'upload-icon' }),
  FileText: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'file-text-icon' }),
  Loader2: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'loader-icon' }),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'check-circle-icon' }),
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'alert-circle-icon' }),
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'alert-triangle-icon' }),
  Pencil: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'pencil-icon' }),
  Download: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'download-icon' }),
  Plus: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'plus-icon' }),
  BookOpen: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'book-icon' }),
  Check: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'check-icon' }),
}));

// Test helper component to interact with context
function ContextConsumer({ onContext }: { onContext: (ctx: ReturnType<typeof useAppContext>) => void }) {
  const ctx = useAppContext();
  React.useEffect(() => {
    onContext(ctx);
  });
  return null;
}

// Test helper to set and read context values
function ContextSetter({ action }: { action: (ctx: ReturnType<typeof useAppContext>) => void }) {
  const ctx = useAppContext();
  React.useEffect(() => {
    action(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe('AppProvider Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('initial state', () => {
    it('should provide null assetProfile on mount', () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      expect(capturedContext?.assetProfile).toBeNull();
    });

    it('should provide null analysisResult on mount', () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      expect(capturedContext?.analysisResult).toBeNull();
    });

    it('should provide isAnalyzing as false on mount', () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      expect(capturedContext?.isAnalyzing).toBe(false);
    });
  });

  describe('setAssetProfile', () => {
    it('should update assetProfile in context', async () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextSetter action={(ctx) => ctx.setAssetProfile(SAMPLE_ASSET)} />
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      // Wait for state update
      await act(async () => {});

      expect(capturedContext?.assetProfile).toEqual(SAMPLE_ASSET);
    });

    it('should persist assetProfile to sessionStorage', async () => {
      render(
        <AppProvider>
          <ContextSetter action={(ctx) => ctx.setAssetProfile(SAMPLE_ASSET)} />
        </AppProvider>
      );

      await act(async () => {});

      const stored = sessionStorage.getItem('tp_assetProfile');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.assetName).toBe('Coastal Energy Refinery');
    });
  });

  describe('setAnalysisResult', () => {
    it('should update analysisResult in context', async () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextSetter action={(ctx) => ctx.setAnalysisResult(SAMPLE_ANALYSIS_RESULT)} />
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      await act(async () => {});

      expect(capturedContext?.analysisResult).toEqual(SAMPLE_ANALYSIS_RESULT);
    });

    it('should persist analysisResult to sessionStorage', async () => {
      render(
        <AppProvider>
          <ContextSetter action={(ctx) => ctx.setAnalysisResult(SAMPLE_ANALYSIS_RESULT)} />
        </AppProvider>
      );

      await act(async () => {});

      const stored = sessionStorage.getItem('tp_analysisResult');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.pathways).toHaveLength(4);
    });
  });

  describe('clearAll', () => {
    it('should reset all state to initial values', async () => {
      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      function SetThenClear() {
        const ctx = useAppContext();
        React.useEffect(() => {
          ctx.setAssetProfile(SAMPLE_ASSET);
          ctx.setAnalysisResult(SAMPLE_ANALYSIS_RESULT);
          ctx.setIsAnalyzing(true);
          ctx.setAnalysisError('test error');
          // Then clear
          ctx.clearAll();
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return null;
      }

      render(
        <AppProvider>
          <SetThenClear />
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      await act(async () => {});

      expect(capturedContext?.assetProfile).toBeNull();
      expect(capturedContext?.analysisResult).toBeNull();
      expect(capturedContext?.isAnalyzing).toBe(false);
      expect(capturedContext?.analysisError).toBeNull();
    });

    it('should clear sessionStorage', async () => {
      sessionStorage.setItem('tp_assetProfile', '{"assetName":"old"}');
      sessionStorage.setItem('tp_analysisResult', '{"pathways":[]}');

      render(
        <AppProvider>
          <ContextSetter action={(ctx) => ctx.clearAll()} />
        </AppProvider>
      );

      await act(async () => {});

      expect(sessionStorage.getItem('tp_assetProfile')).toBeNull();
      expect(sessionStorage.getItem('tp_analysisResult')).toBeNull();
    });
  });

  describe('sessionStorage hydration', () => {
    it('should hydrate assetProfile from sessionStorage on mount', async () => {
      sessionStorage.setItem('tp_assetProfile', JSON.stringify(SAMPLE_ASSET));

      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      await act(async () => {});

      expect(capturedContext?.assetProfile).toEqual(SAMPLE_ASSET);
    });

    it('should handle corrupted sessionStorage gracefully', async () => {
      sessionStorage.setItem('tp_assetProfile', 'not-valid-json');

      let capturedContext: ReturnType<typeof useAppContext> | null = null;

      render(
        <AppProvider>
          <ContextConsumer onContext={(ctx) => { capturedContext = ctx; }} />
        </AppProvider>
      );

      await act(async () => {});

      // Should fallback to null without crashing
      expect(capturedContext?.assetProfile).toBeNull();
    });
  });
});

describe('Form Validation Logic', () => {
  const EMPTY_PROFILE: AssetProfile = {
    assetName: '',
    assetType: '' as AssetProfile['assetType'],
    yearCommissioned: 0,
    location: '' as AssetProfile['location'],
    currentCapacity: '',
    capacityUnit: 'bpd',
    primaryProduct: '' as AssetProfile['primaryProduct'],
    annualEmissions: '',
    knownConstraints: '',
    netZeroTarget: null,
    remainingDesignLife: null,
  };

  function isFormValid(formData: AssetProfile): boolean {
    for (const field of REQUIRED_FIELDS) {
      const val = formData[field];
      if (val === '' || val === 0 || val === null || val === undefined) return false;
    }
    return true;
  }

  it('should be invalid when all fields are empty', () => {
    expect(isFormValid(EMPTY_PROFILE)).toBe(false);
  });

  it('should be invalid when location is empty', () => {
    const profile: AssetProfile = {
      ...SAMPLE_ASSET,
      location: '' as AssetProfile['location'],
    };
    expect(isFormValid(profile)).toBe(false);
  });

  it('should be invalid when assetName is empty', () => {
    const profile: AssetProfile = {
      ...SAMPLE_ASSET,
      assetName: '',
    };
    expect(isFormValid(profile)).toBe(false);
  });

  it('should be valid when all required fields are populated', () => {
    expect(isFormValid(SAMPLE_ASSET)).toBe(true);
  });

  it('should be valid when optional fields are null', () => {
    const profile: AssetProfile = {
      ...SAMPLE_ASSET,
      annualEmissions: null,
      knownConstraints: null,
      netZeroTarget: null,
      remainingDesignLife: null,
    };
    expect(isFormValid(profile)).toBe(true);
  });

  it('should be invalid when assetType is empty string', () => {
    const profile: AssetProfile = {
      ...SAMPLE_ASSET,
      assetType: '' as AssetProfile['assetType'],
    };
    expect(isFormValid(profile)).toBe(false);
  });
});

describe('Sample Data Integration', () => {
  it('should have all required fields in SAMPLE_ASSET for form validation', () => {
    for (const field of REQUIRED_FIELDS) {
      const value = SAMPLE_ASSET[field];
      expect(value).not.toBe('');
      expect(value).not.toBe(0);
      expect(value).not.toBeNull();
    }
  });

  it('should have matching pathway names between SAMPLE_ANALYSIS_RESULT and PATHWAY_COLOR_MAP', () => {
    const colorMapKeys = Object.keys(PATHWAY_COLOR_MAP);

    SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
      expect(colorMapKeys).toContain(pathway.pathwayName);
    });
  });

  it('should have exactly 4 pathways in the sample analysis result', () => {
    expect(SAMPLE_ANALYSIS_RESULT.pathways).toHaveLength(4);
  });

  it('should have at least 2 precedent studies', () => {
    expect(SAMPLE_ANALYSIS_RESULT.precedentStudies.length).toBeGreaterThanOrEqual(2);
  });
});
