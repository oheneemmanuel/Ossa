'use client';

import React, { useState } from 'react';
import { Bell, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type?: 'info' | 'success' | 'warning';
  read?: boolean;
}

interface AnnouncementBellProps {
  announcements?: Announcement[];
}

// Dummy data if none is passed via props
const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Platform Update',
    message: 'We have updated our payment flow for faster processing.',
    date: '10 mins ago',
    type: 'info',
    read: false,
  },
  {
    id: '2',
    title: 'Maintenance Notice',
    message: 'Scheduled system maintenance on Sunday at 2:00 AM UTC.',
    date: '2 hours ago',
    type: 'warning',
    read: false,
  },
];

export default function AnnouncementBell({ announcements = defaultAnnouncements }: AnnouncementBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Announcement[]>(announcements);

  const unreadCount = items.filter((item) => !item.read).length;

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
        aria-label="View announcements"
      >
        <Bell className="w-6 h-6" />

        {/* Unread Badge Indicator */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Announcements Popover */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown on outside click */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-3 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Announcements</h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 transition-colors flex gap-3 ${
                      !item.read ? 'bg-blue-50/30 dark:bg-blue-950/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No announcements at this time.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}