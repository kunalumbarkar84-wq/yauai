export type DataType = 'numeric' | 'categorical' | 'date' | 'boolean' | 'text';

export interface ColumnProfile {
  name: string;
  type: DataType;
  sampleValues: (string | number | boolean | null)[];
  totalCount: number;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;
  // Numeric metrics
  mean?: number;
  median?: number;
  mode?: number | string;
  min?: number;
  max?: number;
  range?: number;
  variance?: number;
  stdDev?: number;
  q1?: number;
  q3?: number;
  iqr?: number;
  skewness?: number;
  kurtosis?: number;
  // Categorical metrics
  topCategories?: { value: string; count: number; percentage: number }[];
  // Quality
  hasOutliers?: boolean;
  outlierCount?: number;
}

export interface DatasetSummary {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  fileSizeFormatted: string;
  fileType: string;
  createdAt: string;
  qualityScore: number;
  columns: ColumnProfile[];
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileType: string;
  fileSizeFormatted: string;
  uploadedAt: string;
  qualityScore: number;
  data: Record<string, any>[];
  columns: ColumnProfile[];
  summary: {
    totalRows: number;
    totalColumns: number;
    memoryUsageKB: number;
    missingCellsCount: number;
    missingCellsPercentage: number;
    duplicateRowsCount: number;
    numericColumnsCount: number;
    categoricalColumnsCount: number;
    dateColumnsCount: number;
  };
  cleaningHistory?: CleaningChangeLog[];
}

export interface CleaningChangeLog {
  id: string;
  timestamp: string;
  operation: string;
  column?: string;
  details: string;
  affectedRows: number;
  beforeSample?: any;
  afterSample?: any;
}

export interface DataQualityReport {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: {
    completeness: number; // 0 - 100
    validity: number;     // 0 - 100
    consistency: number;  // 0 - 100
    uniqueness: number;   // 0 - 100
    accuracy: number;     // 0 - 100
  };
  reasons: {
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    impact: string;
  }[];
}

export interface StatisticalSummary {
  correlations: {
    col1: string;
    col2: string;
    pearson: number;
    spearman: number;
    relationship: 'strong_positive' | 'moderate_positive' | 'weak' | 'moderate_negative' | 'strong_negative';
    explanation: string;
  }[];
  significantCorrelations: {
    col1: string;
    col2: string;
    correlation: number;
    strength: string;
    direction: string;
  }[];
  linearRegression?: {
    xCol: string;
    yCol: string;
    slope: number;
    intercept: number;
    r2: number;
    pValue: number;
    formula: string;
    explanation: string;
  };
  hypothesisTests: {
    testName: string;
    testType: 't-test' | 'chi-square' | 'anova';
    variable1: string;
    variable2?: string;
    statistic: number;
    pValue: number;
    significant: boolean;
    explanation: string;
  }[];
  confidenceIntervals: {
    column: string;
    mean: number;
    confidenceLevel: number;
    lower: number;
    upper: number;
    marginOfError: number;
  }[];
}

export interface AnomalyRecord {
  id: string;
  rowIndex: number;
  column: string;
  value: any;
  expectedRange: string;
  severity: 'low' | 'medium' | 'high';
  method: 'IQR' | 'Z-Score' | 'Isolation Forest';
  score: number;
  explanation: string;
  rowData: Record<string, any>;
}

export interface ForecastPoint {
  period?: string;
  date?: string;
  actual?: number;
  value?: number;
  predictedValue?: number;
  forecast?: number;
  lowerBound?: number;
  upperBound?: number;
  lowerConfidence?: number;
  upperConfidence?: number;
}

export interface ForecastResult {
  metric: string;
  dateColumn?: string;
  metricColumn?: string;
  method: string;
  modelUsed: string;
  trendDirection: string;
  percentageChange: number;
  confidenceScore?: number;
  riskFactor: string;
  summary: string;
  historical: { period: string; value: number }[];
  predictions: { period: string; predictedValue: number; lowerBound: number; upperBound: number }[];
  points?: ForecastPoint[];
}

export interface InsightCategory {
  id: string;
  label: string;
}

export interface AIInsight {
  id: string;
  category: 'trend' | 'anomaly' | 'correlation' | 'opportunity' | 'risk';
  title: string;
  description: string;
  evidence: string;
  relevantColumns: string[];
  calculationMetric?: string;
  confidence: number; // 0 - 100
  recommendedAction: string;
  whyThisInsight: string;
}

export interface KPIItem {
  id: string;
  label: string;
  value: string | number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  category: string;
  formula: string;
  description: string;
  status: 'good' | 'neutral' | 'warning';
}

export interface ChartConfig {
  id: string;
  title: string;
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'histogram' | 'heatmap';
  xAxisKey: string;
  yAxisKeys: string[];
  data: any[];
  explanation: string;
  whySelected: string;
  keyObservation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sql?: string;
  data?: Record<string, any>[];
  chart?: ChartConfig;
  groundedInDataset?: boolean;
  evidenceCitations?: string[];
}

export interface QueryLog {
  id: string;
  naturalLanguageQuery?: string;
  generatedSQL: string;
  timestamp: string;
  executionTimeMs: number;
  rowsReturned: number;
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface DemoDatasetMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  rows: number;
  columns: number;
  tags: string[];
}

export interface SQLQueryRecord {
  id: string;
  sql: string;
  timestamp: string;
  rowCount: number;
  durationMs: number;
  status: 'success' | 'blocked' | 'error';
  explanation: string;
}

export interface EnterpriseConnectorInfo {
  id: string;
  name: string;
  category: 'data_warehouse' | 'lakehouse' | 'database' | 'saas_crm' | 'event_stream';
  icon: string;
  status: 'connected' | 'configured' | 'available' | 'syncing';
  defaultPort: number;
  supportsCDC: boolean;
  encryption: string;
  description: string;
  syncFrequency: string;
  lastSync?: string;
  tablesAvailable?: number;
  recordsSynced?: number;
  latencyMs?: number;
}

export interface EnterpriseAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  status: string;
  ipAddress: string;
  complianceCheck: string;
}

export interface AIStudioAnalysisResult {
  executiveDossier?: {
    headline: string;
    strategicSummary: string;
    confidenceScore: number;
    kpiCards: { label: string; value: string; trend: 'up' | 'down' | 'neutral'; delta: string; interpretation: string }[];
    coreTakeaways: string[];
    boardroomRecommendations: string[];
  };
  rootCauses?: {
    factor: string;
    correlationScore: number;
    impactMagnitude: 'high' | 'medium' | 'low';
    mechanism: string;
    countermeasure: string;
  }[];
  cohorts?: {
    cohortName: string;
    size: number;
    shareOfTotal: string;
    primaryTrait: string;
    averageValue: number;
    actionableInsight: string;
  }[];
  syntheticData?: Record<string, any>[];
}

export type ViewMode =
  | 'dashboard'
  | 'upload'
  | 'datasets'
  | 'chat'
  | 'ai_studio'
  | 'cleaning'
  | 'statistics'
  | 'visualizations'
  | 'insights'
  | 'forecasting'
  | 'anomalies'
  | 'reports'
  | 'history'
  | 'workbench'
  | 'integrations'
  | 'settings'
  | 'landing';

