 

import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactElement<any>; // Accepts any props including className
  bgColor: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, bgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor}` })}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatsCard;