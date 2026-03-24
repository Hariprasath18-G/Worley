import { SAMPLE_ANALYSIS_RESULT } from '@/lib/sampleAnalysisResult';
import { PATHWAY_COLOR_MAP, DIMENSION_LABELS } from '@/lib/types';
import type { AnalysisResult } from '@/lib/types';

describe('SAMPLE_ANALYSIS_RESULT', () => {
  it('should conform to the AnalysisResult interface', () => {
    const result: AnalysisResult = SAMPLE_ANALYSIS_RESULT;
    expect(result).toHaveProperty('pathways');
    expect(result).toHaveProperty('recommendation');
    expect(result).toHaveProperty('precedentStudies');
  });

  describe('pathways', () => {
    it('should contain exactly 4 pathway scenarios', () => {
      expect(SAMPLE_ANALYSIS_RESULT.pathways).toHaveLength(4);
    });

    it('should include all four expected pathway names', () => {
      const names = SAMPLE_ANALYSIS_RESULT.pathways.map((p) => p.pathwayName);
      expect(names).toContain('Optimize + CCS');
      expect(names).toContain('Repurpose to Green Hydrogen');
      expect(names).toContain('Repurpose to Biofuels');
      expect(names).toContain('Full Decommission');
    });

    it('should have pathway names matching the PATHWAY_COLOR_MAP keys', () => {
      const colorMapKeys = Object.keys(PATHWAY_COLOR_MAP);
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(colorMapKeys).toContain(pathway.pathwayName);
      });
    });

    it('should have valid accent colors for each pathway', () => {
      const validColors = ['teal', 'bright-orange', 'orange', 'mid-gray'];
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(validColors).toContain(pathway.accentColor);
      });
    });

    it('should have non-empty summaries for all five dimensions in each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        DIMENSION_LABELS.forEach((dim) => {
          const value = pathway[dim.key];
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect((value as string).length).toBeGreaterThan(50);
        });
      });
    });

    it('should have non-empty capexRange for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.capexRange).toBeTruthy();
        expect(pathway.capexRange).toMatch(/\$/);
      });
    });

    it('should have non-empty emissionsReduction for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.emissionsReduction).toBeTruthy();
        expect(pathway.emissionsReduction).toMatch(/%/);
      });
    });

    it('should have non-empty timeline for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.timeline).toBeTruthy();
        expect(pathway.timeline).toMatch(/months/);
      });
    });

    it('should have valid severity levels for regulatoryComplexity', () => {
      const validLevels = ['Low', 'Medium', 'High'];
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(validLevels).toContain(pathway.regulatoryComplexity);
      });
    });

    it('should have valid severity levels for confidence', () => {
      const validLevels = ['Low', 'Medium', 'High'];
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(validLevels).toContain(pathway.confidence);
      });
    });

    it('should have strandedCapitalRisk for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.strandedCapitalRisk).toBeTruthy();
        expect(typeof pathway.strandedCapitalRisk).toBe('string');
        expect(pathway.strandedCapitalRisk.length).toBeGreaterThan(10);
      });
    });

    it('should have socialImpact for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.socialImpact).toBeTruthy();
        expect(typeof pathway.socialImpact).toBe('string');
        expect(pathway.socialImpact.length).toBeGreaterThan(10);
      });
    });

    it('should have a non-empty detailedNarrative for each pathway', () => {
      SAMPLE_ANALYSIS_RESULT.pathways.forEach((pathway) => {
        expect(pathway.detailedNarrative).toBeTruthy();
        expect(pathway.detailedNarrative.length).toBeGreaterThan(100);
      });
    });
  });

  describe('recommendation', () => {
    it('should be a non-empty string', () => {
      expect(typeof SAMPLE_ANALYSIS_RESULT.recommendation).toBe('string');
      expect(SAMPLE_ANALYSIS_RESULT.recommendation.length).toBeGreaterThan(100);
    });

    it('should mention at least one pathway by name', () => {
      const text = SAMPLE_ANALYSIS_RESULT.recommendation;
      const mentionsAnyPathway = SAMPLE_ANALYSIS_RESULT.pathways.some(
        (p) => text.includes(p.pathwayName) || text.toLowerCase().includes('biofuel')
      );
      expect(mentionsAnyPathway).toBe(true);
    });
  });

  describe('precedentStudies', () => {
    it('should contain at least 2 precedent studies', () => {
      expect(SAMPLE_ANALYSIS_RESULT.precedentStudies.length).toBeGreaterThanOrEqual(2);
    });

    it('should have all required fields for each study', () => {
      SAMPLE_ANALYSIS_RESULT.precedentStudies.forEach((study) => {
        expect(study).toHaveProperty('reference');
        expect(study).toHaveProperty('findingSummary');
        expect(study).toHaveProperty('assumptions');
        expect(study).toHaveProperty('relevance');
      });
    });

    it('should have non-empty content for each study field', () => {
      SAMPLE_ANALYSIS_RESULT.precedentStudies.forEach((study) => {
        expect(study.reference.length).toBeGreaterThan(10);
        expect(study.findingSummary.length).toBeGreaterThan(50);
        expect(study.assumptions.length).toBeGreaterThan(20);
        expect(study.relevance.length).toBeGreaterThan(20);
      });
    });
  });
});
