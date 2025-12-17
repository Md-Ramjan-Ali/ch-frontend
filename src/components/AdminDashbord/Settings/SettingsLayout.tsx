import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import AdminUsers from './Users/AdminUsers';
import Notifications from './Notifications';
import Security from './Security';
import Branding from './Branding';

type Tab = 'General' | 'Admin Users' | 'Notifications' | 'Security' | 'Branding';

const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('General');

  const tabs: Tab[] = ['General', 'Admin Users', 'Notifications', 'Security', 'Branding'];

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralSettings />;
      case 'Admin Users':
        return <AdminUsers />;
      case 'Notifications':
        return <Notifications />;
      case 'Security':
        return <Security />;
      case 'Branding':
        return <Branding />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage platform settings, security, and administrative preferences.
        </p>
      </header>
      
      {/* Tabs */}
      <div className="mb-6">
        <nav
          className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex flex-wrap sm:flex-nowrap items-center space-x-1 transition-colors"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-2 px-3 rounded-md cursor-pointer font-medium text-sm transition-all duration-200
                ${activeTab === tab ? 
                    'bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm' : 
                    'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100'}
                sm:text-base md:text-lg
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="transition-colors">{renderContent()}</main>
    </div>
  );
};

export default SettingsLayout;
