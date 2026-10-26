import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Dataset, ForecastResult } from '../types';
import { generateTimeSeriesForecast } from '../utils/dataEngine';

interface ForecastingViewProps {
  dataset: Dataset;
  initialForecast: ForecastResult | null;
}

export const ForecastingView: React.FC<ForecastingViewProps> = ({
  dataset,
  initialForecast
}) => {
  const numericCols = dataset.columns.filter(c => c.type === 'numeric');
  const [targetMetric, setTargetMetric] = useState<string>(
    initialForecast?.metric || numericCols[0]?.name || ''
  );
  const [modelType, setModelType] = useState<
    'moving_average' | 'linear_trend' | 'exponential_smoothing' | 'arima'
  >('exponential_smoothing');
  const [horizon, setHorizon] = useState<number>(6);

  const forecast = React.useMemo(() => {
    if (!targetMetric) return null;
    return generateTimeSeriesForecast(dataset, targetMetric, horizon, modelType);
  }, [dataset, targetMetric, horizon, modelType]);

  // Combine historical points and forecasted points for the unified chart
  const combinedChartData = React.useMemo(() => {
    if (!forecast) return [];
    const hist = forecast.historical.map(h => ({
      period: h.period,
      historical: h.value,
      projected: undefined,
      upperBound: undefined,
      lowerBound: undefined
    }));

    // Bridge historical last point to forecast first point
    const lastHist = hist[hist.length - 1];

    const pred = forecast.predictions.map(p => ({
      period: p.period,
      historical: undefined,
      projected: p.predictedValue,
      upperBound: p.upperBound,
      lowerBound: p.lowerBound
    }));

    if (lastHist) {
      pred.unshift({
        period: lastHist.period,
        historical: undefined,
        projected: lastHist.historical,
        upperBound: lastHist.historical,
        lowerBound: lastHist.historical
      });
    }

    return [...hist, ...pred.slice(1)];
  }, [forecast]);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Predictive Modeling & Trend Extrapolation</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Time-Series Forecasting</h1>
        <p className="text-xs text-slate-400 mt-1">
          Extrapolate future trajectories using Holt-Winters Exponential Smoothing, ARIMA estimation, and 95% confidence intervals.
        </p>
      </div>

      {/* Control Configuration Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Target Numeric Variable</label>
            <select
              value={targetMetric}
              onChange={e => setTargetMetric(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              {numericCols.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Forecasting Model</label>
            <select
              value={modelType}
              onChange={e => setModelType(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="exponential_smoothing">Holt-Winters Exponential Smoothing (Adaptive)</option>
              <option value="linear_trend">Linear Trend Regression Extrapolation</option>
              <option value="moving_average">Rolling Weighted Moving Average</option>
              <option value="arima">Autoregressive Integrated Moving Average (ARIMA)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Horizon Intervals</label>
            <select
              value={horizon}
              onChange={e => setHorizon(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value={3}>3 Periods Forward</option>
              <option value={6}>6 Periods Forward</option>
              <option value={12}>12 Periods Forward</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Forecast Chart */}
      {forecast && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Projection Canvas</span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {targetMetric} Forecast: {forecast.trendDirection.toUpperCase()} Trajectory ({forecast.percentageChange > 0 ? `+${forecast.percentageChange}%` : `${forecast.percentageChange}%`})
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Historical
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Forecast
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500/20 border border-cyan-500/40"></span> 95% Confidence Band
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedChartData}>
                <defs>
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                {/* Confidence Interval Band */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="transparent"
                  fill="url(#bandGrad)"
                />
                {/* Historical Line */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                {/* Forecast Line */}
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium">Momentum Vector</span>
              <div className="text-lg font-bold text-white mt-0.5">
                {forecast.trendDirection} ({forecast.percentageChange}%)
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Net delta relative to latest historical baseline.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium">Volatility Risk Factor</span>
              <div className="text-lg font-bold text-white mt-0.5 uppercase">
                {forecast.riskFactor}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Evaluated based on standard error of residuals.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium">Active Algorithm</span>
              <div className="text-lg font-bold text-cyan-300 mt-0.5 font-mono">
                {forecast.modelUsed}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Parametric tuning computed on {forecast.historical.length} intervals.</p>
            </div>
          </div>
        </div>
      )}

      {/* Projected Points Table */}
      {forecast && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Predicted Values & Confidence Intervals
          </h3>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5 font-sans font-semibold">Horizon Period</th>
                  <th className="p-2.5">Predicted Value</th>
                  <th className="p-2.5">Lower 95% Bound</th>
                  <th className="p-2.5">Upper 95% Bound</th>
                  <th className="p-2.5">Uncertainty Spread (±)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {forecast.predictions.map(pred => (
                  <tr key={pred.period} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-sans font-semibold text-white">{pred.period}</td>
                    <td className="p-2.5 text-cyan-300 font-bold">{pred.predictedValue.toLocaleString()}</td>
                    <td className="p-2.5 text-slate-400">{pred.lowerBound.toLocaleString()}</td>
                    <td className="p-2.5 text-slate-400">{pred.upperBound.toLocaleString()}</td>
                    <td className="p-2.5 text-indigo-400">
                      ±{((pred.upperBound - pred.lowerBound) / 2).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
