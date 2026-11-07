import React, { useState } from 'react';
import { X, RotateCcw, Calendar, CheckSquare, Layers, Building } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { DEPARTMENTS } from '../../data/initialData';

interface NewCampaignModalProps {
  onClose: () => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ onClose }) => {
  const { applications, createCampaign, currentUser } = useAccessGuard();

  const [name, setName] = useState('Q1 2027 Comprehensive Access Recertification');
  const [description, setDescription] = useState(
    'Quarterly access review for ISO 27001 & RBZ compliance across banking and financial systems.'
  );
  const [reviewPeriod, setReviewPeriod] = useState('Q1 2027 (Jan - Mar)');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [deadline, setDeadline] = useState('2026-12-15');

  const [selectedDepts, setSelectedDepts] = useState<string[]>(DEPARTMENTS.map(d => d.id));
  const [selectedApps, setSelectedApps] = useState<string[]>(applications.map(a => a.id));

  const toggleDept = (id: string) => {
    setSelectedDepts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleApp = (id: string) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedDepts.length === 0 || selectedApps.length === 0) {
      setErrorMsg('Please select at least one department and one application for the campaign scope.');
      return;
    }
    setErrorMsg('');

    createCampaign({
      name,
      description,
      reviewPeriod,
      startDate,
      deadline,
      includedDepartmentIds: selectedDepts,
      includedApplicationIds: selectedApps,
      assignedReviewerIds: ['emp-mgr-01', 'emp-mgr-02', 'emp-mgr-03', 'emp-mgr-06'],
      status: 'ACTIVE',
      createdBy: currentUser.name
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Initiate Recertification Campaign</h3>
              <p className="text-[11px] text-slate-400">Quarterly User Access Review Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Review Period *</label>
              <input
                type="text"
                required
                value={reviewPeriod}
                onChange={e => setReviewPeriod(e.target.value)}
                placeholder="e.g. Q4 2026"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white focus:border-amber-500/70 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Manager Sign-off Deadline *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white focus:border-amber-500/70 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Audit Mandate Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Department Scope */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                Departments in Scope ({selectedDepts.length}/{DEPARTMENTS.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedDepts(
                    selectedDepts.length === DEPARTMENTS.length ? [] : DEPARTMENTS.map(d => d.id)
                  )
                }
                className="text-[11px] text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                {selectedDepts.length === DEPARTMENTS.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-[#0E1527] border border-slate-800 rounded-lg">
              {DEPARTMENTS.map(d => (
                <label key={d.id} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(d.id)}
                    onChange={() => toggleDept(d.id)}
                    className="rounded text-amber-500 bg-[#0D1527] border-slate-700 focus:ring-amber-500"
                  />
                  <span className="truncate">{d.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Application Scope */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Connected Applications in Scope ({selectedApps.length}/{applications.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedApps(
                    selectedApps.length === applications.length ? [] : applications.map(a => a.id)
                  )
                }
                className="text-[11px] text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                {selectedApps.length === applications.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-[#0E1527] border border-slate-800 rounded-lg">
              {applications.map(app => (
                <label key={app.id} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedApps.includes(app.id)}
                    onChange={() => toggleApp(app.id)}
                    className="rounded text-amber-500 bg-[#0D1527] border-slate-700 focus:ring-amber-500"
                  />
                  <span className="truncate">{app.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300">
            <strong className="text-amber-200">Centrix Automated Task Generation:</strong> When initiated, Centrix will automatically inspect identity permissions in the scoped departments and systems, generating review tasks directly in the managers&apos; work queues.
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
              Launch Campaign &amp; Generate Tasks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
