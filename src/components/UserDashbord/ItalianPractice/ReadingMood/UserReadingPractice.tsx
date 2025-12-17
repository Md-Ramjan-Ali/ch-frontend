import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReadingExerciseComplete from "./ReadingExerciseComplete";
import readingicon from "../../../../assets/Dashbord/darkreading.svg";
import { MdOutlineTranslate } from "react-icons/md";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import Header from "@/components/Header/Header";
import { 
  useLazyGetNextLessonQuery,
} from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
import { useGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";

// Types based on your API response
interface QuestionOption {
  answer: string;
  options: string[];
  question: string;
}

interface QuestionSetContent {
  passage: string;
  questions: QuestionOption[];
  prompt?: string;
}

interface QuestionSetData {
  content: {
    content: QuestionSetContent;
  };
  createdAt: string;
  id: number;
  lessonId: number;
  prompt: string;
  subCategoryType: string;
}

interface LessonApiResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    type: string;
    difficulty: string;
  };
}

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation?: string;
}

const UserReadingPractice: React.FC = () => {
  const navigate = useNavigate();
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Question & answer state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  // State for API data
  const [readingData, setReadingData] = useState<QuestionSetData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passage, setPassage] = useState<string>("");
  const [lessonId, setLessonId] = useState<number | null>(null);
  
  // API hooks
  const [getNextLesson, { isLoading: isLoadingNextLesson, error: nextLessonError }] = useLazyGetNextLessonQuery();
  
  // Fetch question set when lessonId is available
  const { 
    data: questionSetData, 
    isLoading: isLoadingQuestionSet, 
    error: questionSetError,
    refetch: refetchQuestionSet 
  } = useGetLessonQuestionSetQuery(
    { 
      lessonId: lessonId!,
      subCategoryType: "MAIN_PASSAGE" // Hardcoded for reading practice
    },
    {
      skip: !lessonId,
    }
  );

  // Save theme to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Initialize: Fetch next reading lesson on component mount
  useEffect(() => {
    const fetchReadingLesson = async () => {
      try {
        console.log("Fetching next reading lesson...");
        
        // Call API to get next reading lesson
        const result = await getNextLesson({ type: "READING" }).unwrap();
        
        if (result.success && result.data) {
          const lessonData = result.data as LessonApiResponse['data'];
          console.log("Lesson data received:", lessonData);
          
          // Set lesson ID for question set fetch
          setLessonId(lessonData.id);
          
          // Store lesson info in state if needed
          console.log(`Set lessonId to ${lessonData.id} for fetching question set`);
        } else {
          console.error("Failed to fetch lesson:", result);
        }
      } catch (error) {
        console.error("Error fetching reading lesson:", error);
      }
    };

    fetchReadingLesson();
  }, [getNextLesson]);

  // Process question set data when it's loaded
  useEffect(() => {
    if (questionSetData && questionSetData.success) {
      console.log("QuestionSet data received:", questionSetData);
      
      const apiData = questionSetData.data as QuestionSetData;
      
      // Check if this is a MAIN_PASSAGE subCategoryType
      if (apiData.subCategoryType !== "MAIN_PASSAGE") {
        console.warn(`Expected MAIN_PASSAGE but got: ${apiData.subCategoryType}`);
        return;
      }
      
      // Validate the nested data structure
      if (!apiData.content?.content?.passage || !apiData.content?.content?.questions) {
        console.error("Invalid data structure:", apiData);
        return;
      }
      
      setReadingData(apiData);
      setPassage(apiData.content.content.passage);
      
      // Transform API questions to our format
      const transformedQuestions: Question[] = apiData.content.content.questions.map((q, index) => {
        // Convert answer letter to option index (A=0, B=1, C=2, D=3)
        const answerIndex = q.answer.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
        const correctAnswerText = q.options[answerIndex] || q.answer;
        
        return {
          id: index + 1,
          question: q.question,
          answers: q.options,
          correctAnswer: correctAnswerText,
          explanation: `The correct answer is ${q.answer}: ${correctAnswerText.replace(/^[A-D]\.\s*/, '')}`
        };
      });
      
      setQuestions(transformedQuestions);
      console.log(`Loaded ${transformedQuestions.length} questions`);
    }
  }, [questionSetData]);

  // Get passage title from prompt or content
  const getPassageTitle = () => {
    if (!passage) return "Reading Passage";
    
    // Try to extract title from the passage (first line)
    const firstLineEnd = passage.indexOf('\n');
    if (firstLineEnd > 0) {
      const title = passage.substring(0, firstLineEnd).trim();
      // Remove common title markers
      return title.replace(/^["']|["']$/g, '').replace(/^#+\s*/, '').trim();
    }
    
    return readingData?.prompt?.split('\n')[0] || "Reading Practice";
  };

  // Check if we have valid data
  const hasValidData = passage && questions.length > 0;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Loading states
  const isLoading = isLoadingNextLesson || isLoadingQuestionSet;
  const hasError = nextLessonError || questionSetError;

  const handleNext = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const saved = updatedAnswers[questions[nextIndex].id];
      setSelectedAnswer(saved || null);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const saved = answers[questions[prevIndex].id];
      setSelectedAnswer(saved || null);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleRetry = async () => {
    // Reset states
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setIsComplete(false);
    
    try {
      // Fetch a new lesson
      const result = await getNextLesson({ type: "READING" }).unwrap();
      
      if (result.success && result.data) {
        const lessonData = result.data as LessonApiResponse['data'];
        setLessonId(lessonData.id);
        
        // Refetch question set with new lessonId
        await refetchQuestionSet();
      }
    } catch (error) {
      console.error("Error retrying lesson:", error);
    }
  };

  // Prepare results for completion screen
  const resultAnswers = questions.map((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    return {
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {isLoadingNextLesson ? "Loading reading lesson..." : "Loading questions..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
        <div className="mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/user/practice")}
            className={`flex border p-3 rounded-2xl items-center gap-2 mb-6 ${darkMode ? "border-gray-700 text-gray-200 hover:text-white" : "border-gray-300 text-gray-700 hover:text-gray-900"}`}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold">Back To Practice</span>
          </button>
          
          <div className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Content</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {nextLessonError ? "Failed to load reading lesson" : "Failed to load questions"}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/user/practice")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Return to Practice
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No valid data state
  if (!hasValidData) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
        <div className="mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/user/practice")}
            className={`flex border p-3 rounded-2xl items-center gap-2 mb-6 ${darkMode ? "border-gray-700 text-gray-200 hover:text-white" : "border-gray-300 text-gray-700 hover:text-gray-900"}`}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold">Back To Practice</span>
          </button>
          
          <div className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-yellow-500 text-5xl mb-4">📚</div>
            <h2 className="text-xl font-semibold mb-2">No Reading Content Available</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No reading practice content is currently available.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/user/practice")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Return to Practice
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Content
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/user/practice")}
            className={`flex border p-3 rounded-2xl items-center gap-2 ${darkMode ? "border-gray-700 text-gray-200 hover:text-white" : "border-gray-300 text-gray-700 hover:text-gray-900"}`}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold">Back To Practice</span>
          </button>
        </div>

        <Header
          title="Reading Practice"
          subtitle="Improve your Italian reading comprehension"
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Reading Passage */}
          <div className={`flex-1 flex flex-col gap-4 rounded-lg shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg">
                  <img className="w-8 h-8" src={readingicon} alt="Reading icon" />
                </div>
                <h2 className="text-xl font-semibold dark:text-amber-50">
                  {getPassageTitle()}
                </h2>
              </div>
              <button className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${darkMode ? "border-gray-700 hover:bg-gray-700 text-gray-200" : "border-gray-300 hover:bg-gray-50 text-gray-900"}`}>
                <MdOutlineTranslate className="w-4 h-4" />
                <span className="text-sm">Show Translation</span>
              </button>
            </div>

            <div className="space-y-4 leading-relaxed text-gray-700 dark:text-[#ffff]">
              {passage.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="dark:text-[#ffff]">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Lesson Information */}
            {readingData && (
              <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Prompt:</strong> {readingData.prompt}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      SubCategory: {readingData.subCategoryType} • Lesson ID: {readingData.lessonId}
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    New Lesson
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Questions */}
          <div className={`flex-1 rounded-lg shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {isComplete ? (
              <ReadingExerciseComplete 
                answers={resultAnswers}
                passage={passage}
                onRetry={handleRetry}
                onContinue={() => navigate("/user/practice")}
              />
            ) : (
              <>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                  </div>
                  <ProgressBar
                    progress={progressPercentage}
                    color={darkMode ? "bg-blue-400" : "bg-black"}
                    height="h-3"
                    rounded="rounded-full"
                    className="mb-2"
                  />
                </div>

                {/* Question */}
                {currentQuestion && (
                  <>
                    <div className="mb-8">
                      <h3 className={`text-lg py-6 px-4 font-semibold rounded-xl mb-6 ${darkMode ? "bg-gray-700 text-white" : "bg-[#EBEBEB] text-gray-900"}`}>
                        {currentQuestion.question}
                      </h3>

                      <div className="space-y-5">
                        {currentQuestion.answers.map((answer, index) => {
                          const optionLetter = String.fromCharCode(65 + index);
                          const isSelected = selectedAnswer === answer;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(answer)}
                              className={`w-full text-left p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50 text-gray-900 dark:border-blue-500 dark:bg-blue-900/20 dark:text-white"
                                  : darkMode
                                    ? "border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-200"
                                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">
                                  {optionLetter}.
                                </span>
                                <span>{answer}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1 px-6 py-3 border rounded-lg font-medium cursor-pointer text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={!selectedAnswer}
                        className={`flex-1 px-6 py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
                          selectedAnswer
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {currentQuestionIndex === totalQuestions - 1
                          ? "Finish"
                          : "Next"}
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReadingPractice;



// import React, { useState, useEffect } from "react";
// import { ChevronLeft } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ReadingExerciseComplete from "./ReadingExerciseComplete";
// import readingicon from "../../../../assets/Dashbord/darkreading.svg";
// import { MdOutlineTranslate } from "react-icons/md";
// import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
// import Header from "@/components/Header/Header";

// interface Question {
//   id: number;
//   question: string;
//   answers: string[];
//   correctAnswer: string;
// }

// const UserReadingPractice: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Theme state
//   const [darkMode, setDarkMode] = useState<boolean>(() => {
//     return localStorage.getItem("theme") === "dark";
//   });

//   // Question & answer state
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [isComplete, setIsComplete] = useState<boolean>(false);

//   // Save theme to localStorage
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   const questions: Question[] = [
//     {
//       id: 1,
//       question: "Quando è stata fondata l'Università di Bologna?",
//       answers: ["1088", "1100", "1200", "1300"],
//       correctAnswer: "1088",
//     },
//     {
//       id: 2,
//       question: "Quanti livelli ha il percorso di studi universitario in Italia?",
//       answers: ["Due livelli", "Tre livelli", "Quattro livelli", "Cinque livelli"],
//       correctAnswer: "Tre livelli",
//     },
//     {
//       id: 3,
//       question: "Dove si riuniscono spesso gli studenti per socializzare?",
//       answers: ["In biblioteca", "Nelle piazze e nei caffè", "Nelle aule", "Nei dormitori"],
//       correctAnswer: "Nelle piazze e nei caffè",
//     },
//     {
//       id: 4,
//       question: "Qual è il voto massimo nel sistema di valutazione italiano?",
//       answers: ["25", "28", "30", "32"],
//       correctAnswer: "30",
//     },
//   ];

//   const totalQuestions = questions.length;
//   const currentQuestion = questions[currentQuestionIndex];
//   const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

//   const handleNext = () => {
//     if (!selectedAnswer) return;

//     const updatedAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
//     setAnswers(updatedAnswers);

//     if (currentQuestionIndex < totalQuestions - 1) {
//       const nextIndex = currentQuestionIndex + 1;
//       setCurrentQuestionIndex(nextIndex);
//       const saved = updatedAnswers[questions[nextIndex].id];
//       setSelectedAnswer(saved || null);
//     } else {
//       setIsComplete(true);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       const prevIndex = currentQuestionIndex - 1;
//       setCurrentQuestionIndex(prevIndex);
//       const saved = answers[questions[prevIndex].id];
//       setSelectedAnswer(saved || null);
//     }
//   };

//   const resultAnswers = questions.map((q) => {
//     const userAnswer = answers[q.id];
//     const isCorrect = userAnswer === q.correctAnswer;
//     return {
//       question: q.question,
//       userAnswer,
//       correctAnswer: q.correctAnswer,
//       isCorrect,
//     };
//   });

//   return (
//     <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
//       {/* Header */}
//       <div className="mx-auto px-6 py-4">
//         <div className="flex justify-between items-center mb-4">
//           <button
//             onClick={() => navigate("/user/practice")}
//             className={`flex border p-3 rounded-2xl items-center gap-2 ${darkMode ? "border-gray-700 text-gray-200 hover:text-white" : "border-gray-300 text-gray-700 hover:text-gray-900"}`}
//           >
//             <ChevronLeft className="w-6 h-6" />
//             <span className="text-base font-semibold">Back To Practice</span>
//           </button>

//           {/* Theme Toggle */}
           
//         </div>

//         <Header
//           title="Reading Practice"
//           subtitle="Improve your Italian reading comprehension"
//         />
//       </div>

//       {/* Main Content */}
//       <div className="mx-auto px-6 py-8">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Reading Passage */}
//           <div className={`flex-1 flex flex-col gap-4 rounded-lg shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="rounded-lg">
//                   <img className="w-8 h-8" src={readingicon} alt="" />
//                 </div>
//                 <h2 className="text-xl font-semibold dark:text-amber-50">
//                   La Vita Universitaria in Italia
//                 </h2>
//               </div>
//               <button className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${darkMode ? "border-gray-700 hover:bg-gray-700 text-gray-200" : "border-gray-300 hover:bg-gray-50 text-gray-900"}`}>
//                 <MdOutlineTranslate className="w-4 h-4" />
//                 <span className="text-sm">Show Translation</span>
//               </button>
//             </div>

//             <div className="space-y-4 leading-relaxed text-gray-700 dark:text-[#ffff]">
//               <p className="dark:text-[#ffff]">
//                 L'università italiana ha una lunga tradizione che risale al
//                 Medioevo. Molte università italiane, come l'Università di
//                 Bologna fondata nel 1088, sono tra le più antiche del mondo.
//               </p>
//              <p className="dark:text-[#ffff]">
//                 Gli studenti universitari in Italia seguono un percorso di studi
//                 strutturato in tre livelli: la laurea triennale (tre anni), la
//                 laurea magistrale (due anni) e il dottorato di ricerca.
//               </p>
//             <p className="dark:text-[#ffff]">
//                 La vita sociale degli studenti è molto importante. Molti
//                 partecipano alle attività delle associazioni studentesche, che
//                 organizzano eventi culturali e ricreativi. È comune vedere
//                 gruppi di studenti nelle piazze o nei caffè vicino
//                 all'università.
//               </p>
//               <p className="dark:text-[#ffff]">
//                 Il sistema di valutazione italiano è basato su un punteggio da
//                 18 a 30, dove 18 è il voto minimo per superare un esame e 30 è
//                 il massimo. Gli studenti che ottengono 30 possono anche ricevere
//                 la "lode".
//               </p>
//             </div>

//           </div>

//           {/* Right Side */}
//           <div className={`flex-1 rounded-lg shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//             {isComplete ? (
//               <ReadingExerciseComplete answers={resultAnswers} />
//             ) : (
//               <>
//                 {/* Progress */}
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-500">
//                       Question {currentQuestionIndex + 1} of {totalQuestions}
//                     </span>
//                   </div>
//                   <ProgressBar
//                     progress={progressPercentage}
//                     color={darkMode ? "bg-blue-400" : "bg-black"}
//                     height="h-3"
//                     rounded="rounded-full"
//                     className="mb-2"
//                   />
//                 </div>

//                 {/* Question */}
//                 <div className="mb-8">
//                   <h3 className={`text-lg py-6 px-4 font-semibold rounded-xl mb-6 ${darkMode ? "bg-gray-700 text-white" : "bg-[#EBEBEB] text-gray-900"}`}>
//                     {currentQuestion.question}
//                   </h3>

//                   <div className="space-y-5">
//                     {currentQuestion.answers.map((answer, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedAnswer(answer)}
//                         className={`w-full text-left p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${selectedAnswer === answer
//                             ? "border-blue-600 bg-blue-50 text-gray-900"
//                             : darkMode
//                               ? "border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-200"
//                               : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
//                           }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <span className="font-semibold">
//                             {String.fromCharCode(65 + index)}.
//                           </span>
//                           <span>{answer}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Navigation */}
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handlePrevious}
//                     disabled={currentQuestionIndex === 0}
//                     className="flex-1 px-6 py-3 border rounded-lg font-medium cursor-pointer text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </button>

//                   <button
//                     onClick={handleNext}
//                     disabled={!selectedAnswer}
//                     className={`flex-1 px-6 py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${selectedAnswer
//                         ? "bg-blue-600 text-white hover:bg-blue-700"
//                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       }`}
//                   >
//                     {currentQuestionIndex === totalQuestions - 1
//                       ? "Finish"
//                       : "Next"}
//                     <ChevronLeft className="w-4 h-4 rotate-180" />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserReadingPractice;