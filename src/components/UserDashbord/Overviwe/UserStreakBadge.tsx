import React from 'react';

interface StreakBadgeProps {
  /** The current streak number, e.g., 7. */
  streakCount: number;
  /** The unit for the streak, e.g., 'Day' or 'Week'. */
  streakUnit: string;
  /** A short, motivational message. */
  message: string;
  fireicon:any
}

const UserStreakBadge: React.FC<StreakBadgeProps> = ({ streakCount, streakUnit, message,fireicon }) => {
  return (
    <div className="flex p-5 items-center border border-[#FED9D1] p-3 rounded-xl bg-red-50 bg-[linear-gradient(180deg, rgba(246, 233, 230, 0.10) 0%, rgba(255, 110, 81, 0.10) 100%)] dark:bg-gradient-to-b dark:from-[#6e6e6e] dark:to-[#443734]"  >
      {/* Flame Icon Container */}
    <div className="p-2  bg-[linear-gradient(270deg,_#F96345_0%,_#FAA696_100%)] rounded-full flex items-center justify-center mr-3">
  <img src={fireicon} alt="fire icon" className="w-10 h-10" />
</div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold dark:text-gray-200 text-gray-800">
          {streakCount} {streakUnit} Streak
        </span>
        <span className="text-xs dark:text-gray-100 text-gray-500">
          {message}
        </span>
      </div>
    </div>
  );
};

export default UserStreakBadge;
