


import React from 'react';
import { EyeOff, Eye, Lightbulb } from 'lucide-react';
// import icon from "../../../assets/Dashbord/practice.svg"
// interface ExerciseHeaderProps {
//   title: string;
//   description?: string;
//   progressLabel?: string; // e.g., "Exercise 1/3"
//   showTips?: boolean;
//   onToggleTips?: () => void;
//   icon?: React.ReactNode; // optional custom icon
//   gradientColor?: string; // e.g. "from-amber-400 to-orange-500"
// }


interface ExerciseHeaderProps {
  title: string;
  description?: string;
  progressLabel?: string;
  showTips?: boolean;
  onToggleTips?: () => void;
  icon?: string | React.ReactNode; // string = image path, ReactNode = SVG component
  gradientColor?: string;
}


const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  title,
  description,
  progressLabel,
  showTips,
  onToggleTips,
  icon,
  
}) => {
  return (
    <div className="py-6     rounded-t-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* <div
            className={`w-12 h-12 bg-gradient-to-br ${gradientColor} rounded-lg flex items-center justify-center`}
          >
             
            {icon || <Lightbulb className="w-6 h-6 text-white" />}
          </div> */}
  {typeof icon === "string" ? (
    <img src={icon} alt="icon" className="w-12 h-12" />
  ) : (
    icon || <Lightbulb className="w-6 h-6 text-white" />
  )}
          {/* <img src={icon} alt="" /> */}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-200">{description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {onToggleTips && (
            <button
              onClick={onToggleTips}
              className="px-3 py-1.5 cursor-pointer text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {showTips ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showTips ? 'Hide Hints' : 'Show Hints'}
            </button>
          )}

          {progressLabel && (
            <button className="px-3 py-1.5 cursor-pointer text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              {progressLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeader;






 