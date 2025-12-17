import React, { useState } from 'react';
import { Edit2, HelpCircle, Shield, Download, Bell, Zap, LogOut, Sunset, Target } from 'lucide-react';
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from 'js-cookie';
import { useGetMeQuery } from '@/redux/features/auth/authApi';

// Helper function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return 'US';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Toggle Switch Component with state
interface ToggleProps {
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ defaultChecked, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };
  
  return (
    <div 
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
        isChecked 
          ? 'bg-blue-600' 
          : 'bg-gray-300'
      }`}
    >
      <div 
        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
          isChecked ? 'transform translate-x-6' : 'transform translate-x-0'
        }`}
      ></div>
    </div>
  );
};

// Panel Component
interface PanelProps {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  iconColor?: string;
}

const SettingsPanel: React.FC<PanelProps> = ({ title, icon, subtitle, children, iconColor = 'text-orange-500' }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-center mb-4">
      <span className={`mr-3 ${iconColor}`}>{icon}</span>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export const UserSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: apiResponse } = useGetMeQuery({});
  
  // State for all toggle switches
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [offlineDownload, setOfflineDownload] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyUpdate, setWeeklyUpdate] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  
  // Extract user data from API response
  const userData = apiResponse?.data || {};
  
  const {
    name = "Marco Rossi",
    email = "marco.rossi@email.com",
    currentLevel = "B1",
    // subscriptionPlan = "PREMIUM",
    createdAt = "2024-03-01T00:00:00.000Z",
    currentStreak = 7,
    targetLang = "Italian",
    // nativeLang = "English",
  } = userData;

  // Format learning since date
  const learningSince = formatDate(createdAt);
  
  // Subscription status
//   const isPremium = subscriptionPlan === "PREMIUM";
  const nextBillingDate = "December 15, 2024";
  const nextBillingAmount = "$24.99";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    Cookies.remove("email");
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Profile Information */}
          <SettingsPanel
            title="Profile Information"
            icon={<Target size={20} />}
            subtitle="Update your personal information and learning profile"
            iconColor="text-blue-600"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold border-4 border-white shadow">
                  {getInitials(name)}
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Level {currentLevel}
                    </span>
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Premium
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Learning {targetLang} since {learningSince} • {currentStreak} day streak
                  </p>
                </div>
              </div>
              <button className="flex items-center cursor-pointer text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                <Edit2 size={16} className="mr-1" /> Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" 
                  readOnly 
                />
              </div>
            </div>
          </SettingsPanel>

          {/* 2. Subscription Management */}
          <SettingsPanel
            title="Subscription Management"
            icon={<Zap size={20} />}
            subtitle="Manage your premium subscription and billing"
            iconColor="text-purple-600"
          >
            <div className="p-4 bg-green-50 rounded-lg mb-4 flex justify-between items-center border border-green-200">
              <div>
                <h4 className="font-semibold text-green-700">Premium Plan</h4>
                <p className="text-xs text-green-600">Monthly subscription • Renews: {nextBillingDate}</p>
              </div>
              <span className="text-sm font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Next billing: {nextBillingAmount} on {nextBillingDate}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="flex-1 px-6 cursor-pointer py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Change Plan
              </button>
              <button className="flex-1 px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Billing History
              </button>
            </div>
          </SettingsPanel>

          {/* 3. App Preferences */}
          <SettingsPanel
            title="App Preferences"
            icon={<Sunset size={20} />}
            subtitle="Customize your learning experience"
            iconColor="text-orange-600"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Auto Play Audio</p>
                  <p className="text-xs text-gray-500">Automatically play pronunciation examples</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={autoPlayAudio} 
                  onChange={setAutoPlayAudio}
                  id="auto-play"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Offline Download</p>
                  <p className="text-xs text-gray-500">Download lessons for offline practice</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={offlineDownload} 
                  onChange={setOfflineDownload}
                  id="offline-download"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Study Reminders</p>
                  <p className="text-xs text-gray-500">Daily notifications to maintain your streak</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={studyReminders} 
                  onChange={setStudyReminders}
                  id="study-reminders"
                />
              </div>
            </div>
          </SettingsPanel>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">

          {/* 4. Notifications */}
          <SettingsPanel
            title="Notifications"
            icon={<Bell size={20} />}
            subtitle="Control your notification preferences"
            iconColor="text-blue-600"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Push Notifications</p>
                  <p className="text-xs text-gray-500">App notifications and reminders</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={pushNotifications} 
                  onChange={setPushNotifications}
                  id="push-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Weekly Update</p>
                  <p className="text-xs text-gray-500">Weekly progress reports</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={weeklyUpdate} 
                  onChange={setWeeklyUpdate}
                  id="weekly-update"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Streak Reminders</p>
                  <p className="text-xs text-gray-500">Don't break your streak</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={streakReminders} 
                  onChange={setStreakReminders}
                  id="streak-reminders"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Achievement Alerts</p>
                  <p className="text-xs text-gray-500">New badges and milestones</p>
                </div>
                <ToggleSwitch 
                  defaultChecked={achievementAlerts} 
                  onChange={setAchievementAlerts}
                  id="achievement-alerts"
                />
              </div>
            </div>
          </SettingsPanel>

          {/* 5. Quick Actions */}
          <SettingsPanel
            title="Quick Actions"
            icon={<Zap size={20} />}
            subtitle="Common settings and support options"
            iconColor="text-yellow-600"
          >
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50">
                <HelpCircle size={18} className="mr-3 text-blue-600" />
                Help Centre
              </div>
              <div className="flex items-center text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50">
                <Shield size={18} className="mr-3 text-blue-600" />
                Privacy Policy
              </div>
              <div className="flex items-center text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50">
                <Download size={18} className="mr-3 text-blue-600" />
                Export Data
              </div>
            </div>
          </SettingsPanel>

          {/* 6. Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center cursor-pointer p-4 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors border border-red-200"
          >
            <LogOut size={20} className="mr-2" />
            Log Out
          </button>

          {/* App Version */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              App Version 2.4.1 • LinguaLearn
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};


export default UserSettings;