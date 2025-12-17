// StatCard.tsx
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

 export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="text-indigo-500">{icon}</span>
      </div>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  );
};