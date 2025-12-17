 import  { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, X, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { 
  useCreateLessonMutation, 
  useDeleteLessonMutation, 
  useGetAllLessonsQuery, 
  useGetLessonByIdQuery 
} from '@/redux/features/lesson/lessonContent/lessonContentApi';
import { useNavigate } from 'react-router-dom';
import { 
  useUpsertLessonQuestionSetMutation, 
} from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';

// Enums
const LessonType = {
  READING: 'READING',
  WRITING: 'WRITING',
  LISTENING: 'LISTENING',
  SPEAKING: 'SPEAKING'
};

const AIProvider = {
  OPEN_AI: 'OPENAI',
  GROK: 'GROK'
};

const SubCategoryType = {
  // Reading
  MAIN_PASSAGE: 'MAIN_PASSAGE',
  // Listening
  DIALOGUE_SEQUENCING: 'DIALOGUE_SEQUENCING',
  DICTATION_EXERCISE: 'DICTATION_EXERCISE',
  AUDIO_COMPREHENSION: 'AUDIO_COMPREHENSION',
  // Writing
  GRAMMAR_PRACTICE: 'GRAMMAR_PRACTICE',
  COMPLETE_THE_SENTENCES: 'COMPLETE_THE_SENTENCES',
  SHORT_ESSAY: 'SHORT_ESSAY',
  // Speaking
  READING_ALOUD: 'READING_ALOUD',
  CONVERSATION_PRACTICE: 'CONVERSATION_PRACTICE',
  PRONUNCIATION_PRACTICE: 'PRONUNCIATION_PRACTICE'
};

// API endpoint mappings
const API_ENDPOINTS = {
  READING: {
    endpoint: '/ai/admin/generate/reading-comprehension/',
    fieldName: 'content'
  },
  LISTENING: {
    endpoint: '/ai/admin/generate/listening-comprehension/',
    fieldName: 'content'
  },
  WRITING: {
    endpoint: '/ai/admin/generate/ai/generate/',
    fieldName: 'content'
  },
  SPEAKING: {
    endpoint: '/ai/admin/generate/speaking-practice/',
    fieldName: 'content'
  }
};

// Type mappings for different endpoints
const getTypeMapping = (subCategory, lessonType) => {
  const mappings = {
    // Listening types
    AUDIO_COMPREHENSION: 'audio-comprehension',
    DICTATION_EXERCISE: 'dictation-exercise',
    DIALOGUE_SEQUENCING: 'dialog-sequencing',
    
    // Writing types
    GRAMMAR_PRACTICE: 'grammar_practice',
    COMPLETE_THE_SENTENCES: 'sentence_completion',
    SHORT_ESSAY: 'short_essay',
    
    // Speaking types
    READING_ALOUD: 'reading-aloud',
    CONVERSATION_PRACTICE: 'conversation-practice',
    PRONUNCIATION_PRACTICE: 'pronunciation-practice',
    
    // Reading type
    MAIN_PASSAGE: 'main-passage'
  };
  
  return mappings[subCategory] || subCategory.toLowerCase().replace(/_/g, '-');
};

// Provider mappings
const getProviderMapping = (provider) => {
  return provider === AIProvider.OPEN_AI ? 'openai' : 'grok';
};

const Lessons = () => {
  const navigate = useNavigate();
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLessonType, setSelectedLessonType] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedAIModel, setSelectedAIModel] = useState(AIProvider.OPEN_AI);
  const [currentSubCategory, setCurrentSubCategory] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSubCategories, setCompletedSubCategories] = useState([]);
  const [createdLessonId, setCreatedLessonId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ 
    isOpen: false, 
    lessonId: null, 
    lessonTitle: '' 
  });

  // API hooks
  const [createLesson, { isLoading: isCreatingLessonApi }] = useCreateLessonMutation();
  const [upsertLessonQuestionSet, { isLoading: isSavingQuestionSet }] = useUpsertLessonQuestionSetMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const { data: lessonsData, refetch: refetchLessons } = useGetAllLessonsQuery({});
  const { data: lessonDetails, isLoading: isLoadingDetails } = useGetLessonByIdQuery(
    selectedLesson?.id, 
    { skip: !selectedLesson?.id }
  );

  // View Details Function
  const handleViewDetails = async (lesson) => {
    try {
      setSelectedLesson(lesson);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading lesson details:', error);
      alert('Failed to load lesson details');
    }
  };

  // Close Modal Function
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  // Delete Lesson Functions
  const handleDeleteLesson = (lessonId, lessonTitle) => {
    setDeleteConfirmation({ 
      isOpen: true, 
      lessonId, 
      lessonTitle 
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.lessonId) return;
    
    try {
      await deleteLesson(deleteConfirmation.lessonId).unwrap();
      // alert(`Lesson "${deleteConfirmation.lessonTitle}" deleted successfully! ,${deleteConfirmation.length}` );
      refetchLessons();
      setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert(`Failed to delete lesson: ${error?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
  };

  // Get subcategories based on lesson type
  const getSubCategories = (lessonType) => {
    switch (lessonType) {
      case LessonType.READING:
        return [{ key: 'MAIN_PASSAGE', label: 'Main Passage', exercise: '1/1' }];
      case LessonType.LISTENING:
        return [
          { key: 'AUDIO_COMPREHENSION', label: 'Audio Comprehension', exercise: '1/3' },
          { key: 'DICTATION_EXERCISE', label: 'Dictation Exercise', exercise: '2/3' },
          { key: 'DIALOGUE_SEQUENCING', label: 'Dialogue Sequencing', exercise: '3/3' }
        ];
      case LessonType.WRITING:
        return [
          { key: 'GRAMMAR_PRACTICE', label: 'Grammar Practice', exercise: '1/3' },
          { key: 'COMPLETE_THE_SENTENCES', label: 'Complete the Sentences', exercise: '2/3' },
          { key: 'SHORT_ESSAY', label: 'Short Essay', exercise: '3/3' }
        ];
      case LessonType.SPEAKING:
        return [
          { key: 'READING_ALOUD', label: 'Reading Aloud', exercise: '1/3' },
          { key: 'CONVERSATION_PRACTICE', label: 'Conversation Practice', exercise: '2/3' },
          { key: 'PRONUNCIATION_PRACTICE', label: 'Pronunciation Practice', exercise: '3/3' }
        ];
      default:
        return [];
    }
  };

  const subCategories = getSubCategories(selectedLessonType);
  const currentSubCategoryIndex = subCategories.findIndex(s => s.key === currentSubCategory);

  useEffect(() => {
    // Reset generation states when changing subcategory
    setGeneratedContent('');
    setApiError(null);
    setGenerationSuccess(false);
  }, [currentSubCategory]);

  const handleCreateLesson = () => {
    setIsCreatingLesson(true);
    setCurrentStep(1);
    setSelectedLessonType('');
    setLessonTitle('');
    setSelectedAIModel(AIProvider.OPEN_AI);
    setCurrentSubCategory('');
    setPrompt('');
    setGeneratedContent('');
    setCompletedSubCategories([]);
    setCreatedLessonId(null);
    setApiError(null);
    setGenerationSuccess(false);
  };

  const handleCancelCreate = () => {
    setIsCreatingLesson(false);
    setCurrentStep(1);
    setSelectedLessonType('');
    setLessonTitle('');
    setSelectedAIModel(AIProvider.OPEN_AI);
    setCurrentSubCategory('');
    setPrompt('');
    setGeneratedContent('');
    setCompletedSubCategories([]);
    setCreatedLessonId(null);
    setApiError(null);
    setGenerationSuccess(false);
  };

  const handleTitleNext = async () => {
    if (!selectedLessonType || !lessonTitle || !selectedAIModel) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const lessonData = {
        title: lessonTitle,
        type: selectedLessonType,
        provider: selectedAIModel
      };

      const response = await createLesson(lessonData).unwrap();
      if (response.data && response.data.id) {
        setCreatedLessonId(response.data.id);
      }

      const subCats = getSubCategories(selectedLessonType);
      if (subCats.length > 0) {
        setCurrentSubCategory(subCats[0].key);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert(`Failed to create lesson: ${error?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleGenerateQuestion = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setApiError(null);
    setGenerationSuccess(false);
    
    try {
      // Get API configuration based on lesson type
      const apiConfig = API_ENDPOINTS[selectedLessonType];
      if (!apiConfig) {
        throw new Error(`No API configuration found for lesson type: ${selectedLessonType}`);
      }

      // Prepare request body based on endpoint type
      let requestBody = {
        provider: getProviderMapping(selectedAIModel),
        prompt: prompt.trim()
      };

      // Add type field for specific endpoints
      if (selectedLessonType === LessonType.LISTENING || 
          selectedLessonType === LessonType.WRITING || 
          selectedLessonType === LessonType.SPEAKING) {
        requestBody.type = getTypeMapping(currentSubCategory, selectedLessonType);
      }

      // Add difficulty for speaking practice
      if (selectedLessonType === LessonType.SPEAKING) {
        requestBody.difficulty = 'beginner';
      }

      console.log('Generating content with:', {
        endpoint: apiConfig.endpoint,
        body: requestBody
      });

      // Call the appropriate AI API
      const response = await fetch(
        `https://cheesuschrusty-ai.onrender.com${apiConfig.endpoint}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || `API Error: ${response.status}`);
      }

      let result = await response.json();
      
      console.log('Raw API response:', result);
      
      // FIX: If the API returns a string that looks like JSON, parse it
      if (typeof result === 'string') {
        console.log('API returned string, trying to parse as JSON...');
        try {
          // Clean the string first
          const cleanString = result
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/^"|"$/g, ''); // Remove surrounding quotes if present
          
          result = JSON.parse(cleanString);
          console.log('Successfully parsed string to object:', result);
        } catch (parseError) {
          console.error('Failed to parse string as JSON:', parseError);
          // If it's not JSON, wrap it in a structure
          result = {
            text: result,
            type: currentSubCategory,
            generatedAt: new Date().toISOString()
          };
        }
      }
      
      // Ensure we have a proper object
      if (typeof result !== 'object' || result === null) {
        result = { text: String(result) };
      }
      
      setGeneratedContent(result);
      setGenerationSuccess(true);
      
    } catch (error) {
      console.error('Error generating content:', error);
      setApiError(error.message);
      alert(`Failed to generate content: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextSubCategory = async () => {
    if (!generatedContent) {
      alert('Please generate content before proceeding');
      return;
    }

    if (!createdLessonId || !currentSubCategory) {
      alert('Missing required data to save the question set');
      return;
    }

    try {
      // Parse and structure the content properly
      let structuredContent;
      
      console.log('Generated content type:', typeof generatedContent);
      console.log('Generated content:', generatedContent);
      
      if (typeof generatedContent === 'string') {
        try {
          // Try to parse as JSON - remove any extra backslashes first
          const cleanContent = generatedContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          structuredContent = JSON.parse(cleanContent);
          console.log('Successfully parsed JSON');
        } catch (e) {
          console.error('JSON parse error:', e);
          console.log('Content that failed to parse:', generatedContent);
          
          // If it's not valid JSON, create a structured object based on subcategory
          structuredContent = createStructuredContent(generatedContent, currentSubCategory);
        }
      } else {
        // Already an object
        structuredContent = generatedContent;
      }
      
      // Ensure content is a proper object
      if (!structuredContent || typeof structuredContent !== 'object') {
        console.error('Content is not an object:', structuredContent);
        alert('Generated content must be in a valid object format. Please regenerate.');
        return;
      }

      // Prepare the request payload
      const payload = {
        lessonId: createdLessonId,
        subCategoryType: currentSubCategory,
        prompt: prompt || `Generated ${subCategories[currentSubCategoryIndex]?.label} content`,
        content: structuredContent
      };

      console.log('Final payload:', payload);

      // Call the upsert API
      const response = await upsertLessonQuestionSet(payload).unwrap();

      console.log('Save successful:', response);

      // Mark as completed
      if (!completedSubCategories.includes(currentSubCategory)) {
        setCompletedSubCategories([...completedSubCategories, currentSubCategory]);
      }

      // Move to next subcategory or complete
      if (currentSubCategoryIndex < subCategories.length - 1) {
        // Save current state before moving to next
        const currentPrompt = prompt;
        const currentGeneratedContent = generatedContent;
        const currentSubCat = currentSubCategory;
        
        // Clear for next step
        setPrompt('');
        setGeneratedContent('');
        setApiError(null);
        setGenerationSuccess(false);
        
        // Move to next category
        const nextCategory = subCategories[currentSubCategoryIndex + 1].key;
        setCurrentSubCategory(nextCategory);
        
        // Show success message
        alert(`✅ ${subCategories[currentSubCategoryIndex]?.label} saved successfully! Moving to next exercise...`);
        
      } else {
        // All subcategories completed
        alert(`✅ All exercises completed! Lesson "${lessonTitle}" has been created successfully!`);
        handleCancelCreate();
      }

    } catch (error) {
      console.error('Save failed:', error);
      
      // More detailed error handling
      if (error?.data?.message) {
        const errorMsg = Array.isArray(error.data.message) 
          ? error.data.message.join(', ') 
          : error.data.message;
        alert(`Save failed: ${errorMsg}`);
      } else {
        alert(`Save failed: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  // Helper function to create structured content based on subcategory
  const createStructuredContent = (content, subCategory) => {
    switch (subCategory) {
      case 'AUDIO_COMPREHENSION':
      case 'DIALOGUE_SEQUENCING':
        return {
          dialogue: content,
          questions: [
            {
              id: 1,
              text: "What is the main topic of the conversation?"
            }
          ]
        };
      
      case 'DICTATION_EXERCISE':
        return {
          text: content,
          words: content.split(' ').slice(0, 10), // First 10 words for dictation
          difficulty: 'beginner'
        };
      
      case 'GRAMMAR_PRACTICE':
        return {
          exercises: [
            {
              question: content.substring(0, 100) + "...",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0
            }
          ]
        };
      
      case 'COMPLETE_THE_SENTENCES':
        return {
          sentences: content.split('.')
            .filter(s => s.trim().length > 0)
            .map((sentence, index) => ({
              id: index + 1,
              text: sentence.trim() + ".",
              blankPosition: Math.floor(sentence.length / 2)
            }))
        };
      
      case 'SHORT_ESSAY':
        return {
          prompt: content.substring(0, 200),
          wordCount: 150,
          topics: ["General"]
        };
      
      case 'READING_ALOUD':
        return {
          passage: content,
          duration: Math.ceil(content.length / 10), // Approximate seconds
          difficulty: 'beginner'
        };
      
      case 'CONVERSATION_PRACTICE':
        return {
          scenario: content,
          roles: ["Role A", "Role B"],
          phrases: content.split('.')
            .filter(s => s.trim().length > 0)
            .slice(0, 5)
        };
      
      case 'PRONUNCIATION_PRACTICE':
        return {
          words: content.split(' ')
            .filter(w => w.length > 3)
            .slice(0, 10)
            .map(word => ({
              word,
              phonetic: `/phoʊˈnɛtɪk/`,
              audioUrl: null
            }))
        };
      
      case 'MAIN_PASSAGE':
        return {
          passage: content,
          questions: [
            {
              id: 1,
              text: "What is the main idea of the passage?",
              type: "multiple_choice",
              options: ["Option A", "Option B", "Option C"],
              correctAnswer: 0
            }
          ]
        };
      
      default:
        return {
          text: content,
          metadata: {
            subCategory,
            generatedAt: new Date().toISOString(),
            provider: selectedAIModel
          }
        };
    }
  };

  const handleReGenerate = () => {
    setGeneratedContent('');
    setApiError(null);
    setGenerationSuccess(false);
    handleGenerateQuestion();
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setCurrentSubCategory('');
    setPrompt('');
    setGeneratedContent('');
    setApiError(null);
    setGenerationSuccess(false);
  };

  const getExamplePrompt = (subCategory) => {
    const examples = {
      AUDIO_COMPREHENSION: `Generate a B1 level listening exercise about travel. 
Return a JSON object with: {
  "listening_script": "a natural dialogue about booking a hotel",
  "questions": [
    {"question": "What is the main purpose?", "options": ["A", "B", "C"], "answer": 0}
  ]
}`,
      
      DICTATION_EXERCISE: `Create a dictation exercise about daily routines for beginners.
Return JSON: {
  "text": "full text for dictation",
  "difficulty": "beginner",
  "wordCount": 50
}`,
      
      // Add similar structured prompts for all subcategories...
    };
    
    return examples[subCategory] || `Generate structured content for ${subCategory.toLowerCase().replace(/_/g, ' ')} in JSON format.`;
  };

  // Format generated content for display
  const formatGeneratedContent = (content) => {
    if (!content) return '';
    
    if (typeof content === 'string') {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // If not JSON, return as is
        return content;
      }
    }
    
    return JSON.stringify(content, null, 2);
  };

  // If not creating a lesson, show the lessons list page
  if (!isCreatingLesson) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Lessons</h1>
            <p className="text-gray-600 mt-2">Create and organize your learning lessons</p>
          </div>

          {/* Create Lesson Button */}
          <div className="mb-6">
            <button
              onClick={handleCreateLesson}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Create Lesson
            </button>
          </div>

          {/* Lessons List */}
          {Array.isArray(lessonsData?.data?.data) && lessonsData?.data?.data?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center py-8">
                No lessons created yet. Click "Create Lesson" to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessonsData?.data?.data?.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  {/* Type Badge */}
                <p className="mb-4 font-medium text-gray-700">
  Total lessons: {lessonsData?.data?.data?.length || 0}
</p>
                   <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                      lesson.type === 'READING' ? 'bg-orange-100 text-orange-600' :
                      lesson.type === 'WRITING' ? 'bg-green-100 text-green-600' :
                      lesson.type === 'LISTENING' ? 'bg-orange-100 text-orange-600' :
                      lesson.type === 'SPEAKING' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {lesson.type.charAt(0) + lesson.type.slice(1).toLowerCase()}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-gray-900 font-semibold text-base mb-3">
                    {lesson.title}
                  </h3>
                  
                  {/* Provider */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path strokeWidth="2" d="M12 6v6l4 2"/>
                    </svg>
                    <span>{lesson.provider === 'OPENAI' ? 'Open AI' : lesson.provider.charAt(0) + lesson.provider.slice(1).toLowerCase()}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetails(lesson)}
                      className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                      disabled={isDeleting}
                      className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lesson Details Modal */}
          {isModalOpen && selectedLesson && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Lesson Details</h2>
                
                {isLoadingDetails ? (
                  <div className="text-center py-4">Loading...</div>
                ) : lessonDetails ? (
                  <div className="space-y-3">
                    <p><strong>Title:</strong> {lessonDetails.data.title}</p>
                    <p><strong>Type:</strong> {lessonDetails.data.type}</p>
                    <p><strong>Provider:</strong> {lessonDetails.data.provider}</p>
                    <p><strong>Status:</strong> {lessonDetails.data.status || 'DRAFT'}</p>
                    {lessonDetails.data.createdAt && (
                      <p><strong>Created:</strong> {new Date(lessonDetails.data.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                ) : (
                  <div>Error loading details</div>
                )}
                
                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="mb-6">Delete lesson "{deleteConfirmation.lessonTitle}"?</p>
                <div className="flex gap-2">
                  <button onClick={cancelDelete} className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancelCreate}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Lessons
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Lesson</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                Step {currentStep} of {subCategories.length > 0 ? '2' : '1'}
              </span>
              {createdLessonId && (
                <span className="text-sm text-green-600 mr-4">
                  Lesson ID: {createdLessonId}
                </span>
              )}
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Step 1: Select Test Type, Title & AI Model */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lesson Setup</h2>
              <p className="text-gray-600">Configure the basic settings for your new lesson</p>
            </div>

            {/* Select Test Type */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Select Lesson Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: LessonType.READING, label: 'Reading', icon: '📖', description: 'Generate reading passages and comprehension questions' },
                  { value: LessonType.WRITING, label: 'Writing', icon: '✍️', description: 'Create writing exercises and prompts' },
                  { value: LessonType.LISTENING, label: 'Listening', icon: '👂', description: 'Generate audio exercises and dialogues' },
                  { value: LessonType.SPEAKING, label: 'Speaking', icon: '🗣️', description: 'Create speaking practice exercises' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedLessonType(type.value)}
                    className={`flex flex-col items-start p-6 border-2 rounded-xl transition-all text-left ${
                      selectedLessonType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <span className="text-lg font-medium text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Title */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Lesson Title
              </label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Enter a descriptive title for your lesson..."
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="text-sm text-gray-500 mt-2">
                Example: "B1 Travel Planning Dialogue" or "A2 Restaurant Conversations"
              </div>
            </div>

            {/* Select AI Model */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Select AI Model Provider
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedAIModel(AIProvider.OPEN_AI)}
                  className={`flex-1 py-4 px-6 border-2 rounded-lg transition-all ${
                    selectedAIModel === AIProvider.OPEN_AI
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles size={20} className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">OpenAI</div>
                      <div className="text-sm text-gray-600">GPT-4, DALL-E, etc.</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedAIModel(AIProvider.GROK)}
                  className={`flex-1 py-4 px-6 border-2 rounded-lg transition-all ${
                    selectedAIModel === AIProvider.GROK
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles size={20} className="text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Grok</div>
                      <div className="text-sm text-gray-600">xAI Model</div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-3">
                This will be sent as the "provider" field in the API request
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <button
                onClick={handleCancelCreate}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTitleNext}
                disabled={!selectedLessonType || !lessonTitle || !selectedAIModel || isCreatingLessonApi}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
              >
                {isCreatingLessonApi ? 'Creating Lesson...' : 'Continue to Content Creation'}
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Subcategory Content Generation */}
        {currentStep === 2 && currentSubCategory && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <button
                onClick={handleBackToStep1}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Setup
              </button>
              
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{lessonTitle}</h1>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full mr-3 font-medium">
                      {selectedLessonType}
                    </span>
                    <span className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      {selectedAIModel === AIProvider.OPEN_AI ? 'OpenAI' : 'Grok'}
                    </span>
                    {createdLessonId && (
                      <span className="ml-3 text-sm text-gray-500">
                        ID: {createdLessonId}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Current Exercise</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {subCategories[currentSubCategoryIndex]?.exercise}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {subCategories[currentSubCategoryIndex]?.label}
                </h2>
                <div className="text-sm text-gray-600">
                  Exercise {currentSubCategoryIndex + 1} of {subCategories.length}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentSubCategoryIndex + 1) / subCategories.length) * 100}%` 
                  }}
                ></div>
              </div>
              
              {/* Subcategory Dots */}
              <div className="flex justify-between mt-4">
                {subCategories?.map((subCat, index) => (
                  <div key={subCat.key} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < currentSubCategoryIndex
                        ? 'bg-green-100 text-green-600'
                        : index === currentSubCategoryIndex
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index < currentSubCategoryIndex ? '✓' : index + 1}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center max-w-[80px]">
                      {subCat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Generation Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Generation</h3>
              
              {/* API Status */}
              {apiError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700 font-medium">Error: {apiError}</span>
                  </div>
                </div>
              )}
              
              {generationSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-green-700 font-medium">Content generated successfully!</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your prompt for content generation
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={getExamplePrompt(currentSubCategory)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-lg"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">
                    Be specific about the type of content, difficulty level, and any specific requirements.
                  </div>
                  <button
                    onClick={() => setPrompt(getExamplePrompt(currentSubCategory))}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Load Example
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerateQuestion}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center transition-colors text-lg"
              >
                <Sparkles size={24} className="mr-3" />
                {isGenerating ? 'Generating Content...' : 'Generate Content with AI'}
              </button>
            </div>

            {/* Generated Content Display */}
            {generatedContent && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      AI Generated
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {getProviderMapping(selectedAIModel).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {formatGeneratedContent(generatedContent)}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleReGenerate}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-lg"
                  >
                    Re-generate Content
                  </button>
                  <button
                    onClick={handleNextSubCategory}
                    disabled={isSavingQuestionSet || !generatedContent}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSavingQuestionSet ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : currentSubCategoryIndex < subCategories.length - 1 ? (
                      <>
                        Save & Next Exercise
                        <ArrowLeft size={20} className="ml-2 rotate-180" />
                      </>
                    ) : (
                      'Complete Lesson'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Empty State when no content generated */}
            {!generatedContent && !isGenerating && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Content Preview
                </h3>
                <p className="text-gray-600 mb-4">
                  Your generated content will appear here after you click "Generate Content"
                </p>
                <div className="text-sm text-gray-500">
                  You can regenerate the content if you're not satisfied with the results
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Generating Content
                </h3>
                <p className="text-gray-600">
                  AI is creating content for {subCategories[currentSubCategoryIndex]?.label.toLowerCase()}...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
