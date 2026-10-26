import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Database,
  Cpu,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  X
} from 'lucide-react';
import { Dataset } from '../types';

interface NavbarProps {
  activeDataset: Dataset | null;
  allDatasets: Dataset[];
  onSelectDataset: (id: string) => void;
  onOpenBusinessQuestion: () => void;
  onSearch: (term: string) => void;
  qualityScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeDataset,
  allDatasets,
  onSelectDataset,
  onOpenBusinessQuestion,
  onSearch,
  qualityScore
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatasetDropdown, setShowDatasetDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const notifications = [
    {
      id: '1',
      title: 'Profiling Certified',
      description: `${activeDataset?.summary.totalRows || 0} observations ingested and categorized.`,
      time: 'Just now',
      type: 'success'
    },
    {
      id: '2',
      title: 'Data Quality Certified',
      description: `Integrity index computed at ${qualityScore}/100. Ready for regression & SQL.`,
      time: '2m ago',
      type: 'info'
    },
    {
      id: '3',
      title: 'Anomaly Radar Active',
      description: 'IQR and Z-score models configured on numeric distributions.',
      time: '5m ago',
      type: 'warning'
    }
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-5 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-1/3">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="global-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search columns, queries, metrics or insights..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3">
        {/* Business Question Mode Quick Action */}
        <button
          id="btn-business-questions"
          onClick={onOpenBusinessQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ask Business Question</span>
        </button>

        {/* Dataset Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-dataset-selector"
            onClick={() => setShowDatasetDropdown(!showDatasetDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white transition"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[160px] truncate font-medium">
              {activeDataset ? activeDataset.name : 'Select Dataset'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDatasetDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-700">
                Active & Demo Datasets
              </div>
              {allDatasets.map(ds => (
                <button
                  key={ds.id}
                  onClick={() => {
                    onSelectDataset(ds.id);
                    setShowDatasetDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/60 ${
                    activeDataset?.id === ds.id ? 'bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span className="truncate">{ds.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">
                    {ds.summary.totalRows} rows
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quality Score Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">Quality:</span>
          <span className="text-emerald-400 font-mono font-bold">{qualityScore}/100</span>
        </div>

        {/* AI Engine Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline text-slate-400">Model:</span>
          <span className="font-semibold text-slate-200">Gemini 3.8 Flash</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition relative"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                <span className="text-xs font-semibold text-white">System Events & Alerts</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow">
            KA
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Lead Analyst</div>
            <div className="text-[10px] text-slate-400">Enterprise Workspace</div>
          </div>
        </div>
      </div>
    </header>
  );
};
