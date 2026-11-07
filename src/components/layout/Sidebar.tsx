import React from 'react';
import {
  LayoutDashboard,
  Users,
  Fingerprint,
  Layers,
  KeyRound,
  RotateCcw,
  ShieldAlert,
  GitPullRequest,
  Wrench,
  FileBarChart,
  ScrollText,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
  category?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    metrics,
    currentUser
  } = useAccessGuard();

  const navigationItems: NavItem[] = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, category: 'GOVERNANCE' },
    { id: 'employees', label: 'Employee Directory', icon: Users, category: 'GOVERNANCE' },
    { id: 'identities', label: 'Identity Lifecycle', icon: Fingerprint, category: 'GOVERNANCE' },
    { id: 'systems', label: 'Systems & Applications', icon: Layers, category: 'ACCESS MATRIX' },
    { id: 'permissions', label: 'Access Permissions & RBAC', icon: KeyRound, category: 'ACCESS MATRIX' },
    {
      id: 'recertification',
      label: 'Recertification Centre',
      icon: RotateCcw,
      badge: metrics.pendingReviewsCount,
      badgeColor: 'bg-blue-600 text-white',
      category: 'AUDIT & COMPLIANCE'
    },
    {
      id: 'risks',
      label: 'Risk & Violations Engine',
      icon: ShieldAlert,
      badge: metrics.criticalViolationsCount,
      badgeColor: 'bg-rose-600 text-white',
      category: 'AUDIT & COMPLIANCE'
    },
    { id: 'workflows', label: 'Approval Workflows', icon: GitPullRequest, category: 'AUDIT & COMPLIANCE' },
    {
      id: 'actions',
      label: 'Corrective Actions',
      icon: Wrench,
      badge: metrics.outstandingCorrectiveActionsCount,
      badgeColor: 'bg-amber-600 text-white',
      category: 'REMEDIATION'
    },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, category: 'REMEDIATION' },
    { id: 'audit', label: 'Immutable Audit Trail', icon: ScrollText, category: 'REMEDIATION' },
    { id: 'settings', label: 'Organisation Settings', icon: Building2, category: 'ADMINISTRATION' }
  ];

  return (
    <aside className="w-64 bg-[#0A1120] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 select-none z-20 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/90 flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              AccessGuard
              <span className="text-[10px] font-mono tracking-normal text-blue-400 bg-blue-950/60 border border-blue-800/50 px-1.5 py-0.2 rounded">
                IGA
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Enterprise Access Governance</span>
          </div>
        </div>

        {/* Organisation Context Indicator */}
        <div className="mt-2.5 px-2.5 py-2 rounded-md bg-slate-900/90 border border-slate-800 text-xs">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Active Tenant
          </div>
          <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
            Jenaya Financial Services
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
            <span>Harare HQ</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[9px]">
              SIMULATED LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        {navigationItems.map((item, idx) => {
          const isActive = activeTab === item.id;
          const showCategory = idx === 0 || navigationItems[idx - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {showCategory && (
                <div className="px-2 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Context & Role Footer */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-900/60">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-600">
              {currentUser.avatarInitials}
            </div>
            <div className="truncate">
              <div className="font-semibold text-slate-200 text-xs truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.roleLabel}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            title="Switch User Role or Settings"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
