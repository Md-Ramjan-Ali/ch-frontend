
import React, { useState, useEffect } from "react";
import { ClockIcon, TargetIcon } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import tatgeticon from "../../../assets/Dashbord/tergeticon.svg";
import readingicon from "../../../assets/Dashbord/reading.svg";
import lesteningicon from "../../../assets/Dashbord/listening.svg";
import writingicon from "../../../assets/Dashbord/writing.svg";
import speakingicon from "../../../assets/Dashbord/speaking.svg";
import lockicon from "../../../assets/Dashbord/lock.svg";
import { GiBookmarklet } from "react-icons/gi";

import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import UnlockProCard from "@/components/FreeUserDashbord/Overview/UnlockProCard";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
import { 
  useLazyGetNextLessonQuery,
    
} from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
import { useGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";

// Enum for lesson types to match backend
enum LessonType {
  READING = "READING",
  WRITING = "WRITING",
  LISTENING = "LISTENING",
  SPEAKING = "SPEAKING"
}

// SubCategoryType enum as per your API
enum SubCategoryType {
  // Reading
  MAIN_PASSAGE = "MAIN_PASSAGE",
  
  // Listening
  DIALOGUE_SEQUENCING = "DIALOGUE_SEQUENCING",
  DICTATION_EXERCISE = "DICTATION_EXERCISE",
  AUDIO_COMPREHENSION = "AUDIO_COMPREHENSION",
  
  // Writing
  GRAMMAR_PRACTICE = "GRAMMAR_PRACTICE",
  COMPLETE_THE_SENTENCES = "COMPLETE_THE_SENTENCES",
  SHORT_ESSAY = "SHORT_ESSAY",
  
  // Speaking
  READING_ALOUD = "READING_ALOUD",
  CONVERSATION_PRACTICE = "CONVERSATION_PRACTICE",
  PRONUNCIATION_PRACTICE = "PRONUNCIATION_PRACTICE"
}

// Interface for API response
interface LessonApiResponse {
  success: boolean;
  data: {
    id: string;
    type: LessonType;
    title: string;
    description?: string;
    difficulty?: string;
    subCategoryType?: string;
  };
}

// Service to handle lesson data processing
const PracticeDataService = {
  // Map lesson type to appropriate subCategoryTypes
  getSubCategoryTypesForLessonType: (lessonType: LessonType): string[] => {
    switch (lessonType) {
      case LessonType.READING:
        return [
          SubCategoryType.MAIN_PASSAGE
        ];
      case LessonType.LISTENING:
        return [
          SubCategoryType.AUDIO_COMPREHENSION,
          SubCategoryType.DIALOGUE_SEQUENCING,
          SubCategoryType.DICTATION_EXERCISE
        ];
      case LessonType.WRITING:
        return [
          SubCategoryType.SHORT_ESSAY,
          SubCategoryType.COMPLETE_THE_SENTENCES,
          SubCategoryType.GRAMMAR_PRACTICE
        ];
      case LessonType.SPEAKING:
        return [
          SubCategoryType.READING_ALOUD,
          SubCategoryType.CONVERSATION_PRACTICE,
          SubCategoryType.PRONUNCIATION_PRACTICE
        ];
      default:
        return [SubCategoryType.MAIN_PASSAGE];
    }
  },

  // Get default subCategoryType for a lesson type
  getDefaultSubCategoryType: (lessonType: LessonType): string => {
    switch (lessonType) {
      case LessonType.READING:
        return SubCategoryType.MAIN_PASSAGE;
      case LessonType.LISTENING:
        return SubCategoryType.AUDIO_COMPREHENSION;
      case LessonType.WRITING:
        return SubCategoryType.SHORT_ESSAY;
      case LessonType.SPEAKING:
        return SubCategoryType.READING_ALOUD;
      default:
        return SubCategoryType.MAIN_PASSAGE;
    }
  },

  processApiLessonResponse: (apiResponse: LessonApiResponse) => {
    const lesson = apiResponse.data;
    
    // Get appropriate subCategoryType based on lesson type
    let subCategoryType = lesson.subCategoryType;
    if (!subCategoryType) {
      subCategoryType = PracticeDataService.getDefaultSubCategoryType(lesson.type);
    }

    return {
      id: lesson.id,
      lessonId: lesson.id, // For backward compatibility
      type: lesson.type,
      title: lesson.title,
      description: lesson.description || `Practice your ${lesson.type.toLowerCase()} skills`,
      difficulty: lesson.difficulty || "Beginner",
      subCategoryType: subCategoryType
    };
  },

  getNextLesson: (type: LessonType) => {
    // Fallback local lesson data if API fails
    const lessons = {
      [LessonType.READING]: {
        id: "reading-001",
        lessonId: "reading-001",
        type: LessonType.READING,
        title: "Basic Italian Reading",
        description: "Practice reading comprehension with simple texts",
        difficulty: "Beginner",
        subCategoryType: SubCategoryType.MAIN_PASSAGE
      },
      [LessonType.LISTENING]: {
        id: "listening-001",
        lessonId: "listening-001",
        type: LessonType.LISTENING,
        title: "Italian Conversations",
        description: "Practice listening to Italian conversations",
        difficulty: "Beginner",
        subCategoryType: SubCategoryType.AUDIO_COMPREHENSION
      },
      [LessonType.WRITING]: {
        id: "writing-001",
        lessonId: "writing-001",
        type: LessonType.WRITING,
        title: "Writing Practice",
        description: "Practice writing Italian sentences",
        difficulty: "Beginner",
        subCategoryType: SubCategoryType.SHORT_ESSAY
      },
      [LessonType.SPEAKING]: {
        id: "speaking-001",
        lessonId: "speaking-001",
        type: LessonType.SPEAKING,
        title: "Speaking Practice",
        description: "Practice Italian pronunciation",
        difficulty: "Beginner",
        subCategoryType: SubCategoryType.READING_ALOUD
      }
    };

    return lessons[type];
  }
};

// StatCard Component
const StatCard: React.FC<any> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl shadow-md flex flex-col justify-between dark:text-gray-100 h-full">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs xs:text-sm sm:text-base text-[#A7A7A7] dark:text-gray-300 font-medium">{title}</p>
        <span className="text-indigo-500 text-lg sm:text-xl lg:text-2xl">{icon}</span>
      </div>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
};

// Daily Goal Progress Component
const DailyGoalProgress: React.FC<any> = ({ currentMinutes, totalMinutes, timeLeft }) => {
  const percentage = Math.round((currentMinutes / totalMinutes) * 100);
  return (
    <div className="bg-[#0E9F6E1A] p-4 sm:p-5 lg:p-6 rounded-xl border border-[#0E9F6E33] shadow-sm mb-4 sm:mb-6 lg:mb-8 dark:bg-[#0E9F6E1A] dark:border-[#0E9F6E33]">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-3 xs:gap-4 mb-3 sm:mb-4">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <img className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" src={tatgeticon} alt="Target" />
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#111827] dark:text-gray-200 truncate">
              Daily Goal Progress
            </p>
            <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-50 truncate">
              {currentMinutes} of {totalMinutes} minutes completed
            </p>
          </div>
        </div>
        <div className="text-left xs:text-right">
          <p className="text-base sm:text-lg lg:text-xl font-bold from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent leading-none">
            {percentage}%
          </p>
          <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-300">{timeLeft}</p>
        </div>
      </div>
      <ProgressBar progress={percentage} color="bg-black" showPercentage={false} className="mt-3 sm:mt-4" />
    </div>
  );
};

// Main UserItalianPractice Component
const UserItalianPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useGetMeQuery({});
  const role = data?.data?.role;
  const { data: subscriptionData } = useGetMySubscriptionQuery();
  const prodata = subscriptionData?.data.isPro;
  const hasUsedTrial = subscriptionData?.data.hasUsedTrial;
  
  const [getNextLesson, { isLoading: isLoadingNextLesson }] = useLazyGetNextLessonQuery();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType | null>(null);
  const [selectedSubCategoryType, setSelectedSubCategoryType] = useState<string>("");
  
  // Fetch question set when a lesson is selected
  const { data: questionSetData, isLoading: isLoadingQuestionSet, error: questionSetError } = useGetLessonQuestionSetQuery(
    { 
      lessonId: selectedLessonId!,
      subCategoryType: selectedSubCategoryType
    },
    {
      skip: !selectedLessonId || !selectedSubCategoryType,
    }
  );

  // Function to handle when question set fetch fails
  const handleQuestionSetFetchError = (lessonId: string, lessonType: LessonType, subCategoryType: string) => {
    console.warn(`QuestionSet for Lesson ID ${lessonId} and type ${subCategoryType} not found. Trying fallback...`);
    
    // Get all possible subCategoryTypes for this lesson type
    const possibleSubCategories = PracticeDataService.getSubCategoryTypesForLessonType(lessonType);
    
    // Remove the failed subCategoryType from the list
    const remainingSubCategories = possibleSubCategories.filter(type => type !== subCategoryType);
    
    if (remainingSubCategories.length > 0) {
      // Try the next subCategoryType
      const nextSubCategory = remainingSubCategories[0];
      setSelectedSubCategoryType(nextSubCategory);
      console.log(`Retrying with subCategoryType: ${nextSubCategory}`);
    } else {
      console.error(`No valid subCategoryTypes found for lesson type: ${lessonType}`);
      alert("No practice content available for this lesson type. Please try another skill.");
    }
  };

  const handlePracticeStart = async (skillTitle: string) => {
    // Map skill title to LessonType enum
    let mappedLessonType: LessonType;
    switch (skillTitle) {
      case "Reading":
        mappedLessonType = LessonType.READING;
        break;
      case "Listening":
        mappedLessonType = LessonType.LISTENING;
        break;
      case "Writing":
        mappedLessonType = LessonType.WRITING;
        break;
      case "Speaking":
        mappedLessonType = LessonType.SPEAKING;
        break;
      default:
        mappedLessonType = LessonType.READING;
    }

    // Check if user can access this lesson type
    if (role === "USER" && !hasUsedTrial && mappedLessonType !== LessonType.READING) {
      alert("Please upgrade to premium to access this feature or use your free trial first.");
      return;
    }

    try {
      // Fetch next lesson from API
      const result = await getNextLesson({ type: mappedLessonType }).unwrap();
      console.log(result.data)
      if (result.success && result.data) {
        const lessonData = result.data;
        const lessonId = lessonData.id;
        
        // Process API response to get proper subCategoryType
        const processedLesson = PracticeDataService.processApiLessonResponse(result);
        const defaultSubCategoryType = processedLesson.subCategoryType;
        
        // Set states to trigger question set fetch
        setSelectedLessonId(lessonId);
        setSelectedLessonType(mappedLessonType);
        setSelectedSubCategoryType(defaultSubCategoryType);
        
        // Store lesson data for potential navigation
        const lessonInfo = {
          id: lessonId,
          type: mappedLessonType,
          title: lessonData.title,
          description: lessonData.description || `Practice your ${mappedLessonType.toLowerCase()} skills`,
          difficulty: lessonData.difficulty || "Beginner",
          subCategoryType: defaultSubCategoryType
        };
        console.log(lessonInfo)
        // We'll wait for question set to load or handle errors
        console.log(`Fetching question set for lesson ${lessonId} with subCategoryType: ${defaultSubCategoryType}`);
        
      } else {
        // If no lesson from API, check locally
        const nextLesson = PracticeDataService.getNextLesson(mappedLessonType);
        console.log(nextLesson,"Nwxtlession")
        if (nextLesson) {
          const lessonId = nextLesson.id;
          const subCategoryType = nextLesson.subCategoryType;
          
          setSelectedLessonId(lessonId);
          setSelectedLessonType(mappedLessonType);
          setSelectedSubCategoryType(subCategoryType);
          
          console.log(`Using local lesson data for ${mappedLessonType}`);
        } else {
          alert(`No ${skillTitle.toLowerCase()} lessons available. Please try again later.`);
        }
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      
      // Fallback to local data
      const nextLesson = PracticeDataService.getNextLesson(mappedLessonType);
      
      if (nextLesson) {
        const lessonId = nextLesson.id;
        const subCategoryType = nextLesson.subCategoryType;
        
        setSelectedLessonId(lessonId);
        setSelectedLessonType(mappedLessonType);
        setSelectedSubCategoryType(subCategoryType);
        
        console.log(`Using fallback local lesson data for ${mappedLessonType}`);
      } else {
        alert("Failed to load practice content. Please try again.");
      }
    }
  };

  // Monitor question set loading and navigate when ready
  useEffect(() => {
    if (questionSetData && questionSetData.success && selectedLessonId && selectedLessonType) {
      console.log("Question set loaded successfully:", questionSetData);
      
      // Navigate to practice page
      const skillPath = selectedLessonType.toLowerCase();
      navigate(`/user/practice/${skillPath}`, { 
        state: { 
          lessonId: selectedLessonId,
          lessonType: selectedLessonType,
          questionSet: questionSetData.data,
          subCategoryType: selectedSubCategoryType
        }
      });
      
      // Reset states
      setSelectedLessonId(null);
      setSelectedLessonType(null);
      setSelectedSubCategoryType("");
    }
  }, [questionSetData, selectedLessonId, selectedLessonType, selectedSubCategoryType, navigate]);

  // Handle question set fetch errors
  useEffect(() => {
    if (questionSetError && selectedLessonId && selectedLessonType) {
      console.error("Question set fetch error:", questionSetError);
      
      // Check if it's a 404 error (QuestionSet not found)
      const errorData = (questionSetError as any)?.data;
      if (errorData?.statusCode === 404) {
        handleQuestionSetFetchError(selectedLessonId, selectedLessonType, selectedSubCategoryType);
      } else {
        alert("Failed to load practice questions. Please try again.");
        // Reset states
        setSelectedLessonId(null);
        setSelectedLessonType(null);
        setSelectedSubCategoryType("");
      }
    }
  }, [questionSetError, selectedLessonId, selectedLessonType, selectedSubCategoryType]);

  const progressData = {
    currentMinutes: 22,
    totalMinutes: 30,
    timeLeft: "8 min left",
  };

  const sessionsData = {
    title: "Today's Sessions",
    value: 3,
    icon: <GiBookmarklet className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-700" />,
  };

  const studyTimeData = {
    title: "Total Study Time",
    value: "3/5",
    icon: <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
  };

  const accuracyData = {
    title: "Average Accuracy",
    value: "88%",
    icon: <TargetIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
  };

  const isNested = location.pathname.startsWith("/user/practice/") && location.pathname !== "/user/practice";
  const thisNested = location.pathname.startsWith("/freeuser/practice/") && location.pathname !== "/freeuser/practice";

  if (isNested || thisNested) {
    return <Outlet />;
  }

  const skills = [
    {
      icon: readingicon,
      title: "Reading",
      subtitle: "Comprehension practice",
      duration: "8 min",
      progress: 70,
      bgColor: "bg-blue-50",
      iconBg: "bg-gradient-to-r from-[#0B5FFF] to-[#6C9AF0]",
      type: LessonType.READING
    },
    {
      icon: lesteningicon,
      title: "Listening",
      subtitle: "Audio comprehension",
      duration: "8 min",
      lockicon: lockicon,
      progress: 50,
      bgColor: "bg-orange-50",
      iconBg: "bg-gradient-to-r from-[#F97316] to-[#FB923C]",
      type: LessonType.LISTENING
    },
    {
      icon: writingicon,
      title: "Writing",
      subtitle: "Sentence composition",
      duration: "10 min",
      progress: 30,
      lockicon: lockicon,
      bgColor: "bg-green-50",
      iconBg: "bg-gradient-to-r from-[#0E9F6E] to-[#11D090]",
      type: LessonType.WRITING
    },
    {
      icon: speakingicon,
      title: "Speaking",
      subtitle: "Pronunciation and fluency",
      duration: "12 min",
      lockicon: lockicon,
      progress: 80,
      bgColor: "bg-red-50",
      iconBg: "bg-gradient-to-r from-[#BA0BFF] to-[#E19FFB]",
      type: LessonType.SPEAKING
    },
  ];

  const isLoading = isLoadingNextLesson || isLoadingQuestionSet;

  return (
    <div className="min-h-screen p-3 xs:p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2 lg:mb-3">
            Practice Italian
          </h1>
          <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-100 max-w-3xl">
            Choose a skill to practice and improve your Italian proficiency
          </p>
        </div>

        {/* Daily Goal Progress */}
        <DailyGoalProgress
          currentMinutes={progressData.currentMinutes}
          totalMinutes={progressData.totalMinutes}
          timeLeft={progressData.timeLeft}
        />

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <StatCard {...sessionsData} />
          <StatCard {...studyTimeData} />
          <StatCard {...accuracyData} />
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {skills.map((skill, index) => {
            const shouldShowLock = role === "USER" && !hasUsedTrial && skill.title !== "Reading";
            
            return (
              <div 
                key={index} 
                className={`${skill.bgColor} rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm dark:bg-gray-800 h-full flex flex-col transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4 flex-1">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`${skill.iconBg} rounded-lg p-2 sm:p-3 flex items-center justify-center`}>
                      <img src={skill.icon} alt={skill.title} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base lg:text-lg mb-1 truncate">
                        {skill.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                        {skill.subtitle}
                      </p>
                    </div>
                  </div>

                  {shouldShowLock ? (
                    <img src={lockicon} alt="lock" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2 whitespace-nowrap">
                      {skill.duration}
                    </span>
                  )}
                </div>

                <ProgressBar
                  progress={skill.progress}
                  color="bg-black"
                  showPercentage={false}
                  height="h-1.5 sm:h-2"
                  className="mb-3"
                />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{skill.progress}% Completed</span>
                </div>

                <button
                  onClick={() => handlePracticeStart(skill.title,)}
                  disabled={shouldShowLock || isLoading}
                  className={`${
                    shouldShowLock 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors text-center text-xs sm:text-sm lg:text-base block w-full disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Loading..." : shouldShowLock ? "Locked" : "Start Practice"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Unlock Pro Card */}
        {prodata === false && hasUsedTrial === false && (
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <UnlockProCard
              title="Unlock Premium Access"
              description="Access to all expert-led courses and downloadable resources."
              buttonText="Get 30 Days Trial"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserItalianPractice;














// import React, { useState, useEffect } from "react";
// import { ClockIcon, TargetIcon } from "lucide-react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import tatgeticon from "../../../assets/Dashbord/tergeticon.svg";
// import readingicon from "../../../assets/Dashbord/reading.svg";
// import lesteningicon from "../../../assets/Dashbord/listening.svg";
// import writingicon from "../../../assets/Dashbord/writing.svg";
// import speakingicon from "../../../assets/Dashbord/speaking.svg";
// import lockicon from "../../../assets/Dashbord/lock.svg";
// import { GiBookmarklet } from "react-icons/gi";

// import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
// import UnlockProCard from "@/components/FreeUserDashbord/Overview/UnlockProCard";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import { useGetMySubscriptionQuery } from "@/redux/features/subscriptions/subscriptionsApi";
// import { 
//   useLazyGetNextLessonQuery,
    
// } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
// import { useGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";

// // Enum for lesson types to match backend
// enum LessonType {
//   READING = "READING",
//   LISTENING = "LISTENING",
//   WRITING = "WRITING",
//   SPEAKING = "SPEAKING"
// }

// // Interface for API response
// interface LessonApiResponse {
//   success: boolean;
//   data: {
//     id: string;
//     type: LessonType;
//     title: string;
//     description?: string;
//     difficulty?: string;
//     subCategoryType?: string;
//   };
// }

// // Service to handle lesson data processing
// const PracticeDataService = {
//   processApiLessonResponse: (apiResponse: LessonApiResponse) => {
//     const lesson = apiResponse.data;
    
//     // Map lesson type to subCategoryType if needed
//     let subCategoryType = lesson.subCategoryType;
//     if (!subCategoryType) {
//       // Default mapping based on lesson type
//       switch (lesson.type) {
//         case LessonType.READING:
//           subCategoryType = "READING_COMPREHENSION";
//           break;
//         case LessonType.LISTENING:
//           subCategoryType = "LISTENING_COMPREHENSION";
//           break;
//         case LessonType.WRITING:
//           subCategoryType = "SHORT_ESSAY";
//           break;
//         case LessonType.SPEAKING:
//           subCategoryType = "SPEAKING_PRACTICE";
//           break;
//         default:
//           subCategoryType = "READING_COMPREHENSION";
//       }
//     }

//     return {
//       id: lesson.id,
//       lessonId: lesson.id, // For backward compatibility
//       type: lesson.type,
//       title: lesson.title,
//       description: lesson.description || `Practice your ${lesson.type.toLowerCase()} skills`,
//       difficulty: lesson.difficulty || "Beginner",
//       subCategoryType: subCategoryType
//     };
//   },

//   getNextLesson: (type: LessonType) => {
//     // Fallback local lesson data if API fails
//     const lessons = {
//       [LessonType.READING]: {
//         id: "reading-001",
//         lessonId: "reading-001",
//         type: LessonType.READING,
//         title: "Basic Italian Reading",
//         description: "Practice reading comprehension with simple texts",
//         difficulty: "Beginner",
//         subCategoryType: "READING_COMPREHENSION"
//       },
//       [LessonType.LISTENING]: {
//         id: "listening-001",
//         lessonId: "listening-001",
//         type: LessonType.LISTENING,
//         title: "Italian Conversations",
//         description: "Practice listening to Italian conversations",
//         difficulty: "Beginner",
//         subCategoryType: "LISTENING_COMPREHENSION"
//       },
//       [LessonType.WRITING]: {
//         id: "writing-001",
//         lessonId: "writing-001",
//         type: LessonType.WRITING,
//         title: "Writing Practice",
//         description: "Practice writing Italian sentences",
//         difficulty: "Beginner",
//         subCategoryType: "SHORT_ESSAY"
//       },
//       [LessonType.SPEAKING]: {
//         id: "speaking-001",
//         lessonId: "speaking-001",
//         type: LessonType.SPEAKING,
//         title: "Speaking Practice",
//         description: "Practice Italian pronunciation",
//         difficulty: "Beginner",
//         subCategoryType: "SPEAKING_PRACTICE"
//       }
//     };

//     return lessons[type];
//   }
// };

// // StatCard Component
// const StatCard: React.FC<any> = ({ title, value, icon }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl shadow-md flex flex-col justify-between dark:text-gray-100 h-full">
//       <div className="flex justify-between items-start mb-2">
//         <p className="text-xs xs:text-sm sm:text-base text-[#A7A7A7] dark:text-gray-300 font-medium">{title}</p>
//         <span className="text-indigo-500 text-lg sm:text-xl lg:text-2xl">{icon}</span>
//       </div>
//       <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
//     </div>
//   );
// };

// // Daily Goal Progress Component
// const DailyGoalProgress: React.FC<any> = ({ currentMinutes, totalMinutes, timeLeft }) => {
//   const percentage = Math.round((currentMinutes / totalMinutes) * 100);
//   return (
//     <div className="bg-[#0E9F6E1A] p-4 sm:p-5 lg:p-6 rounded-xl border border-[#0E9F6E33] shadow-sm mb-4 sm:mb-6 lg:mb-8 dark:bg-[#0E9F6E1A] dark:border-[#0E9F6E33]">
//       <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-3 xs:gap-4 mb-3 sm:mb-4">
//         <div className="flex gap-3 items-center flex-1 min-w-0">
//           <img className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" src={tatgeticon} alt="Target" />
//           <div className="min-w-0 flex-1">
//             <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#111827] dark:text-gray-200 truncate">
//               Daily Goal Progress
//             </p>
//             <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-50 truncate">
//               {currentMinutes} of {totalMinutes} minutes completed
//             </p>
//           </div>
//         </div>
//         <div className="text-left xs:text-right">
//           <p className="text-base sm:text-lg lg:text-xl font-bold from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent leading-none">
//             {percentage}%
//           </p>
//           <p className="text-xs sm:text-sm text-[#585858] dark:text-gray-300">{timeLeft}</p>
//         </div>
//       </div>
//       <ProgressBar progress={percentage} color="bg-black" showPercentage={false} className="mt-3 sm:mt-4" />
//     </div>
//   );
// };

// // SkillCard Component
// const SkillCard = ({ icon, title, subtitle, duration, progress, bgColor, iconBg, path, lockicon }: any) => {
//   const { data } = useGetMeQuery({});
//   const usedTrial = data?.data?.hasUsedTrial;
//   const role = data?.data?.role;
  
//   // Show lock icon if:
//   // 1. User is a free user AND
//   // 2. They haven't used their trial yet AND
//   // 3. This is NOT the Reading card (first card)
//   const shouldShowLock = role === "USER" && !usedTrial && title !== "Reading";
  
//   return (
//     <div className={`${bgColor} rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm dark:bg-gray-800 h-full flex flex-col transition-all duration-200 hover:shadow-md`}>
//       <div className="flex items-start justify-between mb-4 flex-1">
//         <div className="flex items-start gap-3 flex-1 min-w-0">
//           <div className={`${iconBg} rounded-lg p-2 sm:p-3 flex items-center justify-center`}>
//             <img src={icon} alt={title} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base lg:text-lg mb-1 truncate">
//               {title}
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
//               {subtitle}
//             </p>
//           </div>
//         </div>

//         {shouldShowLock ? (
//           <img src={lockicon} alt="lock" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
//         ) : (
//           <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2 whitespace-nowrap">
//             {duration}
//           </span>
//         )}
//       </div>

//       <ProgressBar
//         progress={progress}
//         color="bg-black"
//         showPercentage={false}
//         height="h-1.5 sm:h-2"
//         className="mb-3"
//       />

//       <div className="flex items-center justify-between mb-4">
//         <span className="text-xs text-gray-600 dark:text-gray-400">{progress}% Completed</span>
//       </div>

//       <Link
//         to={shouldShowLock ? "#" : path}
//         className={`${shouldShowLock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors text-center text-xs sm:text-sm lg:text-base block w-full`}
//         onClick={shouldShowLock ? (e) => e.preventDefault() : undefined}
//       >
//         {shouldShowLock ? "Locked" : "Start Practice"}
//       </Link>
//     </div>
//   );
// };

// // Main UserItalianPractice Component
// const UserItalianPractice: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { data } = useGetMeQuery({});
//   const role = data?.data?.role;
//   const { data: subscriptionData } = useGetMySubscriptionQuery();
//   const prodata = subscriptionData?.data.isPro;
//   const hasUsedTrial = subscriptionData?.data.hasUsedTrial;
  
//   const [getNextLesson, { isLoading: isLoadingNextLesson }] = useLazyGetNextLessonQuery();
//   const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
//   // Fetch question set when a lesson is selected
//   const { data: questionSetData, isLoading: isLoadingQuestionSet } = useGetLessonQuestionSetQuery(
//     { 
//       lessonId: selectedLessonId!,
//       subCategoryType: "SHORT_ESSAY" // This should be dynamic based on lesson type
//     },
//     {
//       skip: !selectedLessonId,
//     }
//   );

//   const handlePracticeStart = async (lessonType: string) => {
//     // Map card title to LessonType enum
//     let mappedLessonType: LessonType;
//     switch (lessonType) {
//       case "Reading":
//         mappedLessonType = LessonType.READING;
//         break;
//       case "Listening":
//         mappedLessonType = LessonType.LISTENING;
//         break;
//       case "Writing":
//         mappedLessonType = LessonType.WRITING;
//         break;
//       case "Speaking":
//         mappedLessonType = LessonType.SPEAKING;
//         break;
//       default:
//         mappedLessonType = LessonType.READING;
//     }

//     // Check if user can access this lesson type
//     if (role === "USER" && !hasUsedTrial && mappedLessonType !== LessonType.READING) {
//       alert("Please upgrade to premium to access this feature or use your free trial first.");
//       return;
//     }

//     try {
//       // Fetch next lesson from API
//       const result = await getNextLesson({ type: mappedLessonType }).unwrap();
      
//       if (result.success && result.data) {
//         // Process API response
//         const lesson = PracticeDataService.processApiLessonResponse(result);
        
//         // Set the selected lesson ID to trigger question set fetch
//         setSelectedLessonId(lesson.id);
        
//         // Store lesson data for navigation
//         const lessonData = {
//           id: lesson.id,
//           type: lesson.type,
//           title: lesson.title,
//           description: lesson.description,
//           difficulty: lesson.difficulty,
//           subCategoryType: lesson.subCategoryType
//         };

//         // Navigate to practice page
//         navigate(`/user/practice/${lessonType.toLowerCase()}`, { 
//           state: { 
//             lessonId: lesson.id,
//             lessonType: lesson.type,
//             lessonData: lessonData,
//             // Pass question set data if available
//             questionSet: questionSetData?.data || null
//           }
//         });
//       } else {
//         // If no lesson from API, check locally
//         const nextLesson = PracticeDataService.getNextLesson(mappedLessonType);
//         console.log(nextLesson)
//         if (nextLesson) {
//           setSelectedLessonId(nextLesson.id);
//           navigate(`/user/practice/${lessonType.toLowerCase()}`, { 
//             state: { 
//               lessonId: nextLesson.id,
//               lessonType: nextLesson.type,
//               lessonData: nextLesson,
//               questionSet: questionSetData?.data || null
//             }
//           });
//         } else {
//           alert(`No ${lessonType.toLowerCase()} lessons available. Please try again later.`);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching lesson:", error);
      
//       // Fallback to local data
//       const nextLesson = PracticeDataService.getNextLesson(mappedLessonType);
      
//       if (nextLesson) {
//         setSelectedLessonId(nextLesson.id);
//         navigate(`/user/practice/${lessonType.toLowerCase()}`, { 
//           state: { 
//             lessonId: nextLesson.id,
//             lessonType: nextLesson.type,
//             lessonData: nextLesson,
//             questionSet: questionSetData?.data || null
//           }
//         });
//       } else {
//         alert("Failed to load practice content. Please try again.");
//       }
//     }
//   };

//   // Monitor question set loading and update navigation if needed
//   useEffect(() => {
//     if (questionSetData && selectedLessonId) {
//       console.log("Question set loaded:", questionSetData);
//       // You can update the navigation state here if needed
//     }
//   }, [questionSetData, selectedLessonId]);

//   const progressData = {
//     currentMinutes: 22,
//     totalMinutes: 30,
//     timeLeft: "8 min left",
//   };

//   const sessionsData = {
//     title: "Today's Sessions",
//     value: 3,
//     icon: <GiBookmarklet className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-700" />,
//   };

//   const studyTimeData = {
//     title: "Total Study Time",
//     value: "3/5",
//     icon: <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
//   };

//   const accuracyData = {
//     title: "Average Accuracy",
//     value: "88%",
//     icon: <TargetIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
//   };

//   const isNested = location.pathname.startsWith("/user/practice/") && location.pathname !== "/user/practice";
//   const thisNested = location.pathname.startsWith("/freeuser/practice/") && location.pathname !== "/freeuser/practice";

//   if (isNested || thisNested) {
//     return <Outlet />;
//   }

//   const skills = [
//     {
//       icon: readingicon,
//       title: "Reading",
//       subtitle: "Comprehension practice",
//       duration: "8 min",
//       progress: 70,
//       bgColor: "bg-blue-50",
//       iconBg: "bg-gradient-to-r from-[#0B5FFF] to-[#6C9AF0]",
//       path: "#",
//       onClick: () => handlePracticeStart("Reading")
//     },
//     {
//       icon: lesteningicon,
//       title: "Listening",
//       subtitle: "Audio comprehension",
//       duration: "8 min",
//       lockicon: lockicon,
//       progress: 50,
//       bgColor: "bg-orange-50",
//       path: "#",
//       onClick: () => handlePracticeStart("Listening")
//     },
//     {
//       icon: writingicon,
//       title: "Writing",
//       subtitle: "Sentence composition",
//       duration: "10 min",
//       progress: 30,
//       lockicon: lockicon,
//       bgColor: "bg-green-50",
//       iconBg: "bg-gradient-to-r from-[#0E9F6E] to-[#11D090]",
//       path: "#",
//       onClick: () => handlePracticeStart("Writing")
//     },
//     {
//       icon: speakingicon,
//       title: "Speaking",
//       subtitle: "Pronunciation and fluency",
//       duration: "12 min",
//       lockicon: lockicon,
//       progress: 80,
//       bgColor: "bg-red-50",
//       iconBg: "bg-gradient-to-r from-[#BA0BFF] to-[#E19FFB]",
//       path: "#",
//       onClick: () => handlePracticeStart("Speaking")
//     },
//   ];

//   return (
//     <div className="min-h-screen p-3 xs:p-4 sm:p-5 lg:p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header Section */}
//         <div className="mb-4 sm:mb-6 lg:mb-8">
//           <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2 lg:mb-3">
//             Practice Italian
//           </h1>
//           <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-100 max-w-3xl">
//             Choose a skill to practice and improve your Italian proficiency
//           </p>
//         </div>

//         {/* Daily Goal Progress */}
//         <DailyGoalProgress
//           currentMinutes={progressData.currentMinutes}
//           totalMinutes={progressData.totalMinutes}
//           timeLeft={progressData.timeLeft}
//         />

//         {/* Stat Cards Grid */}
//         <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
//           <StatCard {...sessionsData} />
//           <StatCard {...studyTimeData} />
//           <StatCard {...accuracyData} />
//         </div>

//         {/* Skill Cards Grid */}
//         <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
//           {skills.map((skill, index) => (
//             <div 
//               key={index} 
//               className={`${skill.bgColor} rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm dark:bg-gray-800 h-full flex flex-col transition-all duration-200 hover:shadow-md`}
//             >
//               <div className="flex items-start justify-between mb-4 flex-1">
//                 <div className="flex items-start gap-3 flex-1 min-w-0">
//                   <div className={`${skill.iconBg} rounded-lg p-2 sm:p-3 flex items-center justify-center`}>
//                     <img src={skill.icon} alt={skill.title} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base lg:text-lg mb-1 truncate">
//                       {skill.title}
//                     </h3>
//                     <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
//                       {skill.subtitle}
//                     </p>
//                   </div>
//                 </div>

//                 {role === "USER" && !hasUsedTrial && skill.title !== "Reading" ? (
//                   <img src={lockicon} alt="lock" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
//                 ) : (
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2 whitespace-nowrap">
//                     {skill.duration}
//                   </span>
//                 )}
//               </div>

//               <ProgressBar
//                 progress={skill.progress}
//                 color="bg-black"
//                 showPercentage={false}
//                 height="h-1.5 sm:h-2"
//                 className="mb-3"
//               />

//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-xs text-gray-600 dark:text-gray-400">{skill.progress}% Completed</span>
//               </div>

//               <button
//                 onClick={skill.onClick}
//                 disabled={role === "USER" && !hasUsedTrial && skill.title !== "Reading"}
//                 className={`${
//                   role === "USER" && !hasUsedTrial && skill.title !== "Reading" 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 } text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors text-center text-xs sm:text-sm lg:text-base block w-full disabled:opacity-70 disabled:cursor-not-allowed`}
//               >
//                 {role === "USER" && !hasUsedTrial && skill.title !== "Reading" 
//                   ? "Locked" 
//                   : isLoadingNextLesson ? "Loading..." : "Start Practice"}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Unlock Pro Card */}
//         {prodata === false && hasUsedTrial === false && (
//           <div className="mt-4 sm:mt-6 lg:mt-8">
//             <UnlockProCard
//               title="Unlock Premium Access"
//               description="Access to all expert-led courses and downloadable resources."
//               buttonText="Get 30 Days Trial"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserItalianPractice;



 