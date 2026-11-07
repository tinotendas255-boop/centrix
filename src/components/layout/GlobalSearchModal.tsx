import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Layers, ShieldAlert, RotateCcw, ArrowRight } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    employees,
    applications,
    campaigns,
    violations,
    setActiveTab,
    setSelectedEmployeeId,
    setSelectedApplicationId,
    setSelectedCampaignId
  } = useAccessGuard();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedEmployees = trimmed
    ? employees
        .filter(
          e =>
            e.fullName.toLowerCase().includes(trimmed) ||
            e.employeeNumber.toLowerCase().includes(trimmed) ||
            e.email.toLowerCase().includes(trimmed) ||
            e.department.toLowerCase().includes(trimmed) ||
            e.jobTitle.toLowerCase().includes(trimmed)
        )
        .slice(0, 5)
    : [];

  const matchedApps = trimmed
    ? applications
        .filter(
          a =>
            a.name.toLowerCase().includes(trimmed) ||
            a.code.toLowerCase().includes(trimmed) ||
            a.department.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  const matchedCampaigns = trimmed
    ? campaigns
        .filter(
          c =>
            c.name.toLowerCase().includes(trimmed) ||
            c.campaignCode.toLowerCase().includes(trimmed) ||
            c.reviewPeriod.toLowerCase().includes(trimmed)
        )
        .slice(0, 3)
    : [];

  const matchedViolations = trimmed
    ? violations
        .filter(
          v =>
            v.title.toLowerCase().includes(trimmed) ||
            v.employeeName.toLowerCase().includes(trimmed) ||
            v.violationCode.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  const hasResults =
    matchedEmployees.length > 0 ||
    matchedApps.length > 0 ||
    matchedCampaigns.length > 0 ||
    matchedViolations.length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-[#0B101D] text-slate-100 rounded-xl shadow-2xl border border-slate-700/80 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-[#0D1424]">
          <Search className="w-5 h-5 text-amber-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search employees, systems, campaigns, SoD violations..."
            className="flex-1 text-sm bg-transparent outline-none text-white placeholder:text-slate-500 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-800/80 text-xs">
          {!query && (
            <div className="py-8 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
              <p className="font-semibold text-slate-300">Quick Global Search</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Try searching for &quot;Tendai&quot;, &quot;Financial Management&quot;, &quot;SoD&quot;, or &quot;Q4&quot;.
              </p>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-slate-300 font-medium">No matching records found</p>
              <p className="text-[11px] text-slate-500 mt-1">
                No employees, systems or campaigns matched &quot;{query}&quot;
              </p>
            </div>
          )}

          {/* Employees Results */}
          {matchedEmployees.length > 0 && (
            <div className="py-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Employees ({matchedEmployees.length})
              </div>
              {matchedEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployeeId(emp.id);
                    setActiveTab('employees');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[11px] text-amber-400">
                      {emp.employeeNumber}
                    </span>
                    <span className="font-semibold text-white">{emp.fullName}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 truncate">{emp.jobTitle}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        emp.riskLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : emp.riskLevel === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Risk: {emp.riskScore}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Applications */}
          {matchedApps.length > 0 && (
            <div className="py-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Applications ({matchedApps.length})
              </div>
              {matchedApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSelectedApplicationId(app.id);
                    setActiveTab('systems');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[11px] text-blue-400">{app.code}</span>
                    <span className="font-semibold text-white">{app.name}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{app.department}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Violations */}
          {matchedViolations.length > 0 && (
            <div className="py-2">
              <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Security Violations ({matchedViolations.length})
              </div>
              {matchedViolations.map(vio => (
                <button
                  key={vio.id}
                  onClick={() => {
                    setActiveTab('risks');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-semibold text-rose-300">{vio.title}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-medium">{vio.employeeName}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800">
                    {vio.severity}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Campaigns */}
          {matchedCampaigns.length > 0 && (
            <div className="py-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Recertification Campaigns ({matchedCampaigns.length})
              </div>
              {matchedCampaigns.map(camp => (
                <button
                  key={camp.id}
                  onClick={() => {
                    setSelectedCampaignId(camp.id);
                    setActiveTab('recertification');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[11px] text-amber-400">
                      {camp.campaignCode}
                    </span>
                    <span className="font-semibold text-white">{camp.name}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{camp.reviewPeriod}</span>
                  </div>
                  <span className="text-[10px] font-medium text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                    {camp.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-[#0A0F1D] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">ESC</kbd> to close</span>
          </div>
          <span className="font-mono text-[10px] text-amber-400 font-bold">Centrix Identity Search</span>
        </div>
      </div>
    </div>
  );
};
