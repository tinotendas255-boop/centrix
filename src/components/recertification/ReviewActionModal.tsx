import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Edit3, AlertTriangle } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { RecertificationReviewItem, ReviewDecision } from '../../types';

interface ReviewActionModalProps {
  reviewItem: RecertificationReviewItem;
  onClose: () => void;
}

export const ReviewActionModal: React.FC<ReviewActionModalProps> = ({ reviewItem, onClose }) => {
  const { submitReviewDecision, currentUser } = useAccessGuard();

  const [decision, setDecision] = useState<ReviewDecision>('CERTIFIED');
  const [justification, setJustification] = useState('');
  const [escalateTo, setEscalateTo] = useState('Dr. Chengetai Hove (Internal Audit)');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (decision !== 'CERTIFIED' && !justification.trim()) {
      setErrorMsg('Mandatory justification is required when revoking, modifying, or escalating permissions.');
      return;
    }
    setErrorMsg('');

    submitReviewDecision(
      reviewItem.id,
      decision,
      justification || 'Manager affirmed ongoing business role necessity.',
      undefined,
      decision === 'ESCALATE' ? escalateTo : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Manager Access Recertification Decision</h3>
            <p className="text-[11px] text-amber-400 font-mono">Review Item #{reviewItem.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-300">
          {/* Employee & App Summary */}
          <div className="p-3 bg-[#0E1527] border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span>{reviewItem.employeeName}</span>
              <span className="font-mono text-amber-400">{reviewItem.permissionLevel}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {reviewItem.employeeJobTitle} · {reviewItem.employeeDepartment}
            </div>
            <div className="text-[11px] text-slate-200 pt-1 font-semibold">
              System: {reviewItem.applicationName} ({reviewItem.roleName})
            </div>
            {reviewItem.entitlements.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {reviewItem.entitlements.map(ent => (
                  <span
                    key={ent}
                    className="text-[10px] font-mono bg-[#090E1B] px-1.5 py-0.2 rounded border border-slate-800 text-slate-300"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Decision Choices */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Select Recertification Decision *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecision('CERTIFIED')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  decision === 'CERTIFIED'
                    ? 'bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/30 text-emerald-300 font-bold'
                    : 'bg-[#0E1527] border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1. CERTIFY</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  Affirm ongoing business necessity.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REVOKE')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  decision === 'REVOKE'
                    ? 'bg-rose-500/20 border-rose-500/50 ring-1 ring-rose-500/30 text-rose-300 font-bold'
                    : 'bg-[#0E1527] border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>2. REVOKE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  Recommend immediate de-provisioning.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('MODIFY')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  decision === 'MODIFY'
                    ? 'bg-amber-500/20 border-amber-500/50 ring-1 ring-amber-500/30 text-amber-300 font-bold'
                    : 'bg-[#0E1527] border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3. MODIFY</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  Request privilege change or reduction.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('ESCALATE')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  decision === 'ESCALATE'
                    ? 'bg-purple-500/20 border-purple-500/50 ring-1 ring-purple-500/30 text-purple-300 font-bold'
                    : 'bg-[#0E1527] border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>4. ESCALATE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  Flag access for fraud investigation.
                </div>
              </button>
            </div>
          </div>

          {/* Escalation Target if Escalate selected */}
          {decision === 'ESCALATE' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Escalate To</label>
              <select
                value={escalateTo}
                onChange={e => setEscalateTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-slate-200 focus:border-amber-500/70 focus:outline-none"
              >
                <option value="Dr. Chengetai Hove (Internal Audit)">Dr. Chengetai Hove (Chief Internal Auditor)</option>
                <option value="Fungai Muchena (Risk & Compliance)">Fungai Muchena (Head of Risk & Compliance)</option>
                <option value="Tinashe Zimuto (CISO)">Tinashe Zimuto (Chief Information Security Officer)</option>
              </select>
            </div>
          )}

          {/* Justification Textbox */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Reviewer Justification {decision !== 'CERTIFIED' ? '*' : '(Optional)'}
            </label>
            <textarea
              required={decision !== 'CERTIFIED'}
              rows={3}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder={
                decision === 'REVOKE'
                  ? 'State why employee no longer requires this permission (e.g. resigned, role change, excess)...'
                  : decision === 'MODIFY'
                  ? 'Detail requested privilege change (e.g. downgrade from ADMIN to READ_WRITE)...'
                  : decision === 'ESCALATE'
                  ? 'Detail potential fraud or conflict of interest concerns...'
                  : 'Affirm employee requires active credentials for duties...'
              }
              className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
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
              Submit Official Review Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
