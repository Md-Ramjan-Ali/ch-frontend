import React from 'react';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

interface StatCardProps {
  title: string;
  value: number | string;
  total?: number;
  icon: React.FC<any>;
  iconColor: string;
  progressBarColor?: string;
  unit?: string;
  current?: string | number;
}

export const UserStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  total,
  icon: Icon,
  iconColor,
  progressBarColor,
  unit = '',
}) => {
  const isFraction = typeof total === 'number';
  const displayValue = isFraction ? `${value}/${total}` : value + unit;

  return (
    <div className="bg-white dark:bg-[linear-gradient(180deg,#34495E_0%,#2C3E50_100%)] rounded-xl p-5 border border-gray-200 dark:border-gray-500 shadow-sm">
      <div className="flex justify-between items-center mb-2 flex-wrap">
        <span className="text-[#A7A7A7] font-medium text-base w-full sm:w-auto mb-2 sm:mb-0">
          {title}
        </span>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <div className="text-2xl sm:text-4xl font-bold text-[#333] dark:text-gray-200 mb-3">
        {displayValue}
      </div>
      {isFraction && total && (
        <ProgressBar
          current={value}
          total={total}
          color={progressBarColor}
          height="h-2.5"
          rounded="rounded-lg"
        />
      )}
    </div>
  );
};
