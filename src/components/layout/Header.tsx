import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    currentUser,
    switchUser,
    availableDemoUsers,
    notifications,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsHelpOpen,
    resetToDemoData
  } = useAccessGuard();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabLabels: Record<string, string> = {
    overview: 'Executive Governance Dashboard',
    employees: 'Employee Identity Directory',
    identities: 'Lifecycle & Orphan Account Management',
    systems: 'Connected Systems & Applications',
    permissions: 'Role-Based Access Control (RBAC) Matrix',
    recertification: 'Quarterly Recertification Campaign Centre',
    risks: 'Intelligent Risk & SoD Violation Engine',
    workflows: 'Multi-Level Approval Workflows',
    actions: 'Remediation & Corrective Actions',
    reports: 'Audit-Ready Compliance Reports',
    audit: 'Immutable Security Audit Trail',
    settings: 'Organisation & Governance Settings'
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 sticky top-0 z-10 select-none shadow-xs">
      {/* Left Zone: Contextual Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
          AccessGuard
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <h1 className="text-sm font-bold text-slate-900 truncate">
          {tabLabels[activeTab] || 'AccessGuard'}
        </h1>
        <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60 ml-2">
          ZB-33 COMPLIANT
        </span>
      </div>

      {/* Right Zone: Controls & Quick Role Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Global Search Input Affordance */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors text-xs font-medium cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search identities, systems, violations...</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Quick Role Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
            title="Switch Persona to test multi-role view"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] text-slate-400 font-medium">Viewing as:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                {currentUser.roleLabel}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Switch Demonstration Role
              </div>
              {availableDemoUsers.map(user => {
                const isSelected = currentUser.role === user.role;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.role as UserRole);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.roleLabel}</div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="border-t border-slate-100 p-2 bg-slate-50">
                <button
                  onClick={() => {
                    resetToDemoData();
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Baseline Demo Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Toggle */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
          )}
        </button>

        {/* Help & Compliance Info */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Challenge ZB-33 & System Architecture Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
