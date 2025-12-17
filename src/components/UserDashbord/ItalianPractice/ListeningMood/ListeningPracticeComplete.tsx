
import React from 'react';
import { ChevronLeft, Check, TrendingUp } from 'lucide-react';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import think from "../../../../assets/Dashbord/think.svg"
import exericse from "../../../../assets/Dashbord/exercise.svg"
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';

interface ExercisePerformance {
  name: string;
  score: number;
  total: number;
  percentage: number;
}

interface ListeningPracticeCompleteProps {
  exercises: ExercisePerformance[];
}

const ListeningPracticeComplete: React.FC<ListeningPracticeCompleteProps> = ({ exercises }) => {
  const navigate = useNavigate();

  // Calculate overall performance
  const totalScore = exercises.reduce((sum, ex) => sum + ex.score, 0);
  const totalPossible = exercises.reduce((sum, ex) => sum + ex.total, 0);
  const overallPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  const exercisePerformance = exercises.map(ex => ({
    name: ex.name,
    score: ex.score,
    maxScore: ex.total,
    percentage: ex.percentage
  }));

  const areasForImprovement = exercisePerformance
    .filter(ex => ex.percentage < 70)
    .map(ex => ({
      title: ex.name,
      description: `Scored ${ex.score}/${ex.maxScore} (${ex.percentage}%)`,
      practices: [
        { text: 'Practice predicting content before listening' },
        { text: 'Focus on key vocabulary and phrases' },
        { text: 'Listen multiple times to difficult sections' },
        { text: 'Use transcripts to check understanding' }
      ]
    }));

  const studyPlan = [
    { id: 1, text: 'Begin with very basic Italian audio content' },
    { id: 2, text: 'Practice listening to different Italian accents' },
    { id: 3, text: 'Use transcripts to improve comprehension' },
    { id: 4, text: 'Gradually increase listening speed' }
  ];

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/user/practice")}
          className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-base font-semibold">Back To Practice</span>
        </button>

        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 mt-6">
            <div className="w-30 h-30 bg-[#4BAE4F] rounded-full flex items-center justify-center">
              <Check className="w-20 h-20 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#3C424E] dark:text-gray-200 mb-2">Listening Practice Complete!</h1>
          <p className="text-base text-[#999CA2] dark:text-gray-400">You earned {Math.round(totalScore * 2)} points!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#4BAE4F1A] dark:bg-green-900/20 border border-[#EBEBEB] dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-1">{Math.round(totalScore * 2)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Earned Points</div>
          </div>
          <div className="bg-[#F7F9FF] dark:bg-blue-900/20 border border-[#EBEBEB] dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-1">{overallPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
          </div>
          <div className="bg-[#E7EFFF] dark:bg-indigo-900/20 border border-[#EBEBEB] dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-1">{totalScore * 10}+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className={`mt-12 border-l-4 p-4 mb-6 rounded-r-lg ${
          overallPercentage >= 80 ? 'bg-green-50 dark:bg-green-900/20 border-green-400' :
          overallPercentage >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' :
          'bg-red-50 dark:bg-red-900/20 border-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${
              overallPercentage >= 80 ? 'text-green-700' :
              overallPercentage >= 60 ? 'text-yellow-700' :
              'text-red-700'
            }`} />
            <span className={`font-semibold ${
              overallPercentage >= 80 ? 'text-green-900 dark:text-green-300' :
              overallPercentage >= 60 ? 'text-yellow-900 dark:text-yellow-300' :
              'text-red-900 dark:text-red-300'
            }`}>
              Performance Analysis - 
              <span className={`ml-1 ${
                overallPercentage >= 80 ? 'text-green-700 dark:text-green-400' :
                overallPercentage >= 60 ? 'text-yellow-700 dark:text-yellow-400' :
                'text-red-700 dark:text-red-400'
              }`}>
                {overallPercentage >= 80 ? 'Excellent' :
                 overallPercentage >= 60 ? 'Good' :
                 'Needs Improvement'}
              </span>
            </span>
          </div>
        </div>

        <p className="text-sm mt-10 bg-[#EBEBEB] dark:bg-gray-800 py-6 px-4 rounded-2xl text-gray-700 dark:text-gray-300 mb-6">
          {overallPercentage >= 80 ? 'Excellent work! Your listening skills are strong.' :
           overallPercentage >= 60 ? 'Good job! With a bit more practice, you\'ll see great improvement.' :
           'Don\'t worry! Listening is often the most challenging skill. With targeted practice, you\'ll see rapid improvement.'}
        </p>

        {/* Exercise Performance */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img className='w-6 h-6' src={exericse} alt="exercise icon" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">Exercise Performance</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {exercisePerformance.map((exercise, index) => (
              <div key={index} className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-medium text-[#585858] dark:text-gray-300">{exercise.name}</span>
                  <span className="text-sm font-semibold text-[#696D77] dark:text-gray-400">{exercise.percentage}%</span>
                </div>

                <ProgressBar
                  progress={exercise.percentage}
                  height="h-3"
                  color={exercise.percentage >= 70 ? "bg-green-500" : exercise.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}
                  rounded="rounded-full"
                  showPercentage={false}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        {areasForImprovement.length > 0 && (
          <div className="mb-8 mt-10">
            <div className='flex items-center gap-2'>
              <img className='w-6 h-6' src={think} alt="think icon" />
              <h2 className="text-2xl font-bold text-[#333] dark:text-gray-200">Areas for Improvement</h2>
            </div>

            <div className="grid grid-cols-3 mt-5 gap-4">
              {areasForImprovement.map((area, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 text-[#585858] dark:text-gray-300 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-xl mb-1">{area.title}</h3>
                  <p className="text-sm text-[#7E7E7E] dark:text-gray-400 mb-3">{area.description}</p> 
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="text-base font-semibold text-[#585858] dark:text-gray-300 mb-2">Recommended Practice:</h4>
                    <ul className="space-y-1.5">
                      {area.practices.map((practice, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <IoCheckmarkDoneSharp className="w-4 h-4 text-[#0E9F6E] dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{practice.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Study Plan */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">📚 Personalized Study Plan</h2>
          <p className="text-base text-[#7E7E7E] dark:text-gray-400 mb-4">
            Based on your performance, here's what we recommend for your next study sessions:
          </p>

          <div className="grid grid-cols-2 gap-4">
            {studyPlan.map((item) => (
              <div key={item.id} className="bg-[#0E9F6E1A] dark:bg-green-900/20 rounded-lg p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0E9F6E] dark:bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"> 
                  {item.id}
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 cursor-pointer py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
            Practice Again
          </button>
          <button
            onClick={() => navigate("/user/practice")}
            className="px-6 py-3 cursor-pointer bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListeningPracticeComplete;















// import React from 'react';
// import { ChevronLeft, Check, TrendingUp,    } from 'lucide-react';
// import { IoCheckmarkDoneSharp } from "react-icons/io5";

// import { useNavigate } from 'react-router-dom';
// import think from "../../../../assets/Dashbord/think.svg"
// import exericse from "../../../../assets/Dashbord/exercise.svg"
// import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
// interface ExercisePerformance {
//   name: string;
//   score: number;
//   maxScore: number;
//   percentage: number;
// }

// interface RecommendedPractice {
//   text: string;
// }

// interface AreaForImprovement {
//   title: string;
//   description: string;
//   practices: RecommendedPractice[];
// }

// interface StudyPlanItem {
//   id: number;
//   text: string;
// }

// const ListeningPracticeComplete: React.FC = () => {
//   const navigate = useNavigate();

//   const exercisePerformance: ExercisePerformance[] = [
//     { name: 'Audio Comprehension', score: 8, maxScore: 10, percentage: 80 },
//     { name: 'Dictation Exercise', score: 6, maxScore: 10, percentage: 60 },
//     { name: 'Dialogue Sequencing', score: 8, maxScore: 10, percentage: 80 }
//   ];

//   const areasForImprovement: AreaForImprovement[] = [
//     {
//       title: 'Audio Comprehension',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     },
//     {
//       title: 'Dictation Exercise',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     },
//     {
//       title: 'Dialogue Sequencing',
//       description: 'Difficulty understanding quick details',
//       practices: [
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' },
//         { text: 'Practice predicting content before listening' }
//       ]
//     }
//   ];

//   const studyPlan: StudyPlanItem[] = [
//     { id: 1, text: 'Begin with very basic Italian audio content' },
//     { id: 2, text: 'Begin with very basic Italian audio content' },
//     { id: 3, text: 'Begin with very basic Italian audio content' },
//     { id: 4, text: 'Begin with very basic Italian audio content' }
//   ];

//   return (
//     <div className="min-h-screen   p-6">
//       <div className="  mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/user/practice")}
//           className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
//         >
//           <ChevronLeft className="w-6 h-6" />
//           <span className="text-base font-semibold">Back To Practice</span>
//         </button>

//         {/* Success Icon and Title */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-6 mt-6">
//             <div className="w-30 h-30 bg-[#4BAE4F] rounded-full flex items-center justify-center">
//               <Check className="w-20 h-20 text-white" strokeWidth={3} />

//               {/* <img src={serchimg} alt="" /> */}
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold  text-[#3C424E] mb-2">Listening Practice Complete!</h1>
//           <p className="text-base text-[#999CA2]">You earned 10 points and 15 seconds streak!</p>
//         </div>

//         {/* Stats Cards */}
//         <div className='max-w-7xl mx-auto'>
//           <div className="grid  grid-cols-3 gap-4 mb-8">
//             <div className="bg-[#4BAE4F1A] border border-[#EBEBEB] rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">10</div>
//               <div className="text-sm text-gray-600">Earned Points</div>
//             </div>
//             <div className="bg-[#F7F9FF] border border-[#EBEBEB] rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">75%</div>
//               <div className="text-sm text-gray-600">Accuracy Rate</div>
//             </div>
//             <div className="bg-[#E7EFFF] border border-[#EBEBEB]  rounded-lg p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">30+</div>
//               <div className="text-sm text-gray-600">XP Earned</div>
//             </div>
//           </div>
//         </div>

//         {/* Performance Analysis */}
//         <div className="bg-yellow-50 mt-12 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="w-5 h-5 text-yellow-700" />
//             <span className="font-semibold text-yellow-900">Performance Analysis - <span className='text-[#667EEA]'> Needs Improvement</span></span>
//           </div>
//         </div>

//         <p className="text-sm mt-10 bg-[#EBEBEB] py-6 px-4 rounded-2xl text-gray-700 mb-6">
//           Don't worry! Listening is often the most challenging skill. With targeted practice, you'll see rapid improvement.
//         </p>

//         {/* Exercise Performance */}
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             {/* <Target className="w-5 h-5 text-gray-700" /> */}
//             <img className='w-6 h-6' src={exericse} alt="" />
//             <h2 className="text-lg font-bold text-gray-900">Exercise Performance</h2>
//           </div>
 
//           <div className="grid grid-cols-3 gap-4">
//             {exercisePerformance.map((exercise, index) => (
//               <div key={index} className="  rounded-lg p-4 border border-gray-200">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-base font-medium text-[#585858]">{exercise.name}</span>
//                   <span className="text-sm font-semibold text-[#696D77]">{exercise.percentage}%</span>
//                 </div>

//                 {/* Use your ProgressBar component here */}
//                 <ProgressBar
//                   progress={exercise.percentage}          // Or use current/maxScore instead
//                   height="h-3"
//                   color="bg-gray-900"
//                   rounded="rounded-full"
//                   showPercentage={false}                 // Already showing % on top
//                   className="w-full"
//                 />
//               </div>
//             ))}
//           </div>

//         </div>

//         {/* Areas for Improvement */}
//         <div className="mb-8 mt-10">
//           <div className='flex items-center gap-2'>
//             <img className='w-6 h-6' src={think} alt="" />
//             <h2 className="text-2xl font-bold text-[#333]  ">Areas for Improvement</h2>
//           </div>

//           <div className="grid grid-cols-3 mt-5 gap-4">
//             {areasForImprovement.map((area, index) => (
//               <div key={index} className="bg-white text-[#585858] rounded-lg p-4 border border-gray-200">
//                 <h3 className="font-semibold text-xl  mb-1">{area.title}</h3>
//                 <p className="text-sm  text-[#7E7E7E] mb-3">{area.description}</p> 
//                 <div className="border-t border-gray-200 pt-3">
//                   <h4 className="text-base font-semibold   text-[#585858] mb-2">Recommended Practice:</h4>
//                   <ul className="space-y-1.5">
//                     {area.practices.map((practice, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm  ">
//                         <IoCheckmarkDoneSharp className="w-4 h-4  text-[#0E9F6E] flex-shrink-0 mt-0.5" />
//                         <span>{practice.text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Personalized Study Plan */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Personalized Study Plan</h2>
//           <p className="text-base text-[#7E7E7E] mb-4">
//             Based on your performance, here's what we recommend for your next study sessions:
//           </p>

//           <div className="grid grid-cols-2 gap-4">
//             {studyPlan.map((item) => (
//               <div key={item.id} className="bg-[#0E9F6E1A] rounded-lg p-4 flex items-start gap-3 ">
//                 <div className="w-8 h-8 bg-[#0E9F6E] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"> 
//                   {item.id}
//                 </div>
//                 <p className="text-sm text-gray-800 pt-1">{item.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4">
//           <button className="px-6 cursor-pointer py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
//             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M12 2v20M2 12h20" />
//             </svg>
//             Practice Again
//           </button>
//           <button className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
//             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//             Next Listening Practice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListeningPracticeComplete;