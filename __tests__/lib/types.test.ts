import {
  REQUIRED_FIELDS,
  ASSET_TYPES,
  LOCATION_OPTIONS,
  CAPACITY_UNITS,
  PRIMARY_PRODUCTS,
  PATHWAY_COLOR_MAP,
  DIMENSION_LABELS,
  type AssetProfile,
  type AnalysisResult,
  type AnalysisResponse,
} from '@/lib/types';

describe('Type Constants', () => {
  describe('REQUIRED_FIELDS', () => {
    it('should contain exactly 3 required fields', () => {
      expect(REQUIRED_FIELDS).toHaveLength(3);
    });

    it('should include assetName as a required field', () => {
      expect(REQUIRED_FIELDS).toContain('assetName');
    });

    it('should include assetType as a required field', () => {
      expect(REQUIRED_FIELDS).toContain('assetType');
    });

    it('should include location as a required field', () => {
      expect(REQUIRED_FIELDS).toContain('location');
    });

    it('should not include optional fields', () => {
      expect(REQUIRED_FIELDS).not.toContain('yearCommissioned');
      expect(REQUIRED_FIELDS).not.toContain('currentCapacity');
      expect(REQUIRED_FIELDS).not.toContain('primaryProduct');
      expect(REQUIRED_FIELDS).not.toContain('annualEmissions');
      expect(REQUIRED_FIELDS).not.toContain('knownConstraints');
      expect(REQUIRED_FIELDS).not.toContain('netZeroTarget');
      expect(REQUIRED_FIELDS).not.toContain('remainingDesignLife');
    });
  });

  describe('ASSET_TYPES', () => {
    it('should contain 5 asset types', () => {
      expect(ASSET_TYPES).toHaveLength(5);
    });

    it('should include all expected asset types', () => {
      expect(ASSET_TYPES).toContain('Refinery');
      expect(ASSET_TYPES).toContain('Offshore Platform');
      expect(ASSET_TYPES).toContain('Processing Plant');
      expect(ASSET_TYPES).toContain('Chemical Plant');
      expect(ASSET_TYPES).toContain('Power Station');
    });
  });

  describe('LOCATION_OPTIONS', () => {
    it('should contain 9 location options', () => {
      expect(LOCATION_OPTIONS).toHaveLength(9);
    });

    it('should include an Other option for unspecified locations', () => {
      expect(LOCATION_OPTIONS).toContain('Other');
    });

    it('should include UK North Sea', () => {
      expect(LOCATION_OPTIONS).toContain('UK North Sea');
    });
  });

  describe('CAPACITY_UNITS', () => {
    it('should contain 6 capacity units', () => {
      expect(CAPACITY_UNITS).toHaveLength(6);
    });

    it('should include common oil and gas units', () => {
      expect(CAPACITY_UNITS).toContain('bpd');
      expect(CAPACITY_UNITS).toContain('MTPA');
      expect(CAPACITY_UNITS).toContain('MW');
    });
  });

  describe('PRIMARY_PRODUCTS', () => {
    it('should contain 6 product categories', () => {
      expect(PRIMARY_PRODUCTS).toHaveLength(6);
    });

    it('should include Crude Processing', () => {
      expect(PRIMARY_PRODUCTS).toContain('Crude Processing');
    });
  });

  describe('PATHWAY_COLOR_MAP', () => {
    it('should have entries for all four pathways', () => {
      expect(Object.keys(PATHWAY_COLOR_MAP)).toHaveLength(4);
    });

    it('should map Optimize + CCS to teal color', () => {
      const entry = PATHWAY_COLOR_MAP['Optimize + CCS'];
      expect(entry).toBeDefined();
      expect(entry.accent).toBe('#025966');
      expect(entry.tailwindBg).toBe('bg-worley-teal');
      expect(entry.tailwindText).toBe('text-worley-teal');
    });

    it('should map Repurpose to Green Hydrogen to bright teal', () => {
      const entry = PATHWAY_COLOR_MAP['Repurpose to Green Hydrogen'];
      expect(entry).toBeDefined();
      expect(entry.accent).toBe('#2DB3C7');
    });

    it('should map Repurpose to Biofuels to medium teal', () => {
      const entry = PATHWAY_COLOR_MAP['Repurpose to Biofuels'];
      expect(entry).toBeDefined();
      expect(entry.accent).toBe('#0B7B8B');
    });

    it('should map Full Decommission to mid-gray', () => {
      const entry = PATHWAY_COLOR_MAP['Full Decommission'];
      expect(entry).toBeDefined();
      expect(entry.accent).toBe('#8B8D8F');
    });

    it('should have consistent structure for each entry', () => {
      Object.values(PATHWAY_COLOR_MAP).forEach((entry) => {
        expect(entry).toHaveProperty('accent');
        expect(entry).toHaveProperty('tailwindBg');
        expect(entry).toHaveProperty('tailwindText');
        expect(entry.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(entry.tailwindBg).toMatch(/^bg-worley-/);
        expect(entry.tailwindText).toMatch(/^text-worley-/);
      });
    });
  });

  describe('DIMENSION_LABELS', () => {
    it('should contain 7 analysis dimensions', () => {
      expect(DIMENSION_LABELS).toHaveLength(7);
    });

    it('should map keys to human-readable labels', () => {
      const keys = DIMENSION_LABELS.map((d) => d.key);
      expect(keys).toContain('engineeringSummary');
      expect(keys).toContain('financialSummary');
      expect(keys).toContain('emissionsSummary');
      expect(keys).toContain('regulatorySummary');
      expect(keys).toContain('risksSummary');
      expect(keys).toContain('strandedCapitalRisk');
      expect(keys).toContain('socialImpact');
    });

    it('should have non-empty labels for all dimensions', () => {
      DIMENSION_LABELS.forEach((d) => {
        expect(d.label).toBeTruthy();
        expect(typeof d.label).toBe('string');
      });
    });
  });
});

describe('Type Shape Verification', () => {
  it('should allow a valid AssetProfile object', () => {
    const profile: AssetProfile = {
      assetName: 'Test Refinery',
      assetType: 'Refinery',
      yearCommissioned: 1985,
      location: 'UK North Sea',
      currentCapacity: '65,000',
      capacityUnit: 'bpd',
      primaryProduct: 'Crude Processing',
      annualEmissions: '1,200,000',
      knownConstraints: 'None',
      netZeroTarget: 2050,
      remainingDesignLife: 12,
    };
    expect(profile.assetName).toBe('Test Refinery');
    expect(profile.annualEmissions).toBe('1,200,000');
  });

  it('should allow null for optional fields in AssetProfile', () => {
    const profile: AssetProfile = {
      assetName: 'Test',
      assetType: 'Refinery',
      yearCommissioned: 2000,
      location: 'Norway',
      currentCapacity: '50,000',
      capacityUnit: 'bpd',
      primaryProduct: 'Crude Processing',
      annualEmissions: null,
      knownConstraints: null,
      netZeroTarget: null,
      remainingDesignLife: null,
    };
    expect(profile.annualEmissions).toBeNull();
    expect(profile.netZeroTarget).toBeNull();
  });

  it('should validate AnalysisResult shape', () => {
    const result: AnalysisResult = {
      pathways: [],
      recommendation: 'Test recommendation',
      precedentStudies: [],
    };
    expect(result.pathways).toEqual([]);
    expect(result.recommendation).toBe('Test recommendation');
  });

  it('should validate successful AnalysisResponse', () => {
    const response: AnalysisResponse = {
      success: true,
      data: {
        pathways: [],
        recommendation: 'Test',
        precedentStudies: [],
      },
    };
    expect(response.success).toBe(true);
  });

  it('should validate error AnalysisResponse', () => {
    const response: AnalysisResponse = {
      success: false,
      error: 'Something went wrong',
      code: 'API_ERROR',
    };
    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.code).toBe('API_ERROR');
    }
  });
});
