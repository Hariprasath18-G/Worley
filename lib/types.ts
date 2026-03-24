// ============================================================
// Transition Pathfinder - TypeScript Type Definitions
// ============================================================

// --- Asset Profile Types ---

export type AssetType =
  | 'Refinery'
  | 'Offshore Platform'
  | 'Processing Plant'
  | 'Chemical Plant'
  | 'Power Station';

export type LocationOption =
  | 'UK North Sea'
  | 'Norway'
  | 'US Gulf of Mexico'
  | 'Australia'
  | 'Middle East'
  | 'Southeast Asia'
  | 'Canada'
  | 'Brazil'
  | 'Other';

export type CapacityUnit =
  | 'bpd'
  | 'MTPA'
  | 'MW'
  | 'kt/year'
  | 'MMscfd'
  | 'Other';

export type PrimaryProduct =
  | 'Crude Processing'
  | 'Natural Gas'
  | 'LNG'
  | 'Petrochemicals'
  | 'Power Generation'
  | 'Other';

/**
 * Represents the input data for an industrial asset.
 * Collected via manual form entry or AI extraction from uploaded documents.
 */
export interface AssetProfile {
  assetName: string;
  assetType: AssetType;
  yearCommissioned: number;
  location: LocationOption;
  currentCapacity: string;
  capacityUnit: CapacityUnit;
  primaryProduct: PrimaryProduct;
  annualEmissions: string | null;
  knownConstraints: string | null;
  netZeroTarget: number | null;
  remainingDesignLife: number | null;
}

// --- Pathway Scenario Types ---

export type SeverityLevel = 'Low' | 'Medium' | 'High';

export type PathwayAccentColor = 'teal' | 'bright-orange' | 'orange' | 'mid-gray';

/**
 * Represents one of the four transition pathway analyses
 * returned by the AI API.
 */
export interface PathwayScenario {
  pathwayName: string;
  subtitle: string;
  accentColor: PathwayAccentColor;
  capexRange: string;
  emissionsReduction: string;
  timeline: string;
  regulatoryComplexity: SeverityLevel;
  confidence: SeverityLevel;
  engineeringSummary: string;
  financialSummary: string;
  emissionsSummary: string;
  regulatorySummary: string;
  risksSummary: string;
  strandedCapitalRisk: string;
  socialImpact: string;
  detailedNarrative: string;
  nextSteps?: string[];
}

/**
 * Represents a precedent study reference (fictional but realistic)
 * showing a similar decision made by a comparable facility.
 */
export interface PrecedentStudy {
  reference: string;
  findingSummary: string;
  assumptions: string;
  relevance: string;
}

/**
 * The complete response from the AI API for scenario generation.
 * Contains all four pathways, a recommendation, and precedent studies.
 */
export interface AnalysisResult {
  pathways: PathwayScenario[];
  recommendation: string;
  precedentStudies: PrecedentStudy[];
}

// --- API Request / Response Types ---

/**
 * Request body sent from the client to the /api/analyze endpoint.
 * Discriminated union based on analysisType.
 */
export type AnalysisRequest =
  | {
      analysisType: 'extractProfile';
      assetProfile: { documentText: string };
    }
  | {
      analysisType: 'generateScenarios';
      assetProfile: AssetProfile;
    };

/**
 * Wrapper for the /api/analyze response.
 * Discriminated on success/error.
 */
export type AnalysisResponse =
  | {
      success: true;
      data: AnalysisResult | Partial<AssetProfile>;
    }
  | {
      success: false;
      error: string;
      code: 'MISSING_API_KEY' | 'API_ERROR' | 'PARSE_ERROR' | 'INVALID_REQUEST';
    };

// --- App State Types ---

/**
 * Global application state managed via React Context.
 */
export interface AppState {
  assetProfile: AssetProfile | null;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
}

export interface AppContextValue extends AppState {
  /** Whether sessionStorage hydration has completed */
  isHydrated: boolean;
  setAssetProfile: (profile: AssetProfile) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (value: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  clearAll: () => void;
}

// --- Form Validation ---

export interface FormValidation {
  isValid: boolean;
  missingFields: string[];
}

export const REQUIRED_FIELDS: (keyof AssetProfile)[] = [
  'assetName',
  'assetType',
  'location',
];

// --- Pathway Color Mapping ---

export const PATHWAY_COLOR_MAP: Record<string, { accent: string; tailwindBg: string; tailwindText: string }> = {
  'Optimize + CCS': {
    accent: '#025966',
    tailwindBg: 'bg-worley-teal',
    tailwindText: 'text-worley-teal',
  },
  'Repurpose to Green Hydrogen': {
    accent: '#2DB3C7',
    tailwindBg: 'bg-worley-bright-orange',
    tailwindText: 'text-worley-bright-orange',
  },
  'Repurpose to Biofuels': {
    accent: '#0B7B8B',
    tailwindBg: 'bg-worley-orange',
    tailwindText: 'text-worley-orange',
  },
  'Full Decommission': {
    accent: '#8B8D8F',
    tailwindBg: 'bg-worley-mid-gray',
    tailwindText: 'text-worley-mid-gray',
  },
};

// --- Constants ---

export const ASSET_TYPES: AssetType[] = [
  'Refinery',
  'Offshore Platform',
  'Processing Plant',
  'Chemical Plant',
  'Power Station',
];

export const LOCATION_OPTIONS: LocationOption[] = [
  'UK North Sea',
  'Norway',
  'US Gulf of Mexico',
  'Australia',
  'Middle East',
  'Southeast Asia',
  'Canada',
  'Brazil',
  'Other',
];

export const CAPACITY_UNITS: CapacityUnit[] = [
  'bpd',
  'MTPA',
  'MW',
  'kt/year',
  'MMscfd',
  'Other',
];

export const PRIMARY_PRODUCTS: PrimaryProduct[] = [
  'Crude Processing',
  'Natural Gas',
  'LNG',
  'Petrochemicals',
  'Power Generation',
  'Other',
];

export const DIMENSION_LABELS = [
  { key: 'engineeringSummary' as const, label: 'Engineering feasibility' },
  { key: 'financialSummary' as const, label: 'Financial outlook (CAPEX/OPEX)' },
  { key: 'emissionsSummary' as const, label: 'Emissions trajectory' },
  { key: 'regulatorySummary' as const, label: 'Regulatory considerations' },
  { key: 'risksSummary' as const, label: 'Key risks and uncertainties' },
  { key: 'strandedCapitalRisk' as const, label: 'Stranded capital risk' },
  { key: 'socialImpact' as const, label: 'Social impact' },
];

// --- Sensitivity / What-If Analysis Types ---

export interface SensitivityAssumptions {
  carbonPrice: number;
  capexBudgetFactor: number;
  emissionsTarget: number;
  remainingAssetLife: number;
  discountRate: number;
}

export interface PathwayAttractiveness {
  pathwayName: string;
  score: number;
  rank: number;
  delta: number;
  breakdown: Record<string, number>;
}

export interface SliderConfig {
  key: keyof SensitivityAssumptions;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
}

export const DEFAULT_SENSITIVITY_ASSUMPTIONS: SensitivityAssumptions = {
  carbonPrice: 75,
  capexBudgetFactor: 1.0,
  emissionsTarget: 70,
  remainingAssetLife: 15,
  discountRate: 8,
};

export const SENSITIVITY_SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'carbonPrice',
    label: 'Carbon Price',
    min: 10,
    max: 200,
    step: 5,
    defaultValue: 75,
    unit: '$/tonne CO\u2082',
    description: 'Shadow price of carbon used to value emissions reductions',
  },
  {
    key: 'capexBudgetFactor',
    label: 'CAPEX Budget Factor',
    min: 0.5,
    max: 2.0,
    step: 0.1,
    defaultValue: 1.0,
    unit: '\u00d7',
    description: 'Multiplier on available capital budget (1.0 = baseline)',
  },
  {
    key: 'emissionsTarget',
    label: 'Emissions Target',
    min: 30,
    max: 100,
    step: 5,
    defaultValue: 70,
    unit: '% reduction',
    description: 'Minimum emissions reduction target; pathways below are penalised',
  },
  {
    key: 'remainingAssetLife',
    label: 'Remaining Asset Life',
    min: 5,
    max: 30,
    step: 1,
    defaultValue: 15,
    unit: 'years',
    description: 'Expected remaining useful life of the asset',
  },
  {
    key: 'discountRate',
    label: 'Discount Rate',
    min: 3,
    max: 15,
    step: 1,
    defaultValue: 8,
    unit: '%',
    description: 'Higher rates penalise pathways with long payback periods',
  },
];

export const SCORE_WEIGHTS = {
  emissions: 0.30,
  cost: 0.25,
  confidence: 0.20,
  regulatory: 0.15,
  social: 0.10,
};
