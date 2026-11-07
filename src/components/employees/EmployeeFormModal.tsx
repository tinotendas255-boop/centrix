import React, { useState } from 'react';
import { X, UserPlus, Building, MapPin, Briefcase, Mail } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { DEPARTMENTS, BRANCHES } from '../../data/initialData';
import { Employee, EmploymentStatus } from '../../types';

interface EmployeeFormModalProps {
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ onClose, employeeToEdit }) => {
  const { createEmployee, updateEmployee } = useAccessGuard();

  const [firstName, setFirstName] = useState(employeeToEdit?.firstName || '');
  const [lastName, setLastName] = useState(employeeToEdit?.lastName || '');
  const [email, setEmail] = useState(employeeToEdit?.email || '');
  const [departmentId, setDepartmentId] = useState(employeeToEdit?.departmentId || DEPARTMENTS[0].id);
  const [branchId, setBranchId] = useState(employeeToEdit?.branchId || BRANCHES[0].id);
  const [jobTitle, setJobTitle] = useState(employeeToEdit?.jobTitle || '');
  const [status, setStatus] = useState<EmploymentStatus>(employeeToEdit?.employmentStatus || 'ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !jobTitle) {
      setErrorMsg('Please fill in required identity details.');
      return;
    }
    setErrorMsg('');

    const deptObj = DEPARTMENTS.find(d => d.id === departmentId)!;
    const branchObj = BRANCHES.find(b => b.id === branchId)!;

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@jenaya-finance.co.zw`,
        department: deptObj.name,
        departmentId: deptObj.id,
        branch: branchObj.name,
        branchId: branchObj.id,
        jobTitle,
        employmentStatus: status,
        managerId: deptObj.managerId,
        managerName: deptObj.managerName
      });
    } else {
      createEmployee({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@jenaya-finance.co.zw`,
        department: deptObj.name,
        departmentId: deptObj.id,
        branch: branchObj.name,
        branchId: branchObj.id,
        jobTitle,
        employmentStatus: status,
        managerId: deptObj.managerId,
        managerName: deptObj.managerName
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">
              {employeeToEdit ? 'Edit Employee Identity' : 'Provision New Employee Record'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="e.g. Tendai"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="e.g. Chigumba"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="auto-generated if empty: name@jenaya-finance.co.zw"
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department *</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Branch Location *</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Treasury Accountant"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Employment Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as EmploymentStatus)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="RESIGNED">RESIGNED</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#0E1527] border border-slate-800 rounded-lg text-[11px] text-slate-400">
            <strong className="text-amber-400">Centrix Governance Note:</strong> Marking an employee as Resigned or Terminated while they still retain active permissions triggers an automatic <strong className="text-rose-400">Critical Security Violation</strong>.
          </div>

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
              {employeeToEdit ? 'Save Changes' : 'Create Identity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
