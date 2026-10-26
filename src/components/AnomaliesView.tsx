import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  Filter,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Dataset, AnomalyRecord } from '../types';

interface AnomaliesViewProps {
  dataset: Dataset;
  anomalies: AnomalyRecord[];
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({ dataset, anomalies }) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = anomalies.filter(a => {
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchesSearch =
      a.column.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Multivariate Outlier & Risk Surveillance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Anomaly Detection Radar</h1>
        <p className="text-xs text-slate-400 mt-1">
          Surfaces irregular transactional records, sensor blips, and numerical spikes breaching standard Tukey fences and Z-score boundaries.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Severity:</span>
          {(['all', 'high', 'medium', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition border ${
                severityFilter === sev
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search column or cause..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Anomaly Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Flagged Outlier Records ({filtered.length} of {anomalies.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Tukey 1.5x IQR & Z-Score &gt; 2.5
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-3 font-sans">Row #</th>
                  <th className="p-3 font-sans">Dimension</th>
                  <th className="p-3">Observed Value</th>
                  <th className="p-3">Expected Tukey Range</th>
                  <th className="p-3">Z-Score</th>
                  <th className="p-3 font-sans">Severity</th>
                  <th className="p-3 font-sans">Statistical Root Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">#{a.rowIndex}</td>
                    <td className="p-3 font-sans font-semibold text-white">{a.column}</td>
                    <td className="p-3 text-amber-300 font-bold">{String(a.value)}</td>
                    <td className="p-3 text-slate-400">{a.expectedRange}</td>
                    <td className="p-3 text-indigo-400">Z = {a.score.toFixed(1)}</td>
                    <td className="p-3 font-sans">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        a.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        a.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-300 text-xs">{a.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">No Anomalies Found</h3>
            <p className="text-xs text-slate-400">All data values conform strictly to expected statistical boundaries.</p>
          </div>
        )}
      </div>
    </div>
  );
};
