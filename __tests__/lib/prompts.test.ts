import {
  ASSET_PROFILE_INTERPRETER_PROMPT,
  PATHWAY_NARRATIVE_GENERATOR_PROMPT,
} from '@/lib/prompts';

describe('Prompt Templates', () => {
  describe('ASSET_PROFILE_INTERPRETER_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof ASSET_PROFILE_INTERPRETER_PROMPT).toBe('string');
      expect(ASSET_PROFILE_INTERPRETER_PROMPT.length).toBeGreaterThan(100);
    });

    it('should instruct extraction of asset fields as JSON', () => {
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toContain('assetName');
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toContain('assetType');
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toContain('yearCommissioned');
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toContain('location');
    });

    it('should specify returning only JSON', () => {
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toMatch(/return.*only.*json/i);
    });

    it('should instruct not to guess or infer missing values', () => {
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toMatch(/never.*guess/i);
    });

    it('should specify null for fields that cannot be determined', () => {
      expect(ASSET_PROFILE_INTERPRETER_PROMPT).toContain('null');
    });
  });

  describe('PATHWAY_NARRATIVE_GENERATOR_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof PATHWAY_NARRATIVE_GENERATOR_PROMPT).toBe('string');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT.length).toBeGreaterThan(500);
    });

    it('should reference all four pathway names', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Optimize + CCS');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Repurpose to Green Hydrogen');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Repurpose to Biofuels');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Full Decommission');
    });

    it('should reference all five analysis dimensions', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Engineering feasibility');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Financial outlook');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Emissions trajectory');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Regulatory considerations');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Key risks');
    });

    it('should require CAPEX figures as ranges not point estimates', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toMatch(/range/i);
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toMatch(/never.*point.*estimate/i);
    });

    it('should require the recommendation includes caveats', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toMatch(/caveat/i);
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toMatch(/engineer.*validation/i);
    });

    it('should specify JSON response format with pathways array', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('"pathways"');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('"recommendation"');
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('"precedentStudies"');
    });

    it('should label figures as indicative benchmarks', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toMatch(/indicative.*benchmark/i);
    });

    it('should reference the Worley company context', () => {
      expect(PATHWAY_NARRATIVE_GENERATOR_PROMPT).toContain('Worley');
    });
  });
});
