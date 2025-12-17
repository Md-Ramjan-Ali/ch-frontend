import React from 'react';
import StatsCards from './AdminStatsCards';
import UsersChart from './AdminUsersChart';
import RecentActivity from './AdminRecentActivity';
import SubscriptionBreakdown from './AdminSubscriptionBreakdown';
import Header from '@/components/Header/Header';

const AdminOverview: React.FC = () => (
  <div className="p-6 flex flex-col gap-10 dark:text-gray-200 dark:bg-gray-900">

    <Header title={"Admin Dashboard"} subtitle={"   Welcome back! Here's what's happening with your platform today."} />


    <StatsCards />
    <UsersChart />

    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
      <RecentActivity />
      <SubscriptionBreakdown />
    </div> */}

    <div className="flex flex-wrap gap-6 items-start">
      <div className='flex-1 '><RecentActivity /></div>
      <div className='  '><SubscriptionBreakdown /></div>
    </div>


  </div>
);

export default AdminOverview;
