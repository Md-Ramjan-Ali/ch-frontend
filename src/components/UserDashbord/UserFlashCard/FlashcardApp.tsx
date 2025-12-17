 








import React, { useState,  } from "react";
import { FlashcardDashboard } from "./FlashcardDashboard";
import FlashcardReviewSession from "./FlashcardReviewSession";
import { 
  useGetFlashcardOverviewQuery, 
  useStartSessionMutation 
} from "@/redux/features/flashcards/flashcardsApi";
import { FlashcardOverviewResponse, SessionData } from "@/redux/features/flashcards/flashcards.types";

type AppView = "dashboard" | "review";

export const FlashcardApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [totalCards, setTotalCards] = useState<number>(0);

  // Fetch user overview data
  const { 
    data: overviewResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGetFlashcardOverviewQuery();

  const [startSession, { isLoading: isStartingSession }] = useStartSessionMutation();

  // Process overview data
  const overview = overviewResponse?.data as FlashcardOverviewResponse;

  // Start a new session
  const handleStartPractice = async (categoryId: number) => {
    try {
      const category = overview?.categories?.find(cat => cat.categoryId === categoryId);
      if (category) {
        setCategoryTitle(category.categoryTitle);
        setTotalCards(category.total);
      }

      const result = await startSession({ categoryId }).unwrap();
      
      if (result.success) {
       const sessionData: SessionData = {
  sessionId: result.data.sessionId,
  status: result.data.status,
  cardsRemaining: result.data.cardsRemaining,
  scores: result.data.scores,
  currentCard: result.data.currentCard,
  totalTimeSeconds: result.data.totalTimeSeconds,
  formattedTime: result.data.formattedTime,
  categoryId: categoryId,

  // Add these missing properties
  categoryTitle: category?.categoryTitle || "",  // from overview or API
  totalCards: category?.total || 0,             // from overview or API
  startedAt: result.data.startedAt || new Date().toISOString(),
  isActive: true,
};

        
        setSessionData(sessionData);
        setCurrentView("review");
      }
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Failed to start session. Please try again.");
    }
  };

  // Resume active session
  const handleResumePractice = async (categoryId: number) => {
    try {
      const category = overview?.categories?.find(cat => cat.categoryId === categoryId);
      if (category && category.isActiveSession) {
        setCategoryTitle(category.categoryTitle);
        setTotalCards(category.total);
        
        const result = await startSession({ categoryId }).unwrap();
        
        if (result.success) {
         const sessionData: SessionData = {
  sessionId: result.data.sessionId,
  status: result.data.status,
  cardsRemaining: result.data.cardsRemaining,
  scores: result.data.scores,
  currentCard: result.data.currentCard,
  totalTimeSeconds: result.data.totalTimeSeconds,
  formattedTime: result.data.formattedTime,
  categoryId: categoryId,

  // Add these missing properties
  categoryTitle: category?.categoryTitle || "",  // from overview or API
  totalCards: category?.total || 0,             // from overview or API
  startedAt: result.data.startedAt || new Date().toISOString(),
  isActive: true,
};

          
          setSessionData(sessionData);
          setCurrentView("review");
        }
      }
    } catch (error) {
      console.error("Failed to resume session:", error);
      alert("Failed to resume session. Please try again.");
    }
  };

  const handleContinue = () => {
    setSessionData(null);
    setCurrentView("dashboard");
    refetch(); // Refresh dashboard stats
  };

  const handleUpdateSession = (newSessionData: SessionData | null) => {
    setSessionData(newSessionData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading flashcard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading flashcard data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please check your connection and try again</p>
          <button 
            onClick={() => refetch()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform overview data for dashboard
  const dashboardOverview = overview ? {
    totalDecks: overview.categories.length,
    dueCards: overview.categories.reduce((acc, cat) => acc + cat.due, 0),
    lifetimeStats: {
      totalReviews: overview.lifetimeMetrics.totalCardsStudied,
      totalTimeSpent: 0, // This would come from another endpoint
      averageGrade: overview.lifetimeMetrics.averageScorePercentage / 20, // Convert to 5-point scale
    },
  




categories: overview.categories.map(cat => ({
  id: cat.categoryId,
  title: cat.categoryTitle,
  totalCards: cat.total,
  masteredCards: cat.mastered,
  dueCards: cat.due,
  isActiveSession: cat.isActiveSession,
}))








  } : undefined;

  return (
    <div className="min-h-screen">
      {currentView === "dashboard" ? (
        <FlashcardDashboard
          overview={dashboardOverview}
          onStartPractice={handleStartPractice}
          onResumePractice={handleResumePractice}
          isLoading={isStartingSession}
        />
      ) : (
        sessionData && (
          <FlashcardReviewSession
            sessionData={sessionData}
            categoryTitle={categoryTitle}
            totalCards={totalCards}
            onContinue={handleContinue}
            onUpdateSession={handleUpdateSession}
          />
        )
      )}
    </div>
  );
};

export default FlashcardApp;








 