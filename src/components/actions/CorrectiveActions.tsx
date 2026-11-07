import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Play
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { CorrectiveAction, ActionStatus, RiskLevel } from '../../types';

export const CorrectiveActions: React.FC = () => {
  const {
    correctiveActions,
    updateCorrectiveActionStatus,
    executeRemediation,
    createCorrectiveAction,
    currentUser,
    setActiveTab
  } = useAccessGuard();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [affectedEmpName, setAffectedEmpName] = useState('');
  const [affectedAppName, setAffectedAppName] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [assignedTo, setAssignedTo] = useState('Tinashe Zimuto (IT Admin)');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('HIGH');

  const filteredActions = correctiveActions.filter(a => {
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchRisk = riskFilter === 'ALL' || a.riskLevel === riskFilter;
    const matchSearch =
      !searchQuery.trim() ||
      a.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.affectedEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.actionCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchRisk && matchSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;

    createCorrectiveAction({
      issueTitle,
      issueDescription: issueDesc || issueTitle,
      affectedEmployeeId: 'emp-manual',
      affectedEmployeeName: affectedEmpName || 'Enterprise Identity',
      affectedApplicationName: affectedAppName || 'Organizational System',
      riskLevel,
      recommendedAction: recommendedAction || 'Review and remediate entitlement.',
      assignedToId: 'emp-mgr-03',
      assignedToName: assignedTo,
      dueDate,
      status: 'OPEN'
    });

    setIsCreateOpen(false);
    setIssueTitle('');
    setIssueDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            Security Remediation &amp; Corrective Action Tracker
            <span className="text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
              {correctiveActions.length} Tracked Tickets
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready accountability tracking for access rectifications, privilege downgrades, and de-provisioning orders.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Log Corrective Action
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search corrective actions by title, code or identity..."
            className="w-full pl-9 pr-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#070B12] text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#070B12] text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#0B101D] rounded-xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm">Zero Corrective Action Tickets Pending</h3>
            <p className="text-xs text-slate-400 mt-1">All flagged access violations have been successfully remediated.</p>
          </div>
        ) : (
          filteredActions.map(action => {
            const isResolved = action.status === 'RESOLVED' || action.status === 'CLOSED';

            return (
              <div
                key={action.id}
                className={`bg-[#0B101D] rounded-xl border p-5 shadow-lg space-y-3 transition-all ${
                  isResolved
                    ? 'border-emerald-900/60 bg-emerald-950/20'
                    : action.riskLevel === 'CRITICAL'
                    ? 'border-rose-900/60 bg-rose-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {action.actionCode}
                      </span>
                      <h3 className="font-bold text-white text-sm">{action.issueTitle}</h3>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          action.riskLevel === 'CRITICAL'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {action.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Identity: <strong className="text-slate-200">{action.affectedEmployeeName}</strong> · Target System:{' '}
                      <strong className="text-slate-200">{action.affectedApplicationName || 'All Connected Systems'}</strong> · Due Date:{' '}
                      <span className="font-mono text-slate-300">{action.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        isResolved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : action.status === 'IN_PROGRESS'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {action.issueDescription}
                </p>

                <div className="p-3 bg-[#070B12] rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>
                    <strong className="text-slate-200">Mandated Action:</strong> {action.recommendedAction}
                  </div>
                  <div>
                    <strong className="text-slate-200">Assigned Lead:</strong> {action.assignedToName}
                  </div>
                  {action.resolutionNotes && (
                    <div className="pt-1 text-emerald-400 font-medium">
                      ✓ Resolution: {action.resolutionNotes} (by {action.resolvedBy || 'System'})
                    </div>
                  )}
                </div>

                {/* Remediation Action Buttons */}
                {!isResolved && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Requires IT Administrator or Manager Execution
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCorrectiveActionStatus(action.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition-colors"
                      >
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => executeRemediation(action.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Execute Remediation Action
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Log Corrective Action Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B101D] rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 bg-[#070B12] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Log Corrective Action Ticket</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={issueTitle}
                  onChange={e => setIssueTitle(e.target.value)}
                  placeholder="e.g. Revoke root database access from unauthorized staff"
                  className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Affected Identity</label>
                  <input
                    type="text"
                    value={affectedEmpName}
                    onChange={e => setAffectedEmpName(e.target.value)}
                    placeholder="e.g. John Moyo"
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Affected System</label>
                  <input
                    type="text"
                    value={affectedAppName}
                    onChange={e => setAffectedAppName(e.target.value)}
                    placeholder="e.g. Database Administration Console"
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Risk Severity</label>
                  <select
                    value={riskLevel}
                    onChange={e => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Resolution Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mandated Remediation Action</label>
                <textarea
                  rows={2}
                  value={recommendedAction}
                  onChange={e => setRecommendedAction(e.target.value)}
                  placeholder="e.g. De-provision role and reassign standard viewer credentials..."
                  className="w-full p-2.5 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Create Remediation Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
