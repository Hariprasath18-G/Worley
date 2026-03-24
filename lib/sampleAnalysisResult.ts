import type { AnalysisResult } from './types';

/**
 * Hardcoded fallback analysis result for the Coastal Energy Refinery.
 * Used when AI API is unavailable or as a demo fallback.
 */
export const SAMPLE_ANALYSIS_RESULT: AnalysisResult = {
  pathways: [
    {
      pathwayName: 'Optimize + CCS',
      subtitle: 'Continue operations with carbon capture',
      accentColor: 'teal',
      capexRange: '$180M\u2013$280M',
      emissionsReduction: '70\u201385%',
      timeline: '24\u201336 months',
      regulatoryComplexity: 'Medium',
      confidence: 'Medium',
      engineeringSummary:
        'The existing refinery infrastructure can largely be retained, with the addition of a post-combustion carbon capture unit integrated into the FCC and hydrocracker exhaust streams. Key technical challenges include retrofitting amine scrubbing systems into limited plot space and establishing CO2 transport and storage infrastructure, potentially leveraging the adjacent North Sea depleted reservoirs. The FCC unit nearing end-of-life (2028) would require concurrent replacement or major overhaul.',
      financialSummary:
        'Indicative CAPEX benchmarks based on industry precedent suggest $180M\u2013$280M for a capture facility of this scale, including CO2 compression and pipeline tie-in. Ongoing OPEX would increase by an estimated 15\u201325% due to energy penalty from the capture process and solvent replenishment. Revenue continuity from crude processing operations partially offsets the capital investment, with potential UK ETS credit benefits improving payback within 8\u201312 years.',
      emissionsSummary:
        'Post-combustion CCS at 90%+ capture efficiency on major emission sources could reduce Scope 1 emissions from approximately 1.2 MT CO2e to 180,000\u2013360,000 tonnes CO2e annually. Scope 2 emissions would increase modestly due to higher electricity consumption for CO2 compression. Net lifecycle emissions reduction is estimated at 70\u201385%, contingent on capture plant availability and CO2 storage permanence verification.',
      regulatorySummary:
        'UK North Sea regulatory framework is supportive of CCS with the NSTA Track-1 and Track-2 cluster processes. The facility would need to secure a CO2 storage licence and comply with the UK ETS. Industrial Carbon Capture business model funding may be available. Environmental Impact Assessment under the Infrastructure Planning Act would be required for the CO2 pipeline and injection infrastructure.',
      risksSummary:
        'Primary risk is the dependency on CO2 transport and storage infrastructure development timelines, which are subject to planning and permitting delays. CCS technology at refinery scale has limited operational precedent in the UK. The FCC unit replacement schedule creates a critical path dependency. Carbon price volatility could undermine the financial case if UK ETS prices drop below $60/tonne. Assumes continued crude demand through the facility operating period.',
      strandedCapitalRisk:
        'Medium: Existing refinery equipment is largely retained, but the FCC unit nearing end-of-life represents $40M–$60M in write-down exposure if CCS integration is delayed beyond 2028.',
      socialImpact:
        'Minimal workforce disruption as core refinery operations continue. Approximately 50–80 new roles created for CCS operations and maintenance. Retraining required for process operators on carbon capture systems.',
      detailedNarrative:
        'The Optimize + CCS pathway allows the Coastal Energy Refinery to continue its core crude processing operations while achieving substantial emissions reductions through retrofitted carbon capture technology. The site benefits from proximity to the North Sea, where depleted oil and gas reservoirs and saline aquifers offer significant CO2 storage capacity. Engineering considerations centre on integrating post-combustion capture into the existing process layout, with the FCC unit replacement in 2028 providing an opportunity to incorporate CCS-ready design. The financial case is supported by UK government incentives for industrial CCS and the evolving UK ETS carbon price, though the investment carries execution risk given the nascent state of full-chain CCS projects in the UK. This pathway preserves the existing workforce and supply chain relationships but requires long-term commitment to fossil fuel processing, which may conflict with broader corporate net-zero strategies.',
      nextSteps: [
        'Commission pre-FEED study for CCS integration scope and plot plan assessment',
        'Engage CO2 transport and storage operators (e.g., Northern Endurance Partnership) to confirm capacity and connection timelines',
        'Apply for Industrial Carbon Capture business model and UK ETS support funding',
        'Conduct FCC unit remaining-life assessment and CCS-ready overhaul feasibility before 2028 deadline',
        'Initiate Environmental Impact Assessment scoping for CO2 pipeline and injection infrastructure',
      ],
    },
    {
      pathwayName: 'Repurpose to Green Hydrogen',
      subtitle: 'Convert facility for hydrogen production',
      accentColor: 'bright-orange',
      capexRange: '$350M\u2013$550M',
      emissionsReduction: '90\u201395%',
      timeline: '36\u201354 months',
      regulatoryComplexity: 'High',
      confidence: 'Low',
      engineeringSummary:
        'Conversion to green hydrogen production would require installation of large-scale electrolysers (estimated 100\u2013200 MW capacity), with supporting water treatment, hydrogen compression, storage, and distribution infrastructure. Existing utility systems (cooling water, power distribution, control rooms) and some storage tanks could be repurposed. The adjacent offshore wind corridor provides a potential renewable electricity source, but grid connection upgrades would be substantial. Major demolition of existing process units (CDU, FCC, hydrotreater) would be required.',
      financialSummary:
        'Indicative CAPEX benchmarks based on industry precedent suggest $350M\u2013$550M for a green hydrogen facility at this scale, inclusive of electrolyser procurement, balance of plant, and grid connection. Operational economics are highly sensitive to electricity prices, with levelised cost of hydrogen currently at $4\u2013$7/kg against a market price of $2\u2013$3/kg for grey hydrogen. The UK Hydrogen Production Business Model and CfD scheme could bridge this gap, but long-term offtake agreements are essential for bankability.',
      emissionsSummary:
        'Green hydrogen production from renewable electricity would reduce operational Scope 1 emissions by 90\u201395% compared to current refinery operations. Residual emissions relate to backup power systems and construction-phase impacts. The facility would produce zero direct CO2 from the hydrogen production process itself. Lifecycle emissions depend on the carbon intensity of the electricity grid during periods when renewable supply is insufficient.',
      regulatorySummary:
        'The UK Government\u2019s Hydrogen Strategy (2021, updated 2023) targets 10 GW of hydrogen capacity by 2030, and the local authority\u2019s hydrogen hub designation interest is a positive signal. However, regulatory complexity is high: planning consent for major facility conversion, updated COMAH/Seveso status for hydrogen storage, grid connection agreements with National Grid ESO, and compliance with the Low Carbon Hydrogen Standard for certification. Water abstraction licences would also need review for electrolyser feedwater requirements.',
      risksSummary:
        'The most significant risk is market uncertainty: hydrogen demand and pricing are not yet established at scale in the UK. Electrolyser technology is maturing rapidly, and early investment may face obsolescence risk. The project timeline of 36\u201354 months assumes timely planning consent and grid connection, both of which have historically experienced significant delays. Workforce transition from refinery operations to hydrogen plant operations requires substantial retraining. The capital intensity means financial returns are highly sensitive to policy support continuity.',
      strandedCapitalRisk:
        'High: Major demolition of CDU, FCC, and hydrotreater units writes off an estimated $150M\u2013$220M in existing asset value. Only utility systems and storage tanks are retained.',
      socialImpact:
        'Significant workforce transition required \u2014 approximately 60% of existing roles become redundant with new hydrogen-specific roles created. Substantial retraining programme needed. Community benefits from positioning as a hydrogen hub with potential for new supply chain jobs.',
      detailedNarrative:
        'Repurposing the Coastal Energy Refinery for green hydrogen production represents the most transformative pathway, aligning with the UK\u2019s hydrogen economy ambitions and the local authority\u2019s emerging hydrogen hub strategy. The site offers significant advantages: existing industrial zoning, port access for potential hydrogen export, proximity to the offshore wind corridor for renewable electricity supply, and an experienced industrial workforce. However, this pathway carries the highest capital cost and the greatest uncertainty. The hydrogen market in the UK is still nascent, with offtake contracts difficult to secure at bankable terms. Engineering challenges include the scale of demolition required, the complexity of electrolyser integration, and the need for new hydrogen storage and distribution infrastructure. This pathway should be considered a high-reward but high-risk option that requires strong policy support and strategic partnerships to be viable. Detailed feasibility assessment, including front-end engineering design (FEED), is essential before commitment.',
      nextSteps: [
        'Commission pre-FEED for electrolyser sizing, placement, and water treatment requirements',
        'Engage National Grid ESO on grid connection capacity and upgrade timeline for 100\u2013200 MW load',
        'Develop hydrogen offtake strategy \u2014 engage potential industrial buyers and transport operators',
        'Initiate workforce transition planning and skills gap analysis for hydrogen operations',
        'Submit expression of interest for UK Hydrogen Production Business Model allocation',
      ],
    },
    {
      pathwayName: 'Repurpose to Biofuels',
      subtitle: 'Convert facility for biofuel production',
      accentColor: 'orange',
      capexRange: '$200M\u2013$350M',
      emissionsReduction: '50\u201370%',
      timeline: '24\u201342 months',
      regulatoryComplexity: 'Medium',
      confidence: 'Medium',
      engineeringSummary:
        'The existing hydrocracker and hydrotreater units can be adapted for co-processing or dedicated processing of bio-feedstocks (used cooking oil, tallow, and potentially lignocellulosic feedstocks). The hydrogen supply system, utility infrastructure, and product storage and loading facilities are largely reusable. Key modifications include feedstock pretreatment systems, catalyst changes, and updated process control systems. The FCC unit would likely be decommissioned or mothballed, as it is less suitable for bio-feedstock processing.',
      financialSummary:
        'Indicative CAPEX benchmarks based on industry precedent suggest $200M\u2013$350M for biofuel conversion at this scale, depending on the degree of existing unit reuse and the choice of bio-feedstock. OPEX is driven primarily by feedstock costs, which currently represent 60\u201380% of production costs. Revenue is supported by the UK Renewable Transport Fuel Obligation (RTFO) certificates and potential Sustainable Aviation Fuel (SAF) mandates. Payback is estimated at 6\u20139 years under current incentive structures.',
      emissionsSummary:
        'Biofuel production from waste-derived feedstocks achieves a 50\u201370% lifecycle emissions reduction compared to fossil crude processing, depending on feedstock type and accounting methodology. Direct Scope 1 operational emissions are reduced as biogenic carbon is considered neutral in the combustion cycle. However, upstream feedstock transport and processing emissions must be accounted for. The UK RTFO and RED II frameworks provide the methodology for lifecycle carbon accounting.',
      regulatorySummary:
        'The UK RTFO provides a well-established regulatory framework for biofuel production, with tradeable certificates creating revenue support. Emerging SAF mandates (UK SAF mandate from 2025) create additional market opportunity. Planning consent for facility modification rather than new-build is typically less onerous. COMAH classification may change depending on feedstock characteristics. Feedstock sustainability certification under ISCC or RSB schemes is required.',
      risksSummary:
        'Feedstock availability and price volatility represent the primary commercial risk. Global demand for used cooking oil and waste fats is increasing, potentially driving up costs and limiting supply security. The pathway assumes continued government support through RTFO and SAF mandates; policy reversal would significantly impact economics. Technology risk is moderate: co-processing has proven precedent, but dedicated bio-refining at scale requires careful catalyst management. The FCC unit decommissioning creates sunk cost if the pathway is later reversed.',
      strandedCapitalRisk:
        'Medium: FCC unit mothballed or decommissioned ($30M\u2013$50M write-down). Hydrocracker and hydrotreater are repurposed, preserving majority of existing asset value.',
      socialImpact:
        'Moderate workforce transition \u2014 approximately 70% of existing roles transfer to biofuel operations with targeted retraining. Community impact is positive with continued industrial employment and reduced emissions profile.',
      detailedNarrative:
        'The biofuels pathway offers a pragmatic middle ground, leveraging significant existing refinery infrastructure while transitioning to lower-carbon fuel production. The Coastal Energy Refinery\u2019s hydrocracker and hydrotreater units are well-suited for processing bio-feedstocks, and the site\u2019s existing logistics infrastructure (tankage, loading arms, port access) reduces the scale of new-build requirements. The UK\u2019s strengthening biofuel and SAF policy framework provides a supportive market environment, though feedstock security remains the critical challenge. This pathway preserves a larger portion of the existing workforce skill set compared to hydrogen conversion, easing the social impact of transition. The timeline is relatively shorter, and the capital requirement more moderate, making this potentially the most bankable pathway. However, long-term viability depends on feedstock market development and the pace at which advanced feedstocks (e.g., municipal solid waste, forestry residues) become commercially viable at scale.',
      nextSteps: [
        'Secure preliminary feedstock supply agreements (UCO, tallow, waste fats) with quantity and pricing commitments',
        'Commission catalyst compatibility testing for bio-feedstock processing in existing hydrocracker unit',
        'Apply for RTFO registration and assess SAF mandate eligibility for production certificates',
        'Develop phased co-processing integration plan with target to begin bio-feedstock trials within 12 months',
        'Engage ISCC or RSB for feedstock sustainability certification pathway assessment',
      ],
    },
    {
      pathwayName: 'Full Decommission',
      subtitle: 'Safe dismantling and site remediation',
      accentColor: 'mid-gray',
      capexRange: '$120M\u2013$200M',
      emissionsReduction: '100%',
      timeline: '36\u201360 months',
      regulatoryComplexity: 'High',
      confidence: 'High',
      engineeringSummary:
        'Full decommissioning involves systematic shutdown, decontamination, dismantling of all process equipment, demolition of structures, and comprehensive site remediation. The scale of the facility (65,000 bpd refinery with 40 years of operations) means significant soil and groundwater contamination assessment and remediation is likely required. Asbestos-containing materials in older structures must be managed. Scrap metal recovery from equipment and structural steel provides partial cost offset. The process follows established UK HSE and EA guidance for major hazard site decommissioning.',
      financialSummary:
        'Indicative CAPEX benchmarks based on industry precedent suggest $120M\u2013$200M for full decommissioning, net of scrap recovery value. Costs are driven by contamination extent (unknown until detailed site investigation), asbestos management requirements, and regulatory compliance. There is no revenue generation during or after decommissioning unless the remediated site is sold or redeveloped. Site residual value post-remediation depends on local land market conditions and potential redevelopment planning status. End-of-life financial provisions may partially cover costs.',
      emissionsSummary:
        'Full decommissioning eliminates 100% of ongoing operational emissions (1.2 MT CO2e annually). Decommissioning activities themselves generate temporary emissions from demolition, transport, and waste processing, estimated at 20,000\u201340,000 tonnes CO2e over the project duration. Net lifecycle emissions benefit is significant and immediate upon operations cessation. Site remediation may release legacy contaminants that require separate environmental management.',
      regulatorySummary:
        'UK decommissioning of onshore major hazard sites is governed by COMAH Regulations, Environment Agency permitting, and local planning authority requirements. The site would require a Decommissioning Environmental Setting and Site Report (ESSR) and a detailed remediation strategy approved by the EA. COMAH notification requirements apply throughout the decommissioning phase. Workforce consultation under TUPE and collective redundancy regulations is mandatory. Local authority engagement is critical given the workforce of 450 and community impact.',
      risksSummary:
        'The primary risk is cost overrun from unknown contamination discovered during decommissioning, which is common at aged refinery sites. Social and political risk is significant: closure of a 450-person facility will face community opposition and may require negotiated social transition packages. Regulatory approval for the remediation endpoint (industrial reuse vs. residential) affects both cost and timeline. There is also reputational risk if the decommissioning is perceived as abandonment rather than responsible transition. Assumes no regulatory requirement to maintain strategic refining capacity.',
      strandedCapitalRisk:
        'High: Complete write-off of all process equipment and infrastructure, estimated at $250M\u2013$350M in book value. Partial offset from scrap recovery ($20M\u2013$40M).',
      socialImpact:
        'Severe workforce impact \u2014 all 450 positions eliminated over 36\u201360 months. Mandatory TUPE consultation and collective redundancy process required. Community transition package and workforce redeployment programme essential to manage social and political risk.',
      detailedNarrative:
        'Full decommissioning represents the definitive exit pathway, permanently eliminating the facility\u2019s carbon footprint and environmental risk profile. While the engineering and regulatory processes are well-established, the social and economic impact of closing a 450-person operation requires careful management through workforce transition programmes, community engagement, and potentially a site redevelopment master plan. The cost profile is substantial but finite, and the decommissioning timeline of 36\u201360 months reflects the complexity of a 40-year-old refinery site. This pathway should be considered in the context of the broader asset portfolio: if the site has greater value as remediated land for alternative development (e.g., the hydrogen hub designation, renewable energy infrastructure, or mixed-use redevelopment) than as an operating refinery, decommissioning may be the rational economic choice. A detailed site investigation and land valuation study are essential prerequisites for this decision.',
      nextSteps: [
        'Commission Phase II environmental site investigation (soil, groundwater, asbestos survey)',
        'Develop comprehensive workforce transition package with TUPE consultation and redeployment support',
        'Engage Environment Agency on remediation strategy, endpoint criteria, and permit surrender process',
        'Assess post-remediation site value and engage local authority on redevelopment planning status',
        'Prepare detailed decommissioning cost estimate with contamination risk contingency provisions',
      ],
    },
  ],
  recommendation:
    'Based on the preliminary assessment of the Coastal Energy Refinery, the Repurpose to Biofuels pathway appears to offer the most balanced risk-reward profile for near-term decision-making. It leverages substantial existing infrastructure (hydrocracker, hydrotreater, utilities, logistics), benefits from an established UK regulatory framework (RTFO, SAF mandate), and presents a moderate capital requirement with reasonable payback under current policy settings. However, this assessment is indicative and based on industry benchmarks rather than site-specific engineering analysis. The Optimize + CCS pathway remains a strong contender if CO2 transport and storage infrastructure timelines can be confirmed, and the Hydrogen pathway warrants further investigation given the local authority\u2019s hydrogen hub interest and proximity to offshore wind resources. A detailed feasibility study incorporating FEED-level engineering, site-specific cost estimation, feedstock market analysis, and stakeholder consultation is essential before any commitment. This preliminary assessment requires validation by process engineers, financial modellers, and regulatory specialists.',
  precedentStudies: [
    {
      reference: 'Similar refinery co-processing conversion \u2014 Rotterdam, Netherlands, 2022',
      findingSummary:
        'A 70,000 bpd refinery in the Rotterdam industrial cluster completed conversion of its hydrocracker to process 50% bio-feedstock (primarily used cooking oil and animal fats) alongside conventional crude. The conversion was completed within 28 months at a reported cost of approximately EUR 250M. The facility now produces approximately 900,000 tonnes per year of renewable diesel and sustainable aviation fuel, supported by EU RED II mandates and Dutch SDE++ subsidy scheme.',
      assumptions:
        'The Rotterdam case benefited from established feedstock supply chains in the ARA hub region and strong EU regulatory incentives. The conversion scope was partial (co-processing) rather than full dedicated bio-refining. Labour costs and regulatory timelines in the Netherlands differ from UK context.',
      relevance:
        'Highly relevant as a co-processing precedent demonstrating that existing hydrocracker assets can be adapted for bio-feedstocks at comparable scale. The UK RTFO framework provides similar (though not identical) incentive structures to the EU RED II. The Coastal Energy Refinery\u2019s hydrocracker, with its 2021 turnaround, is in good condition for similar conversion.',
    },
    {
      reference: 'North Sea refinery CCS retrofit feasibility study \u2014 Teesside, UK, 2023',
      findingSummary:
        'A FEED-level study for a 100,000 bpd refinery in the Teesside cluster assessed the feasibility of post-combustion CCS on the FCC and utilities complex. The study concluded that 80\u201390% capture was technically feasible with amine-based technology, at an estimated CAPEX of GBP 220M\u2013310M. The project was approved for development under the East Coast Cluster Track-1 programme, with first CO2 injection targeted for 2027.',
      assumptions:
        'The Teesside case benefits from proximity to the Northern Endurance Partnership CO2 transport and storage system, which is further advanced than any comparable infrastructure near the Coastal Energy Refinery site. The study assumed 25-year operational life post-CCS, which may not apply to assets with shorter remaining design life.',
      relevance:
        'Directly relevant as a UK refinery CCS precedent. The CAPEX range and capture efficiency projections provide useful benchmarks for the Coastal Energy Refinery, though the larger scale and more advanced T&S infrastructure in Teesside may not be directly transferable. The FCC end-of-life timing at the Coastal Energy Refinery (2028) creates an additional complication not present in the Teesside case.',
    },
    {
      reference: 'Offshore platform-adjacent facility decommissioning \u2014 Scottish North Sea, 2021',
      findingSummary:
        'A coastal processing facility supporting North Sea offshore operations was fully decommissioned over a 42-month period following field life expiry. Total decommissioning cost was approximately GBP 85M for a smaller facility (25,000 bpd equivalent throughput). Significant unexpected soil contamination added approximately GBP 15M and 6 months to the original programme. The remediated site was subsequently designated for renewable energy infrastructure development.',
      assumptions:
        'The Scottish case involved a smaller and simpler facility than the Coastal Energy Refinery. Contamination surprises are common at aged hydrocarbon facilities and should be expected. The successful site redevelopment for renewables suggests post-decommissioning land value may be significant, though this is location-dependent.',
      relevance:
        'Relevant for understanding UK decommissioning cost ranges and timelines, though the Coastal Energy Refinery\u2019s larger scale and complexity would drive higher costs. The contamination cost overrun is a cautionary precedent that reinforces the importance of early site investigation. The renewables redevelopment outcome is particularly relevant given the adjacent offshore wind corridor at the Coastal Energy Refinery site.',
    },
  ],
};
