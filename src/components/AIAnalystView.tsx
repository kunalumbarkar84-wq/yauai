import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  BrainCircuit,
  HelpCircle,
  Database,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Table as TableIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Dataset, ChatMessage, ChartConfig } from '../types';
import { processAnalystQuery } from '../utils/aiAnalyst';
import { runDatasetSQL } from '../utils/sqlEngine';

interface AIAnalystViewProps {
  dataset: Dataset;
  chatHistory: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onOpenBusinessQuestion: () => void;
}

export const AIAnalystView: React.FC<AIAnalystViewProps> = ({
  dataset,
  chatHistory,
  onAddMessage,
  onOpenBusinessQuestion
}) => {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPills = [
    'Which category generated the highest total volume?',
    'Why did performance fluctuate across recent periods?',
    'Calculate the Pearson correlation between top variables',
    'Detect statistical anomalies breaching Tukey fences',
    'Forecast metrics over the next 3 intervals'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    onAddMessage(userMsg);
    setInputText('');
    setIsThinking(true);

    try {
      const result = await processAnalystQuery(text, dataset);

      const assistantMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        sql: result.sql,
        chart: result.chart,
        data: result.data,
        groundedInDataset: true
      };

      onAddMessage(assistantMsg);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue executing analytical reasoning on the dataset: ${err.message || String(err)}. Please try rephrasing or inspect column names.`,
        timestamp: new Date().toISOString(),
        groundedInDataset: false
      };
      onAddMessage(errorMsg);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopySQL = (sql: string, id: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSQLAgain = async (sql: string) => {
    try {
      const res = await runDatasetSQL(sql, 'dataset', dataset.data);
      const assistantMsg: ChatMessage = {
        id: `msg-sql-re-${Date.now()}`,
        role: 'assistant',
        content: `**Re-Executed SQL Query Output**\n\nQuery executed across in-memory table in ${res.durationMs}ms with ${res.rows.length} records returned.`,
        timestamp: new Date().toISOString(),
        sql,
        data: res.rows,
        chart: res.chart,
        groundedInDataset: true
      };
      onAddMessage(assistantMsg);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Grounded AI Analyst Agent</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Data Context: {dataset.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Calculates real numbers on {dataset.summary.totalRows.toLocaleString()} rows. Does not hallucinate metrics.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBusinessQuestion}
          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Business Question Mode</span>
        </button>
      </div>

      {/* Suggested Query Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none shrink-0 text-[11px]">
        <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0">Suggested:</span>
        {suggestedPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 shrink-0 transition"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">KYU AI Grounded Analytical Assistant</h3>
            <p className="text-xs max-w-md text-slate-400 leading-relaxed mb-4">
              Ask any question about {dataset.name}. The engine parses columns, generates sandboxed SQL, executes statistical tests, and returns validated answers with visual charts.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestedPills.slice(0, 3).map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pill)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                >
                  &ldquo;{pill}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none space-y-3'
                }`}
              >
                {/* Content text */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* SQL Box if available */}
                {msg.sql && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-[11px]">
                    <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Validated Analytical SQL Query</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunSQLAgain(msg.sql!)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Run Query"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>Run</span>
                        </button>
                        <button
                          onClick={() => handleCopySQL(msg.sql!, msg.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="p-3 text-cyan-300 overflow-x-auto whitespace-pre">
                      {msg.sql}
                    </pre>
                  </div>
                )}

                {/* Result Data Table Snippet */}
                {msg.data && msg.data.length > 0 && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="p-2 bg-slate-900 text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Result Rows ({msg.data.length} records)</span>
                    </div>
                    <div className="overflow-x-auto max-h-44">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                          <tr>
                            {Object.keys(msg.data[0]).map(k => (
                              <th key={k} className="p-2 whitespace-nowrap">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {msg.data.slice(0, 5).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/40">
                              {Object.keys(msg.data![0]).map(k => (
                                <td key={k} className="p-2 text-slate-300 whitespace-nowrap">
                                  {String(row[k] ?? 'null')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Inline Chart */}
                {msg.chart && msg.chart.data.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] font-bold text-white mb-2">{msg.chart.title}</div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {msg.chart.chartType === 'bar' ? (
                          <BarChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Bar dataKey={msg.chart.yAxisKeys[0]} fill="#6366f1" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        ) : msg.chart.chartType === 'scatter' ? (
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                            <YAxis dataKey={msg.chart.yAxisKeys[0]} stroke="#64748b" tick={{ fontSize: 9 }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Scatter data={msg.chart.data} fill="#06b6d4" />
                          </ScatterChart>
                        ) : (
                          <AreaChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#64748b" tick={{ fontSize: 9 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Area type="monotone" dataKey={msg.chart.yAxisKeys[0]} stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {msg.groundedInDataset && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <FileCheck2 className="w-3 h-3" /> Grounded in {dataset.summary.totalRows} verified rows
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  U
                </div>
              )}
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-800/90 border border-slate-700 flex items-center gap-3 text-xs text-slate-300">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Auditing schema, compiling in-memory SQL, and calculating statistics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 shrink-0">
        <input
          type="text"
          id="ai-analyst-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask anything about "${dataset.name}" (e.g., "Top products by volume", "Correlation between profit and sales")...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          id="btn-send-analyst"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isThinking}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
        >
          <span>Analyze</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
