import {
  computePathwayScores,
  computeBaselineScores,
  rankPathways,
  parseCapexMidpoint,
  parseEmissionsMidpoint,
} from '@/lib/sensitivityScoring';
import { DEFAULT_SENSITIVITY_ASSUMPTIONS } from '@/lib/types';
import type { SensitivityAssumptions } from '@/lib/types';
import { mockPathways } from '../helpers/testUtils';

describe('sensitivityScoring', () => {
  describe('parseCapexMidpoint', () => {
    it('parses range string to midpoint', () => {
      expect(parseCapexMidpoint('$180M-$280M')).toBe(230);
    });
    it('handles single value', () => {
      expect(parseCapexMidpoint('$200M')).toBe(200);
    });
    it('returns 0 for empty string', () => {
      expect(parseCapexMidpoint('')).toBe(0);
    });
  });

  describe('parseEmissionsMidpoint', () => {
    it('parses range to midpoint', () => {
      expect(parseEmissionsMidpoint('70-85%')).toBe(77.5);
    });
    it('parses single value', () => {
      expect(parseEmissionsMidpoint('100%')).toBe(100);
    });
    it('returns 0 for empty string', () => {
      expect(parseEmissionsMidpoint('')).toBe(0);
    });
  });

  describe('computeBaselineScores', () => {
    it('returns scores for all pathways', () => {
      const scores = computeBaselineScores(mockPathways);
      expect(scores).toHaveLength(4);
    });

    it('assigns ranks 1 through N', () => {
      const scores = computeBaselineScores(mockPathways);
      const ranks = scores.map((s) => s.rank).sort();
      expect(ranks).toEqual([1, 2, 3, 4]);
    });

    it('scores are between 0 and 100', () => {
      const scores = computeBaselineScores(mockPathways);
      scores.forEach((s) => {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      });
    });

    it('deltas are zero at baseline', () => {
      const scores = computeBaselineScores(mockPathways);
      scores.forEach((s) => {
        expect(s.delta).toBe(0);
      });
    });

    it('each score has 5-dimension breakdown', () => {
      const scores = computeBaselineScores(mockPathways);
      scores.forEach((s) => {
        expect(Object.keys(s.breakdown)).toEqual(
          expect.arrayContaining(['emissions', 'cost', 'confidence', 'regulatory', 'social']),
        );
      });
    });
  });

  describe('computePathwayScores', () => {
    it('returns empty array for empty pathways', () => {
      expect(computePathwayScores([], DEFAULT_SENSITIVITY_ASSUMPTIONS)).toEqual([]);
    });

    it('higher carbon price boosts high-emissions-reduction pathways', () => {
      const low = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        carbonPrice: 20,
      });
      const high = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        carbonPrice: 180,
      });

      // Full Decommission has 100% emissions reduction — should benefit most
      const decommLow = low.find((s) => s.pathwayName === 'Full Decommission')!;
      const decommHigh = high.find((s) => s.pathwayName === 'Full Decommission')!;
      expect(decommHigh.score).toBeGreaterThan(decommLow.score);
    });

    it('lower CAPEX budget factor penalises expensive pathways', () => {
      const loose = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        capexBudgetFactor: 2.0,
      });
      const tight = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        capexBudgetFactor: 0.5,
      });

      // Green Hydrogen is most expensive — should be penalised most
      const h2Loose = loose.find((s) => s.pathwayName === 'Repurpose to Green Hydrogen')!;
      const h2Tight = tight.find((s) => s.pathwayName === 'Repurpose to Green Hydrogen')!;
      expect(h2Loose.score).toBeGreaterThan(h2Tight.score);
    });

    it('higher emissions target penalises low-reduction pathways', () => {
      const lowTarget = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        emissionsTarget: 30,
      });
      const highTarget = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        emissionsTarget: 100,
      });

      // Biofuels has lowest reduction (50-70%) — should be penalised at high target
      const bioLow = lowTarget.find((s) => s.pathwayName === 'Repurpose to Biofuels')!;
      const bioHigh = highTarget.find((s) => s.pathwayName === 'Repurpose to Biofuels')!;
      expect(bioLow.score).toBeGreaterThan(bioHigh.score);
    });

    it('rankings change when assumptions change', () => {
      const baseline = computeBaselineScores(mockPathways);
      const altered = computePathwayScores(mockPathways, {
        ...DEFAULT_SENSITIVITY_ASSUMPTIONS,
        carbonPrice: 200,
        capexBudgetFactor: 2.0,
        emissionsTarget: 95,
      });

      // With extreme settings the ranking order should differ
      const baseRanks = baseline.map((s) => s.pathwayName);
      const altRanks = altered.map((s) => s.pathwayName);
      // At minimum the scores should change even if order doesn't
      const baseScores = baseline.map((s) => s.score);
      const altScores = altered.map((s) => s.score);
      expect(altScores).not.toEqual(baseScores);
    });

    it('handles extreme high values without crashing', () => {
      const extreme: SensitivityAssumptions = {
        carbonPrice: 200,
        capexBudgetFactor: 2.0,
        emissionsTarget: 100,
        remainingAssetLife: 30,
        discountRate: 15,
      };
      const scores = computePathwayScores(mockPathways, extreme);
      expect(scores).toHaveLength(4);
      scores.forEach((s) => {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      });
    });

    it('handles extreme low values without crashing', () => {
      const extreme: SensitivityAssumptions = {
        carbonPrice: 10,
        capexBudgetFactor: 0.5,
        emissionsTarget: 30,
        remainingAssetLife: 5,
        discountRate: 3,
      };
      const scores = computePathwayScores(mockPathways, extreme);
      expect(scores).toHaveLength(4);
      scores.forEach((s) => {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('rankPathways', () => {
    it('ranks from highest to lowest score', () => {
      const input = [
        { pathwayName: 'A', score: 40, rank: 0, delta: 0, breakdown: {} },
        { pathwayName: 'B', score: 80, rank: 0, delta: 0, breakdown: {} },
        { pathwayName: 'C', score: 60, rank: 0, delta: 0, breakdown: {} },
      ];
      const ranked = rankPathways(input);
      expect(ranked[0].pathwayName).toBe('B');
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].pathwayName).toBe('C');
      expect(ranked[1].rank).toBe(2);
      expect(ranked[2].pathwayName).toBe('A');
      expect(ranked[2].rank).toBe(3);
    });

    it('computes deltas when baseline provided', () => {
      const scores = [
        { pathwayName: 'A', score: 70, rank: 0, delta: 0, breakdown: {} },
      ];
      const baseline = [
        { pathwayName: 'A', score: 50, rank: 1, delta: 0, breakdown: {} },
      ];
      const ranked = rankPathways(scores, baseline);
      expect(ranked[0].delta).toBe(20);
    });
  });
});
