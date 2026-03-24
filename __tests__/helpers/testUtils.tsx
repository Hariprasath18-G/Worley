import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { AppContext } from '@/lib/context';
import type { AppContextValue, AssetProfile, AnalysisResult, PathwayScenario, PrecedentStudy } from '@/lib/types';

// -- Mock Asset Profile --
export const mockAssetProfile: AssetProfile = {
  assetName: 'Test Refinery Alpha',
  assetType: 'Refinery',
  yearCommissioned: 1990,
  location: 'UK North Sea',
  currentCapacity: '50,000',
  capacityUnit: 'bpd',
  primaryProduct: 'Crude Processing',
  annualEmissions: '800,000',
  knownConstraints: 'Aging FCC unit. Near offshore wind corridor.',
  netZeroTarget: 2050,
  remainingDesignLife: 15,
};

// -- Mock Pathway Scenarios --
export const mockPathways: PathwayScenario[] = [
  {
    pathwayName: 'Optimize + CCS',
    subtitle: 'Continue operations with carbon capture',
    accentColor: 'teal',
    capexRange: '$180M-$280M',
    emissionsReduction: '70-85%',
    timeline: '24-36 months',
    regulatoryComplexity: 'Medium',
    confidence: 'Medium',
    engineeringSummary: 'Retrofit amine scrubbing systems into FCC exhaust.',
    financialSummary: 'CAPEX $180M-$280M with 8-12 year payback.',
    emissionsSummary: 'Reduce Scope 1 emissions by 70-85%.',
    regulatorySummary: 'UK NSTA Track-1 supportive framework.',
    risksSummary: 'CO2 transport infrastructure delays.',
    strandedCapitalRisk: 'Medium: FCC unit nearing end-of-life represents $40M\u2013$60M write-down exposure.',
    socialImpact: 'Minimal workforce disruption. Approximately 50\u201380 new CCS roles created.',
    detailedNarrative: 'The Optimize + CCS pathway allows continued crude processing with substantial emissions reductions through retrofitted carbon capture.',
  },
  {
    pathwayName: 'Repurpose to Green Hydrogen',
    subtitle: 'Convert facility for hydrogen production',
    accentColor: 'bright-orange',
    capexRange: '$350M-$550M',
    emissionsReduction: '90-95%',
    timeline: '36-54 months',
    regulatoryComplexity: 'High',
    confidence: 'Low',
    engineeringSummary: 'Install 100-200 MW electrolysers.',
    financialSummary: 'High CAPEX with uncertain hydrogen market.',
    emissionsSummary: 'Near-zero operational emissions.',
    regulatorySummary: 'UK Hydrogen Strategy targets 10 GW by 2030.',
    risksSummary: 'Market uncertainty and electrolyser obsolescence.',
    strandedCapitalRisk: 'High: Major demolition writes off $150M\u2013$220M in existing asset value.',
    socialImpact: 'Significant workforce transition \u2014 approximately 60% of roles become redundant.',
    detailedNarrative: 'Repurposing for green hydrogen represents the most transformative pathway.',
  },
  {
    pathwayName: 'Repurpose to Biofuels',
    subtitle: 'Convert facility for biofuel production',
    accentColor: 'orange',
    capexRange: '$200M-$350M',
    emissionsReduction: '50-70%',
    timeline: '24-42 months',
    regulatoryComplexity: 'Medium',
    confidence: 'Medium',
    engineeringSummary: 'Adapt hydrocracker for bio-feedstocks.',
    financialSummary: 'Moderate CAPEX with 6-9 year payback.',
    emissionsSummary: '50-70% lifecycle emissions reduction.',
    regulatorySummary: 'UK RTFO provides established framework.',
    risksSummary: 'Feedstock availability and price volatility.',
    strandedCapitalRisk: 'Medium: FCC unit mothballed ($30M\u2013$50M write-down).',
    socialImpact: 'Moderate workforce transition \u2014 approximately 70% of roles transfer.',
    detailedNarrative: 'The biofuels pathway offers a pragmatic middle ground.',
  },
  {
    pathwayName: 'Full Decommission',
    subtitle: 'Safe dismantling and site remediation',
    accentColor: 'mid-gray',
    capexRange: '$120M-$200M',
    emissionsReduction: '100%',
    timeline: '36-60 months',
    regulatoryComplexity: 'High',
    confidence: 'High',
    engineeringSummary: 'Systematic shutdown and site remediation.',
    financialSummary: 'CAPEX $120M-$200M net of scrap recovery.',
    emissionsSummary: '100% elimination of operational emissions.',
    regulatorySummary: 'COMAH Regulations and EA permitting required.',
    risksSummary: 'Unknown contamination cost overruns.',
    strandedCapitalRisk: 'High: Complete write-off of all process equipment ($250M\u2013$350M).',
    socialImpact: 'Severe workforce impact \u2014 all 450 positions eliminated.',
    detailedNarrative: 'Full decommissioning permanently eliminates the carbon footprint.',
  },
];

// -- Mock Precedent Studies --
export const mockPrecedentStudies: PrecedentStudy[] = [
  {
    reference: 'Rotterdam refinery conversion, 2022',
    findingSummary: 'A 70,000 bpd refinery completed bio-feedstock conversion in 28 months.',
    assumptions: 'Established supply chains in the ARA hub region.',
    relevance: 'Highly relevant as co-processing precedent.',
  },
  {
    reference: 'Teesside CCS retrofit study, 2023',
    findingSummary: 'FEED study concluded 80-90% capture feasible at $220M-$310M.',
    assumptions: 'Proximity to Northern Endurance Partnership infrastructure.',
    relevance: 'Directly relevant as UK refinery CCS precedent.',
  },
];

// -- Mock Analysis Result --
export const mockAnalysisResult: AnalysisResult = {
  pathways: mockPathways,
  recommendation: 'The Biofuels pathway appears most balanced for near-term decision-making, but requires detailed feasibility study.',
  precedentStudies: mockPrecedentStudies,
};

// -- Default mock AppContext value --
export function createMockContextValue(overrides?: Partial<AppContextValue>): AppContextValue {
  return {
    assetProfile: null,
    analysisResult: null,
    isAnalyzing: false,
    isHydrated: true,
    analysisError: null,
    setAssetProfile: jest.fn(),
    setAnalysisResult: jest.fn(),
    setIsAnalyzing: jest.fn(),
    setAnalysisError: jest.fn(),
    clearAll: jest.fn(),
    ...overrides,
  };
}

// -- Render with AppContext --
interface RenderWithContextOptions extends Omit<RenderOptions, 'wrapper'> {
  contextValue?: Partial<AppContextValue>;
}

export function renderWithContext(
  ui: React.ReactElement,
  options?: RenderWithContextOptions,
) {
  const { contextValue = {}, ...renderOptions } = options || {};
  const value = createMockContextValue(contextValue);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    contextValue: value,
  };
}
