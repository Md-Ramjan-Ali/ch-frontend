import React from 'react';
import { Check } from 'lucide-react';
import { GoalData } from './AIStudyPlanner';
import { IoSparklesSharp } from "react-icons/io5";

type SetupGoalProps = {
  goalData: GoalData;
  setGoalData: React.Dispatch<React.SetStateAction<GoalData>>;
  onGenerate: () => void;
};

// Checkbox Component with Dark Mode
const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
    <input
      type="checkbox"
      className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);

// Time Option Component with Dark Mode
const TimeOption: React.FC<{ time: string; hint: string; isSelected: boolean; onClick: () => void }> = ({
  time,
  hint,
  isSelected,
  onClick,
}) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-800'
        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <p className="font-medium text-gray-800 dark:text-gray-200">{time}</p>
      {isSelected && <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
  </div>
);

export const SetupGoalView: React.FC<SetupGoalProps> = ({ goalData, setGoalData, onGenerate }) => {
  const focusAreas = ['Vocabulary', 'Listening', 'Speaking', 'Grammar', 'Writing', 'All Areas'];
  const dailyTimes = ['20 minutes', '45 minutes', '1 hour', '2 hours'];

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
      {/* Left Column - Learning Goals */}
      <div className="space-y-6 p-6 border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Set Your Learning Goals</h2>

        {/* Focus Areas */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Select Your Focus Areas</h3>
          <div className="grid grid-cols-2 gap-2">
            {focusAreas.map((area) => (
              <Checkbox
                key={area}
                label={area}
                checked={goalData.focusAreas.includes(area)}
                onChange={(checked) =>
                  setGoalData({
                    ...goalData,
                    focusAreas: checked
                      ? [...goalData.focusAreas, area]
                      : goalData.focusAreas.filter((f) => f !== area),
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Target Selection */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Choose Your Target</h3>
          <select
            value={goalData.target}
            onChange={(e) => setGoalData({ ...goalData, target: e.target.value })}
            className="w-full cursor-pointer p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
          >
            <option value="Learn 50 New Words">Learn 50 New Words</option>
            <option value="Master 10 Grammar Rules">Master 10 Grammar Rules</option>
            <option value="Improve Conversation Skills">Improve Conversation Skills</option>
            <option value="Prepare for Italian Exam">Prepare for Italian Exam</option>
            <option value="Travel Italian Basics">Travel Italian Basics</option>
          </select>
        </div>

        {/* Selection Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Your Selection:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {goalData.focusAreas.length > 0 
              ? `Focusing on: ${goalData.focusAreas.join(', ')}`
              : 'No focus areas selected'
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: {goalData.target}
          </p>
        </div>
      </div>

      {/* Right Column - Availability */}
      <div className="space-y-6 p-6 border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Set Your Availability</h2>

        {/* Daily Study Time */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Daily Study Time</h3>
          <div className="space-y-3">
            {dailyTimes.map((time) => (
              <TimeOption
                key={time}
                time={time}
                hint={time === '20 minutes' ? 'Perfect for beginners' : 
                      time === '45 minutes' ? 'Good for consistent progress' :
                      time === '1 hour' ? 'Ideal for serious learners' :
                      'Best for intensive learning'}
                isSelected={goalData.dailyTime === time}
                onClick={() => setGoalData({ ...goalData, dailyTime: time })}
              />
            ))}
          </div>
        </div>

        {/* Days Per Week Slider */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Days Per Week</h3>

          {/* Progress Bar Track and Value */}
          <div className="relative h-3 w-full rounded-full bg-gray-300 dark:bg-gray-600">
            {/* The filled part of the 'slider' */}
            <div
              className="absolute h-full rounded-l-full bg-[#FF6E51] dark:bg-orange-500 transition-all duration-300"
              style={{ width: `${(goalData.daysPerWeek / 7) * 100}%` }}
            ></div>

            {/* The circle 'handle' at the current value */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#FF6E51] dark:border-orange-400 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300"
              style={{ left: `calc(${(goalData.daysPerWeek / 7) * 100}% - 10px)` }}
            ></div>
          </div>

          {/* Day labels below the bar */}
          <div className="relative mt-6 grid grid-cols-7 text-center text-sm font-normal text-gray-500 dark:text-gray-400">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="relative">
                {/* Day number label */}
                <span
                  className={`transition-colors duration-200 ${
                    day === goalData.daysPerWeek
                      ? 'text-[#FF6E51] dark:text-orange-400 font-bold'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {day} {day === 1 ? 'Day' : 'Days'}
                </span>
                
                {/* Vertical tick mark under the bar for each day */}
                <div className="absolute  left-1/2 h-2 w-px bg-gray-400 dark:bg-gray-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Your Study Plan:</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {goalData.dailyTime} per day, {goalData.daysPerWeek} days per week
          </p>
        </div>

        {/* Generate Button */}
        <button
          className="w-full from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800 flex cursor-pointer items-center justify-center space-x-2 text-white py-4 rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg mt-2 group"
          onClick={onGenerate}
        >
          <IoSparklesSharp className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-semibold text-lg">Generate AI Study Plan</span>
        </button>

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Our AI will create a personalized study plan based on your goals and availability
        </p>
      </div>
    </div>
  );
};











// import React, { useState } from 'react';
// import { Check,   Plus,   } from 'lucide-react';

// // Reusable Checkbox Component
// const Checkbox: React.FC<{ label: string }> = ({ label }) => (
//   <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-indigo-50 transition-colors">
//     <input
//       type="checkbox"
//       className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
//     />
//     <span className="text-gray-700">{label}</span>
//   </label>
// );

// // Reusable Time Option Component
// const TimeOption: React.FC<{ time: string; hint: string; isSelected: boolean; onClick: () => void }> = ({ time, hint, isSelected, onClick }) => (
//   <div
//     className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
//       isSelected
//         ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
//         : 'border-gray-200 hover:bg-gray-50'
//     }`}
//     onClick={onClick}
//   >
//     <div className="flex justify-between items-center">
//       <p className="font-medium text-gray-800">{time}</p>
//       {isSelected && <Check className="h-5 w-5 text-indigo-600" />}
//     </div>
//     <p className="text-sm text-gray-500">{hint}</p>
//   </div>
// );

// // Helper for the Days Per Week slider (just visual representation here)
// const DaysSlider: React.FC = () => {
//   const selectedDays = 5; // Example state
//   const totalDays = 7;
//   const percentage = (selectedDays / totalDays) * 100;

//   return (
//     <div className="space-y-4">
//       <div className="relative h-2 bg-gray-200 rounded-full">
//         <div
//           className="absolute h-2 bg-red-500 rounded-full"
//           style={{ width: `${percentage}%` }}
//         ></div>
//         <div
//           className="absolute w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow-md -translate-y-1/2"
//           style={{ left: `calc(${percentage}% - 8px)` }}
//         ></div>
//       </div>
//       <div className="flex justify-between text-sm text-gray-500">
//         {[1, 2, 3, 4, 5, 6, 7].map((day) => (
//           <span key={day} className={day <= selectedDays ? 'font-bold text-gray-800' : ''}>
//             {day} Day{day > 1 ? 's' : ''}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export const SetupGoalView: React.FC = () => {
//   const [selectedTime, setSelectedTime] = useState('20 minutes');

//   return (
//     <div className="grid md:grid-cols-2 gap-10">
//       {/* Left Column: Learning Goals */}
//       <div className="space-y-6 p-6 border border-gray-100 rounded-xl shadow-sm">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Set Your Learning Goals
//         </h2>
        
//         <div className="space-y-3">
//           <h3 className="font-medium text-gray-700">Select Your Focus Areas</h3>
//           <div className="grid grid-cols-2 gap-2">
//             <Checkbox label="Vocabulary" />
//             <Checkbox label="Listening" />
//             <Checkbox label="Speaking" />
//             <Checkbox label="Grammar" />
//             <Checkbox label="Writing" />
//             <Checkbox label="All Areas" />
//           </div>
//         </div>

//         <div className="space-y-3">
//           <h3 className="font-medium text-gray-700">Choose Your Target</h3>
//           <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500">
//             <option>Learn 50 New Words</option>
//             <option>Master 10 Grammar Rules</option>
//           </select>
//         </div>
//       </div>

//       {/* Right Column: Availability */}
//       <div className="space-y-6 p-6 border border-gray-100 rounded-xl shadow-sm">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Set Your Availability
//         </h2>

//         {/* Daily Study Time */}
//         <div className="space-y-3">
//           <h3 className="font-medium text-gray-700">Daily Study Time</h3>
//           <div className="space-y-2">
//             <TimeOption
//               time="20 minutes"
//               hint="Perfect for beginners"
//               isSelected={selectedTime === '20 minutes'}
//               onClick={() => setSelectedTime('20 minutes')}
//             />
//             <TimeOption
//               time="45 minutes"
//               hint="Perfect for beginners"
//               isSelected={selectedTime === '45 minutes'}
//               onClick={() => setSelectedTime('45 minutes')}
//             />
//             <TimeOption
//               time="1 hour"
//               hint="Perfect for beginners"
//               isSelected={selectedTime === '1 hour'}
//               onClick={() => setSelectedTime('1 hour')}
//             />
//             <TimeOption
//               time="2 hours"
//               hint="Perfect for beginners"
//               isSelected={selectedTime === '2 hours'}
//               onClick={() => setSelectedTime('2 hours')}
//             />
//           </div>
//         </div>

//         {/* Days Per Week */}
//         <div className="space-y-3">
//           <h3 className="font-medium text-gray-700">Days Per Week</h3>
//           <DaysSlider />
//         </div>

//         {/* Generate Button */}
//         <button className="w-full flex cursor-pointer items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg mt-6">
//           <Plus className="h-5 w-5" />
//           <span>Generate by AI Study Planner</span>
//         </button>
//       </div>
//     </div>
//   );
// };