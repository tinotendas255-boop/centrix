import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { GrantRevokeModal } from './GrantRevokeModal';
import { PermissionLevel } from '../../types';

export const AccessPermissions: React.FC = () => {
  const {
    employees,
    applications,
    revokePermission,
    modifyPermission,
    setSelectedEmployeeId,
    setActiveTab
  } = useAccessGuard();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrivilege, setFilterPrivilege] = useState<string>('ALL');
  const [filterApp, setFilterApp] = useState<string>('ALL');
  const [grantModalEmpId, setGrantModalEmpId] = useState<string | null>(null);

  // Selected permission for editing level
  const [editingPerm, setEditingPerm] = useState<{
    employeeId: string;
    permissionId: string;
    appName: string;
    currentLevel: PermissionLevel;
  } | null>(null);
  const [newEditLevel, setNewEditLevel] = useState<PermissionLevel>('READ_ONLY');
  const [editJustification, setEditJustification] = useState('');

  // Collect all assigned permissions flat
  const allAssignedPermissions = useMemo(() => {
    const list: {
      employeeId: string;
      employeeName: string;
      employeeNumber: string;
      department: string;
      jobTitle: string;
      employmentStatus: string;
      permissionId: string;
      applicationId: string;
      applicationName: string;
      roleName: string;
      level: PermissionLevel;
      specificEntitlements: string[];
      grantedDate: string;
      grantedBy: string;
      isDormant?: boolean;
    }[] = [];

    employees.forEach(emp => {
      emp.permissions.forEach(p => {
        if (p.level !== 'NO_ACCESS') {
          list.push({
            employeeId: emp.id,
            employeeName: emp.fullName,
            employeeNumber: emp.employeeNumber,
            department: emp.department,
            jobTitle: emp.jobTitle,
            employmentStatus: emp.employmentStatus,
            permissionId: p.id,
            applicationId: p.applicationId,
            applicationName: p.applicationName,
            roleName: p.roleName,
            level: p.level,
            specificEntitlements: p.specificEntitlements || [],
            grantedDate: p.grantedDate,
            grantedBy: p.grantedBy,
            isDormant: p.isDormant
          });
        }
      });
    });

    return list;
  }, [employees]);

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    return allAssignedPermissions.filter(p => {
      const matchSearch =
        !searchQuery.trim() ||
        p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.roleName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriv = filterPrivilege === 'ALL' || p.level === filterPrivilege;
      const matchApp = filterApp === 'ALL' || p.applicationId === filterApp;

      return matchSearch && matchPriv && matchApp;
    });
  }, [allAssignedPermissions, searchQuery, filterPrivilege, filterApp]);

  const [editErrorMsg, setEditErrorMsg] = useState('');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerm) return;
    if (!editJustification.trim()) {
      setEditErrorMsg('A justification is required to modify permissions.');
      return;
    }
    setEditErrorMsg('');

    modifyPermission(
      editingPerm.employeeId,
      editingPerm.permissionId,
      newEditLevel,
      ['Modified_Entitlement_Baseline'],
      editJustification
    );

    setEditingPerm(null);
    setEditJustification('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            Access Permissions &amp; Role-Based Access Control (RBAC) Matrix
            <span className="text-xs font-mono font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {allAssignedPermissions.length} Active Entitlements
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enforces the Principle of Least Privilege across all connected systems with granular privilege level governance.
          </p>
        </div>
      </div>

      {/* Principle of Least Privilege Banner */}
      <div className="p-4 bg-[#0B101D] text-slate-300 rounded-xl border border-slate-800 text-xs flex items-start justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white text-sm">Principle of Least Privilege Policy</span>
            <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
              Every employee must only hold the minimum permissions necessary to perform their assigned role. Elevated administrative rights (ADMIN / SUPER_ADMIN) are strictly monitored and quarantined outside IT.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setFilterPrivilege('ADMIN');
          }}
          className="px-3 py-1.5 bg-[#0D1527] hover:bg-slate-800 text-rose-300 border border-slate-700 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
        >
          Inspect Admin Accounts →
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by employee name, ID, application or role..."
            className="w-full pl-9 pr-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={filterPrivilege}
            onChange={e => setFilterPrivilege(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Privilege Levels</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="READ_WRITE">READ_WRITE</option>
            <option value="READ_ONLY">READ_ONLY</option>
          </select>

          <select
            value={filterApp}
            onChange={e => setFilterApp(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Applications</option>
            {applications.map(app => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D1527] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department &amp; Title</th>
                <th className="py-3 px-4">Connected Application</th>
                <th className="py-3 px-4">Role &amp; Privilege Level</th>
                <th className="py-3 px-4">Entitlements</th>
                <th className="py-3 px-4">Granted By / Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No active entitlements match the query filters.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map(item => {
                  const isAdmin = item.level === 'ADMIN' || item.level === 'SUPER_ADMIN';
                  const isNonItAdmin = isAdmin && item.department !== 'IT & Information Security';

                  return (
                    <tr
                      key={item.permissionId}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isNonItAdmin ? 'bg-amber-950/20' : ''
                      }`}
                    >
                      {/* Employee */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {item.employeeName}
                          {isNonItAdmin && (
                            <span title="Excessive Privilege: Elevated Admin rights outside IT!">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-amber-400/90">
                          {item.employeeNumber}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{item.department}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {item.jobTitle}
                        </div>
                      </td>

                      {/* Application */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">{item.applicationName}</span>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-300">{item.roleName}</div>
                        <span
                          className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                            item.level === 'SUPER_ADMIN'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : item.level === 'ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : item.level === 'READ_WRITE'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.level}
                        </span>
                      </td>

                      {/* Entitlements */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.specificEntitlements.map(ent => (
                            <span
                              key={ent}
                              className="text-[10px] font-mono bg-[#0D1527] text-slate-300 px-1.5 py-0.2 rounded border border-slate-800"
                            >
                              {ent}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Granted Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        <div>{item.grantedDate}</div>
                        <div className="text-[10px] text-slate-500">by {item.grantedBy}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              setEditingPerm({
                                employeeId: item.employeeId,
                                permissionId: item.permissionId,
                                appName: item.applicationName,
                                currentLevel: item.level
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Modify Privilege Level"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              revokePermission(
                                item.employeeId,
                                item.permissionId,
                                'Administrative revocation via RBAC Matrix'
                              );
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Revoke Entitlement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#090E1B] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Showing {filteredPermissions.length} active assignments</span>
          <span className="font-mono text-[10px] text-amber-400">Least Privilege Enforcement Matrix</span>
        </div>
      </div>

      {/* Edit Level Modal */}
      {editingPerm && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Modify Privilege Level</h3>
              <button
                onClick={() => setEditingPerm(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs text-slate-300">
              <div className="text-slate-300">
                Adjusting privileges for <strong className="text-amber-400">{editingPerm.appName}</strong>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Privilege Level</label>
                <select
                  value={newEditLevel}
                  onChange={e => setNewEditLevel(e.target.value as PermissionLevel)}
                  className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
                >
                  <option value="READ_ONLY">READ_ONLY (Viewer)</option>
                  <option value="READ_WRITE">READ_WRITE (Standard User)</option>
                  <option value="ADMIN">ADMIN (Administrative)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Root)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Change Justification (Mandatory Audit Requirement) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editJustification}
                  onChange={e => setEditJustification(e.target.value)}
                  placeholder="State reason for privilege adjustment..."
                  className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {editErrorMsg && (
                <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
                  {editErrorMsg}
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPerm(null)}
                  className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Save Privilege Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Modal */}
      {grantModalEmpId && (
        <GrantRevokeModal
          employeeId={grantModalEmpId}
          onClose={() => setGrantModalEmpId(null)}
        />
      )}
    </div>
  );
};
