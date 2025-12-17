// ProgressBar.tsx

import React from 'react';

interface ProgressBarProps {
  label: string;
  progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, progress }) => {
  return (
    <div className="mb-3">
      {/* Label and progress percentage */}
      <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>

      {/* Bar background */}
      <div className="mt-1 h-2 bg-gray-700 dark:bg-gray-200 rounded-full">
        {/* Progress fill */}
        <div
          className="h-2 rounded-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
