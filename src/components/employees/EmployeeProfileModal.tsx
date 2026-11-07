import React, { useState } from 'react';
import {
  X,
  User,
  ShieldAlert,
  KeyRound,
  History,
  Building,
  Calendar,
  Mail,
  UserCheck,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { Employee, PermissionAssignment } from '../../types';

interface EmployeeProfileModalProps {
  employeeId: string;
  onClose: () => void;
  onOpenGrantModal: (empId: string) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employeeId,
  onClose,
  onOpenGrantModal
}) => {
  const {
    employees,
    applications,
    violations,
    auditLogs,
    revokePermission,
    deactivateEmployee,
    currentUser,
    setActiveTab
  } = useAccessGuard();

  const [activeTab, setModalTab] = useState<'details' | 'permissions' | 'risks' | 'history'>('details');

  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return null;

  const empViolations = violations.filter(v => v.employeeId === employeeId);
  const empLogs = auditLogs.filter(l => l.targetEmployeeId === employeeId);

  const isTerminatedWithAccess =
    (employee.employmentStatus === 'TERMINATED' || employee.employmentStatus === 'RESIGNED') &&
    employee.permissions.some(p => p.level !== 'NO_ACCESS');

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090E1B] text-white flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{employee.fullName}</h2>
                <span className="font-mono text-xs text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  {employee.employeeNumber}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    employee.employmentStatus === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {employee.employmentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {employee.jobTitle} · {employee.department} · {employee.branch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {employee.employmentStatus === 'ACTIVE' && (
              <button
                onClick={() => {
                  deactivateEmployee(employee.id, 'Manager initiated resignation / deactivation');
                }}
                className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-rose-500/40"
              >
                Deactivate Identity
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Critical Orphan Access Warning if Terminated */}
        {isTerminatedWithAccess && (
          <div className="p-3 bg-rose-950/80 border-b border-rose-600/50 text-rose-200 flex items-center justify-between text-xs px-6 font-medium">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 animate-pulse" />
              <span>
                <strong className="text-white">CRITICAL SECURITY HAZARD:</strong> Employee is {employee.employmentStatus} but still possesses {employee.permissions.filter(p => p.level !== 'NO_ACCESS').length} active system permissions.
              </span>
            </div>
            <button
              onClick={() => {
                employee.permissions.forEach(p => {
                  revokePermission(employee.id, p.id, 'Emergency de-provisioning of inactive employee');
                });
              }}
              className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-500 text-[11px] cursor-pointer shrink-0 shadow-sm"
            >
              Emergency Revoke All
            </button>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-[#0A0F1D] text-xs font-medium text-slate-400">
          <button
            onClick={() => setModalTab('details')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-amber-500 text-amber-300 font-bold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Identity Dossier
          </button>
          <button
            onClick={() => setModalTab('permissions')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-amber-500 text-amber-300 font-bold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Assigned Permissions
            <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-700">
              {employee.permissions.length}
            </span>
          </button>
          <button
            onClick={() => setModalTab('risks')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'risks'
                ? 'border-amber-500 text-amber-300 font-bold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Risk Analysis
            {empViolations.length > 0 && (
              <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full font-bold">
                {empViolations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setModalTab('history')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-300 font-bold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Audit Trail
            <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-700">
              {empLogs.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-300">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#0E1527] rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Email Address</div>
                  <div className="font-medium text-white mt-1 truncate">{employee.email}</div>
                </div>
                <div className="p-3 bg-[#0E1527] rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reporting Manager</div>
                  <div className="font-medium text-white mt-1">{employee.managerName}</div>
                </div>
                <div className="p-3 bg-[#0E1527] rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Hire Date</div>
                  <div className="font-medium text-white mt-1 font-mono">{employee.dateOfEmployment}</div>
                </div>
                <div className="p-3 bg-[#0E1527] rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Last Recertification</div>
                  <div className="font-medium text-white mt-1 font-mono">{employee.lastAccessReviewDate}</div>
                </div>
              </div>

              {employee.departmentTransferDate && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-amber-400" /> Department Transfer Record
                  </div>
                  <p className="text-slate-300 text-xs mt-1">
                    Transferred from <strong>{employee.previousDepartment}</strong> on <strong>{employee.departmentTransferDate}</strong>. Ensure residual permissions from previous business unit are de-provisioned.
                  </p>
                </div>
              )}

              {/* Risk Summary Badge */}
              <div className="p-4 bg-[#0E1527] border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Explainable Governance Risk Score</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Calculated by Centrix rules engine based on role alignment, SoD conflicts, and review currency.
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold font-mono ${
                    employee.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                    employee.riskLevel === 'HIGH' ? 'text-amber-400' :
                    employee.riskLevel === 'MODERATE' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {employee.riskScore} / 100
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {employee.riskLevel} RISK
                  </div>
                </div>
              </div>

              {/* Risk Factors List */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2">Identified Risk Rationale</h4>
                <div className="space-y-1.5">
                  {employee.riskFactors.map((factor, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#0E1527] border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 font-mono text-[10px]">0{i + 1}.</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  Active Connected System Entitlements ({employee.permissions.length})
                </span>
                <button
                  onClick={() => onOpenGrantModal(employee.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Grant New Access
                </button>
              </div>

              {employee.permissions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-[#0E1527] rounded-lg border border-slate-800 font-mono">
                  No active application permissions assigned.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-[#0A0F1D]">
                  {employee.permissions.map(perm => (
                    <div key={perm.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{perm.applicationName}</span>
                            <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                              {perm.roleName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                perm.level === 'ADMIN' || perm.level === 'SUPER_ADMIN'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : perm.level === 'READ_WRITE'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {perm.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                            <span>Granted: <strong className="font-mono text-slate-300">{perm.grantedDate}</strong></span>
                            <span>·</span>
                            <span>Authorized by: <strong className="text-slate-300">{perm.grantedBy}</strong></span>
                            <span>·</span>
                            <span>Last Used: <strong className="font-mono text-slate-300">{perm.lastUsedDate || 'Never'}</strong></span>
                          </div>

                          {perm.justification && (
                            <div className="text-[11px] text-slate-400 mt-1 italic">
                              &quot;{perm.justification}&quot;
                            </div>
                          )}

                          {/* Specific entitlements */}
                          {perm.specificEntitlements && perm.specificEntitlements.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {perm.specificEntitlements.map(ent => (
                                <span
                                  key={ent}
                                  className="text-[10px] font-mono bg-[#0E1527] text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                                >
                                  {ent}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            revokePermission(employee.id, perm.id, 'Manual administrative revocation via Profile Modal');
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Revoke Permission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RISKS */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="font-bold text-white text-xs">
                Active Security Violations for this Identity ({empViolations.length})
              </div>

              {empViolations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-[#0E1527] rounded-lg border border-slate-800">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Zero Security Violations Detected</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Identity adheres strictly to least-privilege standards and Segregation of Duties guidelines.
                  </p>
                </div>
              ) : (
                empViolations.map(vio => (
                  <div key={vio.id} className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 rounded">
                          {vio.violationCode}
                        </span>
                        <span className="font-bold text-white">{vio.title}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded">
                        {vio.severity}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">{vio.description}</p>

                    <div className="p-2.5 bg-[#090E1B] rounded border border-rose-500/30 text-slate-300 space-y-1">
                      <div>
                        <strong className="text-rose-400">Why this is dangerous:</strong> {vio.whyDangerous}
                      </div>
                      <div>
                        <strong className="text-emerald-400">Recommended Action:</strong> {vio.recommendedAction}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="font-bold text-white text-xs">
                Immutable Access Governance History ({empLogs.length})
              </div>

              {empLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-[#0E1527] rounded-lg border border-slate-800 font-mono">
                  No individual audit logs recorded for this identity yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-[#0A0F1D]">
                  {empLogs.map(log => (
                    <div key={log.id} className="p-3 text-xs flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700 px-1.5 py-0.2 rounded">
                            {log.action}
                          </span>
                          <span className="font-semibold text-white">{log.description}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span>By: {log.actorName}</span>
                          <span>·</span>
                          <span className="font-mono">{log.ipAddress}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090E1B] flex items-center justify-between text-xs text-slate-400">
          <span>Identity ID: <strong className="font-mono text-amber-400">{employee.id}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
