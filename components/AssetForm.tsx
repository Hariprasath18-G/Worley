'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type {
  AssetProfile,
  AssetType,
  LocationOption,
  CapacityUnit,
  PrimaryProduct,
} from '@/lib/types';
import {
  ASSET_TYPES,
  LOCATION_OPTIONS,
  CAPACITY_UNITS,
  PRIMARY_PRODUCTS,
} from '@/lib/types';

interface AssetFormProps {
  value: AssetProfile;
  onChange: (profile: AssetProfile) => void;
  disabled?: boolean;
}

const inputClasses =
  'w-full rounded-lg border border-worley-input-border bg-white px-3 py-2.5 text-base text-worley-text-primary placeholder:text-worley-text-muted transition-all duration-200 focus:border-worley-orange focus:outline-none focus:ring-2 focus:ring-worley-orange/30 disabled:cursor-not-allowed disabled:opacity-50 h-[44px]';

const selectWrapperClasses = 'relative';

const selectClasses =
  'w-full rounded-lg border border-worley-input-border bg-white px-3 py-2.5 pr-10 text-base text-worley-text-primary transition-all duration-200 focus:border-worley-orange focus:outline-none focus:ring-2 focus:ring-worley-orange/30 disabled:cursor-not-allowed disabled:opacity-50 h-[44px]';

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-worley-text-secondary">
      {children}
      {required && <span className="ml-1 text-worley-orange">*</span>}
    </label>
  );
}

function SelectChevron() {
  return (
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-worley-text-muted" />
  );
}

/**
 * Asset profile form with 3 required fields (name, type, location)
 * and a collapsible "Additional details" section for optional fields.
 */
export default function AssetForm({ value, onChange, disabled }: AssetFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (field: keyof AssetProfile, fieldValue: string | number | null) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const emissionsUnknown = value.annualEmissions === null;

  // Check if any optional fields have data (auto-expand if so)
  const hasOptionalData =
    (value.yearCommissioned && value.yearCommissioned > 0) ||
    value.currentCapacity ||
    (value.primaryProduct && value.primaryProduct !== ('' as PrimaryProduct)) ||
    value.annualEmissions ||
    value.knownConstraints ||
    value.netZeroTarget ||
    value.remainingDesignLife;

  const isAdvancedVisible = showAdvanced || !!hasOptionalData;

  return (
    <div>
      {/* Essential fields (always visible) */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {/* Asset name */}
        <div>
          <Label htmlFor="assetName" required>Asset name</Label>
          <input
            id="assetName"
            type="text"
            className={inputClasses}
            placeholder="e.g. Coastal Energy Refinery"
            value={value.assetName}
            onChange={(e) => update('assetName', e.target.value)}
            disabled={disabled}
            aria-required="true"
          />
        </div>

        {/* Asset type */}
        <div>
          <Label htmlFor="assetType" required>Asset type</Label>
          <div className={selectWrapperClasses}>
            <select
              id="assetType"
              className={selectClasses}
              value={value.assetType}
              onChange={(e) => update('assetType', e.target.value as AssetType)}
              disabled={disabled}
              aria-required="true"
            >
              <option value="">Select asset type</option>
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" required>Location / jurisdiction</Label>
          <div className={selectWrapperClasses}>
            <select
              id="location"
              className={selectClasses}
              value={value.location}
              onChange={(e) => update('location', e.target.value as LocationOption)}
              disabled={disabled}
              aria-required="true"
            >
              <option value="">Select location</option>
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {/* Known constraints (promoted — helps AI produce better analysis) */}
        <div>
          <Label htmlFor="knownConstraints">Known constraints or context</Label>
          <input
            id="knownConstraints"
            type="text"
            className={inputClasses}
            placeholder="e.g. Aging FCC unit, near wind corridor"
            value={value.knownConstraints || ''}
            onChange={(e) => update('knownConstraints', e.target.value || null)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Collapsible advanced section */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!isAdvancedVisible)}
          className="flex items-center gap-2 text-sm font-medium text-worley-text-secondary transition-colors hover:text-worley-orange"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${isAdvancedVisible ? 'rotate-180' : ''}`}
          />
          {isAdvancedVisible ? 'Hide additional details' : 'Add more details for better analysis'}
        </button>
        <p className="mt-1 text-xs text-worley-text-muted">
          More details help the AI produce more specific and accurate scenarios
        </p>

        <div
          className={`overflow-hidden transition-all duration-400 ${
            isAdvancedVisible ? 'mt-5 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* Year commissioned */}
            <div>
              <Label htmlFor="yearCommissioned">Year commissioned</Label>
              <input
                id="yearCommissioned"
                type="number"
                className={inputClasses}
                placeholder="e.g. 1985"
                min={1950}
                max={2025}
                value={value.yearCommissioned || ''}
                onChange={(e) => update('yearCommissioned', e.target.value ? parseInt(e.target.value, 10) : 0)}
                disabled={disabled}
              />
            </div>

            {/* Current capacity + unit */}
            <div>
              <Label htmlFor="currentCapacity">Current capacity</Label>
              <div className="flex gap-3">
                <input
                  id="currentCapacity"
                  type="text"
                  className={`${inputClasses} flex-1`}
                  placeholder="e.g. 65,000"
                  value={value.currentCapacity}
                  onChange={(e) => update('currentCapacity', e.target.value)}
                  disabled={disabled}
                />
                <div className={`${selectWrapperClasses} w-30`}>
                  <select
                    id="capacityUnit"
                    className={selectClasses}
                    value={value.capacityUnit}
                    onChange={(e) => update('capacityUnit', e.target.value as CapacityUnit)}
                    disabled={disabled}
                    aria-label="Capacity unit"
                  >
                    {CAPACITY_UNITS.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            {/* Primary product */}
            <div>
              <Label htmlFor="primaryProduct">Primary product</Label>
              <div className={selectWrapperClasses}>
                <select
                  id="primaryProduct"
                  className={selectClasses}
                  value={value.primaryProduct}
                  onChange={(e) => update('primaryProduct', e.target.value as PrimaryProduct)}
                  disabled={disabled}
                >
                  <option value="">Select primary product</option>
                  {PRIMARY_PRODUCTS.map((product) => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
                <SelectChevron />
              </div>
            </div>

            {/* Annual emissions + Unknown toggle */}
            <div>
              <Label htmlFor="annualEmissions">Annual emissions (tonnes CO2e)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="annualEmissions"
                  type="text"
                  className={`${inputClasses} flex-1`}
                  placeholder="e.g. 1,200,000"
                  value={emissionsUnknown ? '' : (value.annualEmissions || '')}
                  onChange={(e) => update('annualEmissions', e.target.value || null)}
                  disabled={disabled || emissionsUnknown}
                />
                <label className="flex items-center gap-2 whitespace-nowrap text-sm text-worley-text-secondary">
                  <input
                    type="checkbox"
                    checked={emissionsUnknown}
                    onChange={(e) => update('annualEmissions', e.target.checked ? null : '')}
                    disabled={disabled}
                    className="h-4.5 w-4.5 rounded border-worley-input-border bg-white accent-worley-orange"
                  />
                  Unknown
                </label>
              </div>
            </div>

            {/* Net zero target year */}
            <div>
              <Label htmlFor="netZeroTarget">Net zero target year</Label>
              <input
                id="netZeroTarget"
                type="number"
                className={inputClasses}
                placeholder="e.g. 2050"
                min={2030}
                max={2060}
                value={value.netZeroTarget || ''}
                onChange={(e) => update('netZeroTarget', e.target.value ? parseInt(e.target.value, 10) : null)}
                disabled={disabled}
              />
            </div>

            {/* Remaining design life */}
            <div>
              <Label htmlFor="remainingDesignLife">Remaining design life (years)</Label>
              <input
                id="remainingDesignLife"
                type="number"
                className={inputClasses}
                placeholder="e.g. 12"
                min={0}
                max={100}
                value={value.remainingDesignLife || ''}
                onChange={(e) => update('remainingDesignLife', e.target.value ? parseInt(e.target.value, 10) : null)}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Full known constraints textarea */}
          <div className="mt-5">
            <Label htmlFor="knownConstraintsDetail">Detailed constraints and context</Label>
            <textarea
              id="knownConstraintsDetail"
              className={`${inputClasses} h-auto min-h-[80px] resize-y`}
              placeholder="Detailed equipment issues, regulatory constraints, environmental considerations, workforce details..."
              value={value.knownConstraints || ''}
              onChange={(e) => update('knownConstraints', e.target.value || null)}
              disabled={disabled}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
