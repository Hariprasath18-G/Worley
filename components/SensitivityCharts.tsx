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
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PathwayAttractiveness } from '@/lib/types';
import { PATHWAY_COLOR_MAP, SCORE_WEIGHTS } from '@/lib/types';

const CHART_COLORS = ['#025966', '#2DB3C7', '#0B7B8B', '#8B8D8F'];

function getColor(name: string, idx: number): string {
  return PATHWAY_COLOR_MAP[name]?.accent || CHART_COLORS[idx % CHART_COLORS.length];
}

interface SensitivityChartsProps {
  scores: PathwayAttractiveness[];
  baselineScores: PathwayAttractiveness[];
}

export default function SensitivityCharts({ scores, baselineScores }: SensitivityChartsProps) {
  // --- Bar chart data ---
  const barData = scores.map((s, idx) => ({
    name: s.pathwayName.length > 18 ? s.pathwayName.slice(0, 16) + '...' : s.pathwayName,
    fullName: s.pathwayName,
    score: s.score,
    fill: getColor(s.pathwayName, idx),
  }));

  // --- Radar chart data ---
  const dimensions = Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[];
  const dimensionLabels: Record<string, string> = {
    emissions: 'Emissions',
    cost: 'Cost Efficiency',
    confidence: 'Confidence',
    regulatory: 'Regulatory',
    social: 'Social',
  };

  const radarData = dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dimension: dimensionLabels[dim] || dim };
    scores.forEach((s) => {
      entry[s.pathwayName] = s.breakdown[dim] ?? 0;
    });
    return entry;
  });

  return (
    <div className="space-y-6">
      {/* Attractiveness Bar Chart */}
      <div className="rounded-xl border border-worley-border bg-white p-5">
        <h3 className="mb-1 text-base font-semibold text-worley-text-primary">
          Pathway Attractiveness Score
        </h3>
        <p className="mb-4 text-xs text-worley-text-muted">
          Weighted composite score (0-100) based on current assumptions
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => [`${value}`, 'Score']}
              labelFormatter={(label) => {
                const match = barData.find((d) => d.name === label);
                return match?.fullName || label;
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {barData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking Cards */}
      <div className="rounded-xl border border-worley-border bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-worley-text-primary">
          Pathway Rankings
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {scores.map((s, idx) => {
            const baseline = baselineScores.find((b) => b.pathwayName === s.pathwayName);
            const delta = baseline ? s.score - baseline.score : 0;
            const color = getColor(s.pathwayName, idx);

            return (
              <div
                key={s.pathwayName}
                className="flex items-center gap-3 rounded-lg border border-worley-border p-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {s.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-worley-text-primary">
                    {s.pathwayName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-worley-text-muted">Score: {s.score}</span>
                    {delta !== 0 && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          delta > 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {delta > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    )}
                    {delta === 0 && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-worley-text-muted">
                        <Minus className="h-3 w-3" />
                        baseline
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Axis Radar Chart */}
      <div className="rounded-xl border border-worley-border bg-white p-5">
        <h3 className="mb-1 text-base font-semibold text-worley-text-primary">
          Multi-Dimension Breakdown
        </h3>
        <p className="mb-4 text-xs text-worley-text-muted">
          Dimension scores under current assumptions &mdash; higher is better
        </p>
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={radarData} outerRadius="68%" margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="dimension"
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
            {scores.map((s, idx) => (
              <Radar
                key={s.pathwayName}
                name={s.pathwayName}
                dataKey={s.pathwayName}
                stroke={getColor(s.pathwayName, idx)}
                fill={getColor(s.pathwayName, idx)}
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
  );
}
