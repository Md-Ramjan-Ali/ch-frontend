
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import React from 'react';
import { Link } from 'react-router-dom';

// Define a type for the detailed statistic items
interface StatItem {
  label: string;
  value: string;
}

interface WeeklyProgressCardProps {
  /** The user's progress percentage, between 0 and 100. */
  progress: number;
  /** The main title for the statistics section (e.g., 'This Week'). */
  title: string;
  /** The subtitle for the statistics section (e.g., 'Your learning progress'). */
  subtitle: string;
  /** The text displayed on the action button. */
  buttonText: string;
  /** Optional function to call when the button is clicked. */
  onButtonClick?: () => void;
  /** The list of key statistics to display. */
  stats: StatItem[];
}

const UserWeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  progress,
  title,
  subtitle,
  buttonText,
  onButtonClick,
  stats,
}) => {
  // Ensure progress is within bounds
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="p-6 bg-white dark:bg-[#34485D] rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        <p className="text-sm text-[#A7A7A7] dark:text-gray-400">{subtitle}</p>
      </div>

      {/* Progress Bar Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Weekly Goal</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{clampedProgress}%</span>
        </div>

        <ProgressBar 
          progress={clampedProgress} 
          color="bg-[#111827]" 
          className="h-3"
        />
      </div>

      {/* Stats Section */}
      <div className="flex justify-around py-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-[#A7A7A7] dark:text-gray-400 mb-1">{stat.label}</div>
            <div className="text-lg font-bold text-[#333] dark:text-gray-200">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Link to="analytics"
        onClick={onButtonClick}
        className="w-full p-5 border cursor-pointer border-[#333] text-[#333]  font-semibold py-3 rounded-xl hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 transition duration-150"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default UserWeeklyProgressCard;














// import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
// import React from 'react';

// // Define a type for the detailed statistic items
// interface StatItem {
//   label: string;
//   value: string;
// }

// interface WeeklyProgressCardProps {
//   /** The user's progress percentage, between 0 and 100. */
//   progress: number;
//   /** The main title for the statistics section (e.g., 'This Week'). */
//   title: string;
//   /** The subtitle for the statistics section (e.g., 'Your learning progress'). */
//   subtitle: string;
//   /** The text displayed on the action button. */
//   buttonText: string;
//   /** Optional function to call when the button is clicked. */
//   onButtonClick?: () => void;
//   /** The list of key statistics to display. */
//   stats: StatItem[];
// }

// const UserWeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
//   progress,
//   title,
//   subtitle,
//   buttonText,
//   onButtonClick,
//   stats,
// }) => {
//   // Ensure progress is within bounds
//   const clampedProgress = Math.min(100, Math.max(0, progress));

//   return (
//     <div className="p-6  bg-white rounded-xl shadow-lg"  >
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//         <p className="text-sm text-[#A7A7A7]">{subtitle}</p>
//       </div>

//       {/* Progress Bar Section */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
//           <span className="text-sm font-semibold text-gray-800">{clampedProgress}%</span>
//         </div>

//         {/* Progress Bar Track */}
//         {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
//            <div
//             className="bg-[#111827] h-3 rounded-full"
//             style={{ width: `${clampedProgress}%` }}
//           ></div>
//         </div> */}

// <ProgressBar 
//   progress={clampedProgress} 
//   color="bg-[#111827]" 
//    className='h-3'
//   // showPercentage
  
// />
//       </div>

//       {/* Stats Section */}
//       <div className="flex justify-around      py-4 mb-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="text-center">
//             <div className="text-xs font-medium text-[#A7A7A7] mb-1">{stat.label}</div>
//             <div className="text-lg font-bold text-[#333]">{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Action Button */}
//       <button
//         onClick={onButtonClick}
//         className="w-full border cursor-pointer border-[#333] text-[#333]  font-semibold   py-3 rounded-xl hover:bg-gray-50 transition duration-150"
//       >
//         {buttonText}
//       </button>
//     </div>
//   );
// };

// export default UserWeeklyProgressCard;
