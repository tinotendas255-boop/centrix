import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { Employee } from '../../types';
import { DEPARTMENTS, BRANCHES } from '../../data/initialData';

interface CsvImportModalProps {
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ onClose }) => {
  const { importEmployees } = useAccessGuard();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Partial<Employee>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sampleCsv = `firstName,lastName,email,department,branch,jobTitle,status
Kumbirai,Gatsi,kumbirai.gatsi@jenaya-finance.co.zw,Finance & Accounting,Harare Main Branch (Headquarters),Audit Senior,ACTIVE
Anesu,Muzenda,anesu.muzenda@jenaya-finance.co.zw,Banking Operations & Treasury,Bulawayo Commercial Hub,Teller,ACTIVE
Chiedza,Chikwanha,chiedza.chikwanha@jenaya-finance.co.zw,IT & Information Security,Harare Main Branch (Headquarters),Security Analyst,ACTIVE`;

  const parseCsv = (text: string) => {
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must contain a header row and at least one data row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows: Partial<Employee>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const vals = line.split(',').map(v => v.trim());

        const fName = vals[0] || 'Staff';
        const lName = vals[1] || 'Member';
        const email = vals[2] || `${fName.toLowerCase()}.${lName.toLowerCase()}@jenaya-finance.co.zw`;
        const dept = vals[3] || 'Finance & Accounting';
        const branch = vals[4] || 'Harare Main Branch (Headquarters)';
        const title = vals[5] || 'Associate';
        const status = (vals[6]?.toUpperCase() as any) || 'ACTIVE';

        rows.push({
          firstName: fName,
          lastName: lName,
          fullName: `${fName} ${lName}`,
          email,
          department: dept,
          departmentId: DEPARTMENTS.find(d => d.name === dept)?.id || 'dept-fin',
          branch,
          branchId: BRANCHES.find(b => b.name === branch)?.id || 'br-hre-main',
          jobTitle: title,
          employmentStatus: status,
          managerId: 'emp-mgr-01',
          managerName: 'Ruvimbo Dube',
          dateOfEmployment: new Date().toISOString().slice(0, 10),
          lastLoginDate: new Date().toISOString(),
          assignedApplications: ['app-collab'],
          permissions: [],
          riskScore: 0,
          riskLevel: 'LOW',
          riskFactors: [],
          lastAccessReviewDate: new Date().toISOString().slice(0, 10),
          isPrivilegedUser: false
        });
      }

      setParsedRows(rows);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV');
    }
  };

  const handleImport = () => {
    if (parsedRows.length === 0) return;

    const newEmployees: Employee[] = parsedRows.map((r, idx) => ({
      ...r,
      id: `emp-imp-${Date.now()}-${idx}`,
      employeeNumber: `JFS-${Math.floor(1000 + Math.random() * 9000)}`
    } as Employee));

    importEmployees(newEmployees);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Import Employee Identities via CSV</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Paste CSV Data or Template</label>
              <button
                type="button"
                onClick={() => {
                  setCsvText(sampleCsv);
                  parseCsv(sampleCsv);
                }}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Load Sample Template
              </button>
            </div>
            <textarea
              rows={6}
              value={csvText}
              onChange={e => {
                setCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder="firstName,lastName,email,department,branch,jobTitle,status"
              className="w-full p-2.5 font-mono text-xs border border-slate-700 rounded-lg bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between font-semibold text-white mb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> {parsedRows.length} Validated Records Ready
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800 bg-[#0E1527]">
                {parsedRows.slice(0, 5).map((r, idx) => (
                  <div key={idx} className="p-2 text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-white">{r.fullName}</span>
                    <span className="text-slate-400">{r.jobTitle}</span>
                    <span className="text-slate-500">{r.department}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{r.employmentStatus}</span>
                  </div>
                ))}
                {parsedRows.length > 5 && (
                  <div className="p-1.5 text-center text-slate-500 text-[10px] font-mono">
                    ...and {parsedRows.length - 5} more records
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={parsedRows.length === 0}
              onClick={handleImport}
              className={`px-4 py-1.5 text-slate-950 font-bold rounded-lg shadow-sm transition-all ${
                parsedRows.length > 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 cursor-pointer shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Import {parsedRows.length} Identities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
