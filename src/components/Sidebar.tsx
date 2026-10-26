import {
  LayoutDashboard,
  Upload,
  Database,
  Bot,
  Sparkles,
  BarChart3,
  PieChart,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  FileText,
  History,
  Settings,
  ShieldCheck,
  Home,
  CheckCircle2,
  Building2,
  Sliders,
  BrainCircuit
} from 'lucide-react';
import { ViewMode, Dataset } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeDataset: Dataset | null;
  qualityScore: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeDataset,
  qualityScore
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'ai_studio', label: 'AI Intelligence Studio', icon: BrainCircuit, badge: 'New AI' },
    { id: 'workbench', label: 'Interactive Studio', icon: Sliders, badge: 'New UX' },
    { id: 'integrations', label: 'Enterprise Integrations', icon: Building2, badge: 'Large Scale' },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'datasets', label: 'Dataset Library', icon: Database, badge: '6 Demos' },
    { id: 'chat', label: 'AI Analyst Chat', icon: Bot, badge: 'Live AI' },
    { id: 'cleaning', label: 'Data Cleaning', icon: Sparkles },
    { id: 'statistics', label: 'Statistical Engine', icon: BarChart3 },
    { id: 'visualizations', label: 'Visualizations', icon: PieChart },
    { id: 'insights', label: 'Strategic Insights', icon: Lightbulb, badge: 'Auto' },
    { id: 'forecasting', label: 'Predictive Forecast', icon: TrendingUp },
    { id: 'anomalies', label: 'Anomaly Radar', icon: AlertTriangle },
    { id: 'reports', label: 'Executive Reports', icon: FileText },
    { id: 'history', label: 'Query & SQL Log', icon: History },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectView('landing')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
            K
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">KYU AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Data Analyst</p>
          </div>
        </div>
      </div>

      {/* Active Dataset Status Widget */}
      {activeDataset && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Active Context</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
          <div className="text-xs font-semibold text-white truncate" title={activeDataset.name}>
            {activeDataset.name}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/50 pt-1.5">
            <span>{activeDataset.summary.totalRows.toLocaleString()} rows</span>
            <span className="text-indigo-400 font-mono font-medium">Q-Score: {qualityScore}%</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="px-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Analytics Suite
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/25'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-indigo-800 text-indigo-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        <button
          onClick={() => onSelectView('landing')}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Landing Showcase</span>
        </button>
      </div>
    </aside>
  );
};
