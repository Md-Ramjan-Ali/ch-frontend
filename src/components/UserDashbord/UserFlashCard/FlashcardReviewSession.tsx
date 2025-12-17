import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
   Volume2,
  Pause,
  Play,
  X,
  HelpCircle,
  Check,
  Star,
  Clock1,
  BookOpen,
  RotateCw,
  ChevronsLeft,
  ChevronsRight,
 
} from "lucide-react";
import {
  useGradeFlashcardMutation,
  usePauseSessionMutation,
} from "@/redux/features/flashcards/flashcardsApi";
import {
 
  GradeResponse,
  SessionData,
} from "@/redux/features/flashcards/flashcards.types";

interface FlashcardReviewSessionProps {
  sessionData: SessionData;
  categoryTitle: string;
  totalCards: number;
  onContinue: () => void;
  onUpdateSession: (newSessionData: SessionData | null) => void;
}

interface RatingButtonProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClasses: string;
  grade: number;
  onClick: (grade: number) => void;
  disabled: boolean;
  isSelected: boolean;
}

const RatingButton: React.FC<RatingButtonProps> = ({
  label,
  description,
  icon,
  colorClasses,
  grade,
  onClick,
  disabled,
  isSelected,
}) => (
  <button
    onClick={() => onClick(grade)}
    disabled={disabled}
    className={`p-4 rounded-xl text-center flex flex-col items-center justify-center transition-all duration-300 ${colorClasses} ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:shadow-md active:scale-95"
    } ${isSelected ? "ring-4 ring-offset-2 transform scale-105" : ""}`}
  >
    {icon}
    <p className="font-bold text-lg mt-2 mb-1">{label}</p>
    <p className="text-xs opacity-90">{description}</p>
  </button>
);

export const FlashcardReviewSession: React.FC<FlashcardReviewSessionProps> = ({
  sessionData,
  categoryTitle,
  totalCards,
  onContinue,
  onUpdateSession,
}) => {
  const [cardRevealed, setCardRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"right" | "left" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(sessionData.totalTimeSeconds);
  const [userKnowsTranslation, setUserKnowsTranslation] = useState<
    boolean | null
  >(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [gradeFlashcard] = useGradeFlashcardMutation();
  const [pauseSession] = usePauseSessionMutation();

  // Start timer
  useEffect(() => {
    if (sessionData.status === "ACTIVE") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionData.status]);

  // Reset user knowledge state when card changes
  useEffect(() => {
    setUserKnowsTranslation(null);
  }, [sessionData.currentCard]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFlipCard = (direction: "right" | "left") => {
    if (isFlipping) return;

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      setCardRevealed(!cardRevealed);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 500);
  };

  const handleAutoFlip = () => {
    if (cardRevealed) {
      handleFlipCard("left");
    } else {
      handleFlipCard("right");
    }
  };

  const handleGrade = (grade: number) => {
    setSelectedGrade(grade);

    // Auto-reveal if user selects "Forgot" or "Hard"
    if (grade === 0 || grade === 1) {
      setCardRevealed(true);
    }
  };

 

  const handleSubmitGrade = async () => {
    if (!sessionData.currentCard || selectedGrade === null || isSubmitting)
      return;

    setIsSubmitting(true);
    try {
      const result = await gradeFlashcard({
        sessionId: sessionData.sessionId,
        cardId: sessionData.currentCard.cardId,
        grade: selectedGrade,
        currentTimeSeconds: elapsedTime,
      }).unwrap();

      if (result.success) {
        const responseData = result.data as GradeResponse;

        if (responseData.sessionFinished) {
          // Session is complete
          const updatedSession: SessionData = {
            ...sessionData,
            status: "COMPLETED",
            scores: responseData.scores,
            totalTimeSeconds: responseData.totalTimeSeconds,
            formattedTime: responseData.formattedTime,
          };
          onUpdateSession(updatedSession);
        } else if (responseData.currentCard) {
          // Move to next card
          const updatedSession: SessionData = {
            ...sessionData,
            scores: responseData.scores,
            currentCard: responseData.currentCard,
            cardsRemaining: sessionData.cardsRemaining - 1,
            totalTimeSeconds: responseData.totalTimeSeconds,
            formattedTime: responseData.formattedTime,
          };

          setCardRevealed(false);
          setSelectedGrade(null);
          setUserKnowsTranslation(null);
          onUpdateSession(updatedSession);
        }
      }
    } catch (error) {
      console.error("Failed to grade card:", error);
      alert("Failed to submit grade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePauseResume = async () => {
    try {
      if (sessionData.status === "ACTIVE") {
        // Pause the session
        await pauseSession({
          sessionId: sessionData.sessionId,
          currentTimeSeconds: elapsedTime,
        }).unwrap();

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const updatedSession: SessionData = {
          ...sessionData,
          status: "PAUSED",
          totalTimeSeconds: elapsedTime,
          formattedTime: formatTime(elapsedTime),
        };
        onUpdateSession(updatedSession);
      } else {
        // Resume the session
        onContinue();
      }
    } catch (error) {
      console.error("Failed to pause/resume session:", error);
    }
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && sessionData.currentCard) {
      const utterance = new SpeechSynthesisUtterance(
        cardRevealed
          ? sessionData.currentCard.backText
          : sessionData.currentCard.frontText
      );
      utterance.lang = "it-IT";
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

 

// Call when voices are loaded
window.speechSynthesis.onvoiceschanged = handleSpeak;




  // Calculate progress percentage
  const progressPercentage =
    totalCards > 0
      ? ((totalCards - sessionData.cardsRemaining) / totalCards) * 100
      : 0;

  // Grade descriptions for 0-3 system
  const gradeDescriptions = [
    {
      grade: 0,
      label: "Didn’t know",
      desc: "Show again & again",
      color: "red",
      icon: <X size={24} className="text-red-600 dark:text-red-400" />,
    },
    {
      grade: 1,
      label: "Unsure",
      desc: "Review tomorrow",
      color: "orange",
      icon: (
        <HelpCircle
          size={24}
          className="text-orange-600 dark:text-orange-400"
        />
      ),
    },
    {
      grade: 2,
      label: "Good",
      desc: "Review In 3 days",
      color: "blue",
      icon: <Check size={24} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      grade: 3,
      label: "Perfect",
      desc: "Review in 1 week",
      color: "emerald",
      icon: (
        <Star size={24} className="text-emerald-600 dark:text-emerald-400" />
      ),
    },
  ];

  // If the session is completed, show summary
  if (sessionData.status === "COMPLETED") {
    const accuracy =
      sessionData.scores.correctCount + sessionData.scores.incorrectCount > 0
        ? Math.round(
            (sessionData.scores.correctCount /
              (sessionData.scores.correctCount +
                sessionData.scores.incorrectCount)) *
              100
          )
        : 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check size={40} className="text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session Complete! 🎉
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Great job! You've mastered this review session.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {sessionData.scores.correctCount +
                  sessionData.scores.incorrectCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cards Reviewed
              </p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Accuracy
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {sessionData.scores.correctCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Correct
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Time Spent
              </p>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full cursor-pointer py-4 bg-gradient-to-r  from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="  mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {categoryTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Session ID: {sessionData.sessionId.slice(0, 8)}...
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Clock1 size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <button
              onClick={handlePauseResume}
              className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all flex items-center gap-2 ${
                sessionData.status === "ACTIVE"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {sessionData.status === "ACTIVE" ? (
                <>
                  <Pause size={18} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={18} />
                  Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="  mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Flashcard Section - Takes 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {totalCards - sessionData.cardsRemaining} of {totalCards}{" "}
                  cards
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard Container */}
            <div className="relative flex flex-col items-center">
              {/* Card Rotation Instructions */}
              <div className="mb-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use buttons below to flip the card or click the card itself
                </p>
              </div>

              {/* Flashcard with Rotation */}
              <div
                className="relative"
                style={{
                  perspective: "1000px",
                  width: "100%",
                  maxWidth: "500px",
                }}
              >
                <div
                  className={`relative w-full h-64 sm:h-80 md:h-96 cursor-pointer transition-all duration-500 ${
                    isFlipping ? "scale-95" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: cardRevealed
                      ? flipDirection === "right"
                        ? "rotateY(180deg) rotateZ(10deg)"
                        : flipDirection === "left"
                        ? "rotateY(180deg) rotateZ(-10deg)"
                        : "rotateY(180deg)"
                      : flipDirection === "right"
                      ? "rotateY(0deg) rotateZ(10deg)"
                      : flipDirection === "left"
                      ? "rotateY(0deg) rotateZ(-10deg)"
                      : "rotateY(0deg)",
                  }}
                  onClick={handleAutoFlip}
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-blue-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center backface-hidden">
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <BookOpen size={16} />
                      <span className="text-sm font-medium">Italian</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                      {sessionData.currentCard?.frontText}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg text-center">
                      {cardRevealed ? "Showing Translation" : "Showing Italian"}
                    </p>
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak();
                        }}
                        className="p-3 cursor-pointer rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Volume2
                          size={20}
                          className="text-blue-600 cursor-pointer dark:text-blue-400"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-emerald-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <RotateCw size={16} />
                      <span className="text-sm font-medium">Translation</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                      {sessionData.currentCard?.backText}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg text-center">
                      {cardRevealed ? "Showing Translation" : "Showing Italian"}
                    </p>
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak();
                        }}
                        className="p-3 cursor-pointer rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Volume2
                          size={20}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rotation Buttons */}
                <div className="flex relative justify-center items-center gap-8 mt-8">
                  <button
                    onClick={() => handleFlipCard("left")}
                    disabled={isFlipping}
                    className={`p-4 cursor-pointer rounded-full shadow-lg transition-all duration-300 ${
                      isFlipping
                        ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer hover:shadow-xl active:scale-95"
                    }`}
                  >
                    <ChevronsLeft size={28} className="text-white" />
                  </button>

                   
                  <button
                    onClick={() => handleFlipCard("right")}
                    disabled={isFlipping}
                    className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
                      isFlipping
                        ? "bg-gray-200 cursor-pointer dark:bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer hover:shadow-xl active:scale-95"
                    }`}
                  >
                    <ChevronsRight size={28} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Quick Knowledge Check */}
             
            </div>

            {/* Grade Selection - Always Active */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                How well did you know this word?
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {gradeDescriptions.map((gradeInfo) => (
                  <RatingButton
                    key={gradeInfo.grade}
                    label={gradeInfo.label}
                    description={gradeInfo.desc}
                    icon={gradeInfo.icon}
                    colorClasses={`border-2 ${
                      selectedGrade === gradeInfo.grade
                        ? `border-${gradeInfo.color}-500 bg-${gradeInfo.color}-50 dark:bg-${gradeInfo.color}-900/30`
                        : `border-${gradeInfo.color}-200 dark:border-${gradeInfo.color}-800 bg-${gradeInfo.color}-50 dark:bg-${gradeInfo.color}-900/20`
                    } text-${gradeInfo.color}-700 dark:text-${
                      gradeInfo.color
                    }-300`}
                    grade={gradeInfo.grade}
                    onClick={handleGrade}
                    disabled={isSubmitting} // Always active, only disabled when submitting
                    isSelected={selectedGrade === gradeInfo.grade}
                  />
                ))}
              </div>

              {/* Submit Button */}


{
  sessionData.status === "ACTIVE" && <button
                onClick={handleSubmitGrade}
                disabled={selectedGrade === null || isSubmitting}
                className={`w-full py-4 cursor-pointer rounded-xl font-bold text-lg transition-all ${
                  selectedGrade !== null && !isSubmitting
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Next Card ${
                    sessionData.cardsRemaining > 1
                      ? `(${sessionData.cardsRemaining - 1} left)`
                      : ""
                  }`
                )}
              </button>
}

              

              {/* Status Messages */}
              {selectedGrade === null && (
                <p className="text-center mt-4 text-amber-600 dark:text-amber-400">
                  Select a grade to continue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Sidebar - Takes 1/3 width */}
        <div className="lg:col-span-1 space-y-6">
          {/* Session Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              Session Stats
            </h3>

            <div className="space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {sessionData.scores.correctCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-emerald-200">
                    Correct
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {sessionData.scores.incorrectCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-red-200">
                    Incorrect
                  </p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {sessionData.scores.correctCount +
                      sessionData.scores.incorrectCount >
                    0
                      ? Math.round(
                          (sessionData.scores.correctCount /
                            (sessionData.scores.correctCount +
                              sessionData.scores.incorrectCount)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-gray-600 dark:text-blue-200">
                    Accuracy
                  </p>
                </div>
              </div>

              {/* Cards Remaining */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {sessionData.cardsRemaining}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-purple-200">
                    Cards Remaining
                  </p>
                </div>
              </div>

              {/* User Knowledge Status */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {userKnowsTranslation === true
                      ? "You know it! 🎉"
                      : userKnowsTranslation === false
                      ? "Learning now 📚"
                      : "Ready to grade?"}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-indigo-200">
                    {cardRevealed ? "Translation shown" : "Italian shown"}
                  </p>
                </div>
              </div>

              {/* Current Grade Selection */}
              {selectedGrade !== null && (
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      Grade: {selectedGrade}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-indigo-200">
                      {
                        gradeDescriptions.find((g) => g.grade === selectedGrade)
                          ?.label
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Session Status */}
              <div
                className={`p-4 rounded-xl ${
                  sessionData.status === "ACTIVE"
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
                }`}
              >
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">
                    {sessionData.status === "ACTIVE" ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">
                        Paused
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {sessionData.status === "ACTIVE"
                      ? "Session is in progress"
                      : "Session is paused"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              Quick Actions
            </h3>

            <div className="space-y-4">
              <button
                onClick={handlePauseResume}cursor-pointer
                className={`w-full py-3 rounded-lg  font-medium transition-all flex items-center justify-center gap-2 ${
                  sessionData.status === "ACTIVE"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                }`}
              >
                {sessionData.status === "ACTIVE" ? (
                  <>
                    <Pause size={18} />
                    Pause Session
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Resume Session
                  </>
                )}
              </button>

              <button
                onClick={onContinue}
                className="w-full py-3cursor-pointer  bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardReviewSession;
 