import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, Play, Pause, Loader2 } from 'lucide-react';
import ListeningDictation from './ListeningDictation';
import SentenceOrdering from './SentenceOrdering';
import ListeningPracticeComplete from './ListeningPracticeComplete';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { AudioPlayerComponent } from './AudioPlayerComponent ';
import Header from '@/components/Header/Header';
import ExerciseHeader from '../ExerciseHeader';
import lisdteningicon from "../../../../assets/Dashbord/microhead.svg";
import { 
  useLazyGetNextLessonQuery,
} from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
import { useGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";
import { useTextToSpeechMutation } from "@/redux/features/audio/audioApi";

// Types based on your API response
interface QuestionOption {
  answer: string;
  options: string[];
  question: string;
}

interface AudioComprehensionContent {
  passage: string;
  questions: QuestionOption[];
}

interface DictationExerciseContent {
  dictation: string;
}

interface DialogueSequencingContent {
  dialogue: string;
  scrambled: string[];
}

interface QuestionSetData {
  id: number;
  lessonId: number;
  subCategoryType: string;
  prompt: string;
  content: AudioComprehensionContent | DictationExerciseContent | DialogueSequencingContent;
  createdAt: string;
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
  options: string[];
  selectedAnswer: string | null;
  correctAnswer?: string;
}

// Exercise types in sequence
const EXERCISE_SEQUENCE = ['AUDIO_COMPREHENSION', 'DICTATION_EXERCISE', 'DIALOGUE_SEQUENCING'] as const;
type ExerciseType = typeof EXERCISE_SEQUENCE[number];

// Direct API call function for play-for-testing endpoint
const playForTestingDirect = async (text: string): Promise<any> => {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://cheesuschrusty-ai.onrender.com/audio/play-for-testing?text=${encodedText}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type to determine how to handle response
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('audio/')) {
      // It's an audio file - create blob URL
      const audioBlob = await response.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      return { 
        success: true, 
        audioUrl: blobUrl,
        isBlob: true 
      };
    } else if (contentType?.includes('application/json')) {
      // It's JSON response
      return await response.json();
    } else {
      // Try to parse as JSON anyway
      try {
        return await response.json();
      } catch {
        // If not JSON, assume it's audio
        const audioBlob = await response.blob();
        const blobUrl = URL.createObjectURL(audioBlob);
        return { 
          success: true, 
          audioUrl: blobUrl,
          isBlob: true 
        };
      }
    }
  } catch (error: any) {
    console.error('Direct play-for-testing error:', error);
    throw error;
  }
};

const ListeningPractice: React.FC = () => {
  const navigate = useNavigate();
  
  // API hooks
  const [getNextLesson, { isLoading: isLoadingNextLesson, error: nextLessonError }] = useLazyGetNextLessonQuery();
  const [triggerTTS, { isLoading: isLoadingTTS }] = useTextToSpeechMutation();
  
  // State for API data
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentExerciseType, setCurrentExerciseType] = useState<ExerciseType>('AUDIO_COMPREHENSION');
  const [listeningData, setListeningData] = useState<QuestionSetData | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Component state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [phase, setPhase] = useState<'questions' | 'dictation' | 'sentence' | 'complete'>('questions');
  const [showTips, setShowTips] = useState(true);
  const [dictationText, setDictationText] = useState('');
  const [orderedSentences, setOrderedSentences] = useState<string[]>([]);
  const [availableSentences, setAvailableSentences] = useState<string[]>([]);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isBlobUrl, setIsBlobUrl] = useState<boolean>(false);
  
  // Scores storage
  const [exerciseScores, setExerciseScores] = useState<{
    AUDIO_COMPREHENSION: { score: number; total: number; percentage: number };
    DICTATION_EXERCISE: { score: number; total: number; percentage: number };
    DIALOGUE_SEQUENCING: { score: number; total: number; percentage: number };
  }>({
    AUDIO_COMPREHENSION: { score: 0, total: 0, percentage: 0 },
    DICTATION_EXERCISE: { score: 0, total: 10, percentage: 0 },
    DIALOGUE_SEQUENCING: { score: 0, total: 10, percentage: 0 },
  });

  const totalExercises = EXERCISE_SEQUENCE.length;
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch question set when lessonId or exercise type changes
  const { 
    data: questionSetData, 
    isLoading: isLoadingQuestionSet, 
    error: questionSetError,
    refetch: refetchQuestionSet 
  } = useGetLessonQuestionSetQuery(
    { 
      lessonId: lessonId!,
      subCategoryType: currentExerciseType
    },
    { skip: !lessonId }
  );

  // Initialize: Fetch next listening lesson on component mount
  useEffect(() => {
    const fetchListeningLesson = async () => {
      try {
        console.log("Fetching next listening lesson...");
        
        // Call API to get next listening lesson
        const result = await getNextLesson({ type: "LISTENING" }).unwrap();
        
        if (result.success && result.data) {
          const lessonData = result.data as LessonApiResponse['data'];
          console.log("Lesson data received:", lessonData);
          
          // Set lesson ID for question set fetch
          setLessonId(lessonData.id);
        } else {
          setError("Failed to fetch listening lesson");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching listening lesson:", error);
        setError("Error fetching listening content");
        setLoading(false);
      }
    };

    fetchListeningLesson();
  }, [getNextLesson]);

  // Process question set data when it's loaded
  useEffect(() => {
    if (questionSetData && questionSetData.success) {
      console.log("QuestionSet data received:", questionSetData);
      
      const apiData = questionSetData.data as QuestionSetData;
      setListeningData(apiData);
      
      // Process based on subCategoryType
      processExerciseData(apiData);
      
      setLoading(false);
      setAudioError(null);
    }
  }, [questionSetData]);

  // Clean up blob URLs on component unmount or when URL changes
  useEffect(() => {
    return () => {
      if (isBlobUrl && audioUrl) {
        URL.revokeObjectURL(audioUrl);
        console.log("Cleaned up blob URL");
      }
    };
  }, [audioUrl, isBlobUrl]);

  // Function to handle audio generation and playback
  const handlePlayAudio = async () => {
    if (!listeningData) return;

    // Extract text based on exercise type
    let textToConvert = '';
    
    switch (listeningData.subCategoryType) {
      case 'AUDIO_COMPREHENSION':
        const audioContent = listeningData.content as AudioComprehensionContent;
        textToConvert = audioContent.passage;
        break;
      case 'DICTATION_EXERCISE':
        const dictationContent = listeningData.content as DictationExerciseContent;
        textToConvert = dictationContent.dictation;
        break;
      case 'DIALOGUE_SEQUENCING':
        const dialogueContent = listeningData.content as DialogueSequencingContent;
        textToConvert = dialogueContent.dialogue;
        break;
    }

    if (!textToConvert || textToConvert.trim() === '') {
      setAudioError("No text available for audio generation");
      return;
    }

    try {
      setAudioLoading(true);
      setAudioError(null);
      setIsPlaying(false);
      
      // Clean up previous blob URL if it exists
      if (isBlobUrl && audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl("");
      setIsBlobUrl(false);
      
      console.log("Generating audio for text (first 100 chars):", textToConvert.substring(0, 100) + "...");

      // TRY DIRECT API CALL FIRST (play-for-testing)
      console.log("Calling play-for-testing endpoint directly...");
      try {
        const playResult = await playForTestingDirect(textToConvert);
        console.log("Direct API response:", playResult);
        
        if (playResult.success && playResult.audioUrl) {
          setAudioUrl(playResult.audioUrl);
          setIsBlobUrl(playResult.isBlob || false);
          console.log("Audio URL set from direct API call");
        } else if (playResult.audioBase64) {
          // Handle base64 audio
          const base64Audio = `data:audio/mp3;base64,${playResult.audioBase64}`;
          setAudioUrl(base64Audio);
          setIsBlobUrl(false);
          console.log("Base64 audio set");
        } else if (typeof playResult === 'string' && playResult.startsWith('http')) {
          setAudioUrl(playResult);
          setIsBlobUrl(false);
          console.log("Direct URL set");
        } else {
          console.warn("Unexpected response from direct API, trying TTS endpoint...", playResult);
          throw new Error("Invalid response from play-for-testing");
        }
      } catch (directError: any) {
        console.log("Direct API call failed, trying TTS mutation...", directError);
        
        // TRY TTS MUTATION AS FALLBACK
        try {
          const ttsResult = await triggerTTS({ text: textToConvert }).unwrap();
          console.log("TTS mutation response:", ttsResult);
          
          if (ttsResult.success && ttsResult.data?.audioUrl) {
            setAudioUrl(ttsResult.data.audioUrl);
            setIsBlobUrl(false);
          } else if (ttsResult.audioUrl) {
            setAudioUrl(ttsResult.audioUrl);
            setIsBlobUrl(false);
          } else if (ttsResult.audioBase64) {
            const base64Audio = `data:audio/mp3;base64,${ttsResult.audioBase64}`;
            setAudioUrl(base64Audio);
            setIsBlobUrl(false);
          } else {
            throw new Error("No audio URL in TTS response");
          }
        } catch (ttsError: any) {
          console.error("TTS mutation failed:", ttsError);
          throw new Error("Both audio generation methods failed");
        }
      }

      // Wait a bit for the URL to be set, then try to play
      setTimeout(() => {
        if (audioRef.current && audioUrl) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log("Audio started playing");
              })
              .catch((playError) => {
                console.error("Auto-play failed:", playError);
                setAudioError("Audio loaded. Click play button to listen.");
              });
          }
        }
      }, 300);
      
    } catch (error: any) {
      console.error("Error generating audio:", error);
      setAudioError(`Audio generation failed: ${error.message || "Please try again"}`);
      
      // Provide helpful debugging info
      console.log("Full error object:", error);
      if (error.data) {
        console.log("Error data:", error.data);
      }
    } finally {
      setAudioLoading(false);
    }
  };

  // Handle audio events
  const handleAudioPlay = () => {
    setIsPlaying(true);
    setAudioError(null);
  };
  
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);
  
  const handleAudioError = (e: any) => {
    console.error("Audio element error:", e);
    setIsPlaying(false);
    setAudioError("Failed to play audio. Try generating again.");
  };

  // Audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      audioElement.addEventListener('play', handleAudioPlay);
      audioElement.addEventListener('pause', handleAudioPause);
      audioElement.addEventListener('ended', handleAudioEnded);
      audioElement.addEventListener('error', handleAudioError);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('play', handleAudioPlay);
        audioElement.removeEventListener('pause', handleAudioPause);
        audioElement.removeEventListener('ended', handleAudioEnded);
        audioElement.removeEventListener('error', handleAudioError);
      }
    };
  }, []);

  const processExerciseData = (data: QuestionSetData) => {
    // Reset audio state for new exercise
    if (isBlobUrl && audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl("");
    setAudioError(null);
    setIsPlaying(false);
    setIsBlobUrl(false);
    
    switch (data.subCategoryType) {
      case 'AUDIO_COMPREHENSION':
        processAudioComprehension(data);
        break;
      case 'DICTATION_EXERCISE':
        processDictationExercise(data);
        break;
      case 'DIALOGUE_SEQUENCING':
        processDialogueSequencing(data);
        break;
      default:
        setError(`Unsupported subCategoryType: ${data.subCategoryType}`);
    }
  };

  const processAudioComprehension = (data: QuestionSetData) => {
    const content = data.content as AudioComprehensionContent;
    
    // Transform API questions to our format
    const transformedQuestions: Question[] = content.questions.map((q, index) => {
      // Convert answer letter to full answer text
      const answerIndex = q.answer.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
      const correctAnswerText = q.options[answerIndex] || q.answer;
      
      return {
        id: index + 1,
        question: q.question,
        options: q.options,
        selectedAnswer: null,
        correctAnswer: correctAnswerText
      };
    });
    
    setQuestions(transformedQuestions);
    setPhase('questions');
    setCurrentQuestion(0);
    
    // Update exercise scores with total questions
    setExerciseScores(prev => ({
      ...prev,
      AUDIO_COMPREHENSION: {
        ...prev.AUDIO_COMPREHENSION,
        total: transformedQuestions.length
      }
    }));
  };

  const processDictationExercise = (data: QuestionSetData) => {
    setDictationText('');
    setPhase('dictation');
  };

  const processDialogueSequencing = (data: QuestionSetData) => {
    const content = data.content as DialogueSequencingContent;
    setAvailableSentences(content.scrambled);
    setOrderedSentences([]);
    setPhase('sentence');
  };

  // Move to next exercise
  const goToNextExercise = async () => {
    if (currentExerciseIndex < EXERCISE_SEQUENCE.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      const nextExerciseType = EXERCISE_SEQUENCE[nextIndex];
      
      console.log(`Moving to next exercise: ${nextExerciseType}`);
      
      setCurrentExerciseIndex(nextIndex);
      setCurrentExerciseType(nextExerciseType);
      
      // Clear previous state
      if (isBlobUrl && audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl("");
      setAudioError(null);
      setIsPlaying(false);
      setIsBlobUrl(false);
      
      // Refetch with new exercise type
      try {
        await refetchQuestionSet();
      } catch (error) {
        console.error("Error fetching next exercise:", error);
        setError("Failed to load next exercise");
      }
    } else {
      // All exercises completed
      console.log("All exercises completed!");
      setPhase('complete');
    }
  };

  // Handle completion of audio comprehension
  const handleAudioComprehensionComplete = () => {
    // Calculate score for audio comprehension
    const correctCount = questions.filter(q => q.selectedAnswer === q.correctAnswer).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
    setExerciseScores(prev => ({
      ...prev,
      AUDIO_COMPREHENSION: {
        score: correctCount,
        total,
        percentage
      }
    }));
    
    goToNextExercise();
  };

  // Handle completion of dictation exercise
  const handleDictationComplete = () => {
    // Calculate score for dictation (simplified)
    const dictationContent = listeningData?.content as DictationExerciseContent;
    const dictationTextContent = dictationContent?.dictation || '';
    const score = calculateDictationScore(dictationText, dictationTextContent);
    const percentage = score * 10; // Convert to percentage
    
    setExerciseScores(prev => ({
      ...prev,
      DICTATION_EXERCISE: {
        score,
        total: 10,
        percentage
      }
    }));
    
    goToNextExercise();
  };

  // Handle completion of dialogue sequencing
  const handleDialogueSequencingComplete = () => {
    // Calculate score for dialogue sequencing
    const dialogueContent = listeningData?.content as DialogueSequencingContent;
    const correctDialogue = dialogueContent?.dialogue || '';
    const score = calculateSequenceScore(orderedSentences, correctDialogue);
    const percentage = score * 10; // Convert to percentage
    
    setExerciseScores(prev => ({
      ...prev,
      DIALOGUE_SEQUENCING: {
        score,
        total: 10,
        percentage
      }
    }));
    
    goToNextExercise();
  };

  // Question handling
  const handleOptionSelect = (option: string) => {
    const updated = [...questions];
    updated[currentQuestion].selectedAnswer = option;
    setQuestions(updated);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleAudioComprehensionComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Play failed:", err);
        setAudioError("Failed to play audio. Try generating again.");
      });
    }
  };

  // Get exercise title based on current exercise type
  const getExerciseTitle = () => {
    switch (currentExerciseType) {
      case 'AUDIO_COMPREHENSION':
        return 'Audio Comprehension';
      case 'DICTATION_EXERCISE':
        return 'Dictation Exercise';
      case 'DIALOGUE_SEQUENCING':
        return 'Dialogue Sequencing';
      default:
        return 'Listening Practice';
    }
  };

  // Get exercise description
  const getExerciseDescription = () => {
    if (!listeningData) return '';
    
    switch (listeningData.subCategoryType) {
      case 'AUDIO_COMPREHENSION':
        return 'Listen to the audio and answer comprehension questions';
      case 'DICTATION_EXERCISE':
        return 'Listen carefully and write what you hear';
      case 'DIALOGUE_SEQUENCING':
        return 'Arrange the dialogue sentences in correct order';
      default:
        return '';
    }
  };

  // Get passage/dialogue text for display
  const getDisplayText = () => {
    if (!listeningData) return '';
    
    switch (listeningData.subCategoryType) {
      case 'AUDIO_COMPREHENSION':
        const audioContent = listeningData.content as AudioComprehensionContent;
        return audioContent.passage;
      case 'DIALOGUE_SEQUENCING':
        const dialogueContent = listeningData.content as DialogueSequencingContent;
        return dialogueContent.dialogue;
      default:
        return '';
    }
  };

  // Loading state
  if (loading || isLoadingNextLesson || isLoadingQuestionSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {isLoadingNextLesson ? 'Loading listening lesson...' : 
             isLoadingQuestionSet ? 'Loading exercise...' : 
             'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || nextLessonError || questionSetError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <div className="mx-auto p-6">
          <button
            onClick={() => navigate("/user/practice")}
            className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold">Back To Practice</span>
          </button>
          
          <div className="rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-800">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Content</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "Failed to load listening practice"}
            </p>
            <button
              onClick={() => navigate("/user/practice")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!listeningData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <div className="mx-auto p-6">
          <button
            onClick={() => navigate("/user/practice")}
            className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base font-semibold">Back To Practice</span>
          </button>
          
          <div className="rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-800">
            <div className="text-yellow-500 text-5xl mb-4">🔇</div>
            <h2 className="text-xl font-semibold mb-2">No Listening Content Available</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No listening practice content is currently available.
            </p>
            <button
              onClick={() => navigate("/user/practice")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-7xl">
        {phase !== 'complete' && (
          <>
            {/* Back Button */}
            <button
              onClick={() => navigate("/user/practice")}
              className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-base font-semibold">Back To Practice</span>
            </button>

            {/* Header */}
            <Header 
              title="Listening Practice" 
              subtitle="Improve your Italian listening comprehension" 
            />

            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exercise {currentExerciseIndex + 1} of {totalExercises}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getExerciseTitle()}
                </span>
              </div>
              <ProgressBar
                current={currentExerciseIndex + 1}
                total={totalExercises}
                label="Progress"
                color="bg-blue-600"
                height="h-3"
                rounded="rounded-full"
              />
            </div>

            {/* Exercise Info */}
            <ExerciseHeader
              title={getExerciseTitle()}
              icon={lisdteningicon}
              description={getExerciseDescription()}
              showTips={showTips}
              onToggleTips={() => setShowTips(!showTips)}
            />

            {/* Display text for reference (except dictation) */}
            {currentExerciseType !== 'DICTATION_EXERCISE' && getDisplayText() && (
              <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Reference Text:</h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {getDisplayText()}
                </div>
              </div>
            )}

            {/* Audio Player Section */}
            <div className="mb-8">
              {/* Hidden audio element */}
              <audio 
                ref={audioRef} 
                className="hidden"
                controls
                onError={handleAudioError}
              />
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Volume2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Audio Player</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Generate audio from the text below
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Generate Audio Button */}
                    <button
                      onClick={handlePlayAudio}
                      disabled={audioLoading || isLoadingTTS}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        audioLoading || isLoadingTTS
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                      }`}
                    >
                      {audioLoading || isLoadingTTS ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Audio...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          Generate Audio
                        </>
                      )}
                    </button>
                    
                    {/* Play/Pause Button (shows when audio is available) */}
                    {audioUrl && (
                      <button
                        onClick={togglePlayPause}
                        disabled={!audioUrl || audioLoading}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                          !audioUrl || audioLoading
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Status Messages */}
                <div className="space-y-2">
                  {audioError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm">{audioError}</p>
                    </div>
                  )}
                  
                  {audioLoading && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Generating audio from text...
                        </p>
                      </div>
                      <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                        Using: https://cheesuschrusty-ai.onrender.com/audio/play-for-testing
                      </p>
                    </div>
                  )}
                  
                  {audioUrl && !audioError && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-green-400'}`} />
                          <p className="text-green-600 dark:text-green-400 text-sm">
                            {isPlaying ? 'Playing...' : 'Audio ready to play'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {audioUrl.length > 80 ? `${audioUrl.substring(0, 80)}...` : audioUrl}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Text preview for audio generation */}
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Text to be converted to audio:</p>
                  <div className="text-gray-700 dark:text-gray-300 text-sm max-h-32 overflow-y-auto">
                    {(() => {
                      if (!listeningData) return "";
                      switch (listeningData.subCategoryType) {
                        case 'AUDIO_COMPREHENSION':
                          return (listeningData.content as AudioComprehensionContent).passage.substring(0, 300) + "...";
                        case 'DICTATION_EXERCISE':
                          return (listeningData.content as DictationExerciseContent).dictation.substring(0, 300) + "...";
                        case 'DIALOGUE_SEQUENCING':
                          return (listeningData.content as DialogueSequencingContent).dialogue.substring(0, 300) + "...";
                        default:
                          return "";
                      }
                    })()}
                  </div>
                </div>
                
                {/* Audio player component */}
                {audioUrl && (
                  <div className="mt-4">
                    <AudioPlayerComponent 
                      src={audioUrl} 
                      isPlaying={isPlaying}
                      onPlayClick={togglePlayPause}
                    />
                  </div>
                )}
              </div>
              
              {/* Audio Tips */}
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">💡 How to use:</p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 list-disc pl-5 space-y-1">
                  <li>Click "Generate Audio" to convert text to speech</li>
                  <li>Click "Play" to listen to the generated audio</li>
                  <li>Listen carefully multiple times if needed</li>
                  <li>The audio is generated in real-time from your text</li>
                </ul>
              </div>
            </div>

            {/* Current Exercise Content */}
            {currentExerciseType === 'AUDIO_COMPREHENSION' && questions.length > 0 && (
              <div className="rounded-xl mt-8 mb-6">
                <ProgressBar
                  current={currentQuestion + 1}
                  total={questions.length}
                  label="Question"
                  color="bg-black dark:bg-white"
                />

                {/* Question */}
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mt-6 mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-colors cursor-pointer ${
                        questions[currentQuestion].selectedAnswer === option
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900'
                      }`}
                    >
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="ml-2 text-gray-700 dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      className={`px-6 py-3 border-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                        currentQuestion === 0
                          ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      disabled={!questions[currentQuestion].selectedAnswer}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                        !questions[currentQuestion].selectedAnswer
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {currentQuestion === questions.length - 1 ? 'Continue' : 'Next'}
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentExerciseType === 'DICTATION_EXERCISE' && listeningData.subCategoryType === 'DICTATION_EXERCISE' && (
              <ListeningDictation 
                dictationText={(listeningData.content as DictationExerciseContent).dictation}
                userText={dictationText}
                onTextChange={setDictationText}
                continueCallback={handleDictationComplete}
              />
            )}

            {currentExerciseType === 'DIALOGUE_SEQUENCING' && listeningData.subCategoryType === 'DIALOGUE_SEQUENCING' && (
              <SentenceOrdering 
                scrambledSentences={(listeningData.content as DialogueSequencingContent).scrambled}
                correctDialogue={(listeningData.content as DialogueSequencingContent).dialogue}
                orderedSentences={orderedSentences}
                setOrderedSentences={setOrderedSentences}
                availableSentences={availableSentences}
                setAvailableSentences={setAvailableSentences}
                continueCallback={handleDialogueSequencingComplete}
              />
            )}
          </>
        )}

        {phase === 'complete' && (
          <ListeningPracticeComplete 
            exercises={[
              { 
                name: 'Audio Comprehension', 
                score: exerciseScores.AUDIO_COMPREHENSION.score,
                total: exerciseScores.AUDIO_COMPREHENSION.total,
                percentage: exerciseScores.AUDIO_COMPREHENSION.percentage
              },
              { 
                name: 'Dictation Exercise', 
                score: exerciseScores.DICTATION_EXERCISE.score,
                total: exerciseScores.DICTATION_EXERCISE.total,
                percentage: exerciseScores.DICTATION_EXERCISE.percentage
              },
              { 
                name: 'Dialogue Sequencing', 
                score: exerciseScores.DIALOGUE_SEQUENCING.score,
                total: exerciseScores.DIALOGUE_SEQUENCING.total,
                percentage: exerciseScores.DIALOGUE_SEQUENCING.percentage
              }
            ]}
          />
        )}
      </div>
    </div>
  );
};

// Helper functions for scoring
const calculateDictationScore = (userText: string, correctText: string): number => {
  if (!userText || !correctText) return 0;
  
  const userWords = userText.toLowerCase().split(/\s+/);
  const correctWords = correctText.toLowerCase().split(/\s+/);
  
  let correctCount = 0;
  userWords.forEach((word, index) => {
    if (index < correctWords.length && word === correctWords[index]) {
      correctCount++;
    }
  });
  
  return Math.round((correctCount / correctWords.length) * 10);
};

const calculateSequenceScore = (userSequence: string[], correctDialogue: string): number => {
  if (!correctDialogue) return 0;
  
  const correctLines = correctDialogue.split('\n').filter(line => line.trim());
  let correctCount = 0;
  
  userSequence.forEach((sentence, index) => {
    if (index < correctLines.length && sentence.trim() === correctLines[index].trim()) {
      correctCount++;
    }
  });
  
  return Math.round((correctCount / correctLines.length) * 10);
};

export default ListeningPractice;










// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft } from 'lucide-react';
// import ListeningDictation from './ListeningDictation';
// import SentenceOrdering from './SentenceOrdering';
// import ListeningPracticeComplete from './ListeningPracticeComplete';
// import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
// import { AudioPlayerComponent } from './AudioPlayerComponent ';
// import Header from '@/components/Header/Header';
// import ExerciseHeader from '../ExerciseHeader';
// import lisdteningicon from "../../../../assets/Dashbord/microhead.svg";
// import { 
//   useLazyGetNextLessonQuery,
// } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
// import { useGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";

// // Custom TTS function
// const generateTTSAudio = async (text: string): Promise<string | null> => {
//   try {
//     const response = await fetch('https://cheesuschrusty-ai.onrender.com/audio/tts', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
    
//     if (data.success && data.data?.audioUrl) {
//       return data.data.audioUrl;
//     } else {
//       throw new Error(data.message || 'Failed to generate audio');
//     }
//   } catch (err: any) {
//     console.error('TTS error:', err);
//     return null;
//   }
// };

// // Types based on your API response
// interface QuestionOption {
//   answer: string;
//   options: string[];
//   question: string;
// }

// interface AudioComprehensionContent {
//   passage: string;
//   questions: QuestionOption[];
// }

// interface DictationExerciseContent {
//   dictation: string;
// }

// interface DialogueSequencingContent {
//   dialogue: string;
//   scrambled: string[];
// }

// interface QuestionSetData {
//   id: number;
//   lessonId: number;
//   subCategoryType: string;
//   prompt: string;
//   content: AudioComprehensionContent | DictationExerciseContent | DialogueSequencingContent;
//   createdAt: string;
// }

// interface LessonApiResponse {
//   success: boolean;
//   data: {
//     id: number;
//     title: string;
//     type: string;
//     difficulty: string;
//   };
// }

// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   selectedAnswer: string | null;
//   correctAnswer?: string;
// }

// // Exercise types in sequence
// const EXERCISE_SEQUENCE = ['AUDIO_COMPREHENSION', 'DICTATION_EXERCISE', 'DIALOGUE_SEQUENCING'] as const;
// type ExerciseType = typeof EXERCISE_SEQUENCE[number];

// const ListeningPractice: React.FC = () => {
//   const navigate = useNavigate();
  
//   // API hooks
//   const [getNextLesson, { isLoading: isLoadingNextLesson, error: nextLessonError }] = useLazyGetNextLessonQuery();
  
//   // State for API data
//   const [lessonId, setLessonId] = useState<number | null>(null);
//   const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
//   const [currentExerciseType, setCurrentExerciseType] = useState<ExerciseType>('AUDIO_COMPREHENSION');
//   const [listeningData, setListeningData] = useState<QuestionSetData | null>(null);
//   const [audioUrl, setAudioUrl] = useState<string>("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoadingTTS, setIsLoadingTTS] = useState<boolean>(false);
  
//   // Component state
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [phase, setPhase] = useState<'questions' | 'dictation' | 'sentence' | 'complete'>('questions');
//   const [showTips, setShowTips] = useState(true);
//   const [dictationText, setDictationText] = useState('');
//   const [orderedSentences, setOrderedSentences] = useState<string[]>([]);
//   const [availableSentences, setAvailableSentences] = useState<string[]>([]);
  
//   // Scores storage
//   const [exerciseScores, setExerciseScores] = useState<{
//     AUDIO_COMPREHENSION: { score: number; total: number; percentage: number };
//     DICTATION_EXERCISE: { score: number; total: number; percentage: number };
//     DIALOGUE_SEQUENCING: { score: number; total: number; percentage: number };
//   }>({
//     AUDIO_COMPREHENSION: { score: 0, total: 0, percentage: 0 },
//     DICTATION_EXERCISE: { score: 0, total: 10, percentage: 0 },
//     DIALOGUE_SEQUENCING: { score: 0, total: 10, percentage: 0 },
//   });

//   const totalExercises = EXERCISE_SEQUENCE.length;
//   const audioGeneratedRef = useRef<boolean>(false);

//   // Fetch question set when lessonId or exercise type changes
//   const { 
//     data: questionSetData, 
//     isLoading: isLoadingQuestionSet, 
//     error: questionSetError,
//     refetch: refetchQuestionSet 
//   } = useGetLessonQuestionSetQuery(
//     { 
//       lessonId: lessonId!,
//       subCategoryType: currentExerciseType
//     },
//     { skip: !lessonId }
//   );

//   // Initialize: Fetch next listening lesson on component mount
//   useEffect(() => {
//     const fetchListeningLesson = async () => {
//       try {
//         console.log("Fetching next listening lesson...");
        
//         // Call API to get next listening lesson
//         const result = await getNextLesson({ type: "LISTENING" }).unwrap();
        
//         if (result.success && result.data) {
//           const lessonData = result.data as LessonApiResponse['data'];
//           console.log("Lesson data received:", lessonData);
          
//           // Set lesson ID for question set fetch
//           setLessonId(lessonData.id);
//         } else {
//           setError("Failed to fetch listening lesson");
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching listening lesson:", error);
//         setError("Error fetching listening content");
//         setLoading(false);
//       }
//     };

//     fetchListeningLesson();
//   }, [getNextLesson]);

//   // Process question set data when it's loaded
//   useEffect(() => {
//     if (questionSetData && questionSetData.success) {
//       console.log("QuestionSet data received:", questionSetData);
      
//       const apiData = questionSetData.data as QuestionSetData;
//       setListeningData(apiData);
      
//       // Process based on subCategoryType
//       processExerciseData(apiData);
      
//       setLoading(false);
//     }
//   }, [questionSetData]);

//   // Generate TTS audio when we have text
//   useEffect(() => {
//     const generateAudio = async () => {
//       if (!listeningData || audioGeneratedRef.current) return;

//       let textToConvert = '';
      
//       // Extract text based on subCategoryType
//       switch (listeningData.subCategoryType) {
//         case 'AUDIO_COMPREHENSION':
//           const audioContent = listeningData.content as AudioComprehensionContent;
//           textToConvert = audioContent.passage;
//           break;
//         case 'DICTATION_EXERCISE':
//           const dictationContent = listeningData.content as DictationExerciseContent;
//           textToConvert = dictationContent.dictation;
//           break;
//         case 'DIALOGUE_SEQUENCING':
//           const dialogueContent = listeningData.content as DialogueSequencingContent;
//           textToConvert = dialogueContent.dialogue;
//           break;
//       }

//       if (textToConvert) {
//         try {
//           console.log("Generating TTS for text:", textToConvert.substring(0, 100) + "...");
//           setIsLoadingTTS(true);
//           const audioUrl = await generateTTSAudio(textToConvert);
          
//           if (audioUrl) {
//             setAudioUrl(audioUrl);
//             audioGeneratedRef.current = true;
//             console.log("TTS audio generated:", audioUrl);
//           } else {
//             console.error("TTS API returned no audio URL");
//             // Fallback
//             setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
//           }
//         } catch (error: any) {
//           console.error("Error generating TTS audio:", error);
//           // Fallback audio
//           setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
//         } finally {
//           setIsLoadingTTS(false);
//         }
//       }
//     };

//     generateAudio();
//   }, [listeningData]);

//   const processExerciseData = (data: QuestionSetData) => {
//     // Reset audio generated flag for new exercise
//     audioGeneratedRef.current = false;
    
//     switch (data.subCategoryType) {
//       case 'AUDIO_COMPREHENSION':
//         processAudioComprehension(data);
//         break;
//       case 'DICTATION_EXERCISE':
//         processDictationExercise(data);
//         break;
//       case 'DIALOGUE_SEQUENCING':
//         processDialogueSequencing(data);
//         break;
//       default:
//         setError(`Unsupported subCategoryType: ${data.subCategoryType}`);
//     }
//   };

//   const processAudioComprehension = (data: QuestionSetData) => {
//     const content = data.content as AudioComprehensionContent;
    
//     // Transform API questions to our format
//     const transformedQuestions: Question[] = content.questions.map((q, index) => {
//       // Convert answer letter to full answer text
//       const answerIndex = q.answer.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
//       const correctAnswerText = q.options[answerIndex] || q.answer;
      
//       return {
//         id: index + 1,
//         question: q.question,
//         options: q.options,
//         selectedAnswer: null,
//         correctAnswer: correctAnswerText
//       };
//     });
    
//     setQuestions(transformedQuestions);
//     setPhase('questions');
//     setCurrentQuestion(0);
    
//     // Update exercise scores with total questions
//     setExerciseScores(prev => ({
//       ...prev,
//       AUDIO_COMPREHENSION: {
//         ...prev.AUDIO_COMPREHENSION,
//         total: transformedQuestions.length
//       }
//     }));
//   };

//   const processDictationExercise = (data: QuestionSetData) => {
//     const content = data.content as DictationExerciseContent;
//     setDictationText('');
//     setPhase('dictation');
//   };

//   const processDialogueSequencing = (data: QuestionSetData) => {
//     const content = data.content as DialogueSequencingContent;
//     setAvailableSentences(content.scrambled);
//     setOrderedSentences([]);
//     setPhase('sentence');
//   };

//   // Move to next exercise
//   const goToNextExercise = async () => {
//     if (currentExerciseIndex < EXERCISE_SEQUENCE.length - 1) {
//       const nextIndex = currentExerciseIndex + 1;
//       const nextExerciseType = EXERCISE_SEQUENCE[nextIndex];
      
//       console.log(`Moving to next exercise: ${nextExerciseType}`);
      
//       setCurrentExerciseIndex(nextIndex);
//       setCurrentExerciseType(nextExerciseType);
      
//       // Clear previous state
//       setAudioUrl("");
//       setAudioUrl(""); // Clear audio URL
      
//       // Refetch with new exercise type
//       try {
//         await refetchQuestionSet();
//       } catch (error) {
//         console.error("Error fetching next exercise:", error);
//         setError("Failed to load next exercise");
//       }
//     } else {
//       // All exercises completed
//       console.log("All exercises completed!");
//       setPhase('complete');
//     }
//   };

//   // Handle completion of audio comprehension
//   const handleAudioComprehensionComplete = () => {
//     // Calculate score for audio comprehension
//     const correctCount = questions.filter(q => q.selectedAnswer === q.correctAnswer).length;
//     const total = questions.length;
//     const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
//     setExerciseScores(prev => ({
//       ...prev,
//       AUDIO_COMPREHENSION: {
//         score: correctCount,
//         total,
//         percentage
//       }
//     }));
    
//     goToNextExercise();
//   };

//   // Handle completion of dictation exercise
//   const handleDictationComplete = () => {
//     // Calculate score for dictation (simplified)
//     const dictationContent = listeningData?.content as DictationExerciseContent;
//     const dictationTextContent = dictationContent?.dictation || '';
//     const score = calculateDictationScore(dictationText, dictationTextContent);
//     const percentage = score * 10; // Convert to percentage
    
//     setExerciseScores(prev => ({
//       ...prev,
//       DICTATION_EXERCISE: {
//         score,
//         total: 10,
//         percentage
//       }
//     }));
    
//     goToNextExercise();
//   };

//   // Handle completion of dialogue sequencing
//   const handleDialogueSequencingComplete = () => {
//     // Calculate score for dialogue sequencing
//     const dialogueContent = listeningData?.content as DialogueSequencingContent;
//     const correctDialogue = dialogueContent?.dialogue || '';
//     const score = calculateSequenceScore(orderedSentences, correctDialogue);
//     const percentage = score * 10; // Convert to percentage
    
//     setExerciseScores(prev => ({
//       ...prev,
//       DIALOGUE_SEQUENCING: {
//         score,
//         total: 10,
//         percentage
//       }
//     }));
    
//     goToNextExercise();
//   };

//   // Question handling
//   const handleOptionSelect = (option: string) => {
//     const updated = [...questions];
//     updated[currentQuestion].selectedAnswer = option;
//     setQuestions(updated);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       handleAudioComprehensionComplete();
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
//   };

//   // Get exercise title based on current exercise type
//   const getExerciseTitle = () => {
//     switch (currentExerciseType) {
//       case 'AUDIO_COMPREHENSION':
//         return 'Audio Comprehension';
//       case 'DICTATION_EXERCISE':
//         return 'Dictation Exercise';
//       case 'DIALOGUE_SEQUENCING':
//         return 'Dialogue Sequencing';
//       default:
//         return 'Listening Practice';
//     }
//   };

//   // Get exercise description
//   const getExerciseDescription = () => {
//     if (!listeningData) return '';
    
//     switch (listeningData.subCategoryType) {
//       case 'AUDIO_COMPREHENSION':
//         return 'Listen to the audio and answer comprehension questions';
//       case 'DICTATION_EXERCISE':
//         return 'Listen carefully and write what you hear';
//       case 'DIALOGUE_SEQUENCING':
//         return 'Arrange the dialogue sentences in correct order';
//       default:
//         return '';
//     }
//   };

//   // Get passage/dialogue text for display
//   const getDisplayText = () => {
//     if (!listeningData) return '';
    
//     switch (listeningData.subCategoryType) {
//       case 'AUDIO_COMPREHENSION':
//         const audioContent = listeningData.content as AudioComprehensionContent;
//         return audioContent.passage;
//       case 'DIALOGUE_SEQUENCING':
//         const dialogueContent = listeningData.content as DialogueSequencingContent;
//         return dialogueContent.dialogue;
//       default:
//         return '';
//     }
//   };

//   // Loading state
//   if (loading || isLoadingNextLesson || isLoadingQuestionSet) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-300">
//             {isLoadingNextLesson ? 'Loading listening lesson...' : 
//              isLoadingQuestionSet ? 'Loading exercise...' : 
//              'Loading...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || nextLessonError || questionSetError) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
//         <div className="mx-auto p-6">
//           <button
//             onClick={() => navigate("/user/practice")}
//             className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
//           >
//             <ChevronLeft className="w-6 h-6" />
//             <span className="text-base font-semibold">Back To Practice</span>
//           </button>
          
//           <div className="rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-800">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-xl font-semibold mb-2">Unable to Load Content</h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               {error || "Failed to load listening practice"}
//             </p>
//             <button
//               onClick={() => navigate("/user/practice")}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Return to Practice
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No data state
//   if (!listeningData) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
//         <div className="mx-auto p-6">
//           <button
//             onClick={() => navigate("/user/practice")}
//             className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
//           >
//             <ChevronLeft className="w-6 h-6" />
//             <span className="text-base font-semibold">Back To Practice</span>
//           </button>
          
//           <div className="rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-800">
//             <div className="text-yellow-500 text-5xl mb-4">🔇</div>
//             <h2 className="text-xl font-semibold mb-2">No Listening Content Available</h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               No listening practice content is currently available.
//             </p>
//             <button
//               onClick={() => navigate("/user/practice")}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Return to Practice
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
//       <div className="mx-auto max-w-7xl">
//         {phase !== 'complete' && (
//           <>
//             {/* Back Button */}
//             <button
//               onClick={() => navigate("/user/practice")}
//               className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-6"
//             >
//               <ChevronLeft className="w-6 h-6" />
//               <span className="text-base font-semibold">Back To Practice</span>
//             </button>

//             {/* Header */}
//             <Header 
//               title="Listening Practice" 
//               subtitle="Improve your Italian listening comprehension" 
//             />

//             {/* Progress indicator */}
//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Exercise {currentExerciseIndex + 1} of {totalExercises}
//                 </span>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">
//                   {getExerciseTitle()}
//                 </span>
//               </div>
//               <ProgressBar
//                 current={currentExerciseIndex + 1}
//                 total={totalExercises}
//                 label="Progress"
//                 color="bg-blue-600"
//                 height="h-3"
//                 rounded="rounded-full"
//               />
//             </div>

//             {/* Exercise Info */}
//             <ExerciseHeader
//               title={getExerciseTitle()}
//               icon={lisdteningicon}
//               description={getExerciseDescription()}
//               showTips={showTips}
//               onToggleTips={() => setShowTips(!showTips)}
//             />

//             {/* Display text for reference (except dictation) */}
//             {currentExerciseType !== 'DICTATION_EXERCISE' && getDisplayText() && (
//               <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                 <h3 className="font-semibold mb-2">Reference Text:</h3>
//                 <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                   {getDisplayText()}
//                 </div>
//               </div>
//             )}

//             {/* Audio Player */}
//             {audioUrl ? (
//               <AudioPlayerComponent src={audioUrl} />
//             ) : (
//               <div className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
//                 <p className="text-gray-600 dark:text-gray-300">
//                   {isLoadingTTS ? 'Generating audio...' : 'Audio will be available shortly'}
//                 </p>
//                 {isLoadingTTS && (
//                   <div className="mt-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Current Exercise Content */}
//             {currentExerciseType === 'AUDIO_COMPREHENSION' && questions.length > 0 && (
//               <div className="rounded-xl mt-8 mb-6">
//                 <ProgressBar
//                   current={currentQuestion + 1}
//                   total={questions.length}
//                   label="Question"
//                   color="bg-black dark:bg-white"
//                 />

//                 {/* Question */}
//                 <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mt-6 mb-4">
//                   <h3 className="font-medium text-gray-900 dark:text-gray-100">
//                     {questions[currentQuestion].question}
//                   </h3>
//                 </div>

//                 {/* Options */}
//                 <div className="space-y-3 mb-6">
//                   {questions[currentQuestion].options.map((option, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => handleOptionSelect(option)}
//                       className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-colors cursor-pointer ${
//                         questions[currentQuestion].selectedAnswer === option
//                           ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400'
//                           : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900'
//                       }`}
//                     >
//                       <span className="font-semibold text-gray-900 dark:text-gray-100">
//                         {String.fromCharCode(65 + idx)}.
//                       </span>
//                       <span className="ml-2 text-gray-700 dark:text-gray-200">{option}</span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Navigation */}
//                 <div className="flex flex-col items-center gap-2">
//                   <div className="flex justify-center gap-6">
//                     <button
//                       onClick={handlePreviousQuestion}
//                       disabled={currentQuestion === 0}
//                       className={`px-6 py-3 border-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
//                         currentQuestion === 0
//                           ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
//                       }`}
//                     >
//                       <ChevronLeft className="w-4 h-4" /> Previous
//                     </button>

//                     <button
//                       onClick={handleNextQuestion}
//                       disabled={!questions[currentQuestion].selectedAnswer}
//                       className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
//                         !questions[currentQuestion].selectedAnswer
//                           ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                           : 'bg-blue-600 hover:bg-blue-700 text-white'
//                       }`}
//                     >
//                       {currentQuestion === questions.length - 1 ? 'Continue' : 'Next'}
//                       <ChevronLeft className="w-4 h-4 rotate-180" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentExerciseType === 'DICTATION_EXERCISE' && listeningData.subCategoryType === 'DICTATION_EXERCISE' && (
//               <ListeningDictation 
//                 dictationText={(listeningData.content as DictationExerciseContent).dictation}
//                 userText={dictationText}
//                 onTextChange={setDictationText}
//                 continueCallback={handleDictationComplete}
//               />
//             )}

//             {currentExerciseType === 'DIALOGUE_SEQUENCING' && listeningData.subCategoryType === 'DIALOGUE_SEQUENCING' && (
//               <SentenceOrdering 
//                 scrambledSentences={(listeningData.content as DialogueSequencingContent).scrambled}
//                 correctDialogue={(listeningData.content as DialogueSequencingContent).dialogue}
//                 orderedSentences={orderedSentences}
//                 setOrderedSentences={setOrderedSentences}
//                 availableSentences={availableSentences}
//                 setAvailableSentences={setAvailableSentences}
//                 continueCallback={handleDialogueSequencingComplete}
//               />
//             )}
//           </>
//         )}

//         {phase === 'complete' && (
//           <ListeningPracticeComplete 
//             exercises={[
//               { 
//                 name: 'Audio Comprehension', 
//                 score: exerciseScores.AUDIO_COMPREHENSION.score,
//                 total: exerciseScores.AUDIO_COMPREHENSION.total,
//                 percentage: exerciseScores.AUDIO_COMPREHENSION.percentage
//               },
//               { 
//                 name: 'Dictation Exercise', 
//                 score: exerciseScores.DICTATION_EXERCISE.score,
//                 total: exerciseScores.DICTATION_EXERCISE.total,
//                 percentage: exerciseScores.DICTATION_EXERCISE.percentage
//               },
//               { 
//                 name: 'Dialogue Sequencing', 
//                 score: exerciseScores.DIALOGUE_SEQUENCING.score,
//                 total: exerciseScores.DIALOGUE_SEQUENCING.total,
//                 percentage: exerciseScores.DIALOGUE_SEQUENCING.percentage
//               }
//             ]}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// // Helper functions for scoring
// const calculateDictationScore = (userText: string, correctText: string): number => {
//   if (!userText || !correctText) return 0;
  
//   const userWords = userText.toLowerCase().split(/\s+/);
//   const correctWords = correctText.toLowerCase().split(/\s+/);
  
//   let correctCount = 0;
//   userWords.forEach((word, index) => {
//     if (index < correctWords.length && word === correctWords[index]) {
//       correctCount++;
//     }
//   });
  
//   return Math.round((correctCount / correctWords.length) * 10);
// };

// const calculateSequenceScore = (userSequence: string[], correctDialogue: string): number => {
//   if (!correctDialogue) return 0;
  
//   const correctLines = correctDialogue.split('\n').filter(line => line.trim());
//   let correctCount = 0;
  
//   userSequence.forEach((sentence, index) => {
//     if (index < correctLines.length && sentence.trim() === correctLines[index].trim()) {
//       correctCount++;
//     }
//   });
  
//   return Math.round((correctCount / correctLines.length) * 10);
// };

// export default ListeningPractice;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft } from 'lucide-react';
// import ListeningDictation from './ListeningDictation';
// import SentenceOrdering from './SentenceOrdering';
// import ListeningPracticeComplete from './ListeningPracticeComplete';
// import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
// import { AudioPlayerComponent } from './AudioPlayerComponent ';
// import Header from '@/components/Header/Header';
// import ExerciseHeader from '../ExerciseHeader';
// import lisdteningicon from "../../../../assets/Dashbord/microhead.svg";
// import audioFile from '../../../../assets/videoplayback_2.m4a';
// // Define props interface
// interface ListeningPracticeProps {
//   continueCallback?: () => void; // optional if needed
// }

// // Define question type
// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   selectedAnswer: string | null;
// }

// const ListeningPractice: React.FC<ListeningPracticeProps> = ({ continueCallback }) => {
//   const navigate = useNavigate();
//   // const audioSrc = "/videoplayback_2.m4a"; // correct
 
//   const [questions, setQuestions] = useState<Question[]>([
//     { id: 1, question: "Che cosa ordina Marco?", options: ["Un cappuccino", "Un caffè", "Un cornetto", "Un tè"], selectedAnswer: null },
//     { id: 2, question: "Dove si svolge la conversazione?", options: ["In un ristorante", "In un bar", "In una pizzeria", "In un supermercato"], selectedAnswer: null },
//     { id: 3, question: "A che ora è l'appuntamento di Marco?", options: ["Alle 9:00", "Alle 10:00", "Alle 11:00", "Alle 12:00"], selectedAnswer: null },
//     { id: 4, question: "Con chi ha l'appuntamento Marco?", options: ["Con il suo capo", "Con un amico", "Con un cliente", "Con sua sorella"], selectedAnswer: null },
//     { id: 5, question: "Quanto costa il caffè?", options: ["1 euro", "1.50 euro", "2 euro", "2.50 euro"], selectedAnswer: null },
//   ]);

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [phase, setPhase] = useState<'questions' | 'dictation' | 'sentence' | 'complete'>('questions');
//   const [showTips, setShowTips] = useState(true);
//   const [currentExercise, setCurrentExercise] = useState(1);
//   const totalExercises = 3;

//   const handleOptionSelect = (option: string) => {
//     const updated = [...questions];
//     updated[currentQuestion].selectedAnswer = option;
//     setQuestions(updated);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       setPhase('dictation');
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
//   };

//   const handleDictationContinue = () => {
//     setPhase('sentence');
//     setCurrentExercise(currentExercise + 1);
//   };

//   const handleSentenceComplete = () => {
//     setPhase('complete');
//     setCurrentExercise(currentExercise + 1);
//     continueCallback?.(); // call parent callback if provided
//   };

//   return (
//    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
//   <div className="mx-auto">
//     {phase !== 'complete' && (
//       <>
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/user/practice")}
//           className="flex border p-3 cursor-pointer rounded-2xl items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white mb-4"
//         >
//           <ChevronLeft className="w-6 h-6" />
//           <span className="text-base font-semibold">Back To Practice</span>
//         </button>

//         {/* Header */}
//         <Header title="Listening Practice" subtitle="Improve your Italian listening comprehension" />

//         <ExerciseHeader
//           title="Short Essay"
//           icon={lisdteningicon}
//           description="Write a short paragraph about the given topic."
//           progressLabel={`Exercise ${currentExercise}/${totalExercises}`}
//           showTips={showTips}
//           onToggleTips={() => setShowTips(!showTips)}
//         />

//         {/* Audio Player */}
//         <AudioPlayerComponent src={audioFile} />

//         {phase === 'questions' && (
//           <div className="rounded-xl mt-8 mb-6">
//             <ProgressBar
//               current={currentQuestion + 1}
//               total={questions.length}
//               label="Question"
//               color="bg-black dark:bg-white"
//             />

//             {/* Question */}
//             <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mt-6 mb-4">
//               <h3 className="font-medium text-gray-900 dark:text-gray-100">{questions[currentQuestion].question}</h3>
//             </div>

//             {/* Options */}
//             <div className="space-y-3 mb-6">
//               {questions[currentQuestion].options.map((option, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => handleOptionSelect(option)}
//                   className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-colors cursor-pointer ${
//                     questions[currentQuestion].selectedAnswer === option
//                       ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400'
//                       : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900'
//                   }`}
//                 >
//                   <span className="font-semibold text-gray-900 dark:text-gray-100">{String.fromCharCode(65 + idx)}.</span>
//                   <span className="ml-2 text-gray-700 dark:text-gray-200">{option}</span>
//                 </button>
//               ))}
//             </div>

//             {/* Navigation */}
//             <div className="flex flex-col items-center gap-2">
//               <div className="flex justify-center gap-6">
//                 <button
//                   onClick={handlePreviousQuestion}
//                   disabled={currentQuestion === 0}
//                   className={`px-6 py-3 border-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
//                     currentQuestion === 0
//                       ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
//                       : 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
//                   }`}
//                 >
//                   <ChevronLeft className="w-4 h-4" /> Previous
//                 </button>

//                 <button
//                   onClick={handleNextQuestion}
//                   disabled={!questions[currentQuestion].selectedAnswer}
//                   className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
//                     !questions[currentQuestion].selectedAnswer
//                       ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 text-white'
//                   }`}
//                 >
//                   {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
//                   <ChevronLeft className="w-4 h-4 rotate-180" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {phase === 'dictation' && (
//           <ListeningDictation continueCallback={handleDictationContinue} />
//         )}

//         {phase === 'sentence' && (
//           <SentenceOrdering continueCallback={handleSentenceComplete} />
//         )}
//       </>
//     )}

//     {phase === 'complete' && <ListeningPracticeComplete />}
//   </div>
// </div>

//   );
// };

// export default ListeningPractice;
