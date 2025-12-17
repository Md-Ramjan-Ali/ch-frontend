

import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
}

export const UserProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className="h-3 rounded-full transition-all duration-500 bg-[#111827] dark:bg-[#AFC7FF]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};






// import React from 'react';

// interface ProgressBarProps {
//   value: number;
//   max: number;
//   lightColor?: string; // color for light mode
//   darkColor?: string;  // color for dark mode
// }

// export const UserProgressBar: React.FC<ProgressBarProps> = ({
//   value,
//   max,
//   lightColor = '#111827', // default light mode color
//   darkColor = '#F8F8F8',   // default dark mode color
// }) => {
//   const percentage = Math.min((value / max) * 100, 100);

//   return (
//     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//       <div
//         className="h-3 rounded-full transition-all duration-500"
//         style={{
//           width: `${percentage}%`,
//           backgroundColor: lightColor,
//         }}
//       >
//         <style>{`
//           @media (prefers-color-scheme: dark) {
//             div[style] {
//               background-color: ${darkColor} !important;
//             }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };









// import React from 'react';

// interface ProgressBarProps {
//   value: number;
//   max: number;
//   color?: string; // optional, default to #111827
// }

// export const UserProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = '#111827' }) => {
//   const percentage = Math.min((value / max) * 100, 100); // limit to 100%
  
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-3">
//       <div
//         className="h-3 rounded-full transition-all duration-500"
//         style={{ width: `${percentage}%`, backgroundColor: color }}
//       />
//     </div>
//   );
// };

