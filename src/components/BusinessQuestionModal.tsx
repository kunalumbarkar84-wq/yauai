import React, { useState } from 'react';
import {
  Sparkles,
  X,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Zap,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { Dataset } from '../types';
import { executeBusinessQuestion } from '../utils/aiAnalyst';

interface BusinessQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset;
  onOpenChatWithQuestion: (question: string) => void;
}

export const BusinessQuestionModal: React.FC<BusinessQuestionModalProps> = ({
  isOpen,
  onClose,
  dataset,
  onOpenChatWithQuestion
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('what_happened');

  if (!isOpen) return null;

  const questions = [
    { id: 'what_happened', label: 'What happened?', desc: 'Performance retrospective & dimensional drivers', icon: TrendingUp },
    { id: 'why_did_it_happen', label: 'Why did it happen?', desc: 'Root cause analysis & variance factors', icon: HelpCircle },
    { id: 'what_is_changing', label: 'What is changing?', desc: 'Velocity shifts & emerging trends', icon: Zap },
    { id: 'what_is_unusual', label: 'What is unusual?', desc: 'Statistical anomalies & outlier alerts', icon: AlertTriangle },
    { id: 'what_should_focus_on', label: 'What should I focus on?', desc: 'Strategic priorities & leverage points', icon: Lightbulb },
    { id: 'what_could_happen_next', label: 'What could happen next?', desc: 'Predictive horizon & forward projections', icon: Sparkles },
    { id: 'where_are_opportunities', label: 'Where are opportunities?', desc: 'High-margin niches & expansion pockets', icon: CheckCircle2 },
    { id: 'where_are_risks', label: 'Where are risks?', desc: 'Concentration vulnerabilities & downside exposure', icon: ShieldAlert }
  ];

  const activeAnalysis = executeBusinessQuestion(selectedQuestionId, dataset);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Business Question Mode</h2>
              <p className="text-[11px] text-slate-400">
                8 Autonomous Executive Diagnoses Grounded in {dataset.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left column selector, Right column output */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left questions selector */}
          <div className="w-full md:w-72 border-r border-slate-800 p-3 space-y-1 overflow-y-auto bg-slate-950/40 shrink-0">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Diagnostic Inquiries
            </div>
            {questions.map(q => {
              const Icon = q.icon;
              const isSelected = selectedQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                  <div>
                    <div className="leading-tight">{q.label}</div>
                    <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {q.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right active output */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Grounded Diagnostic Evaluation
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3" /> Certified against {dataset.summary.totalRows} records
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {activeAnalysis.title}
              </h3>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 leading-relaxed">
                {activeAnalysis.answer}
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">
                  Executive Recommended Action
                </span>
                <p className="text-slate-300">{activeAnalysis.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Want deeper granular investigation?
              </span>
              <button
                onClick={() => {
                  const currentQ = questions.find(q => q.id === selectedQuestionId);
                  onClose();
                  if (currentQ) onOpenChatWithQuestion(currentQ.label);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
              >
                <span>Follow Up in AI Analyst Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
