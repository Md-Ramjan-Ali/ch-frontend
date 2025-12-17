import React from 'react';

interface ProgressBarProps {
  wordCount: number;
  minWords: number;
  maxWords: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ wordCount, minWords, maxWords }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-gray-600 mb-1">
      <span>Target: {minWords}-{maxWords} words</span>
      <span
        className={
          wordCount < minWords ? 'text-red-500' :
          wordCount > maxWords ? 'text-orange-500' :
          'text-green-600'
        }
      >
        {wordCount} words
      </span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ${
          wordCount < minWords ? 'bg-red-400' :
          wordCount > maxWords ? 'bg-orange-400' :
          'bg-green-500'
        }`}
        style={{
          width: `${Math.min((wordCount / maxWords) * 100, 100)}%`,
          background: wordCount < minWords
            ? 'repeating-linear-gradient(45deg, #f87171, #f87171 10px, #fca5a5 10px, #fca5a5 20px)'
            : undefined
        }}
      />
    </div>
  </div>
);

export default ProgressBar;
