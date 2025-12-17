import React from 'react';
import { Lightbulb } from 'lucide-react';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';

interface WritingTipsProps {
  tips: string[];
}

const WritingTips: React.FC<WritingTipsProps> = ({ tips }) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 transition-colors duration-200">
    <div className="flex items-center gap-2 mb-4">
      <Lightbulb className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Writing Tips</h3>
    </div>
    <ul className="space-y-3">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
          <IoCheckmarkDoneSharp className="w-4 h-4 text-[#0E9F6E] dark:text-green-400 mt-0.5" />
          <span className="leading-relaxed">{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default WritingTips;