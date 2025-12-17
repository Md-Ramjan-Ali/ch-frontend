import React from 'react';
import ProgressBar from './ProgressBar';

interface WritingAreaProps {
  prompt: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  minWords: number;
  maxWords: number;
  wordCount: number;
}

const WritingArea: React.FC<WritingAreaProps> = ({
  prompt, text, setText, minWords, maxWords, wordCount
}) => (
  <div className="w-full">
    <div className="mb-4">
      {/* Prompt Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-3 rounded-r-lg">
        <p className="text-blue-900 dark:text-blue-100 font-medium">{prompt}</p>
      </div>

      {/* Progress Bar */}
      <ProgressBar wordCount={wordCount} minWords={minWords} maxWords={maxWords} />

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing your response..."
        className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
      />
      
      {/* Word Count Display */}
      <div className="flex justify-between items-center mt-2 px-1">
        <span className={`text-sm ${
          wordCount < minWords 
            ? 'text-red-500 dark:text-red-400' 
            : wordCount > maxWords 
            ? 'text-orange-500 dark:text-orange-400'
            : 'text-green-500 dark:text-green-400'
        } font-medium`}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Target: {minWords}-{maxWords} words
        </span>
      </div>

      {/* Word Count Status Message */}
      {wordCount > 0 && (
        <div className="mt-2 px-1">
          {wordCount < minWords && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {minWords - wordCount} more {minWords - wordCount === 1 ? 'word' : 'words'} needed
            </p>
          )}
          {wordCount > maxWords && (
            <p className="text-sm text-orange-500 dark:text-orange-400">
              {wordCount - maxWords} {wordCount - maxWords === 1 ? 'word' : 'words'} over limit
            </p>
          )}
          {wordCount >= minWords && wordCount <= maxWords && (
            <p className="text-sm text-green-500 dark:text-green-400">
              Word count is perfect!
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);

export default WritingArea;