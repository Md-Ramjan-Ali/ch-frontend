// UserDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserInfoCard from './UserInfoCard';
import StatsGrid from './StatsGrid';
import PersonalInformation from './PersonalInformation';
import LearningOverview from './LearningOverview';
import SubscriptionDetails from './SubscriptionDetails';
import { UserData } from './types';
import { useGetStudentsQuery } from '@/redux/features/userManagement/usermanagementApi';

const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from URL params
  const { data } = useGetStudentsQuery({});
  const [user, setUser] = useState<UserData | null>(null);
  //(data)
//(data?.data?.data?.find((u: UserData) => u.id === id))
  useEffect(() => {
    if (data?.data && id) {
      // Find the user from the API response
      const foundUser = data?.data?.data?.find((u: UserData) => u.id === id);
      setUser(foundUser || null);
    }
  }, [data, id]);

  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8 dark:text-white">
        <p className="text-gray-500 dark:text-gray-400">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8 dark:text-white">
      <header className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          User Management &gt; <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
        </p>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">User Details</h1>
        <p className="text-md text-gray-500 dark:text-gray-400">Comprehensive user information and management</p>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {/* User information card */}
        <UserInfoCard user={user} />

        {/* Stats */}
        <StatsGrid stats={user.stats} dayStreak={user.currentStreak} />

        {/* Personal information */}
        <PersonalInformation 
          user={user} 
          
        />

        {/* Learning overview */}
        <LearningOverview learning={user.learning} stats={user.stats} />

        {/* Subscription details */}
        {/* <SubscriptionDetails subscription={user.subscriptions} /> */}
        <SubscriptionDetails subscription={user.subscriptions?.[0]} />
      </main>
    </div>
  );
};

export default UserDetailsPage;
