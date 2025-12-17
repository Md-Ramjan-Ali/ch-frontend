import React from 'react';

// Define the props interface for type safety
interface StatDisplayCardProps {
  title: string;
  value: string;
  icon: React.ReactNode; // Can accept an SVG, an image, or a simple text icon
}

const StatDisplayCard: React.FC<StatDisplayCardProps> = ({ title, value, icon }) => {
  return (
    <div className="flex-1 min-w-0 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-between transition-shadow hover:shadow-lg dark:text-white">
      <div className="flex flex-col">
        {/* Metric Value */}
        <p className="text-4xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
        {/* Metric Title */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
      </div>
      {/* Icon Display */}
      <div className="text-3xl text-indigo-500 ml-4" aria-hidden="true">
        {icon || <span className="text-gray-400">🔍</span>} {/* Default icon if none provided */}
      </div>
    </div>
  );
};

export default StatDisplayCard;
