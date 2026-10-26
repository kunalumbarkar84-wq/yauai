import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  History,
  AlertCircle,
  Database,
  Clock,
  Sparkles,
  ShieldCheck,
  Table as TableIcon
} from 'lucide-react';
import { Dataset, QueryLog } from '../types';
import { runDatasetSQL } from '../utils/sqlEngine';

interface QueryHistoryViewProps {
  dataset: Dataset;
  queryLogs: QueryLog[];
  onAddQueryLog: (log: QueryLog) => void;
}

export const QueryHistoryView: React.FC<QueryHistoryViewProps> = ({
  dataset,
  queryLogs,
  onAddQueryLog
}) => {
  const [customSQL, setCustomSQL] = useState(
    `SELECT * FROM dataset\nORDER BY 1 DESC\nLIMIT 10;`
  );
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<{
    columns: string[];
    rows: any[];
    durationMs: number;
    explanation: string;
  } | null>(null);

  const handleRunSQL = async (sqlToRun?: string) => {
    const sql = (sqlToRun || customSQL).trim();
    if (!sql) return;

    setErrorMsg(null);
    setIsRunning(true);

    try {
      const res = await runDatasetSQL(sql, 'dataset', dataset.data);
      setActiveResult({
        columns: res.columns,
        rows: res.rows,
        durationMs: res.durationMs,
        explanation: res.explanation
      });

      const newLog: QueryLog = {
        id: `q-${Date.now()}`,
        naturalLanguageQuery: 'Custom SQL Terminal Execution',
        generatedSQL: sql,
        timestamp: new Date().toISOString(),
        executionTimeMs: res.durationMs,
        rowsReturned: res.rows.length,
        status: 'success'
      };
      onAddQueryLog(newLog);
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      const failedLog: QueryLog = {
        id: `q-${Date.now()}`,
        naturalLanguageQuery: 'Custom SQL Terminal Execution',
        generatedSQL: sql,
        timestamp: new Date().toISOString(),
        executionTimeMs: 0,
        rowsReturned: 0,
        status: 'failed',
        errorMessage: err.message
      };
      onAddQueryLog(failedLog);
    } finally {
      setIsRunning(false);
    }
  };

  const sampleQueries = [
    { label: 'Top 5 Records by Metric', sql: `SELECT * FROM dataset ORDER BY 2 DESC LIMIT 5;` },
    { label: 'Count & Average by Group', sql: `SELECT 1 AS category, COUNT(*) AS count, AVG(2) AS avg_metric FROM dataset GROUP BY 1;` },
    { label: 'Outlier Filter (2.5x Mean)', sql: `SELECT * FROM dataset WHERE 2 > 100 LIMIT 10;` }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>Analytical SQL Workbench & Audit Trail</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">SQL Query Terminal</h1>
        <p className="text-xs text-slate-400 mt-1">
          Execute safe, sandboxed analytical SELECT statements against the active dataset ({dataset.name}). Mutative operations are strictly blocked.
        </p>
      </div>

      {/* Interactive SQL Editor */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Table: <code className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">dataset</code> ({dataset.summary.totalRows} rows)</span>
          </div>

          <div className="flex items-center gap-2">
            {sampleQueries.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCustomSQL(s.sql)}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={customSQL}
            onChange={e => setCustomSQL(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-cyan-300 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
            placeholder="SELECT * FROM dataset WHERE..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Read-only validation active. DDL/DML mutations blocked.</span>
          </div>

          <button
            id="btn-run-sql"
            onClick={() => handleRunSQL()}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* SQL Output Results Table */}
      {activeResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <TableIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Execution Result Table</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({activeResult.rows.length} rows in {activeResult.durationMs}ms)
              </span>
            </div>
            <span className="text-xs text-slate-400">{activeResult.explanation}</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-72">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                <tr>
                  {activeResult.columns.map(c => (
                    <th key={c} className="p-2.5 whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {activeResult.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    {activeResult.columns.map(c => (
                      <td key={c} className="p-2.5 whitespace-nowrap">
                        {row[c] !== null && row[c] !== undefined ? String(row[c]) : 'null'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Query Execution History Log */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Historical Query Execution Log</span>
        </h2>

        {queryLogs.length > 0 ? (
          <div className="space-y-2">
            {queryLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="font-mono text-cyan-300 truncate max-w-xl">
                  {log.generatedSQL}
                </div>
                <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                  <span>{log.rowsReturned} rows</span>
                  <span>{log.executionTimeMs}ms</span>
                  <button
                    onClick={() => {
                      setCustomSQL(log.generatedSQL);
                      handleRunSQL(log.generatedSQL);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Re-Run
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            No queries executed in this session yet. Run a query above to record performance metrics.
          </div>
        )}
      </div>
    </div>
  );
};
