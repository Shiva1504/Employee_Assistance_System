import React from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { Announcement } from '../types';

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance',
    content: 'Scheduled maintenance this weekend. System may be slow.',
    date: new Date(),
    priority: 'high',
  },
  {
    id: '2',
    title: 'New Safety Guidelines',
    content: 'Updated safety protocols are now available in the documents section.',
    date: new Date(),
    priority: 'medium',
  },
];

export function Announcements() {
  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Announcements
      </h2>
      <div className="space-y-4">
        {SAMPLE_ANNOUNCEMENTS.map((announcement) => (
          <div
            key={announcement.id}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="flex items-center gap-2">
              {getPriorityIcon(announcement.priority)}
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                {announcement.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {announcement.content}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {announcement.date.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
