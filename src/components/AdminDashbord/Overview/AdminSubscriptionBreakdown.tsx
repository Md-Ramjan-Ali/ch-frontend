import React from 'react';

const AdminSubscriptionBreakdown: React.FC = () => (
  <div className="bg-white p-4 sm:p-6 rounded-lg dark:bg-gray-800">
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:pr-40 dark:text-gray-200">Subscription Breakdown</h2>
    <div className="space-y-3 sm:space-y-4">
      {/* Free Users */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-700"></div>
          <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
            Free Users
          </span>
        </div>
        <div className="text-right">
          <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">10,245</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">51.2%</div>
        </div>
      </div>

      {/* Premium Users */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
          <span className="text-sm sm:text-base font-semibold text-[#696D77] dark:text-gray-300 whitespace-nowrap">
            Premium Users
          </span>
        </div>
        <div className="text-right">
          <div className="font-semibold text-sm sm:text-base text-[#3C424E] dark:text-gray-200">8,241</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">48.8%</div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminSubscriptionBreakdown;