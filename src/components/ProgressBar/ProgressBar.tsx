
import React from "react";

interface ProgressBarProps {
  /** If using percentage directly (0–100) */
  progress?: number;
  /** If using step-based progress */
  current?: string | number | any;
  total?: number;
  /** Optional label shown above the bar */
  label?: string;
  /** Show numeric percentage text */
  showPercentage?: boolean;
  /** Tailwind color for the filled part */
  color?: string;
  /** Height of the bar, e.g. 'h-2', 'h-3' */
  height?: string;
  /** Rounded corner size */
  rounded?: string;
  /** Extra wrapper classes */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  current,
  total,
  label,
  showPercentage = false,
  color = "bg-indigo-600",
  // height = "h-2",
  rounded = "rounded-full",
  className = "",
}) => {
  // Correct progress percentage calculation
  const percentage =
    progress !== undefined
      ? Math.min(Math.max(progress, 0), 100)
      : total
      ? Math.min(((current ?? 0) / total) * 100, 100)
      : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Optional label */}
      {label && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {total && current !== undefined
            ? `${label} ${current} of ${total}`
            : label}
        </div>
      )}

      {/* Progress bar track */}
      <div className={`w-full dark:bg-gray-700 bg-[#D9D9D9]  h-3 ${rounded} overflow-hidden`}>
        <div
          className={`${color} dark:bg-blue-500 h-3 ${rounded} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Optional numeric percentage */}
      {showPercentage && (
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

















// import React from "react";

// interface ProgressBarProps {
//   /** If using percentage directly (0–100) */
//   progress?: number;
//   /** If using step-based progress */
//   current?: string | number|any;
//   total?: number;
//   /** Optional label shown above the bar */
//   label?: string;
//   /** Show numeric percentage text */
//   showPercentage?: boolean;
//   /** Tailwind color for the filled part */
//   color?: string;
//   /** Height of the bar, e.g. 'h-2', 'h-3' */
//   height?: string;
//   /** Rounded corner size */
//   rounded?: string;
//   /** Extra wrapper classes */
//   className?: string;
// }

// export const ProgressBar: React.FC<ProgressBarProps> = ({
//   progress,
//   current,
//   total,
//   label,
//   showPercentage = false,
//   color = "bg-indigo-600",
//   // height = "h-2",
//   rounded = "rounded-full",
//   className = "",
// }) => {
//   // Correct progress percentage calculation
//   const percentage =
//     progress !== undefined
//       ? Math.min(Math.max(progress, 0), 100)
//       : total
//       ? Math.min(((current ?? 0) / total) * 100, 100)
//       : 0;

//   return (
//     <div className={`w-full ${className}`}>
//       {/* Optional label */}
//       {label && (
//         <div className="text-xs text-gray-600 mb-2">
//           {total && current !== undefined
//             ? `${label} ${current} of ${total}`
//             : label}
//         </div>
//       )}

//       {/* Progress bar track */}
//       <div className={`w-full bg-[#D9D9D9]  h-3 ${rounded} overflow-hidden`}>
//         <div
//           className={`${color}  h-3 ${rounded} transition-all duration-500 ease-out`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>

//       {/* Optional numeric percentage */}
//       {showPercentage && (
//         <div className="text-xs text-gray-600 mt-1">{Math.round(percentage)}%</div>
//       )}
//     </div>
//   );
// };










 