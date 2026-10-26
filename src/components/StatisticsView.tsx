import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  GitCommit,
  FlaskConical,
  Scale,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from 'recharts';
import { Dataset, StatisticalSummary } from '../types';
import {
  computeLinearRegression,
  performOneWayANOVA,
  performTwoSampleTTest
} from '../utils/dataEngine';

interface StatisticsViewProps {
  dataset: Dataset;
  statistics: StatisticalSummary;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  dataset,
  statistics
}) => {
  const numericCols = dataset.columns.filter(c => c.type === 'numeric');
  const categoricalCols = dataset.columns.filter(c => c.type === 'categorical');

  const [regX, setRegX] = useState<string>(numericCols[0]?.name || '');
  const [regY, setRegY] = useState<string>(numericCols[1]?.name || numericCols[0]?.name || '');

  const [anovaNum, setAnovaNum] = useState<string>(numericCols[0]?.name || '');
  const [anovaCat, setAnovaCat] = useState<string>(categoricalCols[0]?.name || '');

  // Compute live linear regression for selected X and Y
  const regressionResult = regX && regY
    ? computeLinearRegression(
        dataset.data.map(r => Number(r[regX])).filter(v => !isNaN(v)),
        dataset.data.map(r => Number(r[regY])).filter(v => !isNaN(v)),
        regX,
        regY
      )
    : null;

  // Compute live ANOVA
  const anovaResult = anovaNum && anovaCat
    ? (() => {
        const groups: Record<string, number[]> = {};
        dataset.data.forEach(r => {
          const k = String(r[anovaCat] || 'Other');
          const v = Number(r[anovaNum]);
          if (!isNaN(v)) {
            if (!groups[k]) groups[k] = [];
            groups[k].push(v);
          }
        });
        return performOneWayANOVA(groups);
      })()
    : null;

  // Scatter points for regression
  const scatterPoints = (regX && regY)
    ? dataset.data
        .map(r => ({ [regX]: Number(r[regX]), [regY]: Number(r[regY]) }))
        .filter(p => !isNaN(p[regX]) && !isNaN(p[regY]))
        .slice(0, 40)
    : [];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Inferential & Descriptive Mathematics</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Statistical Analysis Engine</h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive parametric evaluation including descriptive moments, bivariate Pearson correlations, OLS linear regression, and ANOVA hypothesis testing.
        </p>
      </div>

      {/* SECTION 1: COLUMN DESCRIPTIVE METRICS TABLE */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Descriptive Statistical Moments (Numeric Columns)
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            {numericCols.length} variables analyzed
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5 font-sans font-semibold">Variable</th>
                <th className="p-2.5">Mean (μ)</th>
                <th className="p-2.5">Median</th>
                <th className="p-2.5">Std Dev (σ)</th>
                <th className="p-2.5">Min</th>
                <th className="p-2.5">Max</th>
                <th className="p-2.5">IQR</th>
                <th className="p-2.5">Skewness</th>
                <th className="p-2.5 font-sans">Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {numericCols.map(col => (
                <tr key={col.name} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-sans font-semibold text-white">{col.name}</td>
                  <td className="p-2.5">{col.mean?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">{col.median?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">{col.stdDev?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">{col.min?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">{col.max?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">{col.iqr?.toFixed(2) ?? 'N/A'}</td>
                  <td className="p-2.5">
                    <span className={Math.abs(col.skewness || 0) > 1 ? 'text-amber-400' : 'text-slate-300'}>
                      {col.skewness?.toFixed(2) ?? '0.00'}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans">
                    {col.hasOutliers ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        {col.outlierCount} flagged
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-medium">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: BIVARIATE LINEAR REGRESSION */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Ordinary Least Squares</div>
            <h2 className="text-sm font-bold text-white mt-0.5">Bivariate Linear Regression Model</h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Independent (X):</span>
              <select
                value={regX}
                onChange={e => setRegX(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
              >
                {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Dependent (Y):</span>
              <select
                value={regY}
                onChange={e => setRegY(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
              >
                {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {regressionResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Regression metrics cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium">Model Equation</span>
                <div className="text-sm font-bold text-indigo-300 font-mono mt-1">
                  {regressionResult.formula}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Variance (R²)</span>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {(regressionResult.r2 * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Correlation (r)</span>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {Math.sqrt(Math.max(0, regressionResult.r2)).toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Slope (β₁):</span>
                  <span className="font-mono text-white">{regressionResult.slope.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intercept (β₀):</span>
                  <span className="font-mono text-white">{regressionResult.intercept.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">P-Value:</span>
                  <span className="font-mono text-white">{regressionResult.pValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statistical Significance:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {regressionResult.pValue < 0.05 ? 'p < 0.05 (Significant)' : 'p >= 0.05 (Not Significant)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Regression dispersion chart */}
            <div className="lg:col-span-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey={regX} name={regX} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis dataKey={regY} name={regY} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Scatter name="Observations" data={scatterPoints} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: HYPOTHESIS TESTING (ANOVA) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Parametric Hypothesis Test</div>
            <h2 className="text-sm font-bold text-white mt-0.5">One-Way ANOVA (Analysis of Variance)</h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Group Factor:</span>
              <select
                value={anovaCat}
                onChange={e => setAnovaCat(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
              >
                {categoricalCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Metric Tested:</span>
              <select
                value={anovaNum}
                onChange={e => setAnovaNum(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
              >
                {numericCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {anovaResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">F-Statistic Score</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {anovaResult.fStatistic.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Ratio of between-group variance to within-group error.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400">P-Value Significance</span>
              <div className="text-2xl font-bold font-mono mt-1 text-emerald-400">
                p &lt; {anovaResult.pValue}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Probability of observing results under null hypothesis.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Statistical Conclusion</span>
                <div className="text-xs font-bold text-white mt-1">
                  {anovaResult.significant
                    ? 'Reject Null Hypothesis (H₀)'
                    : 'Fail to Reject Null (H₀)'}
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                {anovaResult.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: CORRELATION MATRIX HIGHLIGHTS */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Statistically Significant Pearson Correlation Pairs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {statistics.significantCorrelations.map((pair, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="flex items-center justify-between font-semibold text-white">
                <span className="truncate">{pair.col1} ↔ {pair.col2}</span>
                <span className="font-mono text-indigo-400 font-bold ml-2">r = {pair.correlation.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-700/50">
                <span>{pair.strength} {pair.direction}</span>
                <span className="text-slate-500">n = {dataset.summary.totalRows}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
