import React, { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { UserRole } from '../../types';
import { DEPARTMENTS, BRANCHES } from '../../data/initialData';

export const OrganisationSettings: React.FC = () => {
  const {
    currentUser,
    switchUser,
    availableDemoUsers,
    resetToDemoData,
    metrics
  } = useAccessGuard();

  const [recertWindowDays, setRecertWindowDays] = useState(90);
  const [dormantThresholdDays, setDormantThresholdDays] = useState(90);
  const [maxReviewLatencyDays, setMaxReviewLatencyDays] = useState(180);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-amber-400" />
          Organisation Profile &amp; Governance Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tenant identity configuration for Jenaya Financial Services. Define recertification frequencies, dormancy thresholds, and test persona roles.
        </p>
      </div>

      {/* Role Personas Switcher Showcase */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Switch Active User Persona (Demonstration Experience)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how different roles experience Centrix with strict backend role-based access control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableDemoUsers.map(user => {
            const isCurrent = currentUser.role === user.role;

            return (
              <div
                key={user.id}
                onClick={() => switchUser(user.role as UserRole)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/20'
                    : 'bg-[#070B12] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">{user.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCurrent ? 'Active Persona' : 'Click to Switch'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-amber-400">{user.roleLabel}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {user.department} · {user.branch}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  {user.role === 'SUPER_ADMIN' && 'Full organizational visibility and configuration.'}
                  {user.role === 'DEPARTMENT_MANAGER' && 'Reviews departmental staff permissions and signs off campaigns.'}
                  {user.role === 'BRANCH_MANAGER' && 'Supervises branch employee access authorizations.'}
                  {user.role === 'IT_ADMIN' && 'Executes de-provisioning and remediates security alerts.'}
                  {user.role === 'AUDITOR' && 'Read-only access to audit logs and compliance reports.'}
                  {user.role === 'EMPLOYEE' && 'Self-service view of own profile and assigned systems.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Governance Thresholds Configuration Form */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Periodic Recertification &amp; Risk Detection Thresholds
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Parameters configured to adhere to Reserve Bank of Zimbabwe and ISO 27001 Access Control guidelines.
          </p>
        </div>

        <form onSubmit={handleSavePolicies} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Campaign Frequency Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={30}
                  max={365}
                  value={recertWindowDays}
                  onChange={e => setRecertWindowDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400 font-medium">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Default 90 days (Quarterly)</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Maximum Unreviewed Latency
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={60}
                  max={365}
                  value={maxReviewLatencyDays}
                  onChange={e => setMaxReviewLatencyDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400 font-medium">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Triggers Rule 6 when exceeded (180 days)</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Dormant Account Threshold
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={30}
                  max={180}
                  value={dormantThresholdDays}
                  onChange={e => setDormantThresholdDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070B12] border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400 font-medium">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Triggers Rule 5 when no login in 90 days</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {isSaved && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Governance parameters successfully updated.
              </span>
            )}
            {!isSaved && <span />}

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer shadow-md shadow-amber-950/30"
            >
              Update Policy Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* Synchronize & Reset State Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sync Trigger */}
        <div className="bg-[#0B101D] rounded-xl border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Directory Synchronization Agent</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Forces a SCIM 2.0 re-polling across all connected applications to detect external account changes and reconciliation drift.
          </p>
          <div className="pt-2 flex items-center justify-between">
            {syncSuccess ? (
              <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 10 Systems Re-synchronized
              </span>
            ) : isSyncing ? (
              <span className="text-amber-400 font-semibold text-xs flex items-center gap-1">
                <RefreshCw className="w-4 h-4 animate-spin" /> Polling SCIM Connectors...
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">Last sync: &lt;5 mins ago</span>
            )}

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Run Directory Sync
            </button>
          </div>
        </div>

        {/* Reset State */}
        <div className="bg-[#0B101D] rounded-xl border border-rose-900/50 p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-rose-300 text-sm">Reset Demonstration Data</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Restores all 100 employees, benchmark security test cases (Tendai Chigumba, John Moyo, Blessing Mutasa), campaigns and audit logs to the baseline state.
          </p>
          <div className="pt-2 flex items-center justify-between">
            {resetSuccess ? (
              <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Baseline demo state successfully restored.
              </span>
            ) : <span />}

            <button
              onClick={() => {
                resetToDemoData();
                setResetSuccess(true);
                setTimeout(() => setResetSuccess(false), 3500);
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
