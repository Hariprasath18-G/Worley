import { SAMPLE_ASSET } from '@/lib/sampleData';
import { REQUIRED_FIELDS, ASSET_TYPES, LOCATION_OPTIONS, CAPACITY_UNITS, PRIMARY_PRODUCTS } from '@/lib/types';

describe('SAMPLE_ASSET', () => {
  it('should be a valid AssetProfile object', () => {
    expect(SAMPLE_ASSET).toBeDefined();
    expect(typeof SAMPLE_ASSET).toBe('object');
  });

  it('should have all required fields populated with non-empty values', () => {
    for (const field of REQUIRED_FIELDS) {
      const value = SAMPLE_ASSET[field];
      expect(value).not.toBe('');
      expect(value).not.toBe(0);
      expect(value).not.toBeNull();
      expect(value).not.toBeUndefined();
    }
  });

  it('should have a valid asset type from the allowed options', () => {
    expect(ASSET_TYPES).toContain(SAMPLE_ASSET.assetType);
  });

  it('should have a valid location from the allowed options', () => {
    expect(LOCATION_OPTIONS).toContain(SAMPLE_ASSET.location);
  });

  it('should have a valid capacity unit from the allowed options', () => {
    expect(CAPACITY_UNITS).toContain(SAMPLE_ASSET.capacityUnit);
  });

  it('should have a valid primary product from the allowed options', () => {
    expect(PRIMARY_PRODUCTS).toContain(SAMPLE_ASSET.primaryProduct);
  });

  it('should have the expected sample asset name', () => {
    expect(SAMPLE_ASSET.assetName).toBe('Coastal Energy Refinery');
  });

  it('should have a reasonable year commissioned', () => {
    expect(SAMPLE_ASSET.yearCommissioned).toBeGreaterThanOrEqual(1950);
    expect(SAMPLE_ASSET.yearCommissioned).toBeLessThanOrEqual(2025);
  });

  it('should have annualEmissions as a non-null string', () => {
    expect(SAMPLE_ASSET.annualEmissions).not.toBeNull();
    expect(typeof SAMPLE_ASSET.annualEmissions).toBe('string');
  });

  it('should have knownConstraints as a non-null string', () => {
    expect(SAMPLE_ASSET.knownConstraints).not.toBeNull();
    expect(typeof SAMPLE_ASSET.knownConstraints).toBe('string');
    expect((SAMPLE_ASSET.knownConstraints as string).length).toBeGreaterThan(10);
  });

  it('should have netZeroTarget as a future year', () => {
    expect(SAMPLE_ASSET.netZeroTarget).not.toBeNull();
    expect(SAMPLE_ASSET.netZeroTarget).toBeGreaterThanOrEqual(2030);
  });

  it('should have remainingDesignLife as a positive number', () => {
    expect(SAMPLE_ASSET.remainingDesignLife).not.toBeNull();
    expect(SAMPLE_ASSET.remainingDesignLife).toBeGreaterThan(0);
  });
});
