import { useState, useEffect } from 'react';
import { useGetActivePlansQuery, useUpdatePlanMutation } from '@/redux/features/subscriptions/subscriptionsApi';
import KpiCard from './KpiCard';
import PlanCard from './PlanCard';
 import { AdminPlan, KpiData } from './types';
import { MoneyIcon, CrownIcon, ChartIcon, UserIcon, PlusIcon } from './icons';
import { toast } from 'react-hot-toast';
import EditPlanModal from './EditPlanModal';

const initialKpiData: KpiData[] = [
  { title: 'Monthly Revenue', value: '€0', icon: <MoneyIcon /> },
  { title: 'Active Subscriptions', value: '0', icon: <CrownIcon /> },
  { title: 'Conversion Rate', value: '0%', icon: <ChartIcon /> },
  { title: 'Avg. Revenue Per User', value: '€0', icon: <UserIcon /> },
];

function AdminSubscription() {
  const { data: plansResponse, isLoading, refetch } = useGetActivePlansQuery();
  const [updatePlan] = useUpdatePlanMutation();
  
  const [kpiData, setKpiData] = useState<KpiData[]>(initialKpiData);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AdminPlan | null>(null);

  // Transform API plans to AdminPlan format
  useEffect(() => {
    if (plansResponse?.data) {
      const apiPlans = plansResponse.data;
      const transformedPlans: AdminPlan[] = apiPlans.map((plan, index) => ({
        id: index + 1,
        alias: plan.alias,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval,
        stripePriceId: plan.stripePriceId,
        isActive: plan.isActive,
        features: plan.features,
        activeUsers: 0, // This would come from a different API endpoint
      }));
      setPlans(transformedPlans);

      // Calculate KPIs (mock data - replace with actual API calls)
      const totalRevenue = apiPlans.reduce((sum, plan) => sum + (plan.price * 100), 0);
      const activeSubscriptions = apiPlans.length * 50; // Mock data
      
      setKpiData([
        { title: 'Monthly Revenue', value: `€${(totalRevenue / 100).toFixed(2)}`, icon: <MoneyIcon /> },
        { title: 'Active Subscriptions', value: activeSubscriptions.toString(), icon: <CrownIcon /> },
        { title: 'Conversion Rate', value: '32.1%', icon: <ChartIcon /> },
        { title: 'Avg. Revenue Per User', value: '€7.51', icon: <UserIcon /> },
      ]);
    }
  }, [plansResponse]);

  const handleEditPlan = (plan: AdminPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleUpdatePlan = async (updatedPlanData: Partial<AdminPlan>) => {
    if (!selectedPlan) return;

    try {
      await updatePlan({
        alias: selectedPlan.alias,
        data: {
          price: updatedPlanData.price,
          isActive: updatedPlanData.isActive,
          stripePriceId: updatedPlanData.stripePriceId,
        },
      }).unwrap();

      toast.success('Plan updated successfully');
      refetch(); // Refresh the plans list
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const handleTogglePlanStatus = async (plan: AdminPlan) => {
    try {
      await updatePlan({
        alias: plan.alias,
        data: { isActive: !plan.isActive },
      }).unwrap();

      toast.success(`Plan ${!plan.isActive ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update plan status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Subscription Management</h1>
            <p className="text-gray-600 mt-1 dark:text-gray-400">
              Manage subscription plans and monitor performance metrics
            </p>
          </div>
          
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.title} kpi={kpi} />
          ))}
        </section>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
            Subscription Plans
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({plans.filter(p => p.isActive).length} active plans)
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
              />
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">No plans found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No subscription plans are currently configured. Please check your Stripe integration.
              </p>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          }}
          onUpdate={handleUpdatePlan}
        />
      )}
    </div>
  );
}

export default AdminSubscription;