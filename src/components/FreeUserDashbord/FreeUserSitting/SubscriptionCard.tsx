// src/components/settings/SubscriptionCard.tsx

import React from 'react';

const SubscriptionCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
        <span className="text-yellow-500 mr-2">💰</span> Subscription Management
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your premium subscription and billing</p>
      
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 dark:bg-indigo-700 dark:border-indigo-600">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center">
          <span className="text-lg mr-2">👑</span> Unlock Pro
        </h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
          Unlimited practice, advanced analytics, and personalized feedback
        </p>
        <button className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-150 dark:bg-indigo-500 dark:hover:bg-indigo-400">
          Try 7 Days Free
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
