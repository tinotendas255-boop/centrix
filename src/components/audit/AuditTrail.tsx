import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Lock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { exportToCsv } from '../../utils/exportUtils';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useAccessGuard();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchSev = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchSearch =
      !searchQuery.trim() ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetEmployeeName && log.targetEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSev && matchSearch;
  });

  const handleExportCsv = () => {
    const exportRows = filteredLogs.map(l => ({
      Timestamp: l.timestamp,
      Actor: l.actorName,
      Role: l.actorRole,
      Action: l.action,
      Category: l.category,
      TargetEmployee: l.targetEmployeeName || 'N/A',
      TargetApplication: l.targetApplicationName || 'N/A',
      PreviousValue: l.previousValue || 'N/A',
      NewValue: l.newValue || 'N/A',
      Description: l.description,
      IPAddress: l.ipAddress,
      Severity: l.severity
    }));
    exportToCsv(exportRows, 'Centrix_Immutable_Audit_Log');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-amber-400" />
            Immutable Security &amp; Access Audit Trail
            <span className="text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
              {auditLogs.length} Verified Entries
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-evident chronological record of identity creations, privilege changes, campaign decisions, and risk alerts.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" /> Export Audit Log CSV
        </button>
      </div>

      {/* Compliance Banner */}
      <div className="p-3.5 bg-[#0B101D] text-slate-300 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-emerald-300">WORM Storage Governance:</strong> Audit records are cryptographically verified and cannot be edited, altered, or truncated through the user interface.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider shrink-0 hidden sm:inline">
          SOX 404 &amp; ISO 27001 Compliant
        </span>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, description, action type or target..."
            className="w-full pl-9 pr-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#070B12] text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="EMPLOYEE">Employee Identity</option>
            <option value="PERMISSION">Permissions &amp; RBAC</option>
            <option value="RECERTIFICATION">Recertification</option>
            <option value="RISK_DETECTION">Risk Detection</option>
            <option value="CORRECTIVE_ACTION">Corrective Action</option>
            <option value="SYSTEM_CONFIG">System Integration</option>
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#070B12] text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#070B12] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action &amp; Category</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Values Modified</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No audit records match the selected query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-white text-[11px]">
                        {log.action}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {log.category}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-200">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-slate-300 leading-relaxed max-w-md">{log.description}</p>
                      {log.targetEmployeeName && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Target: <strong className="text-slate-200">{log.targetEmployeeName}</strong>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      {log.previousValue || log.newValue ? (
                        <div className="text-slate-300">
                          <span className="text-rose-400 line-through mr-1">{log.previousValue || 'None'}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400 ml-1 font-semibold">{log.newValue || 'Updated'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {log.ipAddress}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#070B12] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Showing {filteredLogs.length} audit records</span>
          <span className="font-mono text-[10px] text-amber-400">Centrix Cryptographic Ledger</span>
        </div>
      </div>
    </div>
  );
};
