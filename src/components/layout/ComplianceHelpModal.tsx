import React from 'react';
import { X, ShieldCheck, AlertTriangle, BookOpen, Layers, Award, Terminal } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';

export const ComplianceHelpModal: React.FC = () => {
  const { isHelpOpen, setIsHelpOpen, setActiveTab, setSelectedEmployeeId } = useAccessGuard();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Centrix Architecture &amp; Compliance Guide</h2>
              <p className="text-xs text-slate-400">
                User Recertification System Challenge (ZB-33) · Jenaya Financial Services
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Mission & Background */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Challenge Context: ZB-33 User Access Recertification
            </div>
            <p className="text-slate-300 text-xs">
              Issued by <strong>Jenaya Pvt Ltd</strong> through the <strong>Zimbabwe Business Innovation Forum</strong>. Centrix transforms traditional manual quarterly review processes into a real-time, centralized, and auditable Identity Governance and Administration (IGA) platform designed for Tier-1 banks, insurance corporations, and financial enterprises.
            </p>
          </div>

          {/* 7 Rules-Based Risk Engine */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Intelligent Risk Detection Engine (7 Active Rules)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 py-0.2 rounded font-bold">RULE 1</span>
                  Terminated / Resigned Employee Active Access
                </div>
                <p className="text-[11px] text-slate-400">
                  Flags former staff retaining active system accounts as <strong className="text-rose-300">CRITICAL</strong> risk (+55 points). Prevents post-resignation fraud.
                </p>
              </div>

              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 py-0.2 rounded font-bold">RULE 3</span>
                  Segregation of Duties (SoD) Conflicts
                </div>
                <p className="text-[11px] text-slate-400">
                  Identifies toxic entitlement combinations (e.g. Vendor Creation + Payment Release; Loan Origination + Disbursement) (+30 points).
                </p>
              </div>

              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-bold">RULE 2</span>
                  Excessive Administrative Privileges
                </div>
                <p className="text-[11px] text-slate-400">
                  Detects business/finance personnel with elevated admin or root database credentials outside IT (+25 points).
                </p>
              </div>

              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-bold">RULE 4</span>
                  Department Transfer Orphan Permissions
                </div>
                <p className="text-[11px] text-slate-400">
                  Flags users who transferred between departments but retained access privileges from their previous post (+20 points).
                </p>
              </div>

              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1 py-0.2 rounded font-bold">RULE 5</span>
                  Dormant Accounts (&gt;90 Days Inactive)
                </div>
                <p className="text-[11px] text-slate-400">
                  Identifies enabled accounts with zero login activity for over 90 days, closing attack surfaces (+15 points).
                </p>
              </div>

              <div className="p-3 border border-slate-800 rounded-lg bg-[#0E1527]">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1 py-0.2 rounded font-bold">RULE 6 &amp; 7</span>
                  Unreviewed Access &amp; Unjustified Admin
                </div>
                <p className="text-[11px] text-slate-400">
                  Detects identities overdue for quarterly review (&gt;180 days) and unmanaged administrative authorizations (+10-20 points).
                </p>
              </div>
            </div>
          </div>

          {/* Seeded Security Test Scenarios */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Seeded Benchmark Test Scenarios
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800 bg-[#0A0F1D]">
              <div className="p-2.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                  <span className="font-bold text-slate-100">1. Tendai Chigumba (JFS-0012)</span>
                  <p className="text-[11px] text-slate-400">
                    Status: Resigned on 2026-09-30, but still has active Read/Write on Financial Management System &amp; CBS.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployeeId('emp-001');
                    setActiveTab('employees');
                    setIsHelpOpen(false);
                  }}
                  className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-semibold rounded text-[11px] cursor-pointer"
                >
                  View Profile →
                </button>
              </div>

              <div className="p-2.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                  <span className="font-bold text-slate-100">2. John Moyo (JFS-0007)</span>
                  <p className="text-[11px] text-slate-400">
                    Senior Financial Accountant holding elevated DBA Administrator rights on Database Admin Console.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployeeId('emp-002');
                    setActiveTab('employees');
                    setIsHelpOpen(false);
                  }}
                  className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-semibold rounded text-[11px] cursor-pointer"
                >
                  View Profile →
                </button>
              </div>

              <div className="p-2.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                  <span className="font-bold text-slate-100">3. Blessing Mutasa (JFS-0034)</span>
                  <p className="text-[11px] text-slate-400">
                    Segregation of Duties Conflict: Can create new vendor records AND authorize outgoing payments.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployeeId('emp-004');
                    setActiveTab('employees');
                    setIsHelpOpen(false);
                  }}
                  className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-semibold rounded text-[11px] cursor-pointer"
                >
                  View Profile →
                </button>
              </div>

              <div className="p-2.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                  <span className="font-bold text-slate-100">4. Farai Sithole (JFS-0023)</span>
                  <p className="text-[11px] text-slate-400">
                    Transferred from Finance to Procurement, but retains legacy Financial Payment Authorization.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployeeId('emp-003');
                    setActiveTab('employees');
                    setIsHelpOpen(false);
                  }}
                  className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-semibold rounded text-[11px] cursor-pointer"
                >
                  View Profile →
                </button>
              </div>
            </div>
          </div>

          {/* Compliance Standards */}
          <div className="p-3 bg-[#0E1527] border border-slate-800 rounded-lg">
            <h4 className="font-bold text-slate-200 text-xs mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Regulatory Standards Enforced
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-300 mt-2">
              <div className="p-2 bg-[#080D1A] rounded border border-slate-800">
                <strong className="text-white">ISO/IEC 27001</strong>
                <p className="text-[10px] text-slate-400">A.9.2.5 Access review</p>
              </div>
              <div className="p-2 bg-[#080D1A] rounded border border-slate-800">
                <strong className="text-white">SOX Section 404</strong>
                <p className="text-[10px] text-slate-400">Internal financial controls</p>
              </div>
              <div className="p-2 bg-[#080D1A] rounded border border-slate-800">
                <strong className="text-white">COBIT 2019</strong>
                <p className="text-[10px] text-slate-400">DSS05.04 Identity Mgmt</p>
              </div>
              <div className="p-2 bg-[#080D1A] rounded border border-slate-800">
                <strong className="text-white">RBZ IT Mandates</strong>
                <p className="text-[10px] text-slate-400">Cybersecurity Guidelines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090E1B] flex items-center justify-end">
          <button
            onClick={() => setIsHelpOpen(false)}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md shadow-amber-500/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
