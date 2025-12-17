// DailyGoalProgress.tsx
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import React from 'react';
 import tatgeticon from "../../../assets/Dashbord/tergeticon.svg"
interface DailyGoalProgressProps {
  currentMinutes: number;
  totalMinutes: number;
  timeLeft: string;
}

export const DailyGoalProgress: React.FC<DailyGoalProgressProps> = ({
  currentMinutes,
  totalMinutes,
  timeLeft,
}) => {
  const percentage = Math.round((currentMinutes / totalMinutes) * 100);

  return (
    <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        {/* Left: Icon and Title */}
        <div className="flex items-center">
          <span className="text-red-500 mr-2">
            {/* Target/Goal Icon */} 
         

<img className='w-8 h-8' src={tatgeticon} alt="" />

          </span>
          <div>
            <p className="text-base font-semibold text-gray-700">Daily Goal Progress</p>
            <p className="text-xs text-gray-500">
              {currentMinutes} of {totalMinutes} minutes completed
            </p>
          </div>
        </div>

        {/* Right: Percentage and Time Left */}
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-500 leading-none">
            {percentage}%
          </p>
          <p className="text-xs text-gray-500">{timeLeft}</p>
        </div>
      </div>

      {/* Progress Bar using your component */}
      <ProgressBar
        progress={percentage}
        color="bg-indigo-500" // Filled color
        height="h-2.5"
        rounded="rounded-full"
        className="mt-3"
      />
    </div>
  );
};
