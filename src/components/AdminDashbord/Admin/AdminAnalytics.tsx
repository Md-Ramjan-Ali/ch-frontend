import React, { useState, useMemo } from 'react';
import StatCard from '../Analytics/componentes/StatCard';
import TabButton from '../Analytics/componentes/TabButton';
import { UserIcon, CrownIcon, ChartPieIcon, ThumbsUpIcon } from '../Analytics/componentes/icons';
import UserEngagementView from '../Analytics/views/UserEngagementView';
import ContentPerformanceView from '../Analytics/views/ContentPerformanceView';
import LearningProgressView from '../Analytics/views/LearningProgressView';
import UserRetentionView from '../Analytics/views/UserRetentionView';

type Tab = 'User Engagement' | 'Content Performance' | 'Learning Progress' | 'User Retention';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('User Engagement');

  const tabs: Tab[] = ['User Engagement', 'Content Performance', 'Learning Progress', 'User Retention'];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'User Engagement':
        return <UserEngagementView />;
      case 'Content Performance':
        return <ContentPerformanceView />;
      case 'Learning Progress':
        return <LearningProgressView />;
      case 'User Retention':
        return <UserRetentionView />;
      default:
        return <UserEngagementView />;
    }
  };

  const statCards = useMemo(() => [
    { title: 'Daily Active Users', value: '1,520', icon: <ThumbsUpIcon />, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { title: 'Avg. Study Time', value: '22m', icon: <CrownIcon />, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
    { title: 'Content Completion', value: '74.2%', icon: <ChartPieIcon />, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { title: 'User Retention', value: '68.4%', icon: <UserIcon />, iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  ], []);

  return (
    <div className="min-h-screen p-4 sm:p-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-200">Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base dark:text-gray-400">Welcome back! Here's what's happening with your platform today.</p>
        </header>

        <main>
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map(card => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-1 sm:p-2 mb-6 sm:mb-8 w-full overflow-x-auto dark:bg-gray-800">
            <div className="flex space-x-1 min-w-max">
              {tabs.map(tab => (
                <TabButton
                  key={tab}
                  label={tab}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="transition-all duration-300">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;