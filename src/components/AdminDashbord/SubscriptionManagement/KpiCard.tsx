import React from 'react';
import { KpiData } from './types';

interface KpiCardProps {
  kpi: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 dark:bg-gray-800">
      <div className="bg-gray-100 p-3 rounded-full dark:bg-gray-700">
        {kpi.icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{kpi.value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
