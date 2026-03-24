import type { AssetProfile, AnalysisResult } from './types';
import { DIMENSION_LABELS, PATHWAY_COLOR_MAP } from './types';

interface ExportData {
  assetProfile: AssetProfile;
  analysisResult: AnalysisResult;
  generatedAt: string;
}

/**
 * Export analysis results as a downloadable JSON file.
 */
export function exportAsJSON({ assetProfile, analysisResult, generatedAt }: ExportData): void {
  const report = {
    meta: {
      tool: 'Worley Transition Pathfinder',
      generatedAt,
      disclaimer:
        'AI-generated preliminary assessment. All figures are indicative benchmarks based on industry precedent. Requires consultant validation before client delivery.',
    },
    assetProfile,
    analysisResult,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${assetProfile.assetName.replace(/\s+/g, '_')}_Transition_Report.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open a print-friendly report window that the user can print to PDF.
 */
export function exportAsPrintablePDF({ assetProfile, analysisResult, generatedAt }: ExportData): void {
  const pathways = analysisResult.pathways;

  const pathwayCardsHTML = pathways
    .map((p) => {
      const color = PATHWAY_COLOR_MAP[p.pathwayName]?.accent || '#8B8D8F';
      const dimensionsHTML = DIMENSION_LABELS.map(
        (d) =>
          `<tr><td style="font-weight:600;color:#555;padding:6px 12px 6px 0;vertical-align:top;width:200px;border-bottom:1px solid #eee;">${d.label}</td><td style="padding:6px 0;border-bottom:1px solid #eee;">${p[d.key] || 'N/A'}</td></tr>`
      ).join('');

      return `
        <div style="page-break-inside:avoid;margin-bottom:24px;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div style="height:4px;background:${color};"></div>
          <div style="padding:20px;">
            <h3 style="margin:0 0 4px;color:#1a1a1a;font-size:18px;">${p.pathwayName}</h3>
            <p style="margin:0 0 16px;color:#666;font-size:14px;">${p.subtitle}</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="color:#888;padding:4px 12px 4px 0;">Est. CAPEX</td><td style="font-weight:600;">${p.capexRange}</td></tr>
              <tr><td style="color:#888;padding:4px 12px 4px 0;">Emissions reduction</td><td style="font-weight:600;">${p.emissionsReduction}</td></tr>
              <tr><td style="color:#888;padding:4px 12px 4px 0;">Timeline</td><td style="font-weight:600;">${p.timeline}</td></tr>
              <tr><td style="color:#888;padding:4px 12px 4px 0;">Regulatory complexity</td><td style="font-weight:600;">${p.regulatoryComplexity}</td></tr>
              <tr><td style="color:#888;padding:4px 12px 4px 0;">Confidence</td><td style="font-weight:600;">${p.confidence}</td></tr>
            </table>
            <h4 style="margin:16px 0 8px;font-size:14px;color:#333;">Detailed Analysis</h4>
            <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6;">
              ${dimensionsHTML}
            </table>
          </div>
        </div>`;
    })
    .join('');

  const precedentsHTML = analysisResult.precedentStudies
    .map(
      (s) => `
      <div style="margin-bottom:16px;padding:16px;border:1px solid #ddd;border-radius:8px;">
        <h4 style="margin:0 0 8px;font-size:14px;">${s.reference}</h4>
        <p style="margin:0 0 8px;font-size:13px;color:#333;">${s.findingSummary}</p>
        <p style="margin:0;font-size:12px;color:#666;"><strong>Assumptions:</strong> ${s.assumptions}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#666;"><strong>Relevance:</strong> ${s.relevance}</p>
      </div>`
    )
    .join('');

  const assetFields = [
    { label: 'Asset Name', value: assetProfile.assetName },
    { label: 'Asset Type', value: assetProfile.assetType },
    { label: 'Location', value: assetProfile.location },
    { label: 'Year Commissioned', value: String(assetProfile.yearCommissioned) },
    { label: 'Current Capacity', value: `${assetProfile.currentCapacity} ${assetProfile.capacityUnit}` },
    { label: 'Primary Product', value: assetProfile.primaryProduct },
    { label: 'Annual Emissions', value: assetProfile.annualEmissions || 'Unknown' },
    { label: 'Net Zero Target', value: assetProfile.netZeroTarget ? String(assetProfile.netZeroTarget) : 'Not set' },
    { label: 'Remaining Design Life', value: assetProfile.remainingDesignLife ? `${assetProfile.remainingDesignLife} years` : 'Not specified' },
  ];

  const assetTableHTML = assetFields
    .map(
      (f) =>
        `<tr><td style="font-weight:600;color:#555;padding:4px 16px 4px 0;">${f.label}</td><td>${f.value}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${assetProfile.assetName} - Transition Pathfinder Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 900px; margin: 0 auto; padding: 40px 24px; line-height: 1.5; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:24px;padding:12px 16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:14px;color:#0369a1;">Use <strong>Ctrl/Cmd + P</strong> to print or save as PDF</span>
    <button onclick="window.print()" style="padding:8px 20px;background:#E35205;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Print / Save PDF</button>
  </div>

  <header style="margin-bottom:32px;border-bottom:3px solid #E35205;padding-bottom:20px;">
    <h1 style="margin:0 0 4px;font-size:24px;color:#1a1a1a;">Worley Transition Pathfinder</h1>
    <p style="margin:0 0 12px;font-size:14px;color:#666;">Delivering Sustainable Change</p>
    <p style="margin:0;font-size:12px;color:#999;">Report generated: ${generatedAt}</p>
  </header>

  <section style="margin-bottom:32px;">
    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:12px;">Asset Profile</h2>
    <table style="font-size:14px;border-collapse:collapse;">${assetTableHTML}</table>
    ${assetProfile.knownConstraints ? `<p style="margin-top:12px;font-size:13px;"><strong>Known Constraints:</strong> ${assetProfile.knownConstraints}</p>` : ''}
  </section>

  <section style="margin-bottom:32px;">
    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:16px;">Pathway Scenarios</h2>
    ${pathwayCardsHTML}
  </section>

  <section style="margin-bottom:32px;page-break-inside:avoid;">
    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:12px;">Recommendation</h2>
    <div style="padding:16px;border-left:4px solid #E35205;background:#fafafa;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:14px;line-height:1.7;">${analysisResult.recommendation}</p>
    </div>
  </section>

  <section style="margin-bottom:32px;">
    <h2 style="font-size:18px;color:#1a1a1a;margin-bottom:12px;">Precedent Studies</h2>
    ${precedentsHTML}
  </section>

  <footer style="margin-top:40px;padding-top:16px;border-top:1px solid #ddd;">
    <p style="font-size:11px;color:#999;line-height:1.6;">
      <strong>Disclaimer:</strong> This report is an AI-generated preliminary assessment produced by the Worley Transition Pathfinder.
      All CAPEX/OPEX figures are indicative benchmarks based on industry precedent, not calculated projections.
      This analysis requires validation by process engineers, financial modellers, and regulatory specialists before any commitment.
      Do not use this report as definitive engineering feasibility — it is intended as considerations for further assessment.
    </p>
  </footer>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
