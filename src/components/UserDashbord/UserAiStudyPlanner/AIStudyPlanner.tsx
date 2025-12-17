import React, { useState } from 'react';
import { SetupGoalView } from './SetupGoalView';
import { YourPlanView } from './YourPlanView';

type Tab = 'Setup Goal' | 'Your Plan';

export type GoalData = {
  focusAreas: string[];
  target: string;
  dailyTime: string;
  daysPerWeek: number;
};

const TabButton: React.FC<{
  label: Tab;
  isActive: boolean;
  onClick: (label: Tab) => void;
}> = ({ label, isActive, onClick }) => (
  <button
    className={`px-6 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white shadow-md from-indigo-500 to-purple-700 dark:from-indigo-600 dark:to-purple-800'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
    onClick={() => onClick(label)}
  >
    {label}
  </button>
);

export const AIStudyPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Setup Goal');

  const [goalData, setGoalData] = useState<GoalData>({
    focusAreas: [],
    target: 'Learn 50 New Words',
    dailyTime: '20 minutes',
    daysPerWeek: 5,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="mx-auto p-6 lg:p-8 rounded-xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white mb-2">
            AI Study Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
            Create your personalized study plan with AI!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-2 rounded-xl bg-gray-200 dark:bg-gray-800 w-fit mb-8 lg:mb-10 transition-colors duration-200">
          <TabButton 
            label="Setup Goal" 
            isActive={activeTab === 'Setup Goal'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            label="Your Plan" 
            isActive={activeTab === 'Your Plan'} 
            onClick={setActiveTab} 
          />
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          {activeTab === 'Setup Goal' && (
            <SetupGoalView
              goalData={goalData}
              setGoalData={setGoalData}
              onGenerate={() => setActiveTab('Your Plan')}
            />
          )}
          {activeTab === 'Your Plan' && <YourPlanView goalData={goalData} />}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${
              activeTab === 'Setup Goal' 
                ? 'bg-indigo-500 dark:bg-indigo-400' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <div className={`w-2 h-2 rounded-full ${
              activeTab === 'Your Plan' 
                ? 'bg-indigo-500 dark:bg-indigo-400' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            Step {activeTab === 'Setup Goal' ? '1' : '2'} of 2
          </span>
        </div>
      </div>
    </div>
  );
};









// import React, { useState } from 'react';
// import { SetupGoalView } from './SetupGoalView';
// import { YourPlanView } from './YourPlanView';

// type Tab = 'Setup Goal' | 'Your Plan';

// // const TabButton: React.FC<{
// //   label: Tab;
// //   isActive: boolean;
// //   onClick: (label: Tab) => void;
// // }> = ({ label, isActive, onClick }) => (
// //   <button
// //     className={`px-6 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-200 ${
// //       isActive
// //         ? 'bg-indigo-600 text-white shadow-md  ' 
// //         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //     }`}
// //     onClick={() => onClick(label)}
// //   >
// //     {label}
// //   </button>
// // );

// const TabButton: React.FC<{
//   label: Tab;
//   isActive: boolean;
//   onClick: (label: Tab) => void;
// }> = ({ label, isActive, onClick }) => (
//   <button
//     className={`px-6 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${
//       isActive
//         ? 'text-white shadow-md bg-gradient-to-b from-indigo-500 to-purple-700'
//         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//     }`}
//     onClick={() => onClick(label)}
//   >
//     {label}
//   </button>
// );



// export const AIStudyPlanner: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<Tab>('Setup Goal');

//   return (
//     <div className="p-8   min-h-screen">
//       <div className="  mx-auto   p-8 rounded-xl  ">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-2">
//           AI Study Planner
//         </h1>
//         <p className="text-gray-500 mb-8">
//           Create your personalized study plan with AI!
//         </p>

//         {/* Tab Navigation */}
//         <div className="flex space-x-2 p-1 rounded-xl bg-gray-100 w-fit mb-10">
//           <TabButton
//             label="Setup Goal"
//             isActive={activeTab === 'Setup Goal'}
//             onClick={setActiveTab}
//           />
//           <TabButton
//             label="Your Plan"
//             isActive={activeTab === 'Your Plan'}
//             onClick={setActiveTab}
//           />
//         </div>
        
//         {/* Content */}
//         <div>
//           {activeTab === 'Setup Goal' && <SetupGoalView />}
//           {activeTab === 'Your Plan' && <YourPlanView />}
//         </div>
//       </div>
//     </div>
//   );
// };