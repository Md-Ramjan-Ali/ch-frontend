
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between dark:bg-gray-800">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1 dark:text-gray-200">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
