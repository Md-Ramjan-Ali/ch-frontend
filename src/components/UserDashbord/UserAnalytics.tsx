import React from "react";
import {
  Bolt,
  Mic,
  Pencil,
  Headphones,
  TrendingUp,
  ArrowUpRight,
  BookA,
  BookMarked,
  Users,
  Sparkles,
  FireExtinguisher,
} from "lucide-react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import timeicon from "../../assets/Dashbord/timeicon.svg";
import fireicon from "../../assets/Dashbord/fireicon2.svg";
import bookicon from "../../assets/Dashbord/bookopen.svg";
import tergeticon from "../../assets/Dashbord/tergeticon.svg";

// Summary Card
interface SummaryCardProps {
  title: string;
  value: string;
  icon: string | undefined;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <div className="flex justify-between p-4 items-start bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex flex-col">
      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </div>
    </div>
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
      <img src={icon} alt="Icon" className="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
  </div>
);

// Weekly Bar
interface WeeklyBarProps {
  day: string;
  accuracy: number;
  minutes: number;
}

const WeeklyBar: React.FC<WeeklyBarProps> = ({ day, accuracy, minutes }) => {
  const goalMinutes = 40;
  return (
    <div className="mb-4 border rounded-xl border-[#EBEBEB] p-3 dark:bg-gray-800">
      <div className="flex justify-between items-center text-xs sm:text-sm mb-3">
        <div className="font-semibold text-[#585858] dark:text-gray-300">{day}</div>
        <div className={`font-medium ${accuracy >= 70 ? "text-green-600" : "text-[#0E9F6E]"}`}>
          {accuracy}% Accuracy
        </div>
      </div>
      <ProgressBar current={minutes} total={goalMinutes} color="bg-black" height="h-2" rounded="rounded-full" />
      <div className="flex mt-3 justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-300">
        <span>{minutes} min</span>
        <span>{goalMinutes} min goal</span>
      </div>
    </div>
  );
};

// Skill Progress Card
interface SkillCardProps {
  skill: string;
  icon: React.ReactNode;
  lessons: number;
  completion: number;
  improvement: number;
  iconBg: string;
}

const SkillProgressCard: React.FC<SkillCardProps> = ({
  skill,
  icon,
  lessons,
  completion,
  improvement,
  iconBg,
}) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 dark:bg-gray-800 flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-3">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="flex items-center text-xs sm:text-sm font-semibold text-green-600">
        <ArrowUpRight size={14} className="mr-1" />+{improvement}%
      </div>
    </div>

    <h4 className="text-sm sm:text-md font-bold text-gray-800 dark:text-white">{skill}</h4>
    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-4">{lessons} Lessons completed</p>

    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${completion}%` }}></div>
    </div>
    <p className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">{completion}% Completed</p>
  </div>
);

// Achievement Item
interface AchievementItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ icon, title, subtitle }) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-2 dark:bg-gray-700">
    <div className="mr-3 text-gray-600 dark:text-gray-300">{icon}</div>
    <div>
      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">{title}</p>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  </div>
);

// Recent Session Item
interface RecentSessionItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  accuracy: number;
}

const RecentSessionItem: React.FC<RecentSessionItemProps> = ({ icon, title, time, accuracy }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center">
      <div className="mr-3 text-indigo-600 dark:text-indigo-400">{icon}</div>
      <div>
        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{title}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
    <span className={`text-xs sm:text-sm font-bold ${accuracy >= 90 ? "text-green-600" : "text-blue-600"}`}>
      {accuracy}%
    </span>
  </div>
);

// Main UserAnalytics
export const UserAnalytics: React.FC = () => {
  const weeklyProgress = [
    { day: "Monday", accuracy: 53, minutes: 25 },
    { day: "Tuesday", accuracy: 55, minutes: 25 },
    { day: "Wednesday", accuracy: 63, minutes: 25 },
    { day: "Thursday", accuracy: 68, minutes: 25 },
    { day: "Friday", accuracy: 59, minutes: 25 },
    { day: "Saturday", accuracy: 55, minutes: 25 },
    { day: "Sunday", accuracy: 55, minutes: 25 },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced Analytics</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
        Track your progress and achievements in Italian learning
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-10">
        <SummaryCard title="This Week" value="175m" icon={timeicon} color="bg-indigo-500" />
        <SummaryCard title="Current Streak" value="7 Days" icon={fireicon} color="bg-red-500" />
        <SummaryCard title="Avg. Accuracy" value="86%" icon={tergeticon} color="bg-green-500" />
        <SummaryCard title="Total Lessons" value="84" icon={bookicon} color="bg-blue-500" />
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Performance */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" />
              Weekly Performance
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              Study time and accuracy over the past week
            </p>
            {weeklyProgress.map((data) => (
              <WeeklyBar key={data.day} day={data.day} accuracy={data.accuracy} minutes={data.minutes} />
            ))}
          </div>

          {/* Skill Progress */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-4 sm:mb-6">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" />
              Skill Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkillProgressCard
                skill="Reading"
                icon={<BookA className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                lessons={12}
                completion={75}
                improvement={12}
                iconBg="bg-blue-500"
              />
              <SkillProgressCard
                skill="Listening"
                icon={<Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                lessons={14}
                completion={75}
                improvement={12}
                iconBg="bg-orange-500"
              />
              <SkillProgressCard
                skill="Writing"
                icon={<Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                lessons={18}
                completion={75}
                improvement={12}
                iconBg="bg-green-500"
              />
              <SkillProgressCard
                skill="Speaking"
                icon={<Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                lessons={15}
                completion={75}
                improvement={12}
                iconBg="bg-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Achievements */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
            <AchievementItem icon={<FireExtinguisher size={20} />} title="7 Day Streak" subtitle="4 days ago" />
            <AchievementItem icon={<Bolt size={20} />} title="Fast Learner" subtitle="6 days ago" />
            <AchievementItem icon={<BookMarked size={20} />} title="Grammar Master" subtitle="1 week ago" />
            <AchievementItem icon={<Users size={20} />} title="Pronunciation Pro" subtitle="1 week ago" />
          </div>

          {/* Recent Sessions */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Sessions</h2>
            <div className="space-y-3">
              <RecentSessionItem icon={<Mic size={20} />} title="Speaking Practice" time="2 days ago" accuracy={92} />
              <RecentSessionItem icon={<Pencil size={20} />} title="Writing Exercises" time="3 days ago" accuracy={92} />
              <RecentSessionItem icon={<Headphones size={20} />} title="Listening Comprehension" time="1 week ago" accuracy={92} />
              <RecentSessionItem icon={<BookA size={20} />} title="Reading Practice" time="1 week ago" accuracy={55} />
            </div>

            <button className="w-full mt-6 py-2.5 sm:py-3 bg-indigo-600 cursor-pointer text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm sm:text-base">
              <Sparkles size={18} className="mr-2" />
              Start New Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
