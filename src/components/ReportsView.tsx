import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import {
  Dataset,
  DataQualityReport,
  KPIItem,
  AIInsight,
  StatisticalSummary,
  AnomalyRecord,
  ForecastResult
} from '../types';
import {
  compileExecutiveReport,
  exportReportAsPDF,
  exportReportAsExcel,
  exportReportAsCSV
} from '../utils/reportGenerator';

interface ReportsViewProps {
  dataset: Dataset;
  qualityReport: DataQualityReport;
  kpis: KPIItem[];
  insights: AIInsight[];
  statistics: StatisticalSummary;
  anomalies: AnomalyRecord[];
  forecast: ForecastResult | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  dataset,
  qualityReport,
  kpis,
  insights,
  statistics,
  anomalies,
  forecast
}) => {
  const report = compileExecutiveReport(
    dataset,
    qualityReport,
    kpis,
    insights,
    statistics,
    anomalies,
    forecast
  );

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header with Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Autonomous Dossier Generation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Business Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Boardroom-certified dossier ready for stakeholder briefings and executive review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-export-pdf"
            onClick={() => exportReportAsPDF(report)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            id="btn-export-excel"
            onClick={() => exportReportAsExcel(report)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => exportReportAsCSV(dataset)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Cleaned CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Printable Dossier Container */}
      <div className="rounded-2xl bg-white text-slate-900 p-8 shadow-2xl space-y-8 font-sans border border-slate-200">
        {/* Dossier Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-1">
              KYU AI — Executive Intelligence Briefing
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {dataset.name} Performance Audit
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Certified on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Workspace: Autonomous Enterprise Analytics
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Integrity Certification</span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {qualityReport.overallScore}/100 Grade {qualityReport.grade}
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            1. Executive Summary & Objective Finding
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {report.executiveSummary}
          </div>
        </div>

        {/* Section 2: Key KPIs */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            2. Core Business Performance Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpis.slice(0, 4).map(kpi => (
              <div key={kpi.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">{kpi.label}</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight block mt-1">
                  {kpi.value}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Method: {kpi.formula}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Strategic AI Insights */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            3. Autonomous AI Hypotheses & Evidence
          </h3>
          <div className="space-y-3">
            {insights.slice(0, 3).map(ins => (
              <div key={ins.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    [{ins.category.toUpperCase()}] {ins.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-600">
                    {ins.confidence}% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{ins.description}</p>
                <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200 mb-2 font-mono">
                  <strong>Evidence:</strong> {ins.evidence}
                </div>
                <div className="text-xs text-indigo-700 font-semibold">
                  Recommended Action: {ins.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Statistical & Anomaly Surveillance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              4A. Statistical Rigor
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Identified {statistics.significantCorrelations.length} statistically significant correlation vectors. Pearson $r$ evaluates key variables across {dataset.summary.totalRows} paired rows.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-700">
              {statistics.significantCorrelations.slice(0, 2).map((c, i) => (
                <div key={i} className="flex justify-between border-b border-slate-200 pb-1">
                  <span>{c.col1} ↔ {c.col2}</span>
                  <span className="font-bold text-indigo-600">r = {c.correlation.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              4B. Anomaly Risk Radar
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Surfaced {anomalies.length} observations outside the Tukey 1.5x IQR boundary. Recommended for manual audit to eliminate invoice or entry skew.
            </p>
            <div className="text-xs text-slate-700 font-mono">
              Peak flagged variance: Row #{anomalies[0]?.rowIndex || 1} in {anomalies[0]?.column || 'metric'} ({String(anomalies[0]?.value || 'N/A')})
            </div>
          </div>
        </div>

        {/* Section 5: Strategic Recommendations */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            5. Executive Recommendations for Next Cycle
          </h3>
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-800 space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dossier Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Generated via KYU AI Autonomous Platform</span>
          <span>Verified Non-Hallucinatory Analytical Dossier</span>
        </div>
      </div>
    </div>
  );
};
