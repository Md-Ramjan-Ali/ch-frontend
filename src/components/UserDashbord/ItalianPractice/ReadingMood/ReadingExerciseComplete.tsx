import React from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { TiArrowForward } from "react-icons/ti";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { GiCrossedAirFlows } from "react-icons/gi";

interface Answer {
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ReadingExerciseCompleteProps {
  answers: Answer[];
  passage: string;
  onRetry: () => void;
  onContinue: () => void;
}

const ReadingExerciseComplete: React.FC<ReadingExerciseCompleteProps> = ({ 
  answers, 
  passage, 
  onRetry, 
  onContinue 
}) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Function to extract answer text from option string
  const getAnswerText = (answer: string): string => {
    return answer || "No answer provided";
  };

  // Function to extract just the option letter
  const getOptionLetter = (answer: string): string => {
    if (!answer) return "";
    const match = answer.match(/^([A-D])\./);
    return match ? match[1] : answer.charAt(0);
  };

  // Function to find relevant explanation from passage
  const findExplanation = (question: string, correctAnswer: string): string => {
    try {
      const passageSentences = passage.split('. ');
      const questionLower = question.toLowerCase();
      
      // Try to find a sentence that relates to the question
      for (const sentence of passageSentences) {
        const sentenceLower = sentence.toLowerCase();
        
        // Check if sentence contains keywords from question
        const questionWords = questionLower.split(' ').filter(word => word.length > 3);
        const hasQuestionKeywords = questionWords.some(word => 
          sentenceLower.includes(word)
        );
        
        // Check if sentence relates to the correct answer
        const answerText = getAnswerText(correctAnswer).toLowerCase();
        const answerWords = answerText.split(' ').filter(word => word.length > 3);
        const hasAnswerKeywords = answerWords.some(word => 
          sentenceLower.includes(word)
        );
        
        if ((hasQuestionKeywords || hasAnswerKeywords) && sentence.trim().length > 20) {
          return sentence.trim() + ".";
        }
      }
      
    } catch (error) {
      console.error("Error finding explanation:", error);
    }
    
    return "Refer to the passage for more details about this topic.";
  };

  return (
    <div className="mx-auto rounded-lg">
      {/* Success Icon */}
      <div className="flex justify-center mb-4 mt-6">
        <div className="w-30 h-30 bg-[#4BAE4F] rounded-full flex items-center justify-center">
          <Check className="w-20 h-20 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-center text-2xl mt-4 font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Reading Exercise Complete!
      </h1>
      <p className="text-center text-base text-gray-500 dark:text-gray-300 mb-6">
        You scored {correctCount} out of {totalQuestions} questions ({percentage}%)
      </p>

      {/* Stats */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="text-center w-full py-3 border rounded-2xl 
                  bg-gray-100 dark:bg-gray-800 
                  border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {correctCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">CORRECT ANSWERS</div>
        </div>

        <div className="text-center w-full py-3 border rounded-2xl 
                  bg-gray-100 dark:bg-gray-800 
                  border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {percentage}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">ACCURACY</div>
        </div>

        <div className="text-center w-full py-3 border rounded-2xl 
                  bg-gray-100 dark:bg-gray-800 
                  border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {Math.max(20, correctCount * 10)}+
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">XP EARNED</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onRetry}
          className="flex-1 py-3 px-4 border-2 rounded-2xl font-medium cursor-pointer 
             flex items-center justify-center gap-2 
             border-gray-900 text-gray-900 dark:border-gray-300 dark:text-gray-200
             hover:bg-gray-50 dark:hover:bg-gray-700 
             transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Try New Lesson
        </button>

        <button
          onClick={onContinue}
          className="flex-1 justify-center cursor-pointer flex items-center gap-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Practice
          <TiArrowForward className="text-2xl" />
        </button>
      </div>

      {/* Answer Review Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Answer Review</h2>
        <div className="space-y-4">
          {answers.map((answer, index) => {
            const userAnswerText = getAnswerText(answer.userAnswer || "");
            const correctAnswerText = getAnswerText(answer.correctAnswer);
            const userOptionLetter = getOptionLetter(userAnswerText);
            const correctOptionLetter = getOptionLetter(correctAnswerText);
            
            return (
              <div
                key={index}
                className="border-l-4 pl-4 py-2"
                style={{ borderColor: answer.isCorrect ? '#10b981' : '#ef4444' }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {answer.isCorrect ? (
                    <IoCheckmarkDoneSharp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <GiCrossedAirFlows className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {answer.question}
                  </p>
                </div>

                <div className="ml-7 text-sm space-y-1">
                  {answer.userAnswer && (
                    <div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Your Answer: </span>
                      <span className={answer.isCorrect ? "text-gray-700 dark:text-gray-300" : "text-red-600 dark:text-red-400"}>
                        {userOptionLetter && `${userOptionLetter}. `}{userAnswerText.replace(/^[A-D]\.\s*/, '')}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-green-600 dark:text-green-400 font-medium">Correct Answer: </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {correctOptionLetter && `${correctOptionLetter}. `}{correctAnswerText.replace(/^[A-D]\.\s*/, '')}
                    </span>
                  </div>
                </div>

                <p className="ml-7 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {findExplanation(answer.question, answer.correctAnswer)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReadingExerciseComplete;






// import React from 'react';
// import { Check, RefreshCw } from 'lucide-react';
// import { TiArrowForward } from "react-icons/ti";
// import { IoCheckmarkDoneSharp } from "react-icons/io5";
// import { GiCrossedAirFlows } from "react-icons/gi";

// interface Answer {
//   question: string;
//   userAnswer?: string;
//   correctAnswer: string;
//   isCorrect: boolean;
// }

// interface ReadingExerciseCompleteProps {
//   answers: Answer[];
// }

// const ReadingExerciseComplete: React.FC<ReadingExerciseCompleteProps> = ({ answers }) => {
//   const correctCount = answers.filter(a => a.isCorrect).length;
//   const percentage = Math.round((correctCount / answers.length) * 100);

//   return (
//     <div className="mx-auto rounded-lg">
//       {/* Success Icon */}
//       <div className="flex justify-center mb-4 mt-6">
//         <div className="w-30 h-30 bg-[#4BAE4F] rounded-full flex items-center justify-center">
//           <Check className="w-20 h-20 text-white" strokeWidth={3} />
//         </div>
//       </div>

//       {/* Title */}
//       <h1 className="text-center text-2xl mt-4 font-semibold text-gray-800 mb-2">
//         Reading Exercise Complete!
//       </h1>
//       <p className="text-center text-base text-gray-500 mb-6">
//         You scored {correctCount} out of {answers.length} questions ({percentage}%)
//       </p>

//       {/* Stats */}
//       <div className="flex justify-between items-center gap-4 mb-6">
//         <div className="text-center w-full py-3 border rounded-2xl 
//                   bg-gray-100 dark:bg-gray-800 
//                   border-gray-200 dark:border-gray-700">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
//             {correctCount}
//           </div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">CORRECT ANSWERS</div>
//         </div>

//         <div className="text-center w-full py-3 border rounded-2xl 
//                   bg-gray-100 dark:bg-gray-800 
//                   border-gray-200 dark:border-gray-700">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
//             {percentage}%
//           </div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">ACCURACY</div>
//         </div>

//         <div className="text-center w-full py-3 border rounded-2xl 
//                   bg-gray-100 dark:bg-gray-800 
//                   border-gray-200 dark:border-gray-700">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
//             30+
//           </div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">XP EARNED</div>
//         </div>
//       </div>


//       {/* Action Buttons */}
//       <div className="flex gap-3 mb-6">
//         <button
//           className="flex-1 py-3 px-4 border-2 rounded-2xl font-medium cursor-pointer 
//              flex items-center justify-center gap-2 
//              border-gray-900 text-gray-900 
//              hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 
//              transition-colors"
//         >
//           <RefreshCw className="w-5 h-5" />
//           Try Again
//         </button>

//         <button className="flex-1 justify-center cursor-pointer flex items-center gap-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
//           Keep Reading Practice
//           <TiArrowForward className="text-2xl" />
//         </button>
//       </div>

//       {/* Answer Review Section */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Answer Review</h2>
//         <div className="space-y-4">
//           {answers.map((answer, index) => (
//             <div
//               key={index}
//               className="border-l-4 pl-4 py-2"
//               style={{ borderColor: answer.isCorrect ? '#10b981' : '#ef4444' }}
//             >
//               <div className="flex items-start gap-2 mb-2">
//                 {answer.isCorrect ? (
//                   <IoCheckmarkDoneSharp className="w-5 h-5 text-green-500  mt-0.5" />
//                 ) : (
//                   <GiCrossedAirFlows className="w-5 h-5 text-red-500   mt-0.5" />
//                 )}
//                 <p className="text-base font-medium text-gray-800">{answer.question}</p>
//               </div>

//               <div className="ml-7 text-sm space-y-1">
//                 <div>
//                   <span className="text-blue-600 font-medium">Your Answer: </span>
//                   <span className={answer.isCorrect ? "text-gray-700" : "text-red-600"}>
//                     {answer.userAnswer || "No answer"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-green-600 font-medium">Correct Answer: </span>
//                   <span className="text-gray-700">{answer.correctAnswer}</span>
//                 </div>
//               </div>

//               <p className="ml-7 mt-2 text-xs text-gray-600">
//                 L'Università di Bologna è stata fondata nel 1088, rendendola una delle università più antiche del mondo.
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReadingExerciseComplete;









