import React from 'react';
import { useGetMySubscriptionQuery, useCancelSubscriptionMutation } from '@/redux/features/subscriptions/subscriptionsApi';
import { toast } from 'react-hot-toast';

const UserSubscription: React.FC = () => {
  const { data: subscriptionData, isLoading, refetch } = useGetMySubscriptionQuery();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return;
    }

    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading subscription...</p>
        </div>
      </div>
    );
  }

  const subscription = subscriptionData?.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-8">
          My Subscription
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
              Current Plan
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                    {subscription?.plan || 'Free Plan'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription?.isPro
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {subscription?.status?.toUpperCase() || 'INACTIVE'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {subscription?.isPro ? 'Pro Member' : 'Free Member'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {subscription?.currentPeriodEnd && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                  {subscription?.cancelAtPeriodEnd && (
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      Subscription will cancel at period end
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {subscription?.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
                Manage Subscription
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => window.open('/pricing', '_blank')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Upgrade/Downgrade Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="ml-4 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Note: You will retain access until the end of your current billing period.
              </p>
            </div>
          )}

          {subscription?.status === 'none' && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
                No Active Subscription
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You're currently on the free plan. Upgrade to unlock premium features.
              </p>
              <button
                onClick={() => window.open('/pricing', '_blank')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSubscription;