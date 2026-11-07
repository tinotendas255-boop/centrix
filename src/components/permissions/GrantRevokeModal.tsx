import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { PermissionLevel } from '../../types';

interface GrantRevokeModalProps {
  employeeId: string;
  onClose: () => void;
}

export const GrantRevokeModal: React.FC<GrantRevokeModalProps> = ({ employeeId, onClose }) => {
  const { employees, applications, grantPermission } = useAccessGuard();

  const employee = employees.find(e => e.id === employeeId);

  const [applicationId, setApplicationId] = useState(applications[0]?.id || '');
  const selectedApp = applications.find(a => a.id === applicationId) || applications[0];

  const [roleId, setRoleId] = useState(selectedApp?.availableRoles[0]?.id || '');
  const selectedRole = selectedApp?.availableRoles.find(r => r.id === roleId) || selectedApp?.availableRoles[0];

  const [level, setLevel] = useState<PermissionLevel>(selectedRole?.privilegeLevel || 'READ_WRITE');
  const [justification, setJustification] = useState('');
  const [selectedEntitlements, setSelectedEntitlements] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      setErrorMsg('A business justification is required for identity audit compliance.');
      return;
    }
    setErrorMsg('');

    grantPermission(employee.id, {
      employeeId: employee.id,
      applicationId: selectedApp.id,
      applicationName: selectedApp.name,
      roleId: selectedRole?.id || 'custom-role',
      roleName: selectedRole?.name || 'Custom Role',
      level,
      specificEntitlements: selectedEntitlements.length > 0 ? selectedEntitlements : ['General_Access'],
      grantedDate: new Date().toISOString().slice(0, 10),
      grantedBy: 'Administrator',
      justification
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Grant Application Entitlement</h2>
              <p className="text-[11px] text-slate-400">Target Identity: {employee.fullName} (<span className="text-amber-400 font-mono">{employee.employeeNumber}</span>)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Application *</label>
            <select
              value={applicationId}
              onChange={e => {
                const newAppId = e.target.value;
                setApplicationId(newAppId);
                const app = applications.find(a => a.id === newAppId);
                if (app && app.availableRoles.length > 0) {
                  setRoleId(app.availableRoles[0].id);
                  setLevel(app.availableRoles[0].privilegeLevel);
                }
              }}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.name} ({app.code}) — {app.securityClassification}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Application Role *</label>
              <select
                value={roleId}
                onChange={e => {
                  const newRoleId = e.target.value;
                  setRoleId(newRoleId);
                  const r = selectedApp?.availableRoles.find(role => role.id === newRoleId);
                  if (r) setLevel(r.privilegeLevel);
                }}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                {selectedApp?.availableRoles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Privilege Level *</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as PermissionLevel)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                <option value="READ_ONLY">READ_ONLY</option>
                <option value="READ_WRITE">READ_WRITE</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Business Justification (Audit Mandatory) *
            </label>
            <textarea
              required
              rows={3}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="e.g. Assigned to quarterly financial audit team; required for general ledger verification."
              className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {level === 'ADMIN' && employee.department !== 'IT & Information Security' && (
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-lg flex items-start gap-2 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-200">Warning:</strong> Assigning ADMIN privilege to non-IT personnel ({employee.department}) will generate an Excessive Privilege warning in the Centrix risk engine.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Grant Permission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
