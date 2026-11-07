import React from 'react';
import { X, CheckCheck, AlertTriangle, ShieldAlert, RotateCcw, Wrench, Bell } from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab
  } = useAccessGuard();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D1424] shadow-2xl border-l border-slate-800 flex flex-col text-slate-100">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[#0A0F1D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Governance Notifications</h2>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {notifications.filter(n => !n.isRead).length} unread
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No active notifications present
              </div>
            ) : (
              notifications.map(n => {
                const getIcon = () => {
                  switch (n.category) {
                    case 'VIOLATION':
                      return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
                    case 'CAMPAIGN':
                      return <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />;
                    case 'CORRECTIVE_ACTION':
                      return <Wrench className="w-4 h-4 text-amber-400 shrink-0" />;
                    default:
                      return <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />;
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.linkTab) {
                        setActiveTab(n.linkTab);
                        setIsNotificationsOpen(false);
                      }
                    }}
                    className={`p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer text-xs ${
                      !n.isRead ? 'bg-blue-950/20 border-l-2 border-amber-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getIcon()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                          {n.message}
                        </p>
                        {n.linkTab && (
                          <div className="mt-2 text-[10px] font-semibold text-amber-400 flex items-center gap-1 hover:underline">
                            View details in {n.linkTab.toUpperCase()} →
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-[#0A0F1D] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Automated IGA Event Stream</span>
            <span className="font-mono text-[10px] text-amber-400">Centrix Intelligent Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
