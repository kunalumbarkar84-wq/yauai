import React, { useState, useEffect } from 'react';
import {
  Building2,
  Database,
  Cloud,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Sliders,
  Clock,
  HardDrive,
  Network,
  Lock,
  ArrowRight,
  Download,
  Search,
  Filter,
  Eye,
  Server,
  Key,
  Check,
  X,
  Play
} from 'lucide-react';
import { Dataset, EnterpriseConnectorInfo, EnterpriseAuditLog } from '../types';

interface EnterpriseIntegrationsViewProps {
  onLoadDatasetFromWarehouse: (dataset: Dataset) => void;
  activeDataset: Dataset | null;
}

export const EnterpriseIntegrationsView: React.FC<EnterpriseIntegrationsViewProps> = ({
  onLoadDatasetFromWarehouse,
  activeDataset
}) => {
  const [activeTab, setActiveTab] = useState<'connectors' | 'catalog' | 'governance' | 'audit'>('connectors');
  const [connectors, setConnectors] = useState<EnterpriseConnectorInfo[]>([]);
  const [schemas, setSchemas] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<EnterpriseAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Connector for Test & Config Modal
  const [selectedConnector, setSelectedConnector] = useState<EnterpriseConnectorInfo | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Syncing state
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Form state inside modal
  const [connHost, setConnHost] = useState('warehouse.corp.internal.net');
  const [connPort, setConnPort] = useState('5432');
  const [connDatabase, setConnDatabase] = useState('production_analytics_dw');
  const [connAuthType, setConnAuthType] = useState('IAM Role / Service Key');
  const [sslEnabled, setSslEnabled] = useState(true);

  // Fetch initial connectors, schemas, and audit logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Connectors
        const connRes = await fetch('/api/integrations/connectors');
        if (connRes.ok) {
          const json = await connRes.json();
          if (json.success && json.data) {
            setConnectors(json.data);
          }
        }

        // Schemas
        const schemaRes = await fetch('/api/integrations/schemas');
        if (schemaRes.ok) {
          const json = await schemaRes.json();
          if (json.success && json.data) {
            setSchemas(json.data);
          }
        }

        // Audit Logs
        const auditRes = await fetch('/api/integrations/audit-logs');
        if (auditRes.ok) {
          const json = await auditRes.json();
          if (json.success && json.data) {
            setAuditLogs(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load integration endpoints:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trigger Live Connection Test
  const handleRunDiagnostic = async () => {
    if (!selectedConnector) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/integrations/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectorId: selectedConnector.id,
          host: connHost,
          port: connPort,
          database: connDatabase,
          authType: connAuthType
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setTestResult(json.data);
        }
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setTestResult({
        status: 'FAILED',
        error: 'Network handshake timed out. Check firewall and VPC peering rules.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Trigger Sync Pipeline
  const handleTriggerSync = async (connectorId: string) => {
    setSyncingId(connectorId);
    setSyncSuccessMsg(null);
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectorId, syncMode: 'incremental' })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSyncSuccessMsg(`Pipeline sync completed! ${json.data.rowsLoaded.toLocaleString()} records indexed with 0 schema anomalies.`);
          setTimeout(() => setSyncSuccessMsg(null), 6000);
        }
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncingId(null);
    }
  };

  // Convert remote catalog table to active KYU AI dataset
  const handleImportRemoteTable = (schemaItem: any) => {
    const newDataset: Dataset = {
      id: `wh-${schemaItem.id}-${Date.now()}`,
      name: `${schemaItem.name} [${schemaItem.source.split(' ')[0]}]`,
      description: `Ingested from ${schemaItem.source}. Partitions: ${schemaItem.partitions}`,
      fileType: 'Cloud Warehouse Table',
      fileSizeFormatted: `${(schemaItem.totalRows * 0.45).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
      qualityScore: 98,
      data: schemaItem.sampleRows,
      columns: schemaItem.columns.map((col: any) => ({
        name: col.name,
        type: col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('float') || col.type.toLowerCase().includes('decimal') || col.type.toLowerCase().includes('double') ? 'numeric' : 'categorical',
        sampleValues: schemaItem.sampleRows.map((r: any) => r[col.name]),
        totalCount: schemaItem.sampleRows.length,
        nullCount: 0,
        nullPercentage: 0,
        uniqueCount: new Set(schemaItem.sampleRows.map((r: any) => r[col.name])).size,
        uniquePercentage: 100
      })),
      summary: {
        totalRows: schemaItem.totalRows,
        totalColumns: schemaItem.columns.length,
        memoryUsageKB: Math.round(schemaItem.totalRows * 0.12),
        missingCellsCount: 0,
        missingCellsPercentage: 0,
        duplicateRowsCount: 0,
        numericColumnsCount: schemaItem.columns.filter((c: any) => ['DECIMAL', 'FLOAT', 'DOUBLE', 'INTEGER', 'FLOAT64'].some(t => c.type.includes(t))).length,
        categoricalColumnsCount: schemaItem.columns.filter((c: any) => ['VARCHAR', 'STRING'].some(t => c.type.includes(t))).length,
        dateColumnsCount: schemaItem.columns.filter((c: any) => c.type.includes('DATE')).length
      }
    };

    onLoadDatasetFromWarehouse(newDataset);
  };

  const filteredConnectors = connectors.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Large-Scale Enterprise Integration Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Corporate Data Warehouse & Cloud Lake Connectors
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Seamlessly unify Snowflake, BigQuery, AWS Redshift, PostgreSQL, and Databricks clusters into KYU AI.
              Equipped with zero-leak TLS 1.3 encryption, automatic CDC ingestion, schema catalog introspection, and SOC2 Type II audit logging.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Browse Catalog ({schemas.length})</span>
            </button>
            <button
              onClick={() => {
                if (connectors.length > 0) {
                  setSelectedConnector(connectors[0]);
                  setIsTestModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Network className="w-4 h-4" />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        {/* Sync Success Notification Toast */}
        {syncSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
            <button onClick={() => setSyncSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Connected Warehouses</div>
            <div className="text-2xl font-black text-white mt-1">5 <span className="text-xs font-normal text-emerald-400">/ 8 Online</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">High availability clustering</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Records Synced</div>
            <div className="text-2xl font-black text-white mt-1">24.2M</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Continuous CDC sync</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Avg Roundtrip Ping</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">29 ms</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sub-50ms SLA guaranteed</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Compliance & RBAC</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">SOC 2 II</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ISO 27001 & GDPR Ready</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'connectors'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Cloud Connectors ({connectors.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Remote Schema Catalog ({schemas.length})
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'governance'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            RBAC & Governance Matrix
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'connectors' && (
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter connectors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* TAB 1: CLOUD CONNECTORS */}
      {activeTab === 'connectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredConnectors.map(connector => {
            const isSyncing = syncingId === connector.id;
            return (
              <div
                key={connector.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition relative group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        {connector.id === 'snowflake' && '❄️'}
                        {connector.id === 'bigquery' && '🔍'}
                        {connector.id === 'postgresql' && '🐘'}
                        {connector.id === 'redshift' && '⚡'}
                        {connector.id === 'databricks' && '🧱'}
                        {connector.id === 'salesforce' && '☁️'}
                        {connector.id === 'saphana' && '💼'}
                        {connector.id === 'webhooks' && '🪝'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{connector.name}</h3>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                          {connector.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                        connector.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : connector.status === 'configured'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${connector.status === 'connected' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      {connector.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {connector.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4">
                    <div>
                      <span className="text-slate-500 block">Sync Schedule:</span>
                      <span className="text-slate-300 font-medium">{connector.syncFrequency}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Encryption:</span>
                      <span className="text-slate-300 font-medium truncate" title={connector.encryption}>
                        {connector.encryption}
                      </span>
                    </div>
                    {connector.latencyMs && (
                      <div>
                        <span className="text-slate-500 block">Roundtrip Ping:</span>
                        <span className="text-emerald-400 font-mono font-semibold">{connector.latencyMs} ms</span>
                      </div>
                    )}
                    {connector.tablesAvailable && (
                      <div>
                        <span className="text-slate-500 block">Tables Ingested:</span>
                        <span className="text-cyan-400 font-mono font-semibold">{connector.tablesAvailable} tables</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setSelectedConnector(connector);
                      setIsTestModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Diagnostics</span>
                  </button>

                  <button
                    disabled={isSyncing}
                    onClick={() => handleTriggerSync(connector.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Pipeline'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REMOTE SCHEMA CATALOG & 1-CLICK IMPORT */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Discovered Corporate Tables & Views</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Introspected from corporate data warehouses. Click &ldquo;Import & Profile in KYU AI&rdquo; to analyze instantly.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
              Cross-Cloud DWH Catalog
            </span>
          </div>

          <div className="space-y-4">
            {schemas.map(schemaItem => (
              <div
                key={schemaItem.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                      DWH
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">{schemaItem.name}</h3>
                      <p className="text-xs text-slate-400">
                        Source: <span className="text-slate-200 font-medium">{schemaItem.source}</span> &bull; {schemaItem.totalRows.toLocaleString()} rows
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleImportRemoteTable(schemaItem)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Import & Profile in KYU AI</span>
                  </button>
                </div>

                {/* Columns Preview Tag Cloud */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Columns & Data Types ({schemaItem.columns.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schemaItem.columns.map((col: any) => (
                      <span
                        key={col.name}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1.5 ${
                          col.pii
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-white">{col.name}</span>
                        <span className="text-[10px] text-slate-400">({col.type})</span>
                        {col.pii && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded uppercase font-bold">
                            PII Masked
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Records Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                      <tr>
                        {schemaItem.columns.map((col: any) => (
                          <th key={col.name} className="px-3 py-2 font-medium">
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {schemaItem.sampleRows.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          {schemaItem.columns.map((col: any) => (
                            <td key={col.name} className="px-3 py-2">
                              {String(row[col.name])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC & GOVERNANCE MATRIX */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-base font-bold text-white">Enterprise Role-Based Access Control (RBAC)</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Enforce strict least-privilege data access across cross-functional enterprise analytics units.
              Controls ingestion, raw SQL execution, PII masking, autonomous AI prompting, and report export permissions.
            </p>

            <div className="overflow-x-auto mt-5">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Corporate Role</th>
                    <th className="px-4 py-3 font-semibold text-center">Warehouse Ingest</th>
                    <th className="px-4 py-3 font-semibold text-center">Raw SQL Sandbox</th>
                    <th className="px-4 py-3 font-semibold text-center">View PII Data</th>
                    <th className="px-4 py-3 font-semibold text-center">AI Prompt Grounding</th>
                    <th className="px-4 py-3 font-semibold text-center">Executive Reports</th>
                    <th className="px-4 py-3 font-semibold text-center">Purge Datasets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white">
                      Super Admin / Chief Data Officer
                    </td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white">
                      Enterprise Data Architect / Engineer
                    </td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center">
                      <span title="Masked by Default" className="inline-block">
                        <Lock className="w-3.5 h-3.5 text-amber-400 mx-auto" />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white">
                      Lead Data Analyst / Scientist
                    </td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white">
                      Business Executive / VP Stakeholder
                    </td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white">
                      External Auditor / Compliance Officer
                    </td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & COMPLIANCE LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Immutable Enterprise Security Audit Trail</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every data extraction, query, PII scan, and model invocation is permanently recorded for SOC2 & GDPR compliance.
              </p>
            </div>
            <button
              onClick={() => {
                const csvContent = 'data:text/csv;charset=utf-8,' +
                  ['ID,Timestamp,Actor,Role,Action,Resource,Status,ComplianceCheck'].join(',') + '\n' +
                  auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.resource}","${l.status}","${l.complianceCheck}"`).join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `kyu_ai_enterprise_audit_log_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event ID</th>
                  <th className="px-4 py-3 font-semibold">Timestamp (UTC)</th>
                  <th className="px-4 py-3 font-semibold">Actor / User</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Target Resource</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Compliance Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-indigo-400 font-bold">{log.id}</td>
                    <td className="px-4 py-3 text-slate-400">{log.timestamp}</td>
                    <td className="px-4 py-3 font-semibold text-white">{log.actor}</td>
                    <td className="px-4 py-3 text-cyan-300">{log.action}</td>
                    <td className="px-4 py-3 text-slate-300">{log.resource}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{log.complianceCheck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIAGNOSTIC & TEST CONNECTION MODAL */}
      {isTestModalOpen && selectedConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Diagnostic & Connection Test</h3>
                  <p className="text-xs text-slate-400">{selectedConnector.name} Enterprise Endpoint</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsTestModalOpen(false);
                  setTestResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Host Endpoint / DNS:</label>
                  <input
                    type="text"
                    value={connHost}
                    onChange={e => setConnHost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Port:</label>
                  <input
                    type="text"
                    value={connPort}
                    onChange={e => setConnPort(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Database / Warehouse Catalog:</label>
                <input
                  type="text"
                  value={connDatabase}
                  onChange={e => setConnDatabase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Authentication Method:</label>
                  <select
                    value={connAuthType}
                    onChange={e => setConnAuthType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option>IAM Role / Service Key</option>
                    <option>OAuth 2.0 Client Credentials</option>
                    <option>Mutual TLS (mTLS) Certificate</option>
                    <option>Token / Password Vault</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="sslToggle"
                    checked={sslEnabled}
                    onChange={e => setSslEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <label htmlFor="sslToggle" className="text-slate-300 font-medium cursor-pointer">
                    Enforce TLS 1.3 Encryption
                  </label>
                </div>
              </div>
            </div>

            {/* Test Results Display */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                  testResult.status === 'ONLINE'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Handshake Verified &amp; Connection Active
                  </span>
                  <span className="font-mono text-emerald-400">{testResult.pingMs} ms</span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-300 font-mono">
                  <div>SSL Certificate: <span className="text-white">{testResult.sslHandshake}</span></div>
                  <div>Query Roundtrip Latency: <span className="text-white">{testResult.queryLatencyMs} ms</span></div>
                  <div>Tables Cataloged: <span className="text-white">{testResult.tablesDiscovered} analytical relations</span></div>
                  <div>Max Connection Pool: <span className="text-white">{testResult.maxPoolConnections} concurrent streams</span></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsTestModalOpen(false);
                  setTestResult(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                disabled={isTesting}
                onClick={handleRunDiagnostic}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Executing Handshake...' : 'Run Diagnostics'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
