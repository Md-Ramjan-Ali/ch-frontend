import React from 'react';
import { AdminPlan } from '../Admin/types';
import { PencilIcon, ToggleOnIcon, ToggleOffIcon } from './icons';

interface PlanCardProps {
  plan: AdminPlan;
  onEdit: (plan: AdminPlan) => void;
  onToggleStatus: (plan: AdminPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onToggleStatus }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border ${
      plan.isActive 
        ? 'border-green-200 dark:border-green-800' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{plan.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              plan.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </span>
            {plan.isPopular && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Popular
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Alias: {plan.alias}</p>
          {plan.stripePriceId && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
              Stripe ID: {plan.stripePriceId}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            €{plan.price.toFixed(2)}/{plan.interval}
          </p>
          {plan.activeUsers !== undefined && (
            <p className="text-sm text-blue-600 font-semibold dark:text-blue-400">
              {plan.activeUsers} active users
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Features</h4>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          {plan?.features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-center">
              <span className="text-gray-400 dark:text-gray-500 mr-2">•</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <PencilIcon />
          Edit Plan
        </button>
        <button
          onClick={() => onToggleStatus(plan)}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
            plan.isActive
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
              : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
          }`}
        >
          {plan.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
          {plan.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;