// Dashboard.tsx
import React, { useState } from 'react';
import FreeUserStatCard from './FreeUserStatCard';
 import AdvancedAnalyticsCard from "./FreeUserAdvancedAnalyticsCard"
 import {
  
  Volume2,
  CheckSquare,
  Mic,
  FileText,
  
   
} from "lucide-react";
import { UserPracticeAreaCard } from '@/components/UserDashbord/Overviwe/UserPracticeAreaCard';
import UserWeeklyProgressCard from '@/components/UserDashbord/Overviwe/UserWeeklyProgressCard';
  const FreeUserOverviwe: React.FC = () => {
 const practiceAreas = [
  {
    name: "Reading",
    icon: FileText,
    iconColor: "text-blue-600",
    completed: 12,
    total: 16,
  },
  {
    name: "Listening",
    icon: Volume2,
    iconColor: "text-orange-600",
    completed: 12,
    total: 16,
  },
  {
    name: "Writing",
    icon: CheckSquare,
    iconColor: "text-green-600",
    completed: 12,
    total: 16,
  },
  {
    name: "Speaking",
    icon: Mic,
    iconColor: "text-purple-600",
    completed: 12,
    total: 16,
  },
];
const [stats] = useState({
    minutesStudied: 22,
    totalMinutes: 30,
    lessonsCompleted: 3,
    totalLessons: 5,
    accuracyRate: 88,
    wordsLearned: 15,
    totalWords: 20,
    streak: 7,
    weeklyTime: 135,
    weeklyGoal: 160,
    weeklyLessons: 12,
  });
const weeklyStats = [
    { label: "Study Time", value: "2h 15m" },
    { label: "Lessons", value: "12" },
  ];  
  const weeklyProgress = Math.round((stats.weeklyTime / stats.weeklyGoal) * 100);
  const handleViewAnalytics =()=>{
    alert("clicked")
  }
  return (
    <div className="p-4 sm:p-6 md:p-8   min-h-screen font-sans">
      
      {/* --- Header Section --- */}
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Welcome, Marco!</h1>
      <p className="text-gray-500 mb-6 dark:text-gray-400">Start your B1 certification journey</p>
      
      {/* --- Top Row of Cards (Grid) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Current Streak */}
        <FreeUserStatCard 
          icon="🔥"
          title="Current Streak"
          value="3"
          subValue="consecutive days"
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-500"
        />
        
        {/* Basic Progress */}
        <FreeUserStatCard 
          icon="📊"
          title="Basic Progress"
          value="24%"
          subValue="completion"
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-500"
        />
        
        {/* Weekly Time */}
        <FreeUserStatCard 
          icon="🕒"
          title="Weekly Time"
          value="18"
          subValue="of 30min available"
          iconBgColor="bg-gray-100"
          iconTextColor="text-gray-500"
        />

        {/* Unlock Pro Card */}
        <div className="p-4 rounded-xl shadow-custom bg-white border border-yellow-200 border-dashed flex flex-col justify-center dark:bg-gray-800 dark:text-gray-200">
          <div className="flex items-center mb-1">
            <span className="text-xl mr-2 text-yellow-500" role="img" aria-label="crown">👑</span>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Unlock Pro</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">Unlimited practice, advanced analytics, and personalized feedback</p>
          <button className="text-blue-600 font-medium text-sm text-left hover:text-blue-800 transition-colors">
            Try 7 Days Free
          </button>
        </div>
      </div>

      {/* --- Main Content Layout (Grid) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Practice Areas */}
        <div className="lg:col-span-2">
         
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-200">Practice Areas</h2>
      <p className="text-gray-600 mb-6 dark:text-gray-400">
        Track your progress across different skills
      </p>

       <div className="grid grid-cols-2 gap-6">
    {practiceAreas.map((area) => (
      <UserPracticeAreaCard
        key={area.name}
        {...area}
        progress={Math.round((area.completed / area.total) * 100)} // ✅ added
      />
    ))}
  </div>
    </div>
        </div>

        {/* Right Column: This Week Progress */}
        <div className="lg:col-span-1">
          <UserWeeklyProgressCard
            title="This Week"
            subtitle="Your learning progress"
            progress={weeklyProgress}
            stats={weeklyStats}
            buttonText="View Detailed Analytics"
            onButtonClick={handleViewAnalytics}
          />
        </div>
      </div>
      <AdvancedAnalyticsCard />

    </div>
  );
};

export default FreeUserOverviwe;