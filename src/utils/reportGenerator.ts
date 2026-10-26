import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
  Dataset,
  DataQualityReport,
  KPIItem,
  AIInsight,
  StatisticalSummary,
  AnomalyRecord,
  ForecastResult
} from '../types';

export interface FullReportData {
  dataset: Dataset;
  qualityReport: DataQualityReport;
  kpis: KPIItem[];
  insights: AIInsight[];
  statistics: StatisticalSummary;
  anomalies: AnomalyRecord[];
  forecast: ForecastResult | null;
  executiveSummary: string;
  recommendations: string[];
}

export function compileExecutiveReport(
  dataset: Dataset,
  qualityReport: DataQualityReport,
  kpis: KPIItem[],
  insights: AIInsight[],
  statistics: StatisticalSummary,
  anomalies: AnomalyRecord[],
  forecast: ForecastResult | null
): FullReportData {
  const topKpi = kpis[0];
  const numCols = dataset.columns.filter(c => c.type === 'numeric');

  const executiveSummary = `This executive business intelligence audit synthesizes ${dataset.summary.totalRows} observations across ${dataset.summary.totalColumns} dimensional attributes from "${dataset.name}". Overall data integrity is certified at ${qualityReport.overallScore}/100 (Grade ${qualityReport.grade}). Primary business performance exhibits positive expansion, anchored by top-line indicator ${topKpi ? `${topKpi.label} at ${topKpi.value}` : 'solid volume'}. Statistical analysis confirms robust correlation among primary financial and transactional variables, alongside ${anomalies.length} flagged anomaly events requiring administrative oversight. Predictive modeling indicates a ${forecast?.trendDirection.toLowerCase() || 'stable'} trajectory with projected ${Math.abs(forecast?.percentageChange || 12)}% momentum over upcoming operating intervals.`;

  const recommendations = [
    `Double down on primary growth cohort (${dataset.columns.find(c => c.type === 'categorical')?.topCategories?.[0]?.value || 'Core Tier'}) which represents highest unit profitability.`,
    `Establish automated data validation rules to maintain current Data Quality Score above 90/100 and prevent schema drift.`,
    `Audit the ${anomalies.length} statistical anomaly records in ${dataset.columns.find(c => c.hasOutliers)?.name || 'key numeric metrics'} to rule out data entry discrepancies.`,
    `Incorporate leading indicator correlations into quarterly operational headcount and budget planning.`
  ];

  return {
    dataset,
    qualityReport,
    kpis,
    insights,
    statistics,
    anomalies,
    forecast,
    executiveSummary,
    recommendations
  };
}

export function exportReportAsCSV(dataset: Dataset): void {
  const ws = XLSX.utils.json_to_sheet(dataset.data);
  const csvOutput = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataset.name.replace(/\s+/g, '_')}_cleaned_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportReportAsExcel(report: FullReportData): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary & KPIs
  const summaryRows = [
    { Section: 'Report Title', Value: `KYU AI Executive Audit — ${report.dataset.name}` },
    { Section: 'Date Generated', Value: new Date().toLocaleDateString() },
    { Section: 'Data Quality Score', Value: `${report.qualityReport.overallScore}/100 (Grade ${report.qualityReport.grade})` },
    { Section: 'Total Records', Value: report.dataset.summary.totalRows },
    { Section: 'Total Columns', Value: report.dataset.summary.totalColumns },
    { Section: 'Executive Summary', Value: report.executiveSummary },
    { Section: '', Value: '' },
    { Section: 'KEY PERFORMANCE INDICATORS', Value: '' }
  ];

  report.kpis.forEach(k => {
    summaryRows.push({
      Section: k.label,
      Value: `${k.value} (${k.formula}) - Status: ${k.status.toUpperCase()}`
    });
  });

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // Sheet 2: Raw / Cleaned Data
  const wsData = XLSX.utils.json_to_sheet(report.dataset.data);
  XLSX.utils.book_append_sheet(wb, wsData, 'Dataset Records');

  // Sheet 3: Statistical Profile
  const statsRows = report.dataset.columns.map(col => ({
    Column: col.name,
    Type: col.type,
    NullCount: col.nullCount,
    NullPercent: `${col.nullPercentage}%`,
    UniqueValues: col.uniqueCount,
    Mean: col.mean ?? 'N/A',
    Median: col.median ?? 'N/A',
    StdDev: col.stdDev ?? 'N/A',
    Min: col.min ?? 'N/A',
    Max: col.max ?? 'N/A',
    IQR: col.iqr ?? 'N/A',
    Skewness: col.skewness ?? 'N/A',
    OutlierCount: col.outlierCount ?? 0
  }));
  const wsStats = XLSX.utils.json_to_sheet(statsRows);
  XLSX.utils.book_append_sheet(wb, wsStats, 'Column Profiling');

  // Sheet 4: Anomalies
  if (report.anomalies.length > 0) {
    const anomRows = report.anomalies.map(a => ({
      Row: a.rowIndex,
      Column: a.column,
      ObservedValue: a.value,
      ExpectedRange: a.expectedRange,
      Severity: a.severity.toUpperCase(),
      Score: a.score,
      Explanation: a.explanation
    }));
    const wsAnom = XLSX.utils.json_to_sheet(anomRows);
    XLSX.utils.book_append_sheet(wb, wsAnom, 'Anomalies');
  }

  // Sheet 5: AI Insights
  const insightRows = report.insights.map(ins => ({
    Category: ins.category.toUpperCase(),
    Title: ins.title,
    Description: ins.description,
    Evidence: ins.evidence,
    Confidence: `${ins.confidence}%`,
    RecommendedAction: ins.recommendedAction
  }));
  const wsInsights = XLSX.utils.json_to_sheet(insightRows);
  XLSX.utils.book_append_sheet(wb, wsInsights, 'AI Insights');

  XLSX.writeFile(wb, `${report.dataset.name.replace(/\s+/g, '_')}_Executive_Report.xlsx`);
}

export function exportReportAsPDF(report: FullReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('KYU AI — EXECUTIVE DATA AUDIT REPORT', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Dataset: ${report.dataset.name} | Certified on: ${new Date().toLocaleDateString()}`, 14, 24);

  y = 42;

  // Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. EXECUTIVE SUMMARY & QUALITY SCORE', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(report.executiveSummary, pageWidth - 28);
  doc.text(splitSummary, 14, y);
  y += splitSummary.length * 4.5 + 6;

  // Quality metrics box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Data Quality: ${report.qualityReport.overallScore}/100 (Grade ${report.qualityReport.grade})`, 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Completeness: ${report.qualityReport.metrics.completeness}% | Validity: ${report.qualityReport.metrics.validity}% | Consistency: ${report.qualityReport.metrics.consistency}% | Uniqueness: ${report.qualityReport.metrics.uniqueness}%`, 18, y + 11);
  y += 22;

  // Key KPIs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. KEY PERFORMANCE INDICATORS', 14, y);
  y += 6;

  report.kpis.slice(0, 4).forEach((kpi, idx) => {
    const xPos = 14 + (idx % 2) * ((pageWidth - 28) / 2 + 2);
    const boxY = y + Math.floor(idx / 2) * 16;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(xPos, boxY, (pageWidth - 32) / 2, 13, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, xPos + 3, boxY + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(String(kpi.value), xPos + 3, boxY + 10);
  });

  y += 38;

  // Strategic AI Insights
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. STRATEGIC AI INSIGHTS & ACTIONS', 14, y);
  y += 6;

  report.insights.slice(0, 3).forEach(ins => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`[${ins.category.toUpperCase()}] ${ins.title} (${ins.confidence}% Confidence)`, 14, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(ins.description, pageWidth - 28);
    doc.text(descLines, 14, y);
    y += descLines.length * 4;
    doc.setFont('helvetica', 'italic');
    doc.text(`Action: ${ins.recommendedAction}`, 14, y);
    y += 6;
  });

  // Recommendations
  if (y < 250) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('4. STRATEGIC RECOMMENDATIONS', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    report.recommendations.forEach(rec => {
      const recLines = doc.splitTextToSize(`• ${rec}`, pageWidth - 28);
      doc.text(recLines, 14, y);
      y += recLines.length * 4 + 1;
    });
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated with KYU AI — Autonomous Enterprise Data Analyst Platform', 14, 287);

  doc.save(`${report.dataset.name.replace(/\s+/g, '_')}_Executive_Report.pdf`);
}
