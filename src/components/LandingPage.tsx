import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Database,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileCode2,
  TrendingUp,
  ChevronDown,
  Layers,
  Lock,
  Server,
  Building2,
  Sliders,
  Bot
} from 'lucide-react';
import { ViewMode } from '../types';

interface LandingPageProps {
  onEnterApp: (targetView?: ViewMode) => void;
  onLoadDemo: (demoId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onLoadDemo }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const supportedFormats = [
    { name: 'CSV / TSV', desc: 'Comma & tab separated flat files with auto-delimiters', icon: FileSpreadsheet, ext: '.csv, .tsv' },
    { name: 'Excel Sheets', desc: 'Microsoft Excel multi-tab workbooks (XLSX, XLS)', icon: FileSpreadsheet, ext: '.xlsx, .xls' },
    { name: 'JSON Records', desc: 'Hierarchical object arrays and API response dumps', icon: FileCode2, ext: '.json' },
    { name: 'PDF & Reports', desc: 'Tabular document tables and financial balance extracts', icon: FileText, ext: '.pdf, .txt' }
  ];

  const features = [
    {
      title: 'Automated Data Profiling & Hygiene',
      desc: 'Instant detection of missing nulls, duplicate records, skewness, kurtosis, and Tukey outlier boundaries.',
      icon: Database
    },
    {
      title: 'Statistical Reasoning Engine',
      desc: 'One-click Pearson correlations, two-sample t-tests, One-Way ANOVA, and bivariate linear regression models.',
      icon: BarChart3
    },
    {
      title: 'Grounded Natural Language Chat',
      desc: 'Ask complex analytical questions. KYU AI calculates actual numbers on your data instead of generic hallucination.',
      icon: BrainCircuit
    },
    {
      title: 'Secure Read-Only Text-to-SQL',
      desc: 'Converts intent into safe analytical SQL queries with complete sandboxing and execution verification.',
      icon: Zap
    },
    {
      title: 'Predictive Time-Series Forecasts',
      desc: 'Automatic cadence identification with Holt-Winters Exponential Smoothing, moving averages, and 95% confidence bands.',
      icon: TrendingUp
    },
    {
      title: 'Large-Scale Enterprise Integrations',
      desc: 'Seamlessly link Snowflake, Google BigQuery, AWS Redshift, PostgreSQL, and Databricks with automated CDC and zero-leak TLS 1.3 encryption.',
      icon: Building2
    },
    {
      title: 'Interactive Studio & What-If Simulator',
      desc: 'Dynamic multidimensional pivot tables, parametric business levers (price elasticity, retention, marketing spend), and real-time data lineage DAG.',
      icon: Sliders
    },
    {
      title: 'C-Suite Executive Reports',
      desc: 'Compiles full boardroom-ready dossiers with executive summaries, KPI audits, and export to PDF, Excel, and CSV.',
      icon: FileText
    }
  ];

  const faqs = [
    {
      q: 'Does KYU AI hallucinate answers or fabricate metrics?',
      a: 'Never. KYU AI executes real mathematical aggregation routines (means, sums, regressions, ANOVA, and SQL queries) on your actual uploaded dataset before formulating answers. Every AI insight comes with grounded calculation evidence.'
    },
    {
      q: 'What file formats can I upload?',
      a: 'KYU AI supports CSV, TSV, Microsoft Excel (.xlsx and .xls), structured JSON, and plain text/PDF tabular documents up to 50MB per session.'
    },
    {
      q: 'Is my enterprise data private and secure?',
      a: 'Yes. All analytical computations occur in sandboxed memory. SQL execution enforces strict read-only validation preventing any data alteration, and API keys are never exposed on client code.'
    },
    {
      q: 'Can I customize or download the cleaned dataset?',
      a: 'Absolutely. Every deduplication, imputation, and outlier capping transformation is recorded in a transparent changelog, and you can download the clean dataset with one click.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            K
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">KYU AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#supported-files" className="hover:text-white transition">Supported Data</a>
          <a href="#security" className="hover:text-white transition">Security</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterApp('upload')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            Sign In
          </button>
          <button
            id="btn-nav-get-started"
            onClick={() => onEnterApp('dashboard')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Autonomous AI Data Analyst</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Your AI-Powered <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">
            Data Analyst
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Upload your data. Ask questions. Discover insights. Make better decisions.
          KYU AI automatically profiles, cleans, reasons, and builds executive-grade intelligence dossiers in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
          <button
            id="btn-hero-upload"
            onClick={() => onEnterApp('upload')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Dataset</span>
          </button>

          <button
            id="btn-hero-try-demo"
            onClick={() => onLoadDemo('demo-ecommerce')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Try AI Analyst</span>
          </button>

          <button
            onClick={() => onEnterApp('ai_studio')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>AI Intelligence Studio</span>
          </button>

          <button
            onClick={() => onEnterApp('workbench')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Interactive Studio</span>
          </button>

          <button
            onClick={() => onEnterApp('integrations')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Enterprise Warehouses</span>
          </button>
        </div>

        {/* Live Interactive Dashboard Preview Snapshot */}
        <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/80 shadow-2xl overflow-hidden">
          <div className="rounded-xl bg-slate-950 p-5 text-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-400">KYU AI Engine — Live Context: Global E-commerce Sales</span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                Data Quality 94/100 (Grade A)
              </span>
            </div>

            {/* Micro bento grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Total Gross Revenue</div>
                <div className="text-xl font-bold text-white mt-1">$194.2k</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +14.2% vs target
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Net Profit Margin</div>
                <div className="text-xl font-bold text-white mt-1">$48.9k (25.1%)</div>
                <div className="text-[10px] text-emerald-400 mt-1">+18.5% YoY</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Observations Audited</div>
                <div className="text-xl font-bold text-white mt-1">50 Records</div>
                <div className="text-[10px] text-slate-400 mt-1">0 missing nulls</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Statistical Anomalies</div>
                <div className="text-xl font-bold text-amber-400 mt-1">2 Flagged</div>
                <div className="text-[10px] text-amber-400/80 mt-1">Tukey 1.5x IQR test</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">AI Strategy Finding:</strong> Enterprise Cloud Servers drive 48% of total margin with strong positive correlation ($r = 0.84$) to long-term contract lengths.
                </span>
              </div>
              <button
                onClick={() => onLoadDemo('demo-ecommerce')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 ml-4 shrink-0 text-xs"
              >
                Inspect Live Analysis →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Autonomous Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How KYU AI Operates</h2>
            <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
              From raw messy files to boardroom-ready intelligence in four frictionless phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload & Parse', desc: 'Drag-and-drop CSV, Excel, JSON or PDF. Auto-detects encoding, delimiters, headers, and column data types.' },
              { step: '02', title: 'Profile & Clean', desc: 'Computes variance, skewness, missing ratios, and deduplication with an auditable transformation changelog.' },
              { step: '03', title: 'Reason & Calculate', desc: 'Performs hypothesis tests (ANOVA, t-test), correlations, ARIMA forecasting, and secure text-to-SQL.' },
              { step: '04', title: 'Executive Report', desc: 'Exports customized dashboards and PDF, Excel, or CSV briefing dossiers with actionable business recommendations.' }
            ].map(item => (
              <div key={item.step} className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 relative">
                <span className="text-2xl font-black text-indigo-500/40 font-mono">{item.step}</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Files Section */}
      <section id="supported-files" className="py-20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Data Compatibility</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Supported Data Formats</h2>
            <p className="text-slate-400 text-sm mt-1">Connect your existing operational data without pre-formatting.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedFormats.map(fmt => {
              const Icon = fmt.icon;
              return (
                <div key={fmt.name} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{fmt.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">{fmt.ext}</span>
                  <p className="text-xs text-slate-400 leading-normal">{fmt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Enterprise Capabilities</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Everything Human Analysts Do, Automated</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Grade Data Governance</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Bank-Grade Isolation & Zero Data Leakage</h3>
              <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed">
                All uploaded datasets remain sandboxed in strict session partitions. SQL engines enforce read-only execution blocking harmful operations, and LLM providers receive strictly sanitized statistical aggregates.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('dashboard')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shrink-0 shadow transition"
            >
              Verify System Architecture
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-slate-800/80 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Transparent Plans</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Built for Teams of Every Scale</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white">Free / Academic</h3>
              <div className="text-2xl font-bold text-white mt-2 mb-4">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              <p className="text-xs text-slate-400 mb-6">Ideal for students and individual researchers analyzing flat files.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full Profiling & Cleaning</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Grounded AI Chat Assistant</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 6 Realistic Demo Datasets</li>
              </ul>
              <button onClick={() => onEnterApp('dashboard')} className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition">
                Start Free
              </button>
            </div>

            <div className="p-6 rounded-xl bg-indigo-950/40 border-2 border-indigo-500 shadow-xl relative">
              <span className="absolute -top-2.5 right-4 bg-indigo-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                Most Popular
              </span>
              <h3 className="text-base font-bold text-white">Professional Analyst</h3>
              <div className="text-2xl font-bold text-white mt-2 mb-4">$49 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mb-6">For fast-moving startups and product managers demanding executive answers.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Unlimited CSV, Excel & JSON Uploads</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Safe Text-to-SQL Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> PDF & Excel Report Exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Time Series Forecasting & ARIMA</li>
              </ul>
              <button onClick={() => onEnterApp('dashboard')} className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow transition">
                Launch Pro Experience
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white">Enterprise Scale</h3>
              <div className="text-2xl font-bold text-white mt-2 mb-4">$199 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mb-6">Custom cloud security, warehouse connectors, and multi-user RBAC.</p>
              <ul className="text-xs space-y-2.5 text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Custom Warehouse Integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Gemini Enterprise Tier</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenant Role Isolation</li>
              </ul>
              <button onClick={() => onEnterApp('dashboard')} className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition">
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Common Questions</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-xs">K</div>
            <span className="font-bold text-slate-300">KYU AI Platform</span>
            <span>— Autonomous Enterprise Data Analyst</span>
          </div>
          <div>© {new Date().getFullYear()} KYU AI. Built for analytical rigor, grounded intelligence, and decision clarity.</div>
        </div>
      </footer>
    </div>
  );
};
