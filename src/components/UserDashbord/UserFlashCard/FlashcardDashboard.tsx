import React, { useState } from "react";
import { Play, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { FlashcardOverviewResponse, UserFlashcardOverview } from "@/redux/features/flashcards/flashcards.types";
import { useGetFlashcardOverviewQuery } from "@/redux/features/flashcards/flashcardsApi";
 
interface TopicCardProps {
  category: {
    id: number;
    title: string;
    totalCards: number;
    masteredCards: number;
    dueCards: number;
     isActiveSession: boolean;
  };
  onStart: (categoryId: number) => void;
  onResume: (categoryId: number) => void;
  role: string;
  isUnlocked: boolean;
  onUnlock: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  category,
  onStart,
  onResume,
  role,
  isUnlocked,
  onUnlock,
}) => {

  console.log(category)
  // const {categoryId, categoryTitle, total, mastered, due, isActiveSession} = category;


const {
  id: categoryId,
  title: categoryTitle,
  totalCards: total,
  masteredCards: mastered,
  dueCards: due,
  isActiveSession = false,
} = category;


  console.log(categoryId)
  const masteryPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;

  const handleCardClick = () => {
    if (role === "freeuser" && !isUnlocked) {
      onUnlock();
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div
      className="relative cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleCardClick}
    >
      {/* Card content */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col dark:bg-gray-900 h-full">
        <h3 className="text-base sm:text-lg font-bold text-gray-600 dark:text-gray-200 line-clamp-2">
          {categoryTitle}
        </h3>

        <div className="flex justify-between text-xs sm:text-sm mt-3 mb-3 sm:mb-4 text-gray-600 dark:text-gray-200">
          <p className="dark:text-gray-200">Total Cards</p>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <p className="dark:text-gray-200">Mastered</p>
          <span className="font-semibold text-green-600 dark:text-gray-200">
            {mastered} ({masteryPercent}%)
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm mb-4">
          <p className="dark:text-gray-200">Due</p>
          <span className="font-semibold text-red-600 dark:text-gray-200">{due}</span>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 xs:gap-2 mt-auto pt-2">
        

{
  isActiveSession &&   <button
            onClick={(e) => handleButtonClick(e,() => onResume(categoryId))}
            className="flex-1 cursor-pointer flex items-center justify-center px-2 xs:px-3 py-2 text-xs xs:text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <RotateCw size={14} className="mr-1 xs:mr-1" />
            <span className="truncate">Resume</span>
          </button>
}

{
  !isActiveSession && <button  onClick={(e) => handleButtonClick(e, () => onStart(categoryId))}
            className="flex-1 cursor-pointer flex items-center justify-center px-2 xs:px-3 py-2 text-xs xs:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play size={14} className="mr-1 xs:mr-1" />
            <span className="truncate">Start</span>
          </button>
}

        
           
        </div>
      </div>

      {/* Lock overlay for free users */}
      {role === "freeuser" && !isUnlocked && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center p-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
              Click to Unlock
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================
// Main Dashboard Component
// ==========================
interface FlashcardDashboardProps {
  overview?: UserFlashcardOverview;
  onStartPractice: (categoryId: number) => void;
   isLoading: boolean;
   onResumePractice: (categoryId: number) => void; // ✅ FIX
}

export const FlashcardDashboard: React.FC<FlashcardDashboardProps> = ({
  overview,
  onStartPractice,
  onResumePractice
 
}) => {

  console.log(overview)
  const userData = localStorage.getItem("userData");
  const { role } = userData ? JSON.parse(userData) : { role: "freeuser" };

  const [unlockedCategories, setUnlockedCategories] = useState<number[]>([]);
 
  const handleUnlock = (categoryId: number) => {
    setUnlockedCategories((prev) => [...prev, categoryId]);
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 6;

  const categories = overview?.categories || [];
  const totalPages = Math.ceil(categories.length / topicsPerPage);
  const startIndex = (currentPage - 1) * topicsPerPage;
  const endIndex = startIndex + topicsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);
console.log(currentCategories)
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate visible page numbers for pagination
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };





const { 
    data: overviewResponse, 
    isLoading, 
    
  } = useGetFlashcardOverviewQuery();


  const overviews = overviewResponse?.data as FlashcardOverviewResponse;
  console.log(overviews)


  return (
    <div className="mx-auto p-3 xs:p-4 sm:p-5 lg:p-6  ">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Advance Flashcard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">
          Master Italian vocabulary with spaced repetition
        </p>
      </div>

      
      {/* ========== Lifetime Stats Section ========== */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white ">
Previously completed sessions         </h2>
        <p className="text-sm  text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
Master Italian vocabulary with spaced repetition        </p>

        <div className="grid grid-cols-2 min-[480px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
              
              {overviews.lifetimeMetrics?.sessionsCompleted || 0}
              
              {/* {overview?.data?.lifetimeMetrics?.sessionsCompleted || 0} */}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Number of Sessions Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
              {overviews.lifetimeMetrics?.totalCardsStudied}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Cards Studied</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
              {overviews.lifetimeMetrics?.averageScorePercentage}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Average Score</p>
          </div>
          
        </div>
      </div>

      {/* Resume Session Button (if there's an active session) */}
      {overview?.categories?.some(cat => cat.dueCards > 0) && (
        <div className="mb-6">
          <button
            onClick={onResumePractice}
            // onClick={() => onResumePractice(category.id )}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resuming Session...
              </>
            ) : (
              <>
                <RotateCw size={20} className="mr-2" />
                Resume Latest Session ({overview.dueCards} cards due)
              </>
            )}
          </button>
        </div>
      )}

      {/* ========== Topic Grid ========== */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {currentCategories.map((category) => (
          <TopicCard
            key={category.id}
            category={category}
            onStart={onStartPractice}
            onResume={onResumePractice}
            role={role}
            isUnlocked={unlockedCategories.includes(category.id)}
            onUnlock={() => handleUnlock(category.id)}
          />
        ))}
      </div>

      {/* ✅ Pagination Controls */}
      {categories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-gray-700 dark:text-gray-300 mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm order-2 sm:order-1">
            Total Categories:{" "}
            <span className="font-semibold">{categories.length}</span>
          </p>

          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
             <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`sm:hidden p-2 rounded-lg border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

             <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`hidden sm:flex items-center px-4 py-2 rounded-lg border text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

             <div className="hidden xs:flex items-center gap-1 sm:gap-2">
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

             <span className="xs:hidden text-sm font-medium text-center">
              Page {currentPage} of {totalPages}
            </span>

             <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`sm:hidden p-2 rounded-lg border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <ChevronRight size={16} />
            </button>

            {/* Desktop Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`hidden sm:flex items-center px-4 py-2 rounded-lg border text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}


{/* Quick Stats Bar */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 mb-1">{overview?.totalDecks || 0}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Decks</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600 mb-1">{overview?.dueCards  || 0}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Cards Due</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 mb-1">{overview?.lifetimeStats?.totalReviews || 0}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Reviews</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {overview?.lifetimeStats?.averageGrade ? `${overview.lifetimeStats.averageGrade.toFixed(1)}` : "0/5"}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Grade</p>
        </div>
      </div> */}







    </div>
  );
};










 