import type { PathwayScenario, SensitivityAssumptions, PathwayAttractiveness } from './types';
import { DEFAULT_SENSITIVITY_ASSUMPTIONS, SCORE_WEIGHTS } from './types';

/** Extract a midpoint number from a CAPEX range string like "$180M-$280M" → 230 */
export function parseCapexMidpoint(capexRange: string): number {
  const numbers = capexRange.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return 0;
  const values = numbers.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/** Extract a percentage midpoint from "70-85%" → 77.5 */
export function parseEmissionsMidpoint(emissionsReduction: string): number {
  const numbers = emissionsReduction.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return 0;
  const values = numbers.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/** Map confidence/severity level to a 0-100 score */
function confidenceScore(level: string): number {
  if (level === 'High') return 90;
  if (level === 'Medium') return 60;
  return 30;
}

/** Map regulatory complexity to inverted simplicity score */
function regulatorySimplicity(level: string): number {
  if (level === 'Low') return 90;
  if (level === 'Medium') return 60;
  return 30;
}

/** Derive a social impact score from the socialImpact text (heuristic) */
function socialScore(socialImpact: string): number {
  const lower = socialImpact.toLowerCase();
  if (lower.includes('minimal') || lower.includes('low')) return 85;
  if (lower.includes('moderate') || lower.includes('70%')) return 60;
  if (lower.includes('significant') || lower.includes('60%')) return 40;
  if (lower.includes('severe') || lower.includes('all') || lower.includes('eliminated')) return 20;
  return 50;
}

/** Parse timeline midpoint in months from "24-36 months" → 30 */
function parseTimelineMidpoint(timeline: string): number {
  const numbers = timeline.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return 36;
  const values = numbers.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/**
 * Compute attractiveness scores for all pathways given a set of assumptions.
 * Pure function — no side effects.
 */
export function computePathwayScores(
  pathways: PathwayScenario[],
  assumptions: SensitivityAssumptions,
): PathwayAttractiveness[] {
  if (!pathways || pathways.length === 0) return [];

  const maxCapex = Math.max(...pathways.map((p) => parseCapexMidpoint(p.capexRange)), 1);

  const scored = pathways.map((p) => {
    const emissionsPct = parseEmissionsMidpoint(p.emissionsReduction);
    const capexMid = parseCapexMidpoint(p.capexRange);
    const timelineMonths = parseTimelineMidpoint(p.timeline);

    // --- Emissions dimension ---
    // Base: raw emissions reduction percentage
    // Carbon price boost: higher carbon price makes high-reduction pathways more attractive
    const carbonPriceBoost = ((assumptions.carbonPrice - 75) / 125) * (emissionsPct / 100) * 15;
    // Penalty if pathway falls below emissions target
    const targetPenalty = emissionsPct < assumptions.emissionsTarget
      ? (assumptions.emissionsTarget - emissionsPct) * 0.5
      : 0;
    const emissionsScore = Math.max(0, Math.min(100, emissionsPct + carbonPriceBoost - targetPenalty));

    // --- Cost dimension ---
    // Base: cost efficiency relative to most expensive pathway
    const baseCostScore = ((maxCapex - capexMid) / maxCapex) * 100;
    // Budget factor: lower budget penalises expensive pathways more
    const budgetPenalty = assumptions.capexBudgetFactor < 1.0
      ? (1.0 - assumptions.capexBudgetFactor) * (capexMid / maxCapex) * 40
      : 0;
    const budgetBonus = assumptions.capexBudgetFactor > 1.0
      ? (assumptions.capexBudgetFactor - 1.0) * 10
      : 0;
    const costScore = Math.max(0, Math.min(100, baseCostScore - budgetPenalty + budgetBonus));

    // --- Confidence dimension ---
    const confScore = confidenceScore(p.confidence);

    // --- Regulatory dimension ---
    const regScore = regulatorySimplicity(p.regulatoryComplexity);

    // --- Social dimension ---
    const socScore = socialScore(p.socialImpact);

    // --- Asset life & discount rate adjustments ---
    // Longer timelines are penalised more when asset life is short
    const lifeRatio = assumptions.remainingAssetLife / (timelineMonths / 12);
    const lifePenalty = lifeRatio < 1.5 ? (1.5 - lifeRatio) * 10 : 0;
    // Higher discount rate penalises long-payback pathways
    const discountPenalty = ((assumptions.discountRate - 8) / 7) * (timelineMonths / 60) * 10;

    const breakdown: Record<string, number> = {
      emissions: Math.round(emissionsScore),
      cost: Math.round(costScore),
      confidence: confScore,
      regulatory: regScore,
      social: socScore,
    };

    const rawScore =
      emissionsScore * SCORE_WEIGHTS.emissions +
      costScore * SCORE_WEIGHTS.cost +
      confScore * SCORE_WEIGHTS.confidence +
      regScore * SCORE_WEIGHTS.regulatory +
      socScore * SCORE_WEIGHTS.social -
      lifePenalty -
      discountPenalty;

    const score = Math.max(0, Math.min(100, Math.round(rawScore)));

    return { pathwayName: p.pathwayName, score, rank: 0, delta: 0, breakdown };
  });

  return rankPathways(scored);
}

/** Compute baseline scores using default assumptions */
export function computeBaselineScores(pathways: PathwayScenario[]): PathwayAttractiveness[] {
  return computePathwayScores(pathways, DEFAULT_SENSITIVITY_ASSUMPTIONS);
}

/** Sort by score descending, assign ranks, compute delta vs baseline */
export function rankPathways(
  scores: PathwayAttractiveness[],
  baseline?: PathwayAttractiveness[],
): PathwayAttractiveness[] {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  return sorted.map((s, i) => {
    const baselineEntry = baseline?.find((b) => b.pathwayName === s.pathwayName);
    return {
      ...s,
      rank: i + 1,
      delta: baselineEntry ? s.score - baselineEntry.score : 0,
    };
  });
}
