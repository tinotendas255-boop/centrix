import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Edit3,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  Search,
  CheckSquare,
  Calendar,
  Layers,
  Building,
  UserCheck,
  X
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { RecertificationReviewItem, ReviewDecision } from '../../types';
import { NewCampaignModal } from './NewCampaignModal';
import { ReviewActionModal } from './ReviewActionModal';

export const RecertificationCentre: React.FC = () => {
  const {
    campaigns,
    reviewItems,
    currentUser,
    selectedCampaignId,
    setSelectedCampaignId,
    bulkCertifyReviews,
    setSelectedEmployeeId,
    setActiveTab
  } = useAccessGuard();

  const [activeCampaignFilter, setActiveCampaignFilter] = useState<string>(
    selectedCampaignId || campaigns[0]?.id || 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reviewerScope, setReviewerScope] = useState<'ALL' | 'MY_REVIEWS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<RecertificationReviewItem | null>(null);

  // Bulk selection state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [bulkJustification, setBulkJustification] = useState('');
  const [isBulkCertifyOpen, setIsBulkCertifyOpen] = useState(false);

  // Filtered Review Items
  const filteredReviews = useMemo(() => {
    return reviewItems.filter(item => {
      const matchCampaign =
        activeCampaignFilter === 'ALL' || item.campaignId === activeCampaignFilter;

      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'OVERDUE'
          ? item.decision === 'PENDING' && item.isOverdue
          : item.decision === statusFilter;

      const matchReviewer =
        reviewerScope === 'ALL' ||
        item.reviewerId === currentUser.id ||
        item.reviewerName === currentUser.name;

      const matchSearch =
        !searchQuery.trim() ||
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roleName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCampaign && matchStatus && matchReviewer && matchSearch;
    });
  }, [reviewItems, activeCampaignFilter, statusFilter, reviewerScope, searchQuery, currentUser]);

  const activeCampaign = campaigns.find(c => c.id === activeCampaignFilter) || campaigns[0];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(filteredReviews.filter(r => r.decision === 'PENDING').map(r => r.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [bulkErrorMsg, setBulkErrorMsg] = useState('');

  const handleExecuteBulkCertify = () => {
    if (!bulkJustification.trim()) {
      setBulkErrorMsg('A justification is required for bulk recertification audit tracking.');
      return;
    }
    setBulkErrorMsg('');

    bulkCertifyReviews(selectedItemIds, bulkJustification);
    setSelectedItemIds([]);
    setBulkJustification('');
    setIsBulkCertifyOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            Periodic User Access Recertification Centre
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarterly governance engine. Facilitates managerial review, automated revocations, entitlement modification, and compliance verification.
          </p>
        </div>

        <button
          onClick={() => setIsNewCampaignOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Initiate Recertification Campaign
        </button>
      </div>

      {/* Active Campaign Spotlight Card */}
      {activeCampaign && (
        <div className="bg-[#0B101D] text-white rounded-xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                {activeCampaign.campaignCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeCampaign.status === 'ACTIVE'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-emerald-500 text-slate-950 font-black'
                }`}
              >
                {activeCampaign.status}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Deadline: {activeCampaign.deadline}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {activeCampaign.name}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {activeCampaign.description}
            </p>
          </div>

          <div className="bg-[#0E1527] border border-slate-800 p-4 rounded-xl min-w-[240px] shrink-0 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-medium">
              <span>Campaign Velocity</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {activeCampaign.totalReviewItems > 0
                  ? Math.round(
                      (activeCampaign.completedReviewItems / activeCampaign.totalReviewItems) * 100
                    )
                  : 100}
                %
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    activeCampaign.totalReviewItems > 0
                      ? Math.round(
                          (activeCampaign.completedReviewItems /
                            activeCampaign.totalReviewItems) *
                            100
                        )
                      : 100
                  }%`
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px]">
              <div>
                <span className="text-slate-500 block">Total</span>
                <strong className="text-white">{activeCampaign.totalReviewItems}</strong>
              </div>
              <div>
                <span className="text-emerald-400 block">Done</span>
                <strong className="text-emerald-300">
                  {activeCampaign.completedReviewItems}
                </strong>
              </div>
              <div>
                <span className="text-rose-400 block">Revoked</span>
                <strong className="text-rose-300">{activeCampaign.revokedReviewItems}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Selector & Filters Toolbar */}
      <div className="bg-[#0B101D] p-4 rounded-xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Campaign Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {campaigns.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCampaignFilter(c.id);
                  setSelectedCampaignId(c.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeCampaignFilter === c.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#0E1527] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {c.campaignCode} ({c.reviewPeriod.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Quick Reviewer Scope Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setReviewerScope(reviewerScope === 'ALL' ? 'MY_REVIEWS' : 'ALL')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                reviewerScope === 'MY_REVIEWS'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-[#0E1527] border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              {reviewerScope === 'MY_REVIEWS' ? 'Filtering: Assigned to Me' : 'Showing All Reviewers'}
            </button>

            {selectedItemIds.length > 0 && (
              <button
                onClick={() => setIsBulkCertifyOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Bulk Certify ({selectedItemIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by employee, system, or role..."
              className="w-full pl-9 pr-3 py-2 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-700 rounded-lg bg-[#0D1527] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Decisions</option>
              <option value="PENDING">Pending Review</option>
              <option value="OVERDUE">Overdue Reviews</option>
              <option value="CERTIFIED">Certified</option>
              <option value="REVOKED">Revoked</option>
              <option value="MODIFY">Modified</option>
              <option value="ESCALATE">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Task Queue Table */}
      <div className="bg-[#0B101D] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D1527] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedItemIds.length > 0 &&
                      selectedItemIds.length ===
                        filteredReviews.filter(r => r.decision === 'PENDING').length
                    }
                    className="rounded text-amber-500 bg-[#0D1527] border-slate-700"
                  />
                </th>
                <th className="py-3 px-4">Employee Identity</th>
                <th className="py-3 px-4">System &amp; Entitlements</th>
                <th className="py-3 px-4">Privilege Level</th>
                <th className="py-3 px-4">Assigned Reviewer</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No recertification tasks found for the active criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map(item => {
                  const isOverdue = item.decision === 'PENDING' && item.isOverdue;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isOverdue ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          disabled={item.decision !== 'PENDING'}
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded text-amber-500 bg-[#0D1527] border-slate-700 disabled:opacity-30"
                        />
                      </td>

                      {/* Employee */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{item.employeeName}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.employeeJobTitle} · {item.employeeDepartment}
                        </div>
                      </td>

                      {/* System */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{item.applicationName}</div>
                        <div className="text-[11px] text-slate-400">{item.roleName}</div>
                        {item.entitlements.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.entitlements.slice(0, 2).map(ent => (
                              <span
                                key={ent}
                                className="text-[9px] font-mono bg-[#0D1527] text-slate-300 border border-slate-800 px-1 py-0.2 rounded"
                              >
                                {ent}
                              </span>
                            ))}
                            {item.entitlements.length > 2 && (
                              <span className="text-[9px] font-mono text-slate-500">
                                +{item.entitlements.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.permissionLevel === 'ADMIN' || item.permissionLevel === 'SUPER_ADMIN'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {item.permissionLevel}
                        </span>
                      </td>

                      {/* Reviewer */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        <div className="font-semibold text-white">{item.reviewerName}</div>
                        <div className="text-[10px] text-slate-500">Department Lead</div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-400">{item.dueDate}</div>
                        {isOverdue && (
                          <span className="text-[10px] font-bold font-mono text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 rounded inline-flex items-center gap-1 mt-0.5 animate-pulse">
                            <Clock className="w-3 h-3" /> OVERDUE
                          </span>
                        )}
                      </td>

                      {/* Decision */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            item.decision === 'CERTIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.decision === 'REVOKED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.decision === 'MODIFIED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : item.decision === 'ESCALATED'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.decision === 'CERTIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {item.decision === 'REVOKED' && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                          {item.decision === 'MODIFIED' && <Edit3 className="w-3 h-3 text-amber-400" />}
                          {item.decision === 'ESCALATED' && <AlertTriangle className="w-3 h-3 text-purple-400" />}
                          {item.decision}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedReviewItem(item)}
                          className="px-3 py-1 bg-[#0D1527] hover:bg-slate-800 border border-slate-700 text-amber-300 rounded font-semibold text-[11px] shadow-sm cursor-pointer transition-colors"
                        >
                          {item.decision === 'PENDING' ? 'Take Decision' : 'Update Decision'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#090E1B] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Showing {filteredReviews.length} recertification tasks</span>
          <span className="font-mono text-[10px] text-amber-400">Centrix Audit Verified · ISO 27001 A.9.2.5</span>
        </div>
      </div>

      {/* Review Action Modal */}
      {selectedReviewItem && (
        <ReviewActionModal
          reviewItem={selectedReviewItem}
          onClose={() => setSelectedReviewItem(null)}
        />
      )}

      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <NewCampaignModal onClose={() => setIsNewCampaignOpen(false)} />
      )}

      {/* Bulk Certify Dialog */}
      {isBulkCertifyOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 bg-[#090E1B] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Bulk Certify Access</h3>
              <button
                onClick={() => setIsBulkCertifyOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs text-slate-300">
              <p className="text-slate-300">
                You are certifying <strong className="text-amber-400">{selectedItemIds.length}</strong> pending review tasks in bulk. Please provide mandatory audit justification.
              </p>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Manager Justification *
                </label>
                <textarea
                  required
                  rows={3}
                  value={bulkJustification}
                  onChange={e => setBulkJustification(e.target.value)}
                  placeholder="e.g. Verified ongoing role alignment and baseline departmental duties."
                  className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-[#0D1527] text-white placeholder-slate-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
              {bulkErrorMsg && (
                <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
                  {bulkErrorMsg}
                </div>
              )}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkCertifyOpen(false)}
                  className="px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBulkCertify}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Confirm Bulk Certify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
