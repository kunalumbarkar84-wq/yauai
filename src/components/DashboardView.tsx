import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Layers,
  CheckCircle2,
  FileText,
  Activity,
  Building2,
  Sliders,
  BrainCircuit
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Dataset,
  KPIItem,
  AIInsight,
  ChartConfig,
  AnomalyRecord,
  ViewMode
} from '../types';

interface DashboardViewProps {
  dataset: Dataset;
  kpis: KPIItem[];
  insights: AIInsight[];
  charts: ChartConfig[];
  anomalies: AnomalyRecord[];
  onNavigate: (view: ViewMode) => void;
  onOpenBusinessQuestion: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dataset,
  kpis,
  insights,
  charts,
  anomalies,
  onNavigate,
  onOpenBusinessQuestion
}) => {
  const trendChart = charts.find(c => c.chartType === 'area' || c.chartType === 'line') || charts[0];
  const catChart = charts.find(c => c.chartType === 'bar' && c.id !== trendChart?.id) || charts[1];
  const scatterChart = charts.find(c => c.chartType === 'scatter') || charts[2];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Briefing</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {dataset.name} — Executive Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Synthesizing {dataset.summary.totalRows.toLocaleString()} observations across {dataset.summary.totalColumns} dimensional attributes. Integrity score certified at {dataset.qualityScore}/100.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('ai_studio')}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Studio</span>
          </button>
          <button
            onClick={() => onNavigate('workbench')}
            className="px-3.5 py-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Studio</span>
          </button>
          <button
            onClick={() => onNavigate('integrations')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enterprise Integrations</span>
          </button>
          <button
            onClick={onOpenBusinessQuestion}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Business Question</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Executive Report</span>
          </button>
        </div>
      </div>

      {/* ROW 1: KPI CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Row 1 — Core Performance Indicators
          </h2>
          <span className="text-[11px] text-slate-500">Auto-inferred from dimensional attributes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{kpi.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  {kpi.formula}
                </span>
              </div>
              <div className="text-2xl font-black text-white mt-1.5 tracking-tight">
                {kpi.value}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate max-w-[150px]">{kpi.description}</span>
                {kpi.changePercentage !== undefined && kpi.changePercentage !== 0 && (
                  <span className={`flex items-center gap-0.5 font-bold font-mono ${
                    kpi.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.changePercentage > 0 ? `+${kpi.changePercentage}%` : `${kpi.changePercentage}%`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2 & 3: PRIMARY TREND & CATEGORY COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 2: Primary Trend Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Row 2 — Primary Temporal Trend</div>
              <h3 className="text-sm font-bold text-white mt-0.5">{trendChart?.title || 'Trend Trajectory'}</h3>
            </div>
            <button
              onClick={() => onNavigate('visualizations')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            {trendChart && trendChart.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChart.data}>
                  <defs>
                    <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey={trendChart.xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={trendChart.yAxisKeys[0]}
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#primaryAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No time-series date column identified.</div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <strong>Key Observation:</strong> {trendChart?.keyObservation || 'Positive trajectory maintained across observed periods.'}
          </p>
        </div>

        {/* Row 3: Category Comparison */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Row 3 — Categorical Breakdown</div>
              <h3 className="text-sm font-bold text-white mt-0.5">{catChart?.title || 'Segment Volume'}</h3>
            </div>
            <button
              onClick={() => onNavigate('visualizations')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            {catChart && catChart.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catChart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey={catChart.xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey={catChart.yAxisKeys[0]} fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">Categorical distributions computed.</div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <strong>Key Observation:</strong> {catChart?.keyObservation || 'Clear hierarchy observed across primary product cohorts.'}
          </p>
        </div>
      </div>

      {/* ROW 4: CORRELATION & RELATIONSHIPS */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Row 4 — Bivariate Correlation & Dispersion</div>
            <h3 className="text-sm font-bold text-white mt-0.5">{scatterChart?.title || 'Co-variance Analysis'}</h3>
          </div>
          <button
            onClick={() => onNavigate('statistics')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>Full Statistical Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="h-56 w-full">
          {scatterChart && scatterChart.data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey={scatterChart.xAxisKey} name={scatterChart.xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey={scatterChart.yAxisKeys[0]} name={scatterChart.yAxisKeys[0]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Scatter data={scatterChart.data} fill="#818cf8" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">Scatter plots ready.</div>
          )}
        </div>
      </div>

      {/* ROW 5: AI INSIGHTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Row 5 — Autonomous Strategic AI Insights
          </h2>
          <button
            onClick={() => onNavigate('insights')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>View All Insights ({insights.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.slice(0, 3).map(ins => {
            const badgeColor =
              ins.category === 'opportunity' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
              ins.category === 'risk' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
              ins.category === 'anomaly' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
              'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

            return (
              <div key={ins.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                      {ins.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {ins.confidence}% Confidence
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">{ins.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{ins.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
                  <strong className="text-indigo-300">Action:</strong> {ins.recommendedAction}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 6: ANOMALIES & AUDIT RADAR */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Row 6 — Anomaly Radar & Alert Log</div>
              <h3 className="text-sm font-bold text-white mt-0.5">Statistical Outlier Events ({anomalies.length})</h3>
            </div>
          </div>
          <button
            onClick={() => onNavigate('anomalies')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>Audit All Anomalies</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {anomalies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Row #</th>
                  <th className="p-2.5">Flagged Column</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5">Tukey Fence / Expected</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Statistical Root Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {anomalies.slice(0, 4).map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono text-slate-300">#{a.rowIndex}</td>
                    <td className="p-2.5 font-semibold text-white">{a.column}</td>
                    <td className="p-2.5 font-mono text-amber-300 font-bold">{String(a.value)}</td>
                    <td className="p-2.5 font-mono text-slate-400">{a.expectedRange}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        a.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 truncate max-w-xs">{a.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero statistical anomalies detected within 1.5x IQR boundaries.</span>
          </div>
        )}
      </div>
    </div>
  );
};
