import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileCode2,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  Layers,
  Zap,
  BarChart,
  HardDrive
} from 'lucide-react';
import { Dataset, DemoDatasetMeta } from '../types';
import { DEMO_DATASETS } from '../data/demoDatasets';
import {
  parseCSVString,
  parseExcelBuffer,
  parseJSONString,
  parseTabularText,
  profileDataset
} from '../utils/dataEngine';

interface UploadViewProps {
  onDatasetLoaded: (dataset: Dataset) => void;
  onSelectDemo: (demoId: string) => void;
  activeDataset: Dataset | null;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onDatasetLoaded,
  onSelectDemo,
  activeDataset
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setProcessingStatus('Detecting file encoding and delimiter...');

    try {
      const fileName = file.name;
      const ext = fileName.split('.').pop()?.toLowerCase();
      let records: Record<string, any>[] = [];
      let fileType = 'CSV';

      if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        fileType = 'CSV';
        setProcessingStatus('Parsing delimited records & auto-coercing data types...');
        const text = await file.text();
        records = await parseCSVString(text);
        if (records.length === 0) {
          records = parseTabularText(text);
        }
      } else if (ext === 'xlsx' || ext === 'xls') {
        fileType = 'Excel (XLSX)';
        setProcessingStatus('Extracting workbook sheets & tabular matrices...');
        const buffer = await file.arrayBuffer();
        records = parseExcelBuffer(buffer);
      } else if (ext === 'json') {
        fileType = 'JSON';
        setProcessingStatus('Validating JSON schema & unrolling record keys...');
        const text = await file.text();
        records = parseJSONString(text);
      } else if (ext === 'pdf') {
        fileType = 'PDF Document';
        setProcessingStatus('Scanning tabular text stream in PDF...');
        const text = await file.text();
        records = parseTabularText(text);
        if (records.length === 0) {
          throw new Error('Could not automatically parse structured tables from this PDF. Please convert to CSV or Excel for deep analysis.');
        }
      } else {
        throw new Error(`Unsupported file extension (.${ext}). Supported formats: CSV, XLSX, XLS, JSON, PDF.`);
      }

      if (records.length === 0) {
        throw new Error('Dataset is empty or contains no valid rows.');
      }

      setProcessingStatus('Synthesizing statistical profiles, null checks, and Tukey fences...');
      const datasetId = `ds-${Date.now()}`;
      const profiled = profileDataset(datasetId, fileName, records, fileType);

      onDatasetLoaded(profiled);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Failed to parse file. Please check formatting.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Upload className="w-3.5 h-3.5" />
          <span>Ingestion & Profiling Gateway</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Upload Business Dataset</h1>
        <p className="text-xs text-slate-400 mt-1">
          Connect your raw CSV, XLSX, XLS, JSON, or PDF data files. The autonomous engine instantly verifies headers, types, nulls, and outliers.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-2xl border-2 border-dashed cursor-pointer transition flex flex-col items-center justify-center text-center relative overflow-hidden ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/20'
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/90'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.tsv,.xlsx,.xls,.json,.pdf,.txt"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
          <Upload className="w-7 h-7 animate-bounce" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          Click or Drag & Drop Business Dataset Here
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
          Supports CSV, Microsoft Excel (XLSX, XLS), JSON arrays, and PDF tables up to 50MB. Auto-detects delimiters and data types.
        </p>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> CSV / TSV</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Excel XLSX</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FileCode2 className="w-3.5 h-3.5 text-amber-400" /> JSON</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-rose-400" /> PDF Tables</span>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-white">{processingStatus}</p>
            <span className="text-[11px] text-slate-400 mt-1">Executing 11 automated profiling checks</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Dataset Summary (if loaded) */}
      {activeDataset && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Active Dataset Profile: {activeDataset.name}
              </h3>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold font-mono">
              Quality Score: {activeDataset.qualityScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Total Rows</div>
              <div className="text-base font-bold text-white mt-0.5">{activeDataset.summary.totalRows.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Total Columns</div>
              <div className="text-base font-bold text-white mt-0.5">{activeDataset.summary.totalColumns}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Missing Cells</div>
              <div className="text-base font-bold text-slate-200 mt-0.5">{activeDataset.summary.missingCellsPercentage}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Duplicate Rows</div>
              <div className="text-base font-bold text-slate-200 mt-0.5">{activeDataset.summary.duplicateRowsCount}</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono">
              {activeDataset.summary.numericColumnsCount} Numeric Columns
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
              {activeDataset.summary.categoricalColumnsCount} Categorical Columns
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
              {activeDataset.summary.dateColumnsCount} Date / Time Columns
            </span>
          </div>
        </div>
      )}

      {/* 6 DEMO DATASETS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Pre-Loaded Realistic Demo Datasets</h2>
            <p className="text-xs text-slate-400">Click any demo dataset to immediately test the AI analyst and statistical engines.</p>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
            6 Industry Domains
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_DATASETS.map(demo => (
            <div
              key={demo.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {demo.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {demo.rows} rows × {demo.columns} cols
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{demo.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {demo.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {demo.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                id={`btn-load-${demo.id}`}
                onClick={() => onSelectDemo(demo.id)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Load {demo.name.split(' ')[0]} Demo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
