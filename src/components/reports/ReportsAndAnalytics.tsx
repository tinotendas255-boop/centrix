import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { exportToCsv, printComplianceReport } from '../../utils/exportUtils';

export const ReportsAndAnalytics: React.FC = () => {
  const {
    employees,
    applications,
    campaigns,
    reviewItems,
    violations,
    correctiveActions,
    metrics
  } = useAccessGuard();

  const [selectedReport, setSelectedReport] = useState<string>('recertification');

  // Generate Report Data according to selectedReport
  const handleExportCsv = () => {
    switch (selectedReport) {
      case 'recertification': {
        const rows = reviewItems.map(r => ({
          CampaignID: r.campaignId,
          Employee: r.employeeName,
          Department: r.employeeDepartment,
          Application: r.applicationName,
          Role: r.roleName,
          PrivilegeLevel: r.permissionLevel,
          Reviewer: r.reviewerName,
          Decision: r.decision,
          Justification: r.decisionJustification || '',
          DecisionTimestamp: r.decisionTimestamp || '',
          IsOverdue: r.isOverdue ? 'YES' : 'NO'
        }));
        exportToCsv(rows, 'Centrix_Quarterly_Recertification_Audit');
        break;
      }
      case 'inventory': {
        const rows: any[] = [];
        employees.forEach(e => {
          e.permissions.forEach(p => {
            rows.push({
              EmployeeID: e.employeeNumber,
              FullName: e.fullName,
              Department: e.department,
              Status: e.employmentStatus,
              Application: p.applicationName,
              Role: p.roleName,
              Privilege: p.level,
              GrantedDate: p.grantedDate,
              GrantedBy: p.grantedBy,
              RiskScore: e.riskScore
            });
          });
        });
        exportToCsv(rows, 'Centrix_Employee_Access_Inventory');
        break;
      }
      case 'sod': {
        const rows = violations
          .filter(v => v.ruleType === 'SEGREGATION_OF_DUTIES')
          .map(v => ({
            ViolationCode: v.violationCode,
            Employee: v.employeeName,
            Department: v.employeeDepartment,
            Severity: v.severity,
            Description: v.description,
            WhyDangerous: v.whyDangerous,
            Mitigation: v.recommendedAction
          }));
        exportToCsv(rows, 'Centrix_Segregation_of_Duties_Violations');
        break;
      }
      case 'leavers': {
        const rows = employees
          .filter(
            e =>
              (e.employmentStatus === 'TERMINATED' || e.employmentStatus === 'RESIGNED') &&
              e.permissions.some(p => p.level !== 'NO_ACCESS')
          )
          .map(e => ({
            EmployeeID: e.employeeNumber,
            FullName: e.fullName,
            Status: e.employmentStatus,
            Department: e.department,
            TerminationDate: e.terminationDate || 'Recent',
            RetainedPermissionsCount: e.permissions.filter(p => p.level !== 'NO_ACCESS').length,
            RetainedSystems: e.permissions.map(p => p.applicationName).join('; ')
          }));
        exportToCsv(rows, 'Centrix_Inactive_Staff_Active_Access');
        break;
      }
      case 'actions': {
        const rows = correctiveActions.map(a => ({
          ActionCode: a.actionCode,
          Title: a.issueTitle,
          Employee: a.affectedEmployeeName,
          Application: a.affectedApplicationName,
          RiskLevel: a.riskLevel,
          Status: a.status,
          AssignedTo: a.assignedToName,
          DueDate: a.dueDate,
          ResolutionNotes: a.resolutionNotes || ''
        }));
        exportToCsv(rows, 'Centrix_Corrective_Action_Log');
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-amber-400" />
            Executive &amp; Regulatory Compliance Reporting Centre
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-grade governance documentation structured for the Reserve Bank of Zimbabwe, external ISO 27001 auditors, and Board Risk Committees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button
            onClick={printComplianceReport}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save as Audit PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedReport('recertification')}
          className={`px-3.5 py-2 rounded-lg font-semibold shrink-0 transition-all ${
            selectedReport === 'recertification'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
              : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Quarterly Recertification Audit
        </button>
        <button
          onClick={() => setSelectedReport('inventory')}
          className={`px-3.5 py-2 rounded-lg font-semibold shrink-0 transition-all ${
            selectedReport === 'inventory'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
              : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Employee Access Inventory
        </button>
        <button
          onClick={() => setSelectedReport('sod')}
          className={`px-3.5 py-2 rounded-lg font-semibold shrink-0 transition-all ${
            selectedReport === 'sod'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
              : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Segregation of Duties (SoD) Audit
        </button>
        <button
          onClick={() => setSelectedReport('leavers')}
          className={`px-3.5 py-2 rounded-lg font-semibold shrink-0 transition-all ${
            selectedReport === 'leavers'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
              : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Inactive Staff with Active Access
        </button>
        <button
          onClick={() => setSelectedReport('actions')}
          className={`px-3.5 py-2 rounded-lg font-semibold shrink-0 transition-all ${
            selectedReport === 'actions'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950/40'
              : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Corrective Action Log
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-2xl p-8 max-w-5xl mx-auto space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                OFFICIAL AUDIT REPORT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                REF: CTX-JFS-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Jenaya Financial Services · Identity Governance Report
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Generated via Centrix IGA Platform · Zimbabwe Business Innovation Forum Project ZB-33
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-0.5 font-mono">
            <div>
              Date Generated: <strong className="text-slate-200">{new Date().toLocaleDateString()}</strong>
            </div>
            <div>
              Classification: <strong className="text-rose-400">STRICTLY CONFIDENTIAL</strong>
            </div>
            <div>
              Standard: <strong className="text-slate-200">ISO/IEC 27001 (A.9.2.5)</strong>
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics Strip */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-[#070B12] rounded-lg border border-slate-800 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Identities</div>
            <div className="text-xl font-bold font-mono text-white">{metrics.totalEmployees}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Recertification Rate</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {metrics.recertificationCompletionRate}%
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Active Violations</div>
            <div className="text-xl font-bold font-mono text-rose-400">
              {metrics.criticalViolationsCount}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Remediations Open</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {metrics.outstandingCorrectiveActionsCount}
            </div>
          </div>
        </div>

        {/* Dynamic Report Content based on selectedReport */}
        {selectedReport === 'recertification' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1">
              Quarterly Recertification Campaign Log &amp; Manager Signoffs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
                <thead className="bg-[#070B12] font-semibold text-slate-300 text-[11px]">
                  <tr>
                    <th className="p-2.5">Employee</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Target System</th>
                    <th className="p-2.5">Level</th>
                    <th className="p-2.5">Reviewer</th>
                    <th className="p-2.5">Decision</th>
                    <th className="p-2.5">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {reviewItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-2.5 font-bold text-white">{item.employeeName}</td>
                      <td className="p-2.5 text-slate-400">{item.employeeDepartment}</td>
                      <td className="p-2.5 font-semibold text-slate-200">{item.applicationName}</td>
                      <td className="p-2.5 font-mono text-slate-400">{item.permissionLevel}</td>
                      <td className="p-2.5 text-slate-400">{item.reviewerName}</td>
                      <td className="p-2.5">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.decision === 'CERTIFIED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : item.decision === 'REVOKED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.decision}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 italic text-[11px]">
                        {item.decisionJustification || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'sod' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider border-b border-rose-900/50 pb-1">
              Segregation of Duties (SoD) Toxic Entitlement Violations
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
                <thead className="bg-rose-950/40 font-semibold text-rose-300 text-[11px]">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Employee</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Conflict Description</th>
                    <th className="p-2.5">Fraud Rationale</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {violations
                    .filter(v => v.ruleType === 'SEGREGATION_OF_DUTIES')
                    .map(vio => (
                      <tr key={vio.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-rose-400">{vio.violationCode}</td>
                        <td className="p-2.5 font-bold text-white">{vio.employeeName}</td>
                        <td className="p-2.5 text-slate-400">{vio.employeeDepartment}</td>
                        <td className="p-2.5 text-slate-300">{vio.description}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{vio.whyDangerous}</td>
                        <td className="p-2.5 font-mono text-[10px] font-bold text-rose-400">{vio.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'leavers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider border-b border-rose-900/50 pb-1">
              Orphan Accounts: Former Staff Retaining Active Credentials
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
                <thead className="bg-rose-950/40 font-semibold text-rose-300 text-[11px]">
                  <tr>
                    <th className="p-2.5">Employee ID</th>
                    <th className="p-2.5">Employee Name</th>
                    <th className="p-2.5">HR Status</th>
                    <th className="p-2.5">Prior Department</th>
                    <th className="p-2.5">Retained Systems</th>
                    <th className="p-2.5">Risk Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {employees
                    .filter(
                      e =>
                        (e.employmentStatus === 'TERMINATED' || e.employmentStatus === 'RESIGNED') &&
                        e.permissions.some(p => p.level !== 'NO_ACCESS')
                    )
                    .map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-slate-400">{emp.employeeNumber}</td>
                        <td className="p-2.5 font-bold text-white">{emp.fullName}</td>
                        <td className="p-2.5 font-mono font-bold text-rose-400">{emp.employmentStatus}</td>
                        <td className="p-2.5 text-slate-400">{emp.department}</td>
                        <td className="p-2.5">
                          {emp.permissions.map(p => (
                            <span
                              key={p.id}
                              className="inline-block text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800 px-1 py-0.5 rounded mr-1"
                            >
                              {p.applicationName}
                            </span>
                          ))}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-rose-400">CRITICAL ({emp.riskScore})</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Document Sign-off Footer */}
        <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-xs text-slate-400 font-mono">
          <div className="border-t border-slate-700 pt-2">
            <div>Prepared By: <strong className="text-slate-200">Alexander Jenaya</strong></div>
            <div className="text-[10px] text-slate-500">Head of Identity Governance</div>
          </div>
          <div className="border-t border-slate-700 pt-2">
            <div>Reviewed By: <strong className="text-slate-200">Dr. Chengetai Hove</strong></div>
            <div className="text-[10px] text-slate-500">Chief Internal Auditor</div>
          </div>
          <div className="border-t border-slate-700 pt-2">
            <div>Approved By: <strong className="text-slate-200">Ruvimbo Dube</strong></div>
            <div className="text-[10px] text-slate-500">Chief Financial Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
