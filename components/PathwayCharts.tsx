'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import type { PathwayScenario } from '@/lib/types';
import { PATHWAY_COLOR_MAP } from '@/lib/types';
import AIBadge from './AIBadge';

interface PathwayChartsProps {
  pathways: PathwayScenario[];
}

/** Parse a midpoint number from a CAPEX range string like "$180M–$280M" → 230 */
function parseCapexMidpoint(capexRange: string): number {
  const numbers = capexRange.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return 0;
  const values = numbers.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/** Parse percentage midpoint from "70–85%" → 77.5 */
function parseEmissionsMidpoint(emissionsReduction: string): number {
  const numbers = emissionsReduction.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return 0;
  const values = numbers.map(Number);
  if (values.length >= 2) return (values[0] + values[1]) / 2;
  return values[0];
}

/** Map confidence level to numeric score */
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

const CHART_COLORS = ['#025966', '#2DB3C7', '#0B7B8B', '#8B8D8F'];

export default function PathwayCharts({ pathways }: PathwayChartsProps) {
  if (!pathways || pathways.length === 0) return null;

  // CAPEX bar chart data
  const capexData = pathways.map((p, idx) => ({
    name: p.pathwayName.length > 20 ? p.pathwayName.slice(0, 18) + '...' : p.pathwayName,
    fullName: p.pathwayName,
    capex: parseCapexMidpoint(p.capexRange),
    fill: PATHWAY_COLOR_MAP[p.pathwayName]?.accent || CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // Emissions data
  const emissionsData = pathways.map((p, idx) => ({
    name: p.pathwayName,
    percentage: parseEmissionsMidpoint(p.emissionsReduction),
    color: PATHWAY_COLOR_MAP[p.pathwayName]?.accent || CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // Radar chart data
  const radarMetrics = [
    'Emissions Reduction',
    'Confidence',
    'Cost Efficiency',
    'Regulatory Simplicity',
  ];

  const radarData = radarMetrics.map((metric) => {
    const entry: Record<string, string | number> = { metric };
    pathways.forEach((p) => {
      const capexMid = parseCapexMidpoint(p.capexRange);
      const maxCapex = Math.max(...pathways.map((pw) => parseCapexMidpoint(pw.capexRange)), 1);
      let value = 0;
      switch (metric) {
        case 'Emissions Reduction':
          value = parseEmissionsMidpoint(p.emissionsReduction);
          break;
        case 'Confidence':
          value = confidenceScore(p.confidence);
          break;
        case 'Cost Efficiency':
          value = Math.round(((maxCapex - capexMid) / maxCapex) * 100);
          break;
        case 'Regulatory Simplicity':
          value = regulatorySimplicity(p.regulatoryComplexity);
          break;
      }
      entry[p.pathwayName] = value;
    });
    return entry;
  });

  return (
    <section className="mt-8">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-[22px] font-semibold text-worley-text-primary">Visual Comparison</h2>
        <AIBadge />
      </div>
      <div className="mb-6 h-1 w-16 bg-worley-orange" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CAPEX Comparison Bar Chart */}
        <div className="rounded-xl border border-worley-border bg-white p-5">
          <h3 className="mb-1 text-base font-semibold text-worley-text-primary">
            Estimated CAPEX Comparison
          </h3>
          <p className="mb-4 text-xs text-worley-text-muted">
            Indicative benchmarks based on industry precedent (midpoint of range, $M)
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={capexData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}M`} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [`$${value}M`, 'Est. CAPEX']}
                labelFormatter={(label) => {
                  const match = capexData.find((d) => d.name === label);
                  return match?.fullName || label;
                }}
              />
              <Bar dataKey="capex" radius={[0, 4, 4, 0]}>
                {capexData.map((entry, idx) => (
                  <rect key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="rounded-xl border border-worley-border bg-white p-5">
          <h3 className="mb-1 text-base font-semibold text-worley-text-primary">
            Multi-Dimension Comparison
          </h3>
          <p className="mb-4 text-xs text-worley-text-muted">
            Indicative benchmarks &mdash; higher is better on all axes
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData} outerRadius="68%" margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 12, fill: '#374151' }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickCount={5}
              />
              {pathways.map((p, idx) => (
                <Radar
                  key={p.pathwayName}
                  name={p.pathwayName}
                  dataKey={p.pathwayName}
                  stroke={PATHWAY_COLOR_MAP[p.pathwayName]?.accent || CHART_COLORS[idx]}
                  fill={PATHWAY_COLOR_MAP[p.pathwayName]?.accent || CHART_COLORS[idx]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                verticalAlign="bottom"
                iconType="circle"
                iconSize={10}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emissions Reduction Progress Bars */}
      <div className="mt-6 rounded-xl border border-worley-border bg-white p-5">
        <h3 className="mb-1 text-base font-semibold text-worley-text-primary">
          Emissions Reduction Potential
        </h3>
        <p className="mb-4 text-xs text-worley-text-muted">
          Indicative benchmarks based on industry precedent (midpoint of range)
        </p>
        <div className="space-y-3">
          {emissionsData.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-worley-text-secondary">{item.name}</span>
                <span className="text-sm font-medium text-worley-text-primary">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-worley-surface">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
