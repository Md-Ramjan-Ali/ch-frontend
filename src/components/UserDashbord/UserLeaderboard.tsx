import React from 'react';
import { Flame, Star, BookOpen, Volume2, Trophy } from 'lucide-react';
import { FaHeadphonesAlt } from "react-icons/fa";
import { FaPenFancy } from "react-icons/fa6";

// --- Type Definitions ---

/**
 * Interface for a single leaderboard entry.
 */
interface Leader {
  id: number;
  rank: number;
  name: string;
  points: number;
  streak: number;
  badge: 'R1' | 'R2' | 'A2' | 'B1' | 'B2'; // Example badges
  avatarUrl: string; // Using a URL for real-world scenarios, but keeping emojis for simplicity here.
  isUser: boolean; // To highlight the user's position
  isTopThree: boolean; // To distinguish top three visually
}

// --- Mock Data ---

const userPosition: {
  rank: number;
  totalXP: number;
  dailyStreak: number;
  totalPoint: number;
} = {
  rank: 4,
  totalXP: 2847,
  dailyStreak: 2847, // Assuming Daily Streak is 2847 as per the image
  totalPoint: 96,
};

const skillData: {
  name: string;
  value: number;
  color: string;
  icon: React.ElementType; 
  iconcolor: string;
}[] = [
  { name: "Reading", value: 847, color: 'bg-blue-500', icon: BookOpen, iconcolor: "text-[#0B5FFF]" },
  { name: "Listening", value: 920, color: 'bg-orange-500', icon: FaHeadphonesAlt, iconcolor: "text-[#FF6E51]" },
  { name: "Writing", value: 790, color: 'bg-green-500', icon: FaPenFancy, iconcolor: "text-[#0E9F6E]" },
  { name: "Speaking", value: 860, color: 'bg-purple-500', icon: Volume2, iconcolor: "text-[#C535FE]" },
];

const quickStats = {
  weeklyPoints: 245,
  monthlyPoints: 4596,
  totalBadge: 3,
  currentLevel: 42,
};

const leadersData: Leader[] = [
  { id: 1, rank: 1, name: 'Sofia Rossi', points: 3254, streak: 12, badge: 'B2', avatarUrl: '👩', isUser: false, isTopThree: true },
  { id: 2, rank: 2, name: 'Wade Warren', points: 3254, streak: 12, badge: 'B2', avatarUrl: '👨', isUser: false, isTopThree: true },
  { id: 3, rank: 3, name: 'Jerome Bell', points: 3254, streak: 12, badge: 'B2', avatarUrl: '👨', isUser: false, isTopThree: true },
  { id: 4, rank: 4, name: 'Marco Rossi', points: 3254, streak: 11, badge: 'R1', avatarUrl: '👨', isUser: true, isTopThree: false },
  { id: 5, rank: 5, name: 'Brooklyn Simmons', points: 3254, streak: 11, badge: 'R1', avatarUrl: '👩', isUser: false, isTopThree: false },
  { id: 6, rank: 6, name: 'Marvin McKinney', points: 3254, streak: 11, badge: 'R1', avatarUrl: '👨', isUser: false, isTopThree: false },
  { id: 7, rank: 7, name: 'Savannah Nguyen', points: 3254, streak: 12, badge: 'A2', avatarUrl: '👩', isUser: false, isTopThree: false },
  { id: 8, rank: 8, name: 'Kathryn Murphy', points: 3254, streak: 12, badge: 'B1', avatarUrl: '👩', isUser: false, isTopThree: false },
  { id: 9, rank: 9, name: 'Courtney Henry', points: 3254, streak: 12, badge: 'A2', avatarUrl: '👩', isUser: false, isTopThree: false },
  { id: 10, rank: 10, name: 'Jacob Jones', points: 3254, streak: 12, badge: 'A2', avatarUrl: '👨', isUser: false, isTopThree: false },
];

// --- Reusable Components ---

/**
 * Renders a single row in the leaderboard table.
 */
const LeaderboardRow: React.FC<{ leader: Leader }> = ({ leader }) => {
  const { rank, name, points, streak, badge, avatarUrl, isUser, isTopThree } = leader;

  const rowClasses = isUser
    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 border-l-4'
    : 'border-b border-gray-100 dark:border-gray-700 last:border-b-0';

  const rankClasses = isTopThree
    ? rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-orange-500'
    : 'text-gray-500 dark:text-gray-400';
  
  // Custom highlight for Top 3 avatars as seen in the image
  const avatarClasses = isTopThree 
    ? rank === 1 ? 'ring-2 ring-yellow-400' : rank === 2 ? 'ring-2 ring-gray-400' : 'ring-2 ring-orange-400'
    : '';

  return (
    <div
      className={`flex items-center p-2 sm:p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${rowClasses}`}
    >
      <div className={`w-6 sm:w-8 font-semibold text-sm sm:text-base ${rankClasses}`}>
        {rank === 1 && <Trophy className="w-4 h-4 sm:w-5 sm:h-5 inline-block" />}
        {rank > 1 && `#${rank}`}
      </div>
      
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-600 text-lg sm:text-2xl flex items-center justify-center mr-2 sm:mr-3 ${avatarClasses}`}>
        {avatarUrl}
      </div>
      
     <div className='flex flex-1 min-w-0 flex-col gap-1 sm:gap-2'>
       <div className="flex-1 flex flex-col sm:flex-row sm:gap-2 min-w-0">
        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base lg:text-xl truncate">
          {name}
        </div>
         <span className="text-xs border border-gray-300 dark:border-gray-600 font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg w-fit">
          {badge}
        </span>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 mr-2 sm:mr-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 mr-0.5" />
          <span className="font-medium text-xs">{streak} day streak</span>
        </div>
      </div>
     </div>
      
      <div className="text-right font-semibold text-sm sm:text-base lg:text-xl text-gray-900 dark:text-gray-100 w-12 sm:w-16">
        {points.toLocaleString()}
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal block">Points</span>
      </div>
    </div>
  );
};

const LeaderboardTable: React.FC<{ leaders: Leader[] }> = ({ leaders }) => {
  const timePeriods = ['Daily', 'Weekly', 'Monthly', 'All Time'];
  const [activeTab, setActiveTab] = React.useState('All Time');
  const [filteredLeaders, setFilteredLeaders] = React.useState<Leader[]>(leaders);

  // Mock different leaderboard filters
  React.useEffect(() => {
    let newData: Leader[] = [];

    switch (activeTab) {
      case 'Daily':
        newData = [...leaders]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((l, i) => ({ ...l, points: Math.floor(Math.random() * 500 + 100), rank: i + 1 }));
        break;
      case 'Weekly':
        newData = [...leaders]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((l, i) => ({ ...l, points: Math.floor(Math.random() * 1500 + 500), rank: i + 1 }));
        break;
      case 'Monthly':
        newData = [...leaders]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((l, i) => ({ ...l, points: Math.floor(Math.random() * 3000 + 1000), rank: i + 1 }));
        break;
      case 'All Time':
      default:
        newData = [...leaders];
        break;
    }

    // Set the top 3
    newData = newData.map((leader, index) => ({
      ...leader,
      rank: index + 1,
      isTopThree: index < 3,
    }));

    setFilteredLeaders(newData);
  }, [activeTab, leaders]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
          Top 10 Learners ({activeTab})
        </h3>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setActiveTab(period)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === period
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Body */}
      <div className="p-1 sm:p-2">
        {filteredLeaders.map((leader) => (
          <LeaderboardRow key={leader.id} leader={leader} />
        ))}
      </div>
    </div>
  );
};

/**
 * Renders the user's current rank and stats banner.
 */
const UserStatusBanner: React.FC = () => {
  const { rank, totalXP, dailyStreak, totalPoint } = userPosition;

  // Function to create a stat block
  const StatBlock: React.FC<{ label: string; value: number; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        {icon}
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{value.toLocaleString()}</span>
      </div>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">{label}</span>
    </div>
  );

  return (

  <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border border-green-200 dark:border-green-800">
  {/* Left Section: Position */}
  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
    <div className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
      Your Position
    </div>
  </div>

  {/* Right Section: Rank, Stats, and Points */}
  <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
    {/* Rank */}
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-700 dark:text-green-400">
        #{rank}
      </span>
      <span className="text-xs sm:text-sm text-green-600 dark:text-green-300">Current Rank</span>
    </div>

    {/* StatBlocks (hidden on mobile, shown on sm and larger screens) */}
    <div className="hidden sm:flex items-center gap-4 sm:gap-6 lg:gap-8">
      <StatBlock label="Total XP" value={totalXP} />
      <StatBlock label="Daily Streak" value={dailyStreak} />
    </div>

    {/* Total Points Section */}
    <div className="flex flex-col items-end mt-4 sm:mt-0">
      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        {totalPoint}
      </span>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Point</span>
      <div className="w-16 sm:w-20 lg:w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-1">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${Math.min(totalPoint, 100)}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Mobile-only Stats (shown only on small screens) */}
  <div className="flex sm:hidden justify-between w-full pt-2 border-t border-green-200 dark:border-green-700">
    <StatBlock label="Total XP" value={totalXP} />
    <StatBlock label="Daily Streak" value={dailyStreak} />
  </div>
</div>

    
  );
};

/**
 * Renders the skill progress section.
 */
const SkillProgress: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Skill</h3>

   <div className='flex flex-col gap-3'> 
     {skillData.map((skill, index) => (
      <div key={index} className="mb-3 sm:mb-4">
        {/* Header: skill icon, name, and value */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 font-medium">
            <skill.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${skill.iconcolor}`} />     
            <h3 className='text-xs sm:text-sm'>{skill.name}</h3>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{skill.value}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${skill.color}`}
            style={{ width: `${(skill.value / 1000) * 100}%` }}
          ></div>
        </div>
      </div>
    ))}
   </div>
  </div>
);

/**
 * Renders the quick stats section.
 */
const QuickStats: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Stats</h3>
    <div className="space-y-2 sm:space-y-3">
      {Object.entries(quickStats).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center pb-1 border-b border-gray-50 dark:border-gray-700 last:border-b-0">
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={`text-sm font-bold ${key === 'currentLevel' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Simple Share Button component for demonstration
const ShareButton: React.FC = () => (
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium text-sm sm:text-base">
    Share
  </button>
);

// --- Main Component ---

export const UserLeaderboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Pro Leader Board</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Compete with premium learners worldwide</p>
        </div>
        <ShareButton />
      </header>
      
      {/* User Status Banner */}
      <div className="mb-6 sm:mb-8">
        <UserStatusBanner />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-2">
          <LeaderboardTable leaders={leadersData} />
        </div>
        
        {/* Right Column: Skills and Quick Stats */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:space-y-8">
          <SkillProgress />
          <QuickStats />
        </div>
        
      </div>
    </div>
  );
};

export default UserLeaderboard;