import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import type { NotificationItem } from '../../types';
import { Bell, X, CheckCheck, ShieldAlert, ArrowUpRight, Calendar, UserCheck } from 'lucide-react';

export const NotificationDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setSelectedCaseId, setCurrentRoute } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      getNotifications().then(setNotifications);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotificationClick = async (n: NotificationItem) => {
    await markNotificationAsRead(n.id);
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
    setSelectedCaseId(n.caseId);
    setCurrentRoute('officer-case-detail');
    onClose();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']): ReactNode => {
    switch (type) {
      case 'CRITICAL_CASE':
        return <ShieldAlert className="w-4 h-4 text-emergency-600" />;
      case 'PRIORITY_ESCALATED':
        return <ArrowUpRight className="w-4 h-4 text-amber-500" />;
      case 'FOLLOWUP_DUE':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'CASE_REASSIGNED':
        return <UserCheck className="w-4 h-4 text-sage-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-line shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-teal-50/60 border-b border-line flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Officer Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emergency-100 text-emergency-700 border border-emergency-300 text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted hover:text-slate-900 hover:bg-teal-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Bell className="w-8 h-8 text-line mx-auto" />
                <p className="text-xs text-muted">No active notifications.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    !n.isRead
                      ? 'bg-teal-50/70 border-teal-300 shadow-sm'
                      : 'bg-white border-line opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {getIcon(n.type)}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{n.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-900/80 leading-relaxed">{n.message}</p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-teal-600 font-mono font-bold">Case {n.caseId}</span>
                    <span className="text-muted hover:text-slate-900 font-medium">Review Case →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};