// src/components/settings/QuickActionsCard.tsx

import React from 'react';
import { QuestionMarkCircleIcon, ShieldCheckIcon, ArrowDownTrayIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const QuickActionsCard: React.FC = () => {
  // Helper for action items
  const ActionItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-500 cursor-pointer py-2">
      <span className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-4">
        <span className="text-cyan-500 mr-2">⚡</span> Quick Actions
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Common settings and support options</p>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <ActionItem icon={<QuestionMarkCircleIcon />} text="Help Centre" />
        <ActionItem icon={<ShieldCheckIcon />} text="Privacy Policy" />
        <ActionItem icon={<ArrowDownTrayIcon />} text="Export Data" />
      </div>

      {/* Log Out Button */}
      <div className="mt-4">
        <button 
          aria-label="Log Out"
          className="w-full flex items-center cursor-pointer justify-center bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg transition duration-150 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-400"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default QuickActionsCard;
