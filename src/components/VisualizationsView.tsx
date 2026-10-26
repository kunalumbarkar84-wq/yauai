import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Sparkles,
  Layers,
  ArrowUpDown,
  Palette,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Dataset, ChartConfig } from '../types';

interface VisualizationsViewProps {
  dataset: Dataset;
  initialCharts: ChartConfig[];
}

const PALETTES = [
  ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
  ['#3b82f6', '#14b8a6', '#84cc16', '#eab308', '#f97316', '#ef4444'],
  ['#8b5cf6', '#d946ef', '#06b6d4', '#3b82f6', '#10b981', '#f43f5e']
];

export const VisualizationsView: React.FC<VisualizationsViewProps> = ({
  dataset,
  initialCharts
}) => {
  const numericCols = dataset.columns.filter(c => c.type === 'numeric');
  const categoricalCols = dataset.columns.filter(c => c.type === 'categorical');

  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [chartType, setChartType] = useState<string>('bar');
  const [selectedDim, setSelectedDim] = useState<string>(categoricalCols[0]?.name || dataset.columns[0]?.name || '');
  const [selectedMetric, setSelectedMetric] = useState<string>(numericCols[0]?.name || '');
  const [aggregation, setAggregation] = useState<'sum' | 'avg' | 'count' | 'max'>('sum');
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Compute aggregated data for live custom chart builder
  const groupedData = React.useMemo(() => {
    if (!selectedDim || !selectedMetric) return [];

    const groupMap: Record<string, { sum: number; count: number; max: number; min: number }> = {};
    dataset.data.forEach(r => {
      const dimVal = String(r[selectedDim] ?? 'Unspecified');
      const numVal = Number(r[selectedMetric]) || 0;
      if (!groupMap[dimVal]) groupMap[dimVal] = { sum: 0, count: 0, max: numVal, min: numVal };
      groupMap[dimVal].sum += numVal;
      groupMap[dimVal].count++;
      if (numVal > groupMap[dimVal].max) groupMap[dimVal].max = numVal;
      if (numVal < groupMap[dimVal].min) groupMap[dimVal].min = numVal;
    });

    return Object.entries(groupMap)
      .map(([name, stats]) => {
        let finalVal = stats.sum;
        if (aggregation === 'avg') finalVal = stats.count > 0 ? stats.sum / stats.count : 0;
        if (aggregation === 'count') finalVal = stats.count;
        if (aggregation === 'max') finalVal = stats.max;

        return {
          dimension: name,
          value: Number(finalVal.toFixed(2)),
          count: stats.count
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [dataset, selectedDim, selectedMetric, aggregation]);

  const activeColors = PALETTES[paletteIndex];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <PieChartIcon className="w-3.5 h-3.5" />
          <span>Interactive Visual Analytics Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Visualizations & Chart Lab</h1>
        <p className="text-xs text-slate-400 mt-1">
          Auto-generated charts tailored to data types, paired with a custom multi-dimensional visual query builder.
        </p>
      </div>

      {/* SECTION 1: CUSTOM CHART BUILDER */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Custom Visualization Studio</span>
            <h2 className="text-base font-bold text-white mt-0.5">
              {aggregation.toUpperCase()} of {selectedMetric} by {selectedDim}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPaletteIndex((paletteIndex + 1) % PALETTES.length)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Theme Palette</span>
            </button>
          </div>
        </div>

        {/* Controls Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Chart Type</label>
            <select
              value={chartType}
              onChange={e => setChartType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="bar">Vertical Bar Chart</option>
              <option value="area">Area Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Donut / Pie Chart</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Dimension (X-Axis)</label>
            <select
              value={selectedDim}
              onChange={e => setSelectedDim(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              {dataset.columns.map(c => (
                <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Metric (Y-Axis)</label>
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              {numericCols.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Aggregation Function</label>
            <select
              value={aggregation}
              onChange={e => setAggregation(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="sum">SUM (Total)</option>
              <option value="avg">AVG (Arithmetic Mean)</option>
              <option value="count">COUNT (Transactions)</option>
              <option value="max">MAX (Peak Single)</option>
            </select>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-80 w-full mb-4">
          {groupedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={groupedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dimension" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill={activeColors[0]} radius={[4, 4, 0, 0]}>
                    {groupedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={groupedData}>
                  <defs>
                    <linearGradient id="customAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColors[0]} stopOpacity={0.5}/>
                      <stop offset="95%" stopColor={activeColors[0]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dimension" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke={activeColors[0]} strokeWidth={2} fill="url(#customAreaGrad)" />
                </AreaChart>
              ) : chartType === 'line' ? (
                <LineChart data={groupedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dimension" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="value" stroke={activeColors[0]} strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Pie
                    data={groupedData}
                    dataKey="value"
                    nameKey="dimension"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {groupedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No data points available for the selected dimension and metric.
            </div>
          )}
        </div>

        {/* Chart Explanatory Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Explanation</span>
            <span className="text-slate-300">
              Aggregates {aggregation.toUpperCase()} of {selectedMetric} grouped across top 10 unique segments of {selectedDim}.
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Why Selected</span>
            <span className="text-slate-300">
              {chartType === 'bar' ? 'Bar geometry allows exact visual comparison between discrete categories.' :
               chartType === 'pie' ? 'Donut layout illustrates proportional market share of top tiers.' :
               'Continuous curve displays sequential cadence and momentum.'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Observation</span>
            <span className="text-indigo-300 font-semibold">
              {groupedData[0] ? `${groupedData[0].dimension} is top performer with ${groupedData[0].value.toLocaleString()} (${aggregation}).` : 'Awaiting data.'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: AUTOMATICALLY GENERATED CHARTS REPOSITORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Autonomous Chart Repository</h2>
          <span className="text-xs text-slate-400">Pre-computed from dataset schema</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialCharts.map((cfg, idx) => (
            <div key={cfg.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white truncate max-w-[280px]">{cfg.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 uppercase font-bold border border-slate-700">
                  {cfg.chartType}
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {cfg.chartType === 'bar' ? (
                    <BarChart data={cfg.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey={cfg.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey={cfg.yAxisKeys[0]} fill="#6366f1" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  ) : cfg.chartType === 'scatter' ? (
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey={cfg.xAxisKey} name={cfg.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis dataKey={cfg.yAxisKeys[0]} name={cfg.yAxisKeys[0]} stroke="#64748b" tick={{ fontSize: 9 }} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Scatter data={cfg.data} fill="#06b6d4" />
                    </ScatterChart>
                  ) : (
                    <AreaChart data={cfg.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey={cfg.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey={cfg.yAxisKeys[0]} stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-white font-medium">Takeaway: </span>
                {cfg.keyObservation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
