// src/pages/SettingsPage.tsx

import React from 'react';
import ProfileCard from './ProfileCard';
import SubscriptionCard from './SubscriptionCard';
import PreferencesCard from './PreferencesCard';
import NotificationsCard from './NotificationsCard';
import QuickActionsCard from './QuickActionsCard';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-8   min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account and app preferences</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileCard />
          <SubscriptionCard />
          <PreferencesCard />
        </div>

        {/* Right Column (Sidebar/Notifications) */}
        <div className="lg:col-span-1 space-y-8">
          <NotificationsCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;