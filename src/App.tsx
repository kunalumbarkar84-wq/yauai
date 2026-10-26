import React, { useState, useMemo, useEffect } from 'react';
import {
  ViewMode,
  Dataset,
  ChatMessage,
  QueryLog,
  KPIItem,
  AIInsight,
  ChartConfig,
  StatisticalSummary,
  AnomalyRecord,
  ForecastResult
} from './types';
import { DEMO_DATASETS, loadDemoDataset } from './data/demoDatasets';
import {
  profileDataset,
  calculateDataQualityReport,
  inferDatasetKPIs,
  generateAutonomousInsights,
  generateAutoVisualizations,
  computeStatisticalSummary,
  detectDatasetAnomalies,
  generateTimeSeriesForecast
} from './utils/dataEngine';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { DataCleaningView } from './components/DataCleaningView';
import { StatisticsView } from './components/StatisticsView';
import { VisualizationsView } from './components/VisualizationsView';
import { AIAnalystView } from './components/AIAnalystView';
import { InsightsView } from './components/InsightsView';
import { ForecastingView } from './components/ForecastingView';
import { AnomaliesView } from './components/AnomaliesView';
import { ReportsView } from './components/ReportsView';
import { QueryHistoryView } from './components/QueryHistoryView';
import { SettingsView } from './components/SettingsView';
import { BusinessQuestionModal } from './components/BusinessQuestionModal';
import { EnterpriseIntegrationsView } from './components/EnterpriseIntegrationsView';
import { InteractiveWorkbenchView } from './components/InteractiveWorkbenchView';
import { AIAssistantStudioView } from './components/AIAssistantStudioView';

export const App: React.FC = () => {
  // Initialize initial demo dataset (E-commerce)
  const initialProfiledDemo = useMemo(() => {
    const rawDemo = loadDemoDataset('demo-ecommerce');
    return profileDataset('demo-ecommerce', rawDemo.name, rawDemo.data, 'Demo CSV');
  }, []);

  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeDataset, setActiveDataset] = useState<Dataset>(initialProfiledDemo);
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([initialProfiledDemo]);

  // Analytical engines state
  const qualityReport = useMemo(() => calculateDataQualityReport(activeDataset), [activeDataset]);
  const kpis = useMemo(() => inferDatasetKPIs(activeDataset), [activeDataset]);
  const insights = useMemo(() => generateAutonomousInsights(activeDataset), [activeDataset]);
  const charts = useMemo(() => generateAutoVisualizations(activeDataset), [activeDataset]);
  const statistics = useMemo(() => computeStatisticalSummary(activeDataset), [activeDataset]);
  const anomalies = useMemo(() => detectDatasetAnomalies(activeDataset), [activeDataset]);
  const forecast = useMemo(() => generateTimeSeriesForecast(activeDataset), [activeDataset]);

  // Chat and Query histories
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  // Switch demo dataset
  const handleSelectDemo = (demoId: string) => {
    const existing = allDatasets.find(d => d.id === demoId);
    if (existing) {
      setActiveDataset(existing);
    } else {
      const demoRaw = loadDemoDataset(demoId);
      const profiled = profileDataset(demoId, demoRaw.name, demoRaw.data, 'Demo CSV');
      setAllDatasets(prev => [...prev, profiled]);
      setActiveDataset(profiled);
    }
    setCurrentView('dashboard');
  };

  // Upload custom dataset
  const handleDatasetLoaded = (newDataset: Dataset) => {
    setAllDatasets(prev => [newDataset, ...prev.filter(d => d.id !== newDataset.id)]);
    setActiveDataset(newDataset);
    setCurrentView('dashboard');
  };

  // Dataset cleaned update
  const handleUpdateDataset = (cleaned: Dataset) => {
    setActiveDataset(cleaned);
    setAllDatasets(prev => prev.map(d => d.id === cleaned.id ? cleaned : d));
  };

  // Select dataset from dropdown
  const handleSelectDatasetById = (id: string) => {
    const found = allDatasets.find(d => d.id === id);
    if (found) {
      setActiveDataset(found);
    }
  };

  // Chat message management
  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  };

  // Query log management
  const handleAddQueryLog = (log: QueryLog) => {
    setQueryLogs(prev => [log, ...prev]);
  };

  // Open chat with predefined question
  const handleOpenChatWithQuestion = (question: string) => {
    setCurrentView('chat');
    // Pre-insert user message and trigger response
    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMsg]);
  };

  // Reset Session
  const handleResetSession = () => {
    const freshDemo = loadDemoDataset('demo-ecommerce');
    const profiled = profileDataset('demo-ecommerce', freshDemo.name, freshDemo.data, 'Demo CSV');
    setActiveDataset(profiled);
    setAllDatasets([profiled]);
    setChatHistory([]);
    setQueryLogs([]);
    setCurrentView('dashboard');
  };

  // If on landing view, render full landing showcase
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterApp={(targetView?: ViewMode) => setCurrentView(targetView || 'dashboard')}
        onLoadDemo={handleSelectDemo}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeDataset={activeDataset}
        qualityScore={qualityReport.overallScore}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeDataset={activeDataset}
          allDatasets={allDatasets}
          onSelectDataset={handleSelectDatasetById}
          onOpenBusinessQuestion={() => setIsBusinessModalOpen(true)}
          onSearch={(term) => {
            if (term.toLowerCase().includes('sql') || term.toLowerCase().includes('select')) {
              setCurrentView('history');
            } else if (term.toLowerCase().includes('chart') || term.toLowerCase().includes('graph')) {
              setCurrentView('visualizations');
            } else if (term.toLowerCase().includes('clean')) {
              setCurrentView('cleaning');
            }
          }}
          qualityScore={qualityReport.overallScore}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          {currentView === 'dashboard' && (
            <DashboardView
              dataset={activeDataset}
              kpis={kpis}
              insights={insights}
              charts={charts}
              anomalies={anomalies}
              onNavigate={setCurrentView}
              onOpenBusinessQuestion={() => setIsBusinessModalOpen(true)}
            />
          )}

          {currentView === 'upload' && (
            <UploadView
              onDatasetLoaded={handleDatasetLoaded}
              onSelectDemo={handleSelectDemo}
              activeDataset={activeDataset}
            />
          )}

          {currentView === 'datasets' && (
            <UploadView
              onDatasetLoaded={handleDatasetLoaded}
              onSelectDemo={handleSelectDemo}
              activeDataset={activeDataset}
            />
          )}

          {currentView === 'chat' && (
            <AIAnalystView
              dataset={activeDataset}
              chatHistory={chatHistory}
              onAddMessage={handleAddChatMessage}
              onOpenBusinessQuestion={() => setIsBusinessModalOpen(true)}
            />
          )}

          {currentView === 'ai_studio' && (
            <AIAssistantStudioView
              dataset={activeDataset}
              onNavigate={setCurrentView}
              onAugmentDataset={(newRows) => {
                const combinedData = [...activeDataset.data, ...newRows];
                const reProfiled = profileDataset(
                  activeDataset.id,
                  `${activeDataset.name} (Augmented)`,
                  combinedData,
                  activeDataset.fileType
                );
                handleUpdateDataset(reProfiled);
              }}
            />
          )}

          {currentView === 'cleaning' && (
            <DataCleaningView
              dataset={activeDataset}
              onUpdateDataset={handleUpdateDataset}
            />
          )}

          {currentView === 'statistics' && (
            <StatisticsView
              dataset={activeDataset}
              statistics={statistics}
            />
          )}

          {currentView === 'visualizations' && (
            <VisualizationsView
              dataset={activeDataset}
              initialCharts={charts}
            />
          )}

          {currentView === 'insights' && (
            <InsightsView
              dataset={activeDataset}
              insights={insights}
            />
          )}

          {currentView === 'forecasting' && (
            <ForecastingView
              dataset={activeDataset}
              initialForecast={forecast}
            />
          )}

          {currentView === 'anomalies' && (
            <AnomaliesView
              dataset={activeDataset}
              anomalies={anomalies}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              dataset={activeDataset}
              qualityReport={qualityReport}
              kpis={kpis}
              insights={insights}
              statistics={statistics}
              anomalies={anomalies}
              forecast={forecast}
            />
          )}

          {currentView === 'history' && (
            <QueryHistoryView
              dataset={activeDataset}
              queryLogs={queryLogs}
              onAddQueryLog={handleAddQueryLog}
            />
          )}

          {currentView === 'workbench' && (
            <InteractiveWorkbenchView
              dataset={activeDataset}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'integrations' && (
            <EnterpriseIntegrationsView
              activeDataset={activeDataset}
              onLoadDatasetFromWarehouse={handleDatasetLoaded}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              dataset={activeDataset}
              onResetSession={handleResetSession}
            />
          )}
        </main>
      </div>

      {/* Business Question Mode Modal */}
      <BusinessQuestionModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        dataset={activeDataset}
        onOpenChatWithQuestion={handleOpenChatWithQuestion}
      />
    </div>
  );
};

export default App;

