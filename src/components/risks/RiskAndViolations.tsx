import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Terminal,
  BookOpen
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { SecurityViolation, RiskLevel } from '../../types';
import { SOD_RULES } from '../../utils/riskEngine';

export const RiskAndViolations: React.FC = () => {
  const {
    violations,
    createCorrectiveAction,
    revokePermission,
    employees,
    setSelectedEmployeeId,
    setActiveTab
  } = useAccessGuard();

  const [activeTab, setRiskTab] = useState<'violations' | 'sod_matrix' | 'rules'>('violations');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedRule, setSelectedRule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedViolation, setSelectedViolation] = useState<SecurityViolation | null>(null);

  const filteredViolations = violations.filter(v => {
    const matchSev = selectedSeverity === 'ALL' || v.severity === selectedSeverity;
    const matchRule = selectedRule === 'ALL' || v.ruleType === selectedRule;
    const matchSearch =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.violationCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSev && matchRule && matchSearch;
  });

  const handleRemediateViolation = (vio: SecurityViolation) => {
    // 1. Create corrective action record
    createCorrectiveAction({
      issueTitle: vio.title,
      issueDescription: vio.description,
      affectedEmployeeId: vio.employeeId,
      affectedEmployeeName: vio.employeeName,
      affectedApplicationId: vio.applicationId,
      affectedApplicationName: vio.applicationName,
      riskLevel: vio.severity,
      recommendedAction: vio.recommendedAction,
      assignedToId: 'emp-mgr-03',
      assignedToName: 'Tinashe Zimuto (IT Admin)',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      status: 'IN_PROGRESS',
      resolutionNotes: `Remediation initiated directly from Risk Engine for violation ${vio.violationCode}.`,
      violationId: vio.id
    });

    // 2. Route user to corrective actions tab
    setActiveTab('actions');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Intelligent Risk Detection &amp; Segregation of Duties Engine
            <span className="text-xs font-mono font-medium text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
              {violations.length} Active Security Flags
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent, explainable risk engine inspecting identity lifecycles, cross-system entitlements and toxic fraud combinations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0B101D] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setRiskTab('violations')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'violations' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Violations ({violations.length})
          </button>
          <button
            onClick={() => setRiskTab('sod_matrix')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'sod_matrix' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            SoD Conflict Matrix ({SOD_RULES.length})
          </button>
          <button
            onClick={() => setRiskTab('rules')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'rules' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Detection Rules (7)
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE VIOLATIONS */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          {/* Filters Toolbar */}
          <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search violations by title, employee, or violation code..."
                className="w-full pl-9 pr-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto text-xs">
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Severity</option>
                <option value="HIGH">High Severity</option>
                <option value="MODERATE">Moderate Severity</option>
              </select>

              <select
                value={selectedRule}
                onChange={e => setSelectedRule(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Rule Categories</option>
                <option value="TERMINATED_EMPLOYEE_ACTIVE_ACCESS">Terminated Employee Active Access</option>
                <option value="SEGREGATION_OF_DUTIES">Segregation of Duties (SoD)</option>
                <option value="UNAUTHORIZED_ADMIN_PRIVILEGE">Unauthorized Admin Access</option>
                <option value="DEPARTMENT_TRANSFER_ORPHAN">Department Transfer Orphan</option>
                <option value="DORMANT_ACCOUNT">Dormant Account</option>
                <option value="UNREVIEWED_ACCESS">Unreviewed Access</option>
              </select>
            </div>
          </div>

          {/* Violations Cards */}
          <div className="space-y-3">
            {filteredViolations.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-[#0B101D] rounded-xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h3 className="font-bold text-white text-sm">No Security Violations Found</h3>
                <p className="text-xs text-slate-400 mt-1">All identities comply with configured governance rules.</p>
              </div>
            ) : (
              filteredViolations.map(vio => (
                <div
                  key={vio.id}
                  className={`p-5 rounded-xl border transition-all ${
                    vio.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      : vio.severity === 'HIGH'
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-[#0B101D] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {vio.severity === 'CRITICAL' ? (
                          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                            {vio.violationCode}
                          </span>
                          <h3 className="font-bold text-white text-sm">{vio.title}</h3>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>Identity: <strong className="text-slate-200">{vio.employeeName}</strong></span>
                          <span>·</span>
                          <span>Department: {vio.employeeDepartment}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px] text-slate-400">{new Date(vio.detectedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          vio.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : vio.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {vio.severity}
                      </span>
                    </div>
                  </div>

                  {/* Descriptive Breakdown */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {vio.description}
                  </p>

                  {/* 2-Column Risk Rationale & Mitigation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                    <div className="p-3 bg-[#0E1527] rounded-lg border border-rose-500/20 text-slate-300">
                      <span className="font-bold text-rose-400 block mb-0.5">Why this is dangerous:</span>
                      <p className="text-[11px] leading-relaxed text-slate-400">{vio.whyDangerous}</p>
                    </div>
                    <div className="p-3 bg-[#0E1527] rounded-lg border border-emerald-500/20 text-slate-300">
                      <span className="font-bold text-emerald-400 block mb-0.5">Recommended Remediation:</span>
                      <p className="text-[11px] leading-relaxed text-slate-400">{vio.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setSelectedEmployeeId(vio.employeeId);
                        setActiveTab('employees');
                      }}
                      className="font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      Inspect Identity Profile →
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemediateViolation(vio)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Create Corrective Action
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SEGREGATION OF DUTIES (SOD) CONFLICT MATRIX */}
      {activeTab === 'sod_matrix' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0B101D] text-white rounded-xl border border-slate-800 text-xs flex items-start gap-3 shadow-xl">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white text-sm">Segregation of Duties (SoD) Framework</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                Configured rules enforce mathematical separation between conflicting operational entitlements. A single identity cannot possess both privileges simultaneously without creating an audit violation.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {SOD_RULES.map(rule => (
              <div
                key={rule.id}
                className="bg-[#0B101D] p-5 rounded-xl border border-slate-800 shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                        {rule.ruleCode}
                      </span>
                      <h3 className="font-bold text-white text-sm">{rule.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{rule.description}</p>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      rule.riskLevel === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {rule.riskLevel}
                  </span>
                </div>

                {/* Conflict Entitlements Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0E1527] p-3 rounded-lg border border-slate-800">
                  <div className="p-2.5 bg-[#090E1B] rounded border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Restricted Entitlement A</span>
                    <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">{rule.entitlementA}</div>
                  </div>
                  <div className="p-2.5 bg-[#090E1B] rounded border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Restricted Entitlement B</span>
                    <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">{rule.entitlementB}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <strong className="text-rose-400">Fraud / Risk Exposure:</strong> {rule.conflictRationale}
                  </div>
                  <div>
                    <strong className="text-emerald-400">Recommended Control:</strong> {rule.recommendedMitigation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 7 DETECTION RULES CONSTITUTION */}
      {activeTab === 'rules' && (
        <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-xl p-6 space-y-5 text-xs text-slate-300">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Centrix Rules-Based Risk Detection Engine Constitution
            </h3>
            <p className="text-slate-400 text-xs">
              Mathematical scoring rules executing across all employee identities. Weights are cumulative and transparently explainable.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-800">
            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">RULE 1</span>
                TERMINATED EMPLOYEE ACTIVE ACCESS (CRITICAL · +55 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                If an employee&apos;s employment status is TERMINATED or RESIGNED and they retain active permissions on any connected application, an immediate CRITICAL violation is generated and identity risk score increases by 55 points.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">RULE 2</span>
                EXCESSIVE PRIVILEGES &amp; NON-IT ADMINS (HIGH · +25 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Identifies business users possessing ADMIN or SUPER_ADMIN access outside the IT &amp; Information Security department without privileged identity authorization.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">RULE 3</span>
                SEGREGATION OF DUTIES (SoD) CONFLICTS (CRITICAL · +30 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Identifies toxic entitlement combinations such as Supplier Creation + Payment Authorization or Loan Origination + Loan Disbursement.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">RULE 4</span>
                DEPARTMENT TRANSFER ORPHAN ACCESS (HIGH · +20 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Flags identities who transferred between business units but retained permissions belonging exclusively to their previous department.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">RULE 5</span>
                DORMANT ACCOUNTS &gt;90 DAYS INACTIVE (MODERATE · +15 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Accounts that have not recorded authentication telemetry for over 90 calendar days are flagged for deactivation.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">RULE 6</span>
                UNREVIEWED ACCESS OVERDUE &gt;180 DAYS (MODERATE · +10 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Identities whose permissions have not undergone managerial recertification in over 180 days violate periodic review frequency policies.
              </p>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">RULE 7</span>
                ADMINISTRATIVE PRIVILEGES WITHOUT JUSTIFICATION (HIGH · +20 Points)
              </div>
              <p className="text-slate-400 text-xs mt-1">
                System administrative authorizations lacking verified business justification or review timestamps are flagged for compliance audit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
