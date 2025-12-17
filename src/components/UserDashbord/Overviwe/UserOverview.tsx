import React, { useState } from "react";
import {
  Clock,
  BookOpen,
  Target,
  Brain,
  Flame,
  Zap,
  Award,
} from "lucide-react";

import ContinueLearningCard from "./UserContinueLearningCard";
import WeeklyProgressCard from "./UserWeeklyProgressCard";
import StreakBadge from "./UserStreakBadge";
import Header from "../../Header/Header";
import sessionicon from "../../../assets/Dashbord//startsession.svg"
import fireicon from "../../../assets/Dashbord//fireicon.svg"
import reading from "../../../assets/Dashbord//bookopen.svg"
import listening from "../../../assets/Dashbord//microhead.svg"
import writing from "../../../assets/Dashbord//writing.svg"
import speaking from "../../../assets/Dashbord//speaking.svg"
import { UserStatCard } from "./UserStatCard";
import { UserPracticeAreaCard } from "./UserPracticeAreaCard";
import { UserAchievementsCard } from "./UserAchievementsCard";
import { Link } from "react-router-dom";
import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import FreeUserAdvancedAnalyticsCard from "@/components/FreeUserDashbord/Overview/FreeUserAdvancedAnalyticsCard";

export const UserOverview: React.FC = () => {

const {data}=useGetMySubscriptionQuery()
  console.log(data?.data)
const prodata=data?.data?.isPro
const hasUsedTrial=data?.data?.hasUsedTrial
const isDisabled = prodata === true && hasUsedTrial === true;

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


  const minutesRemaining = stats.totalMinutes - stats.minutesStudied;
  const weeklyProgress = Math.round((stats.weeklyTime / stats.weeklyGoal) * 100);

  const practiceAreas = [
    { name: "Reading", icon: reading, iconColor: "text-blue-600", completed: 12, total: 16, completionText: "12 Lessons completed" },
    { name: "Listening", icon: listening, iconColor: "text-orange-600", completed: 12, total: 16, completionText: "12 Lessons completed" },
    { name: "Writing", icon: writing, iconColor: "text-green-600", completed: 12, total: 16, completionText: "12 Lessons completed" },
    { name: "Speaking", icon: speaking, iconColor: "text-purple-600", completed: 12, total: 16, completionText: "12 Lessons completed" },
  ];

  const recentAchievements = [
    { name: "7 Day Streak", icon: Flame, time: "2 days ago", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
    { name: "Fast Learner", icon: Zap, time: "3 days ago", iconColor: "text-yellow-500", bgColor: "bg-yellow-50" },
    { name: "Grammar Master", icon: Award, time: "1 week ago", iconColor: "text-indigo-500", bgColor: "bg-indigo-50" },
  ];

  const weeklyStats = [
    { label: "Study Time", value: "2h 15m" },
    { label: "Lessons", value: "12" },
  ];

  const handleViewAnalytics = () => {
    //("Navigating to detailed analytics...");
  };

  const handleStartSession = () => {
    //("Starting practice session...");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 mx-auto font-sans min-h-screen">
      <Header 
        title={"Welcome back, Marco! 👋"} 
        subtitle={"Ready to continue your Italian learning journey?"} 
      />
      
      <div className="flex flex-col mt-4 sm:mt-6 md:mt-8 gap-4 sm:gap-6 md:gap-10">
        {/* Stats Grid - Responsive columns */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <UserStatCard
            title="Minutes Studied"
            icon={Clock}
            iconColor="text-blue-500"
            value={stats.minutesStudied}
            total={stats.totalMinutes}
            progressBarColor="bg-[#0B5FFF]"
          />
          <UserStatCard
            title="Lessons Completed"
            icon={BookOpen}
            iconColor="text-green-500"
            value={stats.lessonsCompleted}
            total={stats.totalLessons}
            progressBarColor="bg-[#0B5FFF]"
          />
          <UserStatCard
            title="Accuracy Rate"
            icon={Target}
            iconColor="text-red-500"
            value={stats.accuracyRate}
            progressBarColor="bg-[#0B5FFF]"
            unit="%"
          />
         


<div className="p-4 rounded-xl shadow-custom bg-white border border-yellow-200 border-dashed flex flex-col justify-center dark:bg-gray-800 dark:text-gray-200">
  <div className="flex items-center mb-1">
    <span className="text-xl mr-2 text-yellow-500" role="img" aria-label="crown">👑</span>
    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Unlock Pro</h3>
  </div>
  <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">Unlimited practice, advanced analytics, and personalized feedback</p>
<Link
  to={isDisabled ? "#" : "/"} // prevent navigation if disabled
  className={`w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-300 
    ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none " : ""}`}
>
  {
    prodata===true && hasUsedTrial===true? "Try 7 Days Trial is Running":"  Try 7 Days Free"
  }
    {/* Try 7 Days Free */}
  </Link>
</div>
     
          
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column - Main content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6 md:space-y-10">
            <ContinueLearningCard
              title="Continue Learning"
              goalText={`You're ${minutesRemaining} minutes away from your daily goal`}
              buttonText="Start Practice Session"
              img={sessionicon}
              onButtonClick={handleStartSession}
            />

            <div className="bg-white dark:bg-[linear-gradient(180deg,#34495E_0%,#2C3E50_100%)] rounded-xl shadow-md p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-semibold dark:text-gray-200 text-gray-900 mb-3 sm:mb-4">
                Practice Areas
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 dark:text-gray-200 text-sm sm:text-base">
                Track your progress across different skills
              </p>
              <div className="grid grid-cols-2 xs:grid-cols-2 gap-4 sm:gap-6">
                {practiceAreas.map((area) => (
                  <UserPracticeAreaCard
                    key={area.name}
                    {...area}
                    progress={Math.round((area.completed / area.total) * 100)}
                  />
                ))}
              </div>
            </div>
{
  prodata===false && hasUsedTrial===false ?<FreeUserAdvancedAnalyticsCard />:null
}
       




          </div>

          {/* Right Column - Sidebar content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <StreakBadge
              streakCount={stats.streak}
              streakUnit="Day"
              fireicon={fireicon}
              message="Keep the fire burning!"
            />

            <WeeklyProgressCard
              title="This Week"
              subtitle="Your learning progress"
              progress={weeklyProgress}
              stats={weeklyStats}
              buttonText="View Analytics"
              onButtonClick={handleViewAnalytics}
            />

            <UserAchievementsCard achievements={recentAchievements} />
          </div>
        </div>





      </div>
    </div>
  );
};