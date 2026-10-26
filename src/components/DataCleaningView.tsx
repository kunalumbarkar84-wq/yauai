import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  History,
  Layers
} from 'lucide-react';
import { Dataset, CleaningChangeLog } from '../types';
import { cleanDataset, CleaningOptions } from '../utils/dataEngine';
import { exportReportAsCSV } from '../utils/reportGenerator';

interface DataCleaningViewProps {
  dataset: Dataset;
  onUpdateDataset: (cleanedDataset: Dataset) => void;
}

export const DataCleaningView: React.FC<DataCleaningViewProps> = ({
  dataset,
  onUpdateDataset
}) => {
  const [options, setOptions] = useState<CleaningOptions>({
    removeDuplicates: true,
    trimWhitespace: true,
    handleMissingValues: 'impute_mean_mode',
    capOutliers: false,
    standardizeTextCase: true
  });

  const [hasApplied, setHasApplied] = useState(false);
  const [cleaningLogs, setCleaningLogs] = useState<CleaningChangeLog[]>(dataset.cleaningHistory || []);

  const handleApplyCleaning = () => {
    const { cleanedDataset, logs } = cleanDataset(dataset, options);
    onUpdateDataset(cleanedDataset);
    setCleaningLogs(cleanedDataset.cleaningHistory || []);
    setHasApplied(true);
  };

  const handleDownload = () => {
    exportReportAsCSV(dataset);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Data Hygiene & Wrangle Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligent Data Cleaning</h1>
          <p className="text-xs text-slate-400 mt-1">
            Transparently detect and resolve structural defects, missing values, duplicates, and extreme outliers without silent data loss.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-apply-cleaning"
            onClick={handleApplyCleaning}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Cleaning Pipeline</span>
          </button>

          <button
            id="btn-download-cleaned"
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download Cleaned Dataset</span>
          </button>
        </div>
      </div>

      {hasApplied && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Cleaning transformations applied successfully! Dataset profile has been re-indexed.</span>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cleaning Controls */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Automated Treatment Rules
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800/80 transition">
              <input
                type="checkbox"
                checked={options.removeDuplicates}
                onChange={e => setOptions({ ...options, removeDuplicates: e.target.checked })}
                className="mt-0.5 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-white block">Deduplicate Identical Rows</span>
                <span className="text-[11px] text-slate-400">
                  Scans all columns for identical tuples and retains only the first unique occurrence. ({dataset.summary.duplicateRowsCount} duplicates detected)
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800/80 transition">
              <input
                type="checkbox"
                checked={options.trimWhitespace}
                onChange={e => setOptions({ ...options, trimWhitespace: e.target.checked })}
                className="mt-0.5 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-white block">String Hygiene & Whitespace Trimming</span>
                <span className="text-[11px] text-slate-400">
                  Strips leading/trailing spaces, collapses redundant multi-spaces, and normalizes categorical casing.
                </span>
              </div>
            </label>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <span className="text-xs font-semibold text-white block">Missing Value Treatment</span>
              <span className="text-[11px] text-slate-400 block mb-2">
                Configure strategy for null or empty values across {dataset.summary.missingCellsCount} detected missing cells.
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'impute_mean_mode', label: 'Median / Mode Imputation' },
                  { id: 'drop_rows', label: 'Drop Incomplete Rows' },
                  { id: 'none', label: 'Retain As Null' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOptions({ ...options, handleMissingValues: item.id as any })}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition text-center ${
                      options.handleMissingValues === item.id
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800/80 transition">
              <input
                type="checkbox"
                checked={options.capOutliers}
                onChange={e => setOptions({ ...options, capOutliers: e.target.checked })}
                className="mt-0.5 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-white block">Winsorize Statistical Outliers</span>
                <span className="text-[11px] text-slate-400">
                  Caps values outside Tukey fences [Q1 - 1.5*IQR, Q3 + 1.5*IQR] to boundary values to avoid skewing regressions.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Quality Score & Transparent Audit Log */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data Integrity Scorecard
              </h2>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {dataset.qualityScore}/100 Grade Certified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Completeness</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {(100 - dataset.summary.missingCellsPercentage).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-[11px] text-slate-400">Uniqueness</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {dataset.summary.totalRows > 0
                    ? ((1 - dataset.summary.duplicateRowsCount / dataset.summary.totalRows) * 100).toFixed(1)
                    : 100}%
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>Transparent Transformation Changelog</span>
            </h3>

            {cleaningLogs.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cleaningLogs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{log.operation}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{log.affectedRows} affected</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center text-xs text-slate-400">
                No cleaning rules executed yet. Toggle the options above and click &quot;Apply Cleaning Pipeline&quot;.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>KYU AI strictly preserves raw dataset backups in session memory.</span>
          </div>
        </div>
      </div>

      {/* Dataset Sample Table Preview */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Dataset Sample Preview (Top 6 Rows)
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Showing 6 of {dataset.summary.totalRows.toLocaleString()} rows
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-800">
              <tr>
                {dataset.columns.map(c => (
                  <th key={c.name} className="p-2.5 font-semibold whitespace-nowrap">
                    {c.name}
                    <span className="ml-1 text-[9px] uppercase font-mono text-slate-500">
                      ({c.type})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dataset.data.slice(0, 6).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 font-mono">
                  {dataset.columns.map(c => (
                    <td key={c.name} className="p-2.5 text-slate-300 whitespace-nowrap">
                      {row[c.name] !== null && row[c.name] !== undefined ? String(row[c.name]) : (
                        <span className="text-rose-400 italic font-sans text-[10px]">null</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
