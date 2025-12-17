// LearningOverview.tsx

import React from 'react';
import { UserData } from './types';
import ProgressBar from './ProgressBar'; // Import the shared ProgressBar

interface LearningOverviewProps {
  learning: UserData['learning'];
  stats: UserData['stats'];
}

const StatisticItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
  </div>
);

const LearningOverview: React.FC<LearningOverviewProps> = ({ learning, stats }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      
      {/* Learning Statistics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 mb-4">Learning Statistics</h3>
        <div className="space-y-1">
          <StatisticItem label="Current Level" value={learning?.currentLevel} />
          <StatisticItem label="Total Study Time" value={`${stats?.studyHours} hours`} />
          <StatisticItem label="Average Session" value={`${stats?.studyMinutes} minutes`} />
          <StatisticItem label="Flashcards Reviewed" value={learning?.flashcardsReviewed.toLocaleString()} />
          <StatisticItem label="Achievements" value={learning?.achievements} />
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 mb-4">Progress Overview</h3>
        <div className="space-y-4 pt-1">
          <ProgressBar label="Lesson Progress" progress={learning?.progress?.lessonProgress} />
          <ProgressBar label="Vocabulary Mastery" progress={learning?.progress?.vocabularyMastery} />
          <ProgressBar label="Grammar Skills" progress={learning?.progress?.grammarSkills} />
        </div>
      </div>
    </div>
  );
};

export default LearningOverview;
