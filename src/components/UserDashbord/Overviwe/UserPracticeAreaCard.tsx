import React from 'react';
import { UserProgressBar } from './UserProgressBar';
 
interface PracticeAreaCardProps {
  name: string;
  icon: React.FC<any> | string;
  iconColor: string;
  completed: number;
  total: number;
  progress: number
}

export const UserPracticeAreaCard: React.FC<PracticeAreaCardProps> = ({
  name,
  icon: Icon,
  iconColor,
  completed,
  total,
  
}) => {
  return (
    <div className="p-4   rounded-xl bg-[#F8F8F8]   dark:bg-[#111827]   ">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
          {
            typeof Icon === 'string' ? <img className='w-12 bg-gray-300 rounded-4xl' src={Icon} alt={name} /> : <Icon className="w-6 h-6  " />
          }

        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">{name}</h3>
          <p className="text-xs text-gray-500">{completed} Lessons completed</p>
        </div>
      </div>
     {/* <UserProgressBar value={completed} max={total} color="#111827" /> */}
     <UserProgressBar value={completed} max={total} />
<div className="text-sm font-medium text-[#A7A7A7] mb-1 mt-3">
  {Math.round((completed / total) * 100)}% Completed
</div>
    </div>
  );
};
