import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Users,
  KeyRound,
  RotateCcw,
  ShieldAlert,
  FileBarChart,
  Grid,
  Search,
  Bell,
  ChevronDown,
  Layers,
  GitPullRequest,
  Wrench,
  ScrollText,
  Building2,
  Fingerprint,
  RotateCcw as ResetIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { UserRole } from '../../types';

export const CentrixNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchUser,
    availableDemoUsers,
    notifications,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsHelpOpen,
    resetToDemoData,
    metrics
  } = useAccessGuard();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'employees', label: 'People', icon: Users },
    { id: 'permissions', label: 'Access', icon: KeyRound },
    {
      id: 'recertification',
      label: 'Recertification',
      icon: RotateCcw,
      badge: metrics.pendingReviewsCount
    },
    {
      id: 'risks',
      label: 'Risk',
      icon: ShieldAlert,
      badge: metrics.criticalViolationsCount
    },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  const moreItems = [
    { id: 'identities', label: 'Identity Lifecycle (JML)', icon: Fingerprint, desc: 'Orphan accounts & leaver de-provisioning' },
    { id: 'systems', label: 'Connected Systems & Apps', icon: Layers, desc: '10 enterprise banking applications' },
    { id: 'workflows', label: 'Approval Workflows', icon: GitPullRequest, desc: 'Multi-level managerial signoff pipelines' },
    { id: 'actions', label: 'Corrective Actions', icon: Wrench, badge: metrics.outstandingCorrectiveActionsCount, desc: 'Remediation tracking & execution' },
    { id: 'audit', label: 'Immutable Audit Trail', icon: ScrollText, desc: 'Cryptographic tamper-evident logs' },
    { id: 'settings', label: 'Organisation Settings', icon: Building2, desc: 'Policies, thresholds & directory sync' },
  ];

  return (
    <header className="h-16 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      {/* Left: Centrix Logo & Brand */}
      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="h-9 flex items-center">
            <img
              src="/assets/aistudio/Centrix_Intelligent_Security_Logo_2c4f4773.png"
              alt="Centrix"
              className="h-8 max-w-[170px] object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              onError={(e) => {
                // Fallback if public path is resolved directly
                (e.target as HTMLImageElement).src = '/public/assets/aistudio/Centrix_Intelligent_Security_Logo_2c4f4773.png';
              }}
            />
          </div>
        </button>

        {/* Primary Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#0C1220]/90 p-1 rounded-full border border-slate-800/80 shadow-inner">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950 stroke-[2.2]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                moreItems.some(m => m.id === activeTab)
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0D1424] rounded-xl shadow-2xl border border-slate-700/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Extended Governance Modules
                </div>
                <div className="space-y-0.5 mt-1">
                  {moreItems.map(m => {
                    const isSubActive = activeTab === m.id;
                    const SubIcon = m.icon;

                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveTab(m.id);
                          setIsMoreOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isSubActive
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                            : 'hover:bg-slate-800/70 text-slate-300'
                        }`}
                      >
                        <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="truncate">{m.label}</span>
                            {m.badge !== undefined && m.badge > 0 && (
                              <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">{m.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right Controls: Search, Notifications & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Global Search Pill Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/70 bg-[#0C1220]/80 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors text-xs font-medium cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline text-slate-400 text-xs">Search anything...</span>
          <kbd className="hidden md:inline px-1.5 py-0.2 text-[9px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-700/60"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold font-mono flex items-center justify-center ring-2 ring-[#090D16]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-700/80 bg-[#0C1220] hover:border-slate-600 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser.avatarInitials || 'TM'}
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-slate-200 text-xs truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium truncate">
                {currentUser.roleLabel}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0D1424] rounded-xl shadow-2xl border border-slate-700/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Active Demonstration Persona
                </div>
                <div className="font-bold text-white text-sm mt-0.5">{currentUser.name}</div>
                <div className="text-[11px] text-amber-400 font-semibold">{currentUser.roleLabel}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{currentUser.email}</div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Switch Persona Role
                </div>
                {availableDemoUsers.map(user => {
                  const isSelected = currentUser.role === user.role;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.role as UserRole);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-slate-800/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.roleLabel}</div>
                      </div>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-800 p-2">
                <button
                  onClick={() => {
                    setIsHelpOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  ZB-33 Challenge &amp; Compliance Guide
                </button>
                <button
                  onClick={() => {
                    resetToDemoData();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-slate-800 text-xs font-medium cursor-pointer mt-0.5"
                >
                  <ResetIcon className="w-3.5 h-3.5 text-rose-400" />
                  Reset Baseline Demo Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
