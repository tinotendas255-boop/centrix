import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Server,
  ShieldCheck,
  Users,
  KeyRound,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { Application, SecurityClassification } from '../../types';
import { DEPARTMENTS } from '../../data/initialData';

export const SystemsManagement: React.FC = () => {
  const {
    applications,
    employees,
    createApplication,
    setSelectedEmployeeId,
    setActiveTab
  } = useAccessGuard();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form state for registering application
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].name);
  const [classification, setClassification] = useState<SecurityClassification>('CONFIDENTIAL');
  const [integrationType, setIntegrationType] = useState<Application['integrationType']>('DIRECT_API');

  const handleRegisterApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    createApplication({
      name,
      code: code.toUpperCase(),
      description,
      department,
      securityClassification: classification,
      integrationType,
      status: 'ACTIVE'
    });

    setIsRegisterOpen(false);
    setName('');
    setCode('');
    setDescription('');
  };

  // Find users for the selected application
  const appUsers = selectedApp
    ? employees.filter(e =>
        e.permissions.some(p => p.applicationId === selectedApp.id && p.level !== 'NO_ACCESS')
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Connected Systems &amp; Organizational Applications
            <span className="text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
              {applications.length} Connected
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Application inventory connected via Direct REST APIs, SAML 2.0 SSO, and SCIM 2.0 provisioning connectors.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Register System Integration
        </button>
      </div>

      {/* Architecture Disclaimer Strip */}
      <div className="p-3 bg-[#0B101D] border border-blue-900/60 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
        <Server className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-blue-300">Integration Architecture Architecture Note:</strong> Active system integrations are simulated with high-fidelity telemetry and seeded operational schemas for Jenaya Financial Services. The modular connector interface is structured so real-world SCIM 2.0, LDAP, and OAuth2 identity provider hooks can be deployed without refactoring governance logic.
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(app => {
          const userCount = employees.filter(e =>
            e.permissions.some(p => p.applicationId === app.id && p.level !== 'NO_ACCESS')
          ).length;

          const adminUsers = employees.filter(e =>
            e.permissions.some(
              p => p.applicationId === app.id && (p.level === 'ADMIN' || p.level === 'SUPER_ADMIN')
            )
          ).length;

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="bg-[#0B101D] rounded-xl border border-slate-800 hover:border-amber-500/50 p-5 shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                      {app.code}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1.5 group-hover:text-amber-400 transition-colors">
                      {app.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                      app.securityClassification === 'CRITICAL_FINANCIAL'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                        : app.securityClassification === 'RESTRICTED'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {app.securityClassification.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {app.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[170px]">{app.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">System Owner:</span>
                    <span className="font-semibold text-slate-200">{app.ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Connector Type:</span>
                    <span className="font-mono text-[11px] text-amber-400 font-semibold">{app.integrationType}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono font-semibold text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> {userCount} Users
                  </span>
                  {adminUsers > 0 && (
                    <span className="font-mono text-[11px] text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/60">
                      {adminUsers} Admins
                    </span>
                  )}
                </div>
                <span className="text-amber-400 font-semibold text-[11px] group-hover:underline">
                  Inspect Access →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B101D] rounded-xl shadow-2xl border border-slate-800 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-[#070B12] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                    {selectedApp.code}
                  </span>
                  <h3 className="text-base font-bold text-white">{selectedApp.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Owner: <strong className="text-slate-200">{selectedApp.ownerName}</strong> · Department: {selectedApp.department} · Classification: {selectedApp.securityClassification}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
              {/* Available Roles */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Available System Roles ({selectedApp.availableRoles.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedApp.availableRoles.map(role => (
                    <div key={role.id} className="p-3 bg-[#0D1527] border border-slate-800 rounded-lg">
                      <div className="font-semibold text-white">{role.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{role.description}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-amber-400">{role.privilegeLevel}</span>
                        <span className="text-slate-400">Weight: {role.riskWeight}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Users */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Active Users on this System ({appUsers.length})
                </h4>

                {appUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-[#0D1527] rounded-lg">
                    No users currently hold access to this system.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800/80 max-h-64 overflow-y-auto bg-[#070B12]">
                    {appUsers.map(emp => {
                      const userPerm = emp.permissions.find(p => p.applicationId === selectedApp.id);
                      return (
                        <div
                          key={emp.id}
                          className="p-2.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-slate-400 font-semibold">
                              {emp.employeeNumber}
                            </span>
                            <div>
                              <div className="font-bold text-white">{emp.fullName}</div>
                              <div className="text-[11px] text-slate-400">
                                {emp.jobTitle} · {emp.department}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                userPerm?.level === 'ADMIN' || userPerm?.level === 'SUPER_ADMIN'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}
                            >
                              {userPerm?.roleName} ({userPerm?.level})
                            </span>
                            <button
                              onClick={() => {
                                setSelectedApp(null);
                                setSelectedEmployeeId(emp.id);
                                setActiveTab('employees');
                              }}
                              className="px-2 py-1 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                            >
                              Profile →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#070B12] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px]">Last SCIM Sync: {new Date(selectedApp.lastSyncTimestamp).toLocaleString()}</span>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Application Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B101D] rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 bg-[#070B12] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Register Connected System</h3>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterApp} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Treasury Automated Clearing Gateway"
                  className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. APP-TACG-01"
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs uppercase text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Owner Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe functional purpose and data sensitivity..."
                  className="w-full p-2.5 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Security Classification</label>
                  <select
                    value={classification}
                    onChange={e => setClassification(e.target.value as SecurityClassification)}
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="CRITICAL_FINANCIAL">CRITICAL_FINANCIAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Connector Protocol</label>
                  <select
                    value={integrationType}
                    onChange={e => setIntegrationType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="DIRECT_API">Direct REST API</option>
                    <option value="SCIM_PROVISIONING">SCIM 2.0 Provisioning</option>
                    <option value="SAML_SSO">SAML 2.0 / SSO</option>
                    <option value="AGENT_SYNC">On-Prem Agent Sync</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-sm transition-all"
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
