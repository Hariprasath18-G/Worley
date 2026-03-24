'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AssetForm from '@/components/AssetForm';
import DocumentUpload from '@/components/DocumentUpload';
import { useAppContext } from '@/lib/context';
import type { AssetProfile } from '@/lib/types';
import { REQUIRED_FIELDS } from '@/lib/types';

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

/**
 * Screen 1: Asset Intake.
 * Form for manual input, PDF upload zone, and sample data button.
 */
export default function AssetIntakePage() {
  const router = useRouter();
  const { setAssetProfile } = useAppContext();
  const [formData, setFormData] = useState<AssetProfile>(EMPTY_PROFILE);
  const [isExtracting, setIsExtracting] = useState(false);


  const isFormValid = useCallback(() => {
    for (const field of REQUIRED_FIELDS) {
      const val = formData[field];
      if (val === '' || val === 0 || val === null || val === undefined) return false;
    }
    return true;
  }, [formData]);

  const handleExtractedData = useCallback(
    (data: Partial<AssetProfile>) => {
      setFormData((prev) => {
        const merged = { ...prev };
        for (const [key, val] of Object.entries(data)) {
          if (val !== null && val !== undefined && val !== '') {
            (merged as Record<string, unknown>)[key] = val;
          }
        }
        return merged;
      });
    },
    []
  );

  const handleGenerate = useCallback(() => {
    if (!isFormValid()) return;
    setAssetProfile(formData);
    router.push('/analyze');
  }, [formData, isFormValid, setAssetProfile, router]);

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8">
      {/* Header */}
      <header className="pb-6 pt-12">
        <div className="mb-4 flex items-center gap-3">
          <Image
            src="/worley-logo.png"
            alt="Worley"
            width={48}
            height={38}
            className="h-[38px] w-auto"
            priority
          />
          <h1 className="text-[28px] font-semibold leading-[1.3] tracking-[-0.02em] text-worley-text-primary">
            Worley Transition Pathfinder
          </h1>
        </div>
        <div className="mb-3 h-1 w-20 bg-worley-orange" aria-hidden="true" />
        <p className="text-base font-medium text-worley-text-secondary">
          Delivering Sustainable Change
        </p>
        <p className="mt-1 text-sm text-worley-text-muted">
          AI-Powered Scenario Explorer for Asset Transition Decisions
        </p>
      </header>

      {/* Main: Two-column on desktop */}
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
        {/* Right column on mobile/tablet appears first */}
        <div className="order-first lg:order-last">
          <div className="lg:sticky lg:top-8">
            <DocumentUpload
              onExtractedData={handleExtractedData}
              isExtracting={isExtracting}
              onExtractionStart={() => setIsExtracting(true)}
              onExtractionEnd={() => setIsExtracting(false)}
              onError={() => {}}
            />
          </div>
        </div>

        {/* Left column: Form */}
        <div className="order-last lg:order-first">
          <AssetForm
            value={formData}
            onChange={setFormData}
            disabled={isExtracting}
          />
        </div>
      </main>

      {/* Footer: Generate button */}
      <footer className="flex flex-col items-end pb-8 pt-6">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!isFormValid() || isExtracting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-worley-orange px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-worley-orange-hover active:scale-[0.98] active:bg-worley-orange-active focus:outline-none focus:ring-2 focus:ring-worley-orange focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-worley-orange md:w-auto md:min-w-[240px]"
        >
          Generate scenarios
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="mt-3 w-full text-center text-xs text-worley-text-muted md:text-right">
          AI-generated analysis requires consultant review before client delivery
        </p>
      </footer>
    </div>
  );
}
