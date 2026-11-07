import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Upload,
  Download,
  AlertTriangle,
  ShieldAlert,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { Employee, EmploymentStatus, RiskLevel } from '../../types';
import { DEPARTMENTS, BRANCHES } from '../../data/initialData';
import { exportToCsv } from '../../utils/exportUtils';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import { EmployeeFormModal } from './EmployeeFormModal';
import { CsvImportModal } from './CsvImportModal';
import { GrantRevokeModal } from '../permissions/GrantRevokeModal';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    selectedEmployeeId,
    setSelectedEmployeeId,
    deactivateEmployee,
    currentUser
  } = useAccessGuard();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'id' | 'review'>('risk');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [grantModalEmpId, setGrantModalEmpId] = useState<string | null>(null);

  // Filter logic
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch =
          !searchQuery.trim() ||
          emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept || emp.departmentId === selectedDept;
        const matchesBranch = selectedBranch === 'ALL' || emp.branch === selectedBranch || emp.branchId === selectedBranch;
        const matchesStatus = selectedStatus === 'ALL' || emp.employmentStatus === selectedStatus;
        const matchesRisk = selectedRisk === 'ALL' || emp.riskLevel === selectedRisk;

        return matchesSearch && matchesDept && matchesBranch && matchesStatus && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') return b.riskScore - a.riskScore;
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'id') return a.employeeNumber.localeCompare(b.employeeNumber);
        if (sortBy === 'review') return (a.lastAccessReviewDate || '').localeCompare(b.lastAccessReviewDate || '');
        return 0;
      });
  }, [employees, searchQuery, selectedDept, selectedBranch, selectedStatus, selectedRisk, sortBy]);

  // Export CSV handler
  const handleExportCsv = () => {
    const exportRows = filteredEmployees.map(e => ({
      EmployeeID: e.employeeNumber,
      FullName: e.fullName,
      Email: e.email,
      Department: e.department,
      Branch: e.branch,
      JobTitle: e.jobTitle,
      Status: e.employmentStatus,
      RiskScore: e.riskScore,
      RiskLevel: e.riskLevel,
      ActivePermissionsCount: e.permissions.filter(p => p.level !== 'NO_ACCESS').length,
      LastReviewDate: e.lastAccessReviewDate
    }));
    exportToCsv(exportRows, 'AccessGuard_Employee_Identities');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Employee Identity Directory
            <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {filteredEmployees.length} of {employees.length} records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive identity catalog for Jenaya Financial Services. Continuous monitoring for orphaned access and privileged entitlements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCsvImportOpen(true)}
            className="px-3 py-1.5 bg-[#0D1527] border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" /> Import CSV
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-[#0D1527] border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button
            onClick={() => {
              setEmployeeToEdit(null);
              setIsCreateOpen(true);
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 fill-slate-950" /> Create Employee
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, employee ID (e.g. JFS-0012), email, or title..."
              className="w-full pl-9 pr-3 py-2 border border-slate-700/80 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Branches</option>
              {BRANCHES.map(b => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="RESIGNED">Resigned</option>
              <option value="TERMINATED">Terminated</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>

            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (70-100)</option>
              <option value="HIGH">High Risk (40-69)</option>
              <option value="MODERATE">Moderate Risk (20-39)</option>
              <option value="LOW">Low Risk (0-19)</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-amber-300 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="risk">Sort: Highest Risk</option>
              <option value="name">Sort: Full Name</option>
              <option value="id">Sort: Employee ID</option>
              <option value="review">Sort: Review Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D1527] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Identity &amp; Title</th>
                <th className="py-3 px-4">Department &amp; Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Connected Systems</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Last Review</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No employee identities match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const isOrphanAccess =
                    (emp.employmentStatus === 'RESIGNED' || emp.employmentStatus === 'TERMINATED') &&
                    emp.permissions.some(p => p.level !== 'NO_ACCESS');

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isOrphanAccess ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {emp.employeeNumber}
                      </td>

                      {/* Name & Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {emp.fullName}
                          {isOrphanAccess && (
                            <span
                              title="CRITICAL HAZARD: Terminated employee retaining active credentials!"
                              className="text-rose-400 inline-flex items-center"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {emp.jobTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                          {emp.email}
                        </div>
                      </td>

                      {/* Department & Branch */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200 truncate max-w-[170px]">
                          {emp.department}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {emp.branch.split('(')[0]}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            emp.employmentStatus === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : emp.employmentStatus === 'RESIGNED' || emp.employmentStatus === 'TERMINATED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {emp.employmentStatus}
                        </span>
                      </td>

                      {/* Connected Systems */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                          {emp.permissions.filter(p => p.level !== 'NO_ACCESS').length === 0 ? (
                            <span className="text-slate-500 text-[11px]">No access</span>
                          ) : (
                            emp.permissions
                              .filter(p => p.level !== 'NO_ACCESS')
                              .slice(0, 3)
                              .map(p => (
                                <span
                                  key={p.id}
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700"
                                  title={`${p.applicationName} (${p.level})`}
                                >
                                  {p.applicationName.split(' ')[0]}
                                </span>
                              ))
                          )}
                          {emp.permissions.filter(p => p.level !== 'NO_ACCESS').length > 3 && (
                            <span className="text-[10px] font-mono text-slate-400">
                              +{emp.permissions.filter(p => p.level !== 'NO_ACCESS').length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              emp.riskLevel === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : emp.riskLevel === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : emp.riskLevel === 'MODERATE'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {emp.riskScore}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {emp.riskLevel}
                          </span>
                        </div>
                      </td>

                      {/* Last Review */}
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {emp.lastAccessReviewDate || 'Never'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEmployeeId(emp.id)}
                            className="px-2.5 py-1 bg-[#0D1527] hover:bg-slate-800 border border-slate-700 text-amber-300 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => setGrantModalEmpId(emp.id)}
                            className="px-2 py-1 text-cyan-400 hover:bg-cyan-500/10 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Grant New Permission"
                          >
                            +Access
                          </button>
                          <button
                            onClick={() => {
                              setEmployeeToEdit(emp);
                              setIsCreateOpen(true);
                            }}
                            className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded text-[11px] cursor-pointer"
                          >
                            Edit
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

        {/* Table Footer */}
        <div className="p-3 bg-[#090E1B] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
          <span className="font-mono text-[10px] text-amber-400">Centrix Identity Registry</span>
        </div>
      </div>

      {/* Profile Dossier Modal */}
      {selectedEmployeeId && (
        <EmployeeProfileModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
          onOpenGrantModal={empId => {
            setSelectedEmployeeId(null);
            setGrantModalEmpId(empId);
          }}
        />
      )}

      {/* Create / Edit Modal */}
      {isCreateOpen && (
        <EmployeeFormModal
          onClose={() => {
            setIsCreateOpen(false);
            setEmployeeToEdit(null);
          }}
          employeeToEdit={employeeToEdit}
        />
      )}

      {/* CSV Import Modal */}
      {isCsvImportOpen && (
        <CsvImportModal onClose={() => setIsCsvImportOpen(false)} />
      )}

      {/* Grant Permission Modal */}
      {grantModalEmpId && (
        <GrantRevokeModal
          employeeId={grantModalEmpId}
          onClose={() => setGrantModalEmpId(null)}
        />
      )}
    </div>
  );
};
