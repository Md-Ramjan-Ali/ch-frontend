
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ExerciseType,
  SubCategoryType,
  QuestionSetData,
  PronunciationApiResponse,
  ConversationApiResponse,
  ReadingAloudApiResponse
} from './types';
import PronunciationPractice from './PronunciationPractice';
import ConversationPractice from './ConversationPractice';
import ReadingPractice from './ReadingPractice';
import CompletionPage from './CompletionPage';
import ExerciseHeader from './ExerciseHeader';

interface LocationState {
  lessonId?: string;
  lessonType?: string;
  questionSet?: any;
  subCategoryType?: SubCategoryType;
}

const SpeakingPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // --- API Data State ---
  const [apiData, setApiData] = useState<QuestionSetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Exercise State ---
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>('pronunciation');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingScore, setRecordingScore] = useState<number | null>(null);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  // --- Initialize from API Data ---
  useEffect(() => {
    const initializeFromApi = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get data from location state
        const questionSet = locationState?.questionSet;
        
        if (!questionSet || !questionSet.success) {
          throw new Error('No valid question set data received');
        }

        const data = questionSet.data;
        console.log('Speaking Practice API Data:', data);

        if (!data.subCategoryType || !data.content) {
          throw new Error('Invalid API response structure');
        }

        // Validate and set API data
        setApiData(data);

        // Set initial exercise based on subCategoryType
        switch (data.subCategoryType) {
          case 'PRONUNCIATION_PRACTICE':
            setCurrentExercise('pronunciation');
            break;
          case 'CONVERSATION_PRACTICE':
            setCurrentExercise('conversation');
            break;
          case 'READING_ALOUD':
            setCurrentExercise('reading');
            break;
          default:
            throw new Error(`Unknown exercise type: ${data.subCategoryType}`);
        }

      } catch (err: any) {
        console.error('Error initializing speaking practice:', err);
        setError(err.message || 'Failed to load speaking practice');
      } finally {
        setIsLoading(false);
      }
    };

    initializeFromApi();
  }, [locationState]);

  // --- Recording Simulation ---
  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingScore(null);
      
      // Simulate recording process (2 seconds)
      setTimeout(() => {
        setIsRecording(false);
        // Generate realistic score based on exercise type
        let score = 0;
        switch (currentExercise) {
          case 'pronunciation':
            score = Math.floor(Math.random() * 21) + 75; // 75-95%
            break;
          case 'conversation':
            score = Math.floor(Math.random() * 26) + 70; // 70-95%
            break;
          case 'reading':
            score = Math.floor(Math.random() * 31) + 65; // 65-95%
            break;
        }
        setRecordingScore(score);
      }, 2000);
    }
  };

  // --- Navigation ---
  const handleContinue = () => {
    if (currentExercise === 'pronunciation' && apiData?.subCategoryType === 'PRONUNCIATION_PRACTICE') {
      setExerciseCompleted(true);
    } else if (currentExercise === 'conversation' && apiData?.subCategoryType === 'CONVERSATION_PRACTICE') {
      setExerciseCompleted(true);
    } else if (currentExercise === 'reading' && apiData?.subCategoryType === 'READING_ALOUD') {
      setExerciseCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setRecordingScore(null);
    setIsRecording(false);
    setExerciseCompleted(false);
  };

  const handlePracticeAgain = () => {
    // Reset and go back to practice selection
    navigate('/user/practice');
  };

  const handleBackToPractice = () => {
    navigate('/user/practice');
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading speaking practice...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !apiData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="mx-auto px-4 py-4">
            <button 
              onClick={handleBackToPractice}
              className="flex cursor-pointer items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back To Practice</span>
            </button>
          </div>
        </div>
        
        <div className="mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-300">
                Unable to Load Speaking Practice
              </h2>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'No speaking practice data available.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleBackToPractice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Practice
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Based on SubCategoryType ---
  const renderExercise = () => {
    if (exerciseCompleted) {
      return (
        <CompletionPage
          score={recordingScore || 0}
          onPracticeAgain={handlePracticeAgain}
          onBackToPractice={handleBackToPractice}
        />
      );
    }

    switch (apiData.subCategoryType) {
      case 'PRONUNCIATION_PRACTICE':
        const pronunciationData = apiData.content as PronunciationApiResponse;
        return (
          <PronunciationPractice
            phrase={pronunciationData}
            isRecording={isRecording}
            recordingScore={recordingScore}
            onMicClick={handleMicClick}
            onContinue={handleContinue}
            onTryAgain={handleTryAgain}
            isLastPhrase={true}
          />
        );

      case 'CONVERSATION_PRACTICE':
        const conversationData = apiData.content as ConversationApiResponse;
        return (
          <ConversationPractice
            dialogue={conversationData.dialogue}
            prompt={apiData.prompt}
            isRecording={isRecording}
            recordingScore={recordingScore}
            onMicClick={handleMicClick}
            onContinue={handleContinue}
            onTryAgain={handleTryAgain}
          />
        );

      case 'READING_ALOUD':
        const readingData = apiData.content as ReadingAloudApiResponse;
        return (
          <ReadingPractice
            title={readingData.title}
            italianText={readingData.italian_text}
            englishTranslation={readingData.english_translation}
            prompt={apiData.prompt}
            isRecording={isRecording}
            recordingScore={recordingScore}
            onMicClick={handleMicClick}
            onContinue={handleContinue}
            onTryAgain={handleTryAgain}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Unsupported exercise type: {apiData.subCategoryType}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToPractice}
              className="flex cursor-pointer items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back To Practice</span>
            </button>
            
            {/* Exercise Type Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
                {apiData.subCategoryType.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Lesson #{apiData.lessonId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Speaking Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {apiData.prompt || 'Improve your Italian speaking skills'}
          </p>
        </div>

        {/* Exercise Header */}
        {!exerciseCompleted && (
          <ExerciseHeader 
            currentExercise={currentExercise}
            subCategoryType={apiData.subCategoryType}
          />
        )}

        {/* Exercise Content */}
        {renderExercise()}
      </div>
    </div>
  );
};

export default SpeakingPractice;










// import React, { useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// // Assuming these types and components are defined in separate files as per the refactoring
// import { ExerciseType, Phrase, ConversationData } from './types';
// import PronunciationPractice from './PronunciationPractice';
// import ConversationPractice from './ConversationPractice';
// import ReadingPractice from './ReadingPractice';
// import CompletionPage from './CompletionPage';
// import ExerciseHeader from './ExerciseHeader';

// const pronunciationPhrases: Phrase[] = [
//   {
//     italian: "Buongiorno, Come Sta?",
//     english: "Good morning, how are you?",
//     phonetic: "[bwon-JOR-no, KO-meh STAH]"
//   },
//   {
//     italian: "Mi Chiamo Marco E Vengo Dall'Italia.",
//     english: "My name is Marco and I come from Italy.",
//     phonetic: "[mee kee-AH-moh MAR-koh eh VEN-goh dahl ee-TAH-lee-ah]"
//   },
//   {
//     // Index 2: The phrase shown in the image
//     italian: "Dove Posso Trovare Una Farmacia?",
//     english: "Where can I find a pharmacy?",
//     phonetic: "[DOH-veh POS-soh troh-VAH-reh OO-nah far-mah-CHEE-ah]"
//   },
//   {
//     // Index 3: A duplicate, kept for array length consistency
//     italian: "Un caffè e un cornetto, per favore.", 
//     english: "A coffee and a croissant, please.",
//     phonetic: "[oon kahf-FEH eh oon kor-NET-toh, pehr fah-VOH-reh]"
//   }
// ];

// const conversationData: ConversationData = {
//   title: "Ordering At A Restaurant",
//   description: "You are at an Italian restaurant. The waiter will greet you and take your order.",
//   waiterMessages: [
//     { italian: "Buongiorno! Benvenuto al nostro ristorante. Ha una prenotazione?", english: "Good morning! Welcome to our restaurant. Do you have a reservation?" },
//     { italian: "Perfetto, Ecco il menu. Desidera qualcosa da bere?", english: "Perfect, here is the menu. Would you like something to drink?" },
//     { italian: "Ottima scelta! E per il primo piatto?", english: "Great choice! And for the first course?" },
//     { italian: "Grazie! E un ordine arriverà tra 15 minuti.", english: "Thank you! Your order will arrive in 15 minutes." }
//   ],
//   userResponses: [
//     "No, non ho una prenotazione. C'è un tavolo libero?",
//     "Vorrei una birra, per favore.",
//     "Prendo gli spaghetti carbonara.",
//     "Perfetto, grazie mille!"
//   ]
// };

// const SpeakingPractice: React.FC = () => {
//   // --- STATE MODIFIED TO RENDER IMAGE VIEW ---
//   const [currentExercise, setCurrentExercise] = useState<ExerciseType>('pronunciation');
//   const [currentPhraseIndex, setCurrentPhraseIndex] = useState(2); // Start at the 3rd phrase (index 2)
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingScore, setRecordingScore] = useState<number | null>(94); // Start with a 94% score
//   // ------------------------------------------
    
//   const [conversationStarted, setConversationStarted] = useState(false);
//   const [currentConversationStep, setCurrentConversationStep] = useState(0);
//   const [userResponses, setUserResponses] = useState<string[]>([]);
//   const [showConversationComplete, setShowConversationComplete] = useState(false);

//   const handleMicClick = () => {
//     // Start Recording Simulation
//     if (!isRecording) {
//       setIsRecording(true);
//       // Reset score when recording starts
//       setRecordingScore(null); 
//       // Stop Recording Simulation and Score after 2s
//       setTimeout(() => {
//         setIsRecording(false);
//         // Set the score to 94% again (or a random one) for demonstration
//         setRecordingScore(94); 
//       }, 2000);
//     }
//   };

//   const handleStartConversation = () => {
//     setConversationStarted(true);
//     setCurrentConversationStep(0);
//     setUserResponses([]);
//     setShowConversationComplete(false);
//   };

//   const handleRecordConversationResponse = () => {
//     setIsRecording(true);
//     setTimeout(() => {
//       setIsRecording(false);
//       // Simulate user response and advance conversation
//       const newUserResponses = [...userResponses, conversationData.userResponses[currentConversationStep]];
//       setUserResponses(newUserResponses);
      
//       if (currentConversationStep < conversationData.waiterMessages.length - 1) {
//         setTimeout(() => {
//           setCurrentConversationStep(currentConversationStep + 1);
//         }, 500);
//       } else {
//         setTimeout(() => {
//           setShowConversationComplete(true);
//         }, 500);
//       }
//     }, 2000);
//   };

//   const handleContinue = () => {
//     if (currentExercise === 'pronunciation') {
//       if (currentPhraseIndex < pronunciationPhrases.length - 1) {
//         setCurrentPhraseIndex(currentPhraseIndex + 1);
//         setRecordingScore(null);
//       } else {
//         setCurrentExercise('conversation');
//         setCurrentPhraseIndex(0); // Reset for next exercise type
//         setRecordingScore(null);
//       }
//     } else if (currentExercise === 'conversation') {
//       setCurrentExercise('reading');
//     } else if (currentExercise === 'reading') {
//       setCurrentExercise('complete');
//     }
//     // Reset recording state
//     setIsRecording(false);
//     setRecordingScore(null);
//   };

//   const handleTryAgain = () => {
//     setRecordingScore(null);
//     setIsRecording(false);
//   };

//   const resetAllExercises = () => {
//     setCurrentExercise('pronunciation');
//     setCurrentPhraseIndex(0);
//     setRecordingScore(null);
//     setConversationStarted(false);
//     setCurrentConversationStep(0);
//     setUserResponses([]);
//     setShowConversationComplete(false);
//     setIsRecording(false);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
//       <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//         <div className="mx-auto px-4 py-4">
//           <button className="flex cursor-pointer items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
//             <ArrowLeft size={20} />
//             <span className="text-sm font-medium">Back To Practice</span>
//           </button>
//         </div>
//       </div>

//       <div className="mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Speaking Practice
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Improve your Italian pronunciation and conversation skills
//           </p>
//         </div>

//         {currentExercise !== 'complete' && (
//           <ExerciseHeader 
//             currentExercise={currentExercise} 
//             currentPhraseIndex={currentPhraseIndex} 
//           />
//         )}

//         {currentExercise === 'pronunciation' && (
//           <PronunciationPractice
//             phrase={pronunciationPhrases[currentPhraseIndex]}
//             isRecording={isRecording}
//             recordingScore={recordingScore}
//             onMicClick={handleMicClick}
//             onContinue={handleContinue}
//             onTryAgain={handleTryAgain}
//           />
//         )}
        
//         {currentExercise === 'conversation' && (
//           <ConversationPractice
//             conversationData={conversationData}
//             conversationStarted={conversationStarted}
//             currentConversationStep={currentConversationStep}
//             userResponses={userResponses}
//             showConversationComplete={showConversationComplete}
//             isRecording={isRecording}
//             onStart={handleStartConversation}
//             onRecordResponse={handleRecordConversationResponse}
//             onContinue={handleContinue}
//             onTryAgain={handleStartConversation} // Start over simulation
//           />
//         )}

//         {currentExercise === 'reading' && (
//           <ReadingPractice
//             isRecording={isRecording}
//             onMicClick={handleMicClick} // Reusing the same recording logic for reading
//             onContinue={handleContinue}
//             onTryAgain={handleTryAgain}
//           />
//         )}

//         {currentExercise === 'complete' && (
//           <CompletionPage
//             onPracticeAgain={resetAllExercises}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpeakingPractice;