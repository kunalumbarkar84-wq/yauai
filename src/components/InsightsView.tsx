import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Zap,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Dataset, AIInsight } from '../types';

interface InsightsViewProps {
  dataset: Dataset;
  insights: AIInsight[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ dataset, insights }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Insights', count: insights.length },
    { id: 'trend', label: 'Trends & Cadence', count: insights.filter(i => i.category === 'trend').length },
    { id: 'anomaly', label: 'Anomalies & Variance', count: insights.filter(i => i.category === 'anomaly').length },
    { id: 'correlation', label: 'Correlations & Drivers', count: insights.filter(i => i.category === 'correlation').length },
    { id: 'opportunity', label: 'Expansion Opportunities', count: insights.filter(i => i.category === 'opportunity').length },
    { id: 'risk', label: 'Concentration Risks', count: insights.filter(i => i.category === 'risk').length }
  ];

  const filteredInsights = selectedCategory === 'all'
    ? insights
    : insights.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Strategic Decision Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Business Insights</h1>
        <p className="text-xs text-slate-400 mt-1">
          Autonomous hypotheses and strategic observations extracted from multivariate distributions in {dataset.name}.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              selectedCategory === cat.id ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map(ins => {
          const badgeStyle =
            ins.category === 'opportunity' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            ins.category === 'risk' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
            ins.category === 'anomaly' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

          const Icon =
            ins.category === 'opportunity' ? Zap :
            ins.category === 'risk' ? ShieldAlert :
            ins.category === 'anomaly' ? AlertTriangle :
            TrendingUp;

          return (
            <div
              key={ins.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${badgeStyle}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeStyle}`}>
                      {ins.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {ins.confidence}% Confidence
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{ins.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ins.description}</p>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Statistical Evidence
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">{ins.evidence}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 font-bold uppercase text-[10px] shrink-0 mt-0.5">
                  Actionable Strategy:
                </span>
                <span>{ins.recommendedAction}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
