import type { AssetProfile } from './types';

/**
 * Sample asset data for the "Coastal Energy Refinery" demo.
 * Pre-fills the form when user clicks "Try sample asset".
 */
export const SAMPLE_ASSET: AssetProfile = {
  assetName: 'Coastal Energy Refinery',
  assetType: 'Refinery',
  yearCommissioned: 1985,
  location: 'UK North Sea',
  currentCapacity: '65,000',
  capacityUnit: 'bpd',
  primaryProduct: 'Crude Processing',
  annualEmissions: '1,200,000',
  knownConstraints:
    'FCC unit approaching end of design life (2028). Hydrocracker last major turnaround 2021. Site is adjacent to proposed offshore wind corridor. Local authority has indicated interest in hydrogen hub designation. Current workforce of 450 full-time employees.',
  netZeroTarget: 2050,
  remainingDesignLife: 12,
};
