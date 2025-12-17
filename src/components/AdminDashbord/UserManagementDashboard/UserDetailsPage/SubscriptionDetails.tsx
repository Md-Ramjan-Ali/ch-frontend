// SubscriptionDetails.tsx

import React from 'react';
import { UserData } from './types';

interface SubscriptionDetailsProps {
  subscription: UserData['subscription'];
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ subscription }) => {
  
  const BillingItem: React.FC<{ label: string; value: string | React.ReactNode, highlight?: boolean }> = ({ label, value, highlight }) => (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm mb-6 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 mb-4">Subscription Details</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Current plan and billing information</p>

      {/* Plan Card */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200">{subscription?.planName}</h4>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Active until {subscription?.endDate}
          </p>
        </div>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
          {subscription?.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-8">
        
        {/* Left: Billing Information */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Billing Information</h4>
          <BillingItem label="Payment Method" value={subscription?.paymentMethod} />
          <BillingItem label="Auto Renewal" value={subscription?.autoRenewal} />
          <BillingItem label="Next Billing" value={subscription?.nextBilling} />
        </div>

        {/* Right: Plan Features */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Plan Features</h4>
          <div className="space-y-1">
            {subscription?.planFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-end">
                <span className="text-sm text-green-600 dark:text-green-300 text-right">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
