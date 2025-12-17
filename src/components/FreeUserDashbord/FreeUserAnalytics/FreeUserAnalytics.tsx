import React from 'react';
import { Clock, Target, BookOpen } from 'lucide-react'; // Icons for the top cards
import StatDisplayCard from './StatDisplayCard';
import FreeUserAdvancedAnalyticsCard from '../Overview/FreeUserAdvancedAnalyticsCard';

const FreeUserAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen p-8 sm:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">

        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Track your progress and achievements in Italian learning
          </p>
        </header>

        {/* Top Row of Metric Cards */}
        <section className="flex flex-col sm:flex-row gap-6">
          <StatDisplayCard 
            title="This Week"
            value="175m"
            icon={<Clock className="w-8 h-8 text-red-500" />} // Customizing colors to match image
          />
          <StatDisplayCard 
            title="Avg. Accuracy"
            value="86%"
            icon={<Target className="w-8 h-8 text-indigo-500" />}
          />
          <StatDisplayCard 
            title="Total Lessons"
            value="84"
            icon={<BookOpen className="w-8 h-8 text-sky-500" />}
          />
        </section>

        {/* Advanced Analytics Section */}
        <FreeUserAdvancedAnalyticsCard />

      </div>
    </div>
  );
};

export default FreeUserAnalytics;
