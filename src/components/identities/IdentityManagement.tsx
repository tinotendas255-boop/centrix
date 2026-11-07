import React, { useState } from 'react';
import {
  Fingerprint,
  ShieldAlert,
  UserX,
  History,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { Employee } from '../../types';

export const IdentityManagement: React.FC = () => {
  const {
    employees,
    applications,
    violations,
    revokePermission,
    setSelectedEmployeeId,
    setActiveTab
  } = useAccessGuard();

  const [filterMode, setFilterMode] = useState<'all' | 'leavers' | 'transfers' | 'dormant'>('leavers');

  // Inactive / Former employees who still retain active access
  const terminatedWithAccess = employees.filter(
    e =>
      (e.employmentStatus === 'TERMINATED' || e.employmentStatus === 'RESIGNED') &&
      e.permissions.some(p => p.level !== 'NO_ACCESS')
  );

  // Transferred employees holding permissions from previous department
  const transferredWithOldAccess = employees.filter(
    e =>
      e.departmentTransferDate &&
      e.previousDepartment &&
      e.permissions.some(p => {
        const app = applications.find(a => a.id === p.applicationId);
        return app && app.department === e.previousDepartment && p.level !== 'NO_ACCESS';
      })
  );

  // Dormant accounts (>90 days inactive)
  const dormantIdentities = employees.filter(e =>
    e.permissions.some(p => p.isDormant)
  );

  // Bulk deprovision all terminated employees with access
  const handleBulkDeProvisionLeavers = () => {
    terminatedWithAccess.forEach(emp => {
      emp.permissions.forEach(p => {
        revokePermission(
          emp.id,
          p.id,
          'Bulk automated de-provisioning of resigned/terminated employee identity'
        );
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-amber-400" />
            Identity Lifecycle &amp; Orphan Account Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Joiner-Mover-Leaver (JML) governance. Instantly detect and de-provision orphaned accounts and privilege creep.
          </p>
        </div>

        {terminatedWithAccess.length > 0 && (
          <button
            onClick={handleBulkDeProvisionLeavers}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Emergency De-provision All Leavers ({terminatedWithAccess.length})
          </button>
        )}
      </div>

      {/* JML Lifecycle Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Leaver Risks */}
        <div
          onClick={() => setFilterMode('leavers')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'leavers'
              ? 'bg-rose-950/30 border-rose-500/60 ring-2 ring-rose-500/20'
              : 'bg-[#0B101D] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Leaver Orphan Access
            </span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {terminatedWithAccess.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Resigned/Terminated with active logins
          </div>
        </div>

        {/* Mover / Transfer Risks */}
        <div
          onClick={() => setFilterMode('transfers')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'transfers'
              ? 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/20'
              : 'bg-[#0B101D] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Department Mover Creep
            </span>
            <History className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {transferredWithOldAccess.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Transferred holding previous department access
          </div>
        </div>

        {/* Dormant Credentials */}
        <div
          onClick={() => setFilterMode('dormant')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'dormant'
              ? 'bg-blue-950/30 border-blue-500/60 ring-2 ring-blue-500/20'
              : 'bg-[#0B101D] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              Dormant Accounts
            </span>
            <Moon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {dormantIdentities.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Inactive for &gt;90 days without login
          </div>
        </div>

        {/* Clean Identities */}
        <div
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/20'
              : 'bg-[#0B101D] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Total Managed
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {employees.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            All enterprise identities
          </div>
        </div>
      </div>

      {/* FILTER: LEAVER HAZARDS FOCUS */}
      {filterMode === 'leavers' && (
        <div className="bg-[#0B101D] rounded-xl border border-rose-900/50 shadow-lg overflow-hidden">
          <div className="p-4 bg-rose-950/30 border-b border-rose-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <div>
                <h3 className="font-bold text-rose-300 text-sm">
                  CRITICAL: Terminated Employees Retaining Active Application Credentials
                </h3>
                <p className="text-[11px] text-rose-400/80">
                  Identities whose HR status is TERMINATED or RESIGNED but active sessions or accounts still exist on core banking systems.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-rose-900/60 text-rose-200 border border-rose-700 px-2 py-0.5 rounded">
              {terminatedWithAccess.length} Detected
            </span>
          </div>

          {terminatedWithAccess.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-medium text-slate-200">All Leaver Accounts Successfully De-provisioned</p>
              <p className="text-xs text-slate-400 mt-0.5">Zero orphaned accounts detected across all connected applications.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {terminatedWithAccess.map(emp => (
                <div key={emp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {emp.employeeNumber}
                      </span>
                      <span className="font-bold text-white text-sm">{emp.fullName}</span>
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded uppercase">
                        {emp.employmentStatus}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      {emp.jobTitle} · Department: <strong className="text-slate-200">{emp.department}</strong> · Terminated on: <span className="font-mono text-slate-300">{emp.terminationDate || 'Recent'}</span>
                    </div>

                    {/* Active perms list */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-rose-400">Retained Access:</span>
                      {emp.permissions.map(p => (
                        <span key={p.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/80 font-semibold">
                          {p.applicationName} ({p.roleName} - {p.level})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Inspect Profile
                    </button>
                    <button
                      onClick={() => {
                        emp.permissions.forEach(p => {
                          revokePermission(emp.id, p.id, 'Emergency de-provisioning of former employee account');
                        });
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      Revoke All Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILTER: MOVER / TRANSFER PRIVILEGE CREEP */}
      {filterMode === 'transfers' && (
        <div className="bg-[#0B101D] rounded-xl border border-amber-900/50 shadow-lg overflow-hidden">
          <div className="p-4 bg-amber-950/30 border-b border-amber-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-amber-300 text-sm">
                  Department Transfer Privilege Accumulation (Privilege Creep)
                </h3>
                <p className="text-[11px] text-amber-400/80">
                  Employees who changed departments but still hold access permissions belonging to their prior department.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-amber-900/60 text-amber-200 border border-amber-700 px-2 py-0.5 rounded">
              {transferredWithOldAccess.length} Detected
            </span>
          </div>

          {transferredWithOldAccess.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-medium text-slate-200">Zero Transfer Privilege Accumulations</p>
              <p className="text-xs text-slate-400 mt-0.5">All transferred employees have had prior departmental permissions decommissioned.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {transferredWithOldAccess.map(emp => (
                <div key={emp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {emp.employeeNumber}
                      </span>
                      <span className="font-bold text-white text-sm">{emp.fullName}</span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                        TRANSFER DATE: {emp.departmentTransferDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Current Department: <strong className="text-slate-200">{emp.department}</strong> · Previous Department: <strong className="text-slate-200">{emp.previousDepartment}</strong>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-amber-400">Legacy Permissions to Decommission:</span>
                      {emp.permissions
                        .filter(p => {
                          const app = applications.find(a => a.id === p.applicationId);
                          return app && app.department === emp.previousDepartment;
                        })
                        .map(p => (
                          <span key={p.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/80 font-semibold">
                            {p.applicationName} ({p.roleName} - {p.level})
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Review Profile
                    </button>
                    <button
                      onClick={() => {
                        emp.permissions
                          .filter(p => {
                            const app = applications.find(a => a.id === p.applicationId);
                            return app && app.department === emp.previousDepartment;
                          })
                          .forEach(p => {
                            revokePermission(emp.id, p.id, 'Decommission legacy departmental privileges post-transfer');
                          });
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      Decommission Prior Dept Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILTER: DORMANT IDENTITIES */}
      {filterMode === 'dormant' && (
        <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-lg overflow-hidden">
          <div className="p-4 bg-[#0D1527] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Dormant Accounts (&gt;90 Days Without Login Activity)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Accounts that have recorded zero authentication activity for an extended duration, increasing exposure to credential compromise.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
              {dormantIdentities.length} Accounts
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {dormantIdentities.map(emp => (
              <div key={emp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {emp.employeeNumber}
                    </span>
                    <span className="font-bold text-white text-sm">{emp.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {emp.jobTitle}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    Last Authentication Date: <strong className="font-mono text-slate-200">{emp.lastLoginDate ? new Date(emp.lastLoginDate).toLocaleDateString() : 'None'}</strong>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400">Dormant Permissions:</span>
                    {emp.permissions.filter(p => p.isDormant).map(p => (
                      <span key={p.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p.applicationName} ({p.roleName})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      emp.permissions.filter(p => p.isDormant).forEach(p => {
                        revokePermission(emp.id, p.id, 'Dormancy threshold exceeded (>90 days inactive)');
                      });
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Disable Dormant Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER: ALL IDENTITIES SUMMARY */}
      {filterMode === 'all' && (
        <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-lg p-6 text-center">
          <p className="text-slate-300 text-xs">
            Viewing all {employees.length} managed identities. Use the Employee Directory module for complete tabular inspection, searching, and CSV operations.
          </p>
          <button
            onClick={() => setActiveTab('employees')}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all"
          >
            Open Full Employee Directory →
          </button>
        </div>
      )}
    </div>
  );
};
