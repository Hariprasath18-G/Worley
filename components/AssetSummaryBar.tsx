'use client';

import Image from 'next/image';
import { Pencil } from 'lucide-react';
import type { AssetProfile } from '@/lib/types';

interface AssetSummaryBarProps {
  asset: AssetProfile;
  onEditAsset: () => void;
}

/**
 * Horizontal bar showing asset details at the top of the results page.
 * Sticky positioning with teal brand background and white text.
 */
export default function AssetSummaryBar({ asset, onEditAsset }: AssetSummaryBarProps) {
  const fields = [
    { label: 'ASSET', value: asset.assetName },
    { label: 'TYPE', value: asset.assetType },
    { label: 'LOCATION', value: asset.location },
    { label: 'COMMISSIONED', value: String(asset.yearCommissioned) },
    { label: 'CAPACITY', value: `${asset.currentCapacity} ${asset.capacityUnit}` },
  ];

  return (
    <div className="sticky top-0 z-10">
      <div className="bg-worley-orange px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo + Asset details */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <Image
              src="/worley-logo.png"
              alt="Worley"
              width={36}
              height={29}
              className="h-[29px] w-auto brightness-0 invert"
            />
            {fields.map((field, idx) => (
              <div key={field.label} className="flex items-center gap-3 md:gap-6">
                <div>
                  <span className="block text-[10px] font-normal uppercase tracking-[0.05em] text-white/70 md:text-xs">
                    {field.label}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {field.value}
                  </span>
                </div>
                {idx < fields.length - 1 && (
                  <span
                    className="hidden h-6 border-l border-white/20 md:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Edit button */}
          <button
            type="button"
            onClick={onEditAsset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white hover:underline"
            aria-label="Edit asset profile"
          >
            <Pencil className="h-4 w-4" />
            Edit asset
          </button>
        </div>
      </div>
      {/* Accent bar below - slightly darker teal */}
      <div className="h-1 w-full bg-worley-orange-hover" aria-hidden="true" />
    </div>
  );
}
