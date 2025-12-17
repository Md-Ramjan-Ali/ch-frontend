// src/components/settings/NotificationsCard.tsx

import React, { useState } from 'react';
import Toggle from './Toggle';

const NotificationsCard: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyUpdate, setWeeklyUpdate] = useState(false);
  const [streakReminders, setStreakReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);

  // Helper for notification list items
  const NotificationItem: React.FC<{
    title: string;
    desc: string;
    checked: boolean;
    onChange: (c: boolean) => void;
  }> = ({ title, desc, checked, onChange }) => (
    <div className="flex justify-between items-center pt-3">
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto dark:bg-gray-800 dark:text-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
        <span className="text-orange-500 mr-2">🔔</span> Notifications
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Control your notification preferences</p>
      
      <div className="space-y-3">
        <NotificationItem
          title="Push Notifications"
          desc="App notifications and reminders"
          checked={pushNotifications}
          onChange={setPushNotifications}
        />
        <NotificationItem
          title="Weekly Update"
          desc="Weekly progress reports"
          checked={weeklyUpdate}
          onChange={setWeeklyUpdate}
        />
        <NotificationItem
          title="Streak Reminders"
          desc="Don't break your streak"
          checked={streakReminders}
          onChange={setStreakReminders}
        />
        <NotificationItem
          title="Achievement Alerts"
          desc="New badges and milestones"
          checked={achievementAlerts}
          onChange={setAchievementAlerts}
        />
      </div>
    </div>
  );
};

export default NotificationsCard;
