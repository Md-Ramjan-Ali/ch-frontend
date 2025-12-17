import React, { useState } from 'react';
import { MessageSquare, User, Mic, MicOff, CheckCircle, PlayCircle } from 'lucide-react';
import { ConversationPracticeProps } from './types';

const ConversationPractice: React.FC<ConversationPracticeProps> = ({
  dialogue,
  prompt,
  isRecording,
  recordingScore,
  onMicClick,
  onContinue,
  onTryAgain
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [showScore, setShowScore] = useState(false);

  const handleStartConversation = () => {
    setConversationStarted(true);
    setCurrentStep(0);
    setUserResponses([]);
    setShowScore(false);
  };

  const handleRecordResponse = () => {
    if (!isRecording) {
      onMicClick();
      
      // Simulate recording completion and move to next step
      setTimeout(() => {
        // Add response
        const response = dialogue[currentStep]?.italian || "Grazie!";
        setUserResponses([...userResponses, response]);
        
        // Check if conversation is complete
        if (currentStep < dialogue.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setShowScore(true);
        }
      }, 2000);
    }
  };

  const handleRestart = () => {
    setConversationStarted(false);
    setCurrentStep(0);
    setUserResponses([]);
    setShowScore(false);
    onTryAgain();
  };

  if (showScore) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Conversation Complete! 🎉
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You completed the conversation with a score of {recordingScore}%
        </p>
        
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  if (!conversationStarted) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Conversation Practice
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {prompt || 'Practice your conversation skills with this dialogue'}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Dialogue Preview
          </h3>
          <div className="space-y-3">
            {dialogue.slice(0, 3).map((line, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {line.speaker || `Person ${index % 2 === 0 ? 'A' : 'B'}`}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{line.italian}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{line.english}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartConversation}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <PlayCircle className="w-6 h-6" />
            Start Conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Conversation in Progress
          </h2>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Step {currentStep + 1} of {dialogue.length}
        </div>
      </div>

      <div className="space-y-6">
        {/* Previous Messages */}
        {dialogue.slice(0, currentStep + 1).map((message, index) => (
          <div key={index} className="space-y-3">
            {/* System/Other Person Message */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                  {message.speaker || `Person ${index % 2 === 0 ? 'A' : 'B'}`}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-lg text-gray-900 dark:text-white mb-1">
                    {message.italian}
                  </p>
                  {message.phonetic && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-mono">
                      {message.phonetic}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message.english}
                  </p>
                </div>
              </div>
            </div>

            {/* User Response (if given) */}
            {index < userResponses.length && (
              <div className="flex items-start gap-3 ml-8">
                <div className="flex-1 text-right">
                  <div className="font-medium text-green-600 dark:text-green-400 mb-1">
                    You
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-lg text-gray-900 dark:text-white">
                      {userResponses[index]}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current Step Action */}
        {currentStep < dialogue.length && userResponses.length === currentStep && (
          <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              It's your turn to respond
            </p>
            
            <button
              onClick={handleRecordResponse}
              disabled={isRecording}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-6 h-6" />
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  Record Your Response
                </>
              )}
            </button>
            
            {isRecording && (
              <div className="mt-4 animate-pulse text-red-600 dark:text-red-400">
                Speak now...
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleRestart}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Restart Conversation
          </button>
          
          {recordingScore !== null && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Score: {recordingScore}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPractice;










// import React from 'react';
// import { Volume2, MessageSquare, CheckCircle, Mic } from 'lucide-react';
// import { ConversationData } from './types';

// interface ConversationPracticeProps {
//   conversationData: ConversationData;
//   conversationStarted: boolean;
//   currentConversationStep: number;
//   userResponses: string[];
//   showConversationComplete: boolean;
//   isRecording: boolean;
//   onStart: () => void;
//   onRecordResponse: () => void;
//   onContinue: () => void;
//   onTryAgain: () => void;
// }

// const ConversationPractice: React.FC<ConversationPracticeProps> = ({
//   conversationData,
//   conversationStarted,
//   currentConversationStep,
//   userResponses,
//   showConversationComplete,
//   isRecording,
//   onStart,
//   onRecordResponse,
//   onContinue,
//   onTryAgain,
// }) => {
  
//   // --- Conversation Complete View ---
//   if (showConversationComplete) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//               <CheckCircle className="text-green-600" size={40} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Conversation Complete!</h2>
//           <p className="text-gray-600">Great job completing the restaurant scenario!</p>
//         </div>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onTryAgain}
//             className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
//           >
//             <span>🔄</span> Try Again
//           </button>
//           <button
//             onClick={onContinue}
//             className="px-6 py-3 cursor-pointer bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors"
//           >
//             Next Exercise
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --- Start Conversation View ---
//   if (!conversationStarted) {
//     return (
//       <div className=" rounded-lg    ">
//         <div className="p-8 rounded-2xl bg-white">
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
//                 <MessageSquare className="text-indigo-600" size={40} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">{conversationData.title}</h2>
//             <p className="text-gray-600 mb-4">{conversationData.description}</p>
//             <button className="px-4 py-2 cursor-pointer text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//               View Role Guidance
//             </button>
//           </div>
//         </div>
//           <div className="flex mt-6 justify-center">
//             <button
//               onClick={onStart}
//               className="flex items-center cursor-pointer gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//             >
//               <Volume2 size={20} />
//               Begin Conversation
//             </button>
//           </div>
//       </div>
//     );
//   }

//   // --- Active Conversation View ---
//   const isUserTurn = !isRecording && userResponses.length === currentConversationStep && currentConversationStep < conversationData.waiterMessages.length;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//       <div className="p-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
//               <MessageSquare className="text-indigo-600" size={32} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">{conversationData.title}</h2>
//         </div>

//         <div className="space-y-4 max-w-2xl mx-auto mb-8">
//           {/* Conversation History */}
//           {conversationData.waiterMessages.slice(0, currentConversationStep + 1).map((message, index) => (
//             <div key={index} className="space-y-4">
//               {/* Waiter Message */}
//               <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-left">
//                 <p className="text-gray-900 font-medium mb-2">{message.italian}</p>
//                 <button className="flex items-center cursor-pointer gap-2 text-sm text-blue-600 hover:text-blue-700">
//                   <Volume2 size={14} /> <span>Listen</span>
//                 </button>
//               </div>
              
//               {/* User Response (if recorded) */}
//               {userResponses[index] && (
//                 <div className="flex justify-end">
//                   <div className="bg-gray-900 text-white rounded-2xl rounded-tr-none p-4 max-w-md">
//                     <p>{userResponses[index]}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* User Action Area */}
//         {isUserTurn && (
//           <div className="flex justify-center">
//             <button
//               onClick={onRecordResponse}
//               className="flex items-center cursor-pointer gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//             >
//               <Mic size={20} />
//               Record Your Response
//             </button>
//           </div>
//         )}

//         {isRecording && (
//           <div className="flex flex-col items-center">
//             <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center animate-pulse mb-4">
//               <Mic className="text-white" size={32} />
//             </div>
//             <p className="text-gray-600 text-sm">Recording your response...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConversationPractice;