// PersonalInformation.tsx (read-only version)

import React from 'react';
import { UserData } from './types';

interface PersonalInformationProps {
  user: UserData;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  //(user)
  const InfoField: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
    <div className="flex flex-col border-b py-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-800 dark:text-gray-100">{value || '-'}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm mb-6 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 mb-4">
        Personal Information
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        User's personal details and contact information
      </p>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
  <InfoField label="Full Name" value={user.name} />
  <InfoField label="Email Address" value={user.email} />
  <InfoField label="Email Verified" value={user.emailVerified ? "Yes" : "No"} />
  <InfoField label="Current Level" value={user.currentLevel} />
  <InfoField label="Current Streak" value={user.currentStreak} />
  <InfoField label="Daily Goal (minutes)" value={user.dailyGoalMinutes} />
  <InfoField label="Has Used Trial" value={user.hasUsedTrial ? "Yes" : "No"} />
  <InfoField label="Active Status" value={user.isActive ? "Active" : "Inactive"} />
  <InfoField label="Last Practice Date" value={user.lastPracticeDate || "N/A"} />
  <InfoField label="Lessons Completed" value={user.lessonsCompleted} />
  <InfoField label="Longest Streak" value={user.longestStreak} />
  <InfoField label="Native Language" value={user.nativeLang} />
  <InfoField label="Target Language" value={user.targetLang} />
  <InfoField label="Role" value={user.role} />
  <InfoField label="Subscription Plan" value={user.subscriptionPlan} />
  <InfoField label="Stripe Customer ID" value={user.stripeCustomerId || "N/A"} />
  <InfoField label="Subscriptions" value={user.subscriptions.length} />
  <InfoField label="Total Minutes Studied" value={user.totalMinutesStudied} />
  <InfoField label="Trial Available" value={user.trialAvailable ? "Yes" : "No"} />
  <InfoField label="Words Learned" value={user.wordsLearned} />
  <InfoField label="XP" value={user.xp} />
  <InfoField label="Created At" value={new Date(user.createdAt).toLocaleString()} />
  <InfoField label="Updated At" value={new Date(user.updatedAt).toLocaleString()} />
  <InfoField label="Avatar" value={user.avatar || "N/A"} />
  <InfoField label="Timezone" value={user.timezone || "N/A"} />
</div>

    </div>
  );
};

export default PersonalInformation;
