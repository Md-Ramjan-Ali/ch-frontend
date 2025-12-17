
import React from 'react';
import { CheckCircle, RefreshCw, Home } from 'lucide-react';
import { TiArrowForward } from "react-icons/ti";

interface CompletionPageProps {
  score: number;
  onPracticeAgain: () => void;
  onBackToPractice: () => void;
}

const CompletionPage: React.FC<CompletionPageProps> = ({
  score,
  onPracticeAgain,
  onBackToPractice
}) => {
  const getScoreMessage = () => {
    if (score >= 90) return 'Excellent! Your pronunciation is amazing! 🎉';
    if (score >= 75) return 'Great job! You\'re making good progress!';
    if (score >= 60) return 'Good effort! Keep practicing to improve.';
    return 'Keep practicing! You\'ll get better with time.';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" strokeWidth={2} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
        Exercise Complete!
      </h1>
      <p className="text-center text-base text-gray-500 dark:text-gray-300 mb-6">
        {getScoreMessage()}
      </p>

      {/* Score Display */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {score}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">YOUR SCORE</div>
        </div>
        
        {/* Score Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* XP Earned */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center w-full py-3 border rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.max(20, Math.floor(score * 0.3))}+
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">XP EARNED</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPracticeAgain}
          className="flex-1 py-3 px-4 border-2 rounded-xl font-medium cursor-pointer 
             flex items-center justify-center gap-2 
             border-gray-900 text-gray-900 dark:border-gray-300 dark:text-gray-200
             hover:bg-gray-50 dark:hover:bg-gray-700 
             transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Practice Again
        </button>

        <button
          onClick={onBackToPractice}
          className="flex-1 justify-center cursor-pointer flex items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Practice
          <TiArrowForward className="text-xl" />
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Tips for Improvement:
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Practice daily for 15-20 minutes</li>
          <li>• Listen to native Italian speakers</li>
          <li>• Record yourself and compare</li>
          <li>• Focus on difficult sounds</li>
        </ul>
      </div>
    </div>
  );
};

export default CompletionPage;








// import React from 'react';
// import { CheckCircle } from 'lucide-react';

// interface CompletionPageProps {
//   onPracticeAgain: () => void;
// }

// const CompletionPage: React.FC<CompletionPageProps> = ({ onPracticeAgain }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//       <div className="p-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
//               <CheckCircle className="text-green-600" size={50} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Speaking Practice Complete!</h2>
//           <p className="text-gray-600">You scored 15 exercises in 8 sessions today!</p>
//         </div>

//         <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
//           <div className="bg-green-50 p-4 rounded-lg text-center">
//             <div className="text-2xl font-bold text-gray-900">10</div>
//             <div className="text-sm text-gray-600">Exercises Done</div>
//           </div>
//           <div className="bg-blue-50 p-4 rounded-lg text-center">
//             <div className="text-2xl font-bold text-gray-900">75%</div>
//             <div className="text-sm text-gray-600">Accuracy Rate</div>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg text-center">
//             <div className="text-2xl font-bold text-gray-900">30+</div>
//             <div className="text-sm text-gray-600">XP Earned</div>
//           </div>
//         </div>
        
//         {/* Simplified Analysis & Study Plan (Kept as static for simplicity) */}
//         <div className="mb-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
//             <div className="flex items-start gap-3">
//               <div className="text-blue-600 mt-1">📊</div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-1">Performance Analysis - Needs Improvement</h3>
//                 <p className="text-sm text-gray-600">
//                   Don't worry! Listening is often the most challenging skill. With targeted practice, you'll see rapid improvement.
//                 </p>
//               </div>
//             </div>
//         </div>

//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onPracticeAgain}
//             className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
//           >
//             <span>🔄</span> Practice Again
//           </button>
//           <button className="px-6 py-3 bg-blue-60 cursor-pointer rounded-lg font-medium text-white hover:bg-blue-700 transition-colors">
//             ➜ More Speaking Practice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompletionPage;
