import React, { useState, useEffect } from 'react';
import { 
  useCreateLessonMutation, 
  useDeleteLessonMutation, 
  useGetAllLessonsQuery, 
  useGetLessonByIdQuery 
} from '@/redux/features/lesson/lessonContent/lessonContentApi';
import { 
  useUpsertLessonQuestionSetMutation 
} from '@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi';

import LessonsListView from './LessonsListView';
import LessonCreationWizard from './LessonCreationWizard';
import { LessonType, AIProvider, SubCategoryType, DeleteConfirmationState, Lesson } from './Type';

const LessonsContainer: React.FC = () => {
  
  // State management
  const [isCreatingLesson, setIsCreatingLesson] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType | ''>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [selectedAIModel, setSelectedAIModel] = useState<AIProvider>(AIProvider.OPEN_AI);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategoryType | ''>('');
  const [prompt, setPrompt] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [completedSubCategories, setCompletedSubCategories] = useState<SubCategoryType[]>([]);
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({ 
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
    selectedLesson?.id || '', 
    { skip: !selectedLesson?.id }
  );

  // Helper functions
  const getSubCategories = (lessonType: LessonType | ''): Array<{key: SubCategoryType, label: string, exercise: string}> => {
    switch (lessonType) {
      case LessonType.READING:
        return [{ key: SubCategoryType.MAIN_PASSAGE, label: 'Main Passage', exercise: '1/1' }];
      case LessonType.LISTENING:
        return [
          { key: SubCategoryType.AUDIO_COMPREHENSION, label: 'Audio Comprehension', exercise: '1/3' },
          { key: SubCategoryType.DICTATION_EXERCISE, label: 'Dictation Exercise', exercise: '2/3' },
          { key: SubCategoryType.DIALOGUE_SEQUENCING, label: 'Dialogue Sequencing', exercise: '3/3' }
        ];
      case LessonType.WRITING:
        return [
          { key: SubCategoryType.GRAMMAR_PRACTICE, label: 'Grammar Practice', exercise: '1/3' },
          { key: SubCategoryType.COMPLETE_THE_SENTENCES, label: 'Complete the Sentences', exercise: '2/3' },
          { key: SubCategoryType.SHORT_ESSAY, label: 'Short Essay', exercise: '3/3' }
        ];
      case LessonType.SPEAKING:
        return [
          { key: SubCategoryType.READING_ALOUD, label: 'Reading Aloud', exercise: '1/3' },
          { key: SubCategoryType.CONVERSATION_PRACTICE, label: 'Conversation Practice', exercise: '2/3' },
          { key: SubCategoryType.PRONUNCIATION_PRACTICE, label: 'Pronunciation Practice', exercise: '3/3' }
        ];
      default:
        return [];
    }
  };

  const getTypeMapping = (subCategory: SubCategoryType, lessonType: LessonType): string => {
    const mappings: Record<SubCategoryType, string> = {
      [SubCategoryType.AUDIO_COMPREHENSION]: 'audio-comprehension',
      [SubCategoryType.DICTATION_EXERCISE]: 'dictation-exercise',
      [SubCategoryType.DIALOGUE_SEQUENCING]: 'dialog-sequencing',
      [SubCategoryType.GRAMMAR_PRACTICE]: 'grammar_practice',
      [SubCategoryType.COMPLETE_THE_SENTENCES]: 'sentence_completion',
      [SubCategoryType.SHORT_ESSAY]: 'short_essay',
      [SubCategoryType.READING_ALOUD]: 'reading-aloud',
      [SubCategoryType.CONVERSATION_PRACTICE]: 'conversation-practice',
      [SubCategoryType.PRONUNCIATION_PRACTICE]: 'pronunciation-practice',
      [SubCategoryType.MAIN_PASSAGE]: 'main-passage'
    };
    
    return mappings[subCategory] || subCategory.toLowerCase().replace(/_/g, '-');
  };

  const getProviderMapping = (provider: AIProvider): string => {
    return provider === AIProvider.OPEN_AI ? 'openai' : 'grok';
  };

  const getExamplePrompt = (subCategory: SubCategoryType): string => {
    const examples: Partial<Record<SubCategoryType, string>> = {
      [SubCategoryType.AUDIO_COMPREHENSION]: `Generate a B1 level listening exercise about travel. 
Return a JSON object with: {
  "listening_script": "a natural dialogue about booking a hotel",
  "questions": [
    {"question": "What is the main purpose?", "options": ["A", "B", "C"], "answer": 0}
  ]
}`,
      [SubCategoryType.DICTATION_EXERCISE]: `Create a dictation exercise about daily routines for beginners.
Return JSON: {
  "text": "full text for dictation",
  "difficulty": "beginner",
  "wordCount": 50
}`
    };
    
    return examples[subCategory] || `Generate structured content for ${subCategory.toLowerCase().replace(/_/g, ' ')} in JSON format.`;
  };

  const createStructuredContent = (content: string, subCategory: SubCategoryType): any => {
    switch (subCategory) {
      case SubCategoryType.AUDIO_COMPREHENSION:
      case SubCategoryType.DIALOGUE_SEQUENCING:
        return {
          dialogue: content,
          questions: [
            {
              id: 1,
              text: "What is the main topic of the conversation?"
            }
          ]
        };
      // Add other cases as needed...
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

  const formatGeneratedContent = (content: any): string => {
    if (!content) return '';
    
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return content;
      }
    }
    
    return JSON.stringify(content, null, 2);
  };

  // Event Handlers
  const handleCreateLesson = () => {
    setIsCreatingLesson(true);
    setCurrentStep(1);
    setSelectedLessonType('');
    setLessonTitle('');
    setSelectedAIModel(AIProvider.OPEN_AI);
    setCurrentSubCategory('');
    setPrompt('');
    setGeneratedContent(null);
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
    setGeneratedContent(null);
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
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      alert(`Failed to create lesson: ${error?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleGenerateQuestion = async () => {
    if (!prompt.trim() || !selectedLessonType || !currentSubCategory) return;
    
    setIsGenerating(true);
    setApiError(null);
    setGenerationSuccess(false);
    
    try {
      const API_ENDPOINTS = {
        [LessonType.READING]: {
          endpoint: '/ai/admin/generate/reading-comprehension/',
          fieldName: 'content'
        },
        [LessonType.LISTENING]: {
          endpoint: '/ai/admin/generate/listening-comprehension/',
          fieldName: 'content'
        },
        [LessonType.WRITING]: {
          endpoint: '/ai/admin/generate/ai/generate/',
          fieldName: 'content'
        },
        [LessonType.SPEAKING]: {
          endpoint: '/ai/admin/generate/speaking-practice/',
          fieldName: 'content'
        }
      };

      const apiConfig = API_ENDPOINTS[selectedLessonType as LessonType];
      if (!apiConfig) {
        throw new Error(`No API configuration found for lesson type: ${selectedLessonType}`);
      }

      let requestBody: any = {
        provider: getProviderMapping(selectedAIModel),
        prompt: prompt.trim()
      };

      if (selectedLessonType === LessonType.LISTENING || 
          selectedLessonType === LessonType.WRITING || 
          selectedLessonType === LessonType.SPEAKING) {
        requestBody.type = getTypeMapping(currentSubCategory, selectedLessonType as LessonType);
      }

      if (selectedLessonType === LessonType.SPEAKING) {
        requestBody.difficulty = 'beginner';
      }

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
      
      if (typeof result === 'string') {
        try {
          const cleanString = result
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/^"|"$/g, '');
          
          result = JSON.parse(cleanString);
        } catch (parseError) {
          result = {
            text: result,
            type: currentSubCategory,
            generatedAt: new Date().toISOString()
          };
        }
      }
      
      if (typeof result !== 'object' || result === null) {
        result = { text: String(result) };
      }
      
      setGeneratedContent(result);
      setGenerationSuccess(true);
      
    } catch (error: any) {
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

    if (!createdLessonId || !currentSubCategory || !selectedLessonType) {
      alert('Missing required data to save the question set');
      return;
    }

    try {
      let structuredContent: any;
      
      if (typeof generatedContent === 'string') {
        try {
          const cleanContent = generatedContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          structuredContent = JSON.parse(cleanContent);
        } catch (e) {
          structuredContent = createStructuredContent(generatedContent, currentSubCategory);
        }
      } else {
        structuredContent = generatedContent;
      }

      const payload = {
        lessonId: createdLessonId,
        subCategoryType: currentSubCategory,
        prompt: prompt || `Generated ${getSubCategories(selectedLessonType).find(s => s.key === currentSubCategory)?.label} content`,
        content: structuredContent
      };

      await upsertLessonQuestionSet(payload).unwrap();

      if (!completedSubCategories.includes(currentSubCategory)) {
        setCompletedSubCategories([...completedSubCategories, currentSubCategory]);
      }

      const subCategories = getSubCategories(selectedLessonType);
      const currentSubCategoryIndex = subCategories.findIndex(s => s.key === currentSubCategory);
      
      if (currentSubCategoryIndex < subCategories.length - 1) {
        setPrompt('');
        setGeneratedContent(null);
        setApiError(null);
        setGenerationSuccess(false);
        
        const nextCategory = subCategories[currentSubCategoryIndex + 1].key;
        setCurrentSubCategory(nextCategory);
        
        alert(`✅ ${subCategories[currentSubCategoryIndex]?.label} saved successfully! Moving to next exercise...`);
        
      } else {
        alert(`✅ All exercises completed! Lesson "${lessonTitle}" has been created successfully!`);
        handleCancelCreate();
      }

    } catch (error: any) {
      console.error('Save failed:', error);
      
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

  const handleReGenerate = () => {
    setGeneratedContent(null);
    setApiError(null);
    setGenerationSuccess(false);
    handleGenerateQuestion();
  };

  const handleViewDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
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
      refetchLessons();
      setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      alert(`Failed to delete lesson: ${error?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, lessonId: null, lessonTitle: '' });
  };

  // Reset generation states when changing subcategory
  useEffect(() => {
    setGeneratedContent(null);
    setApiError(null);
    setGenerationSuccess(false);
  }, [currentSubCategory]);

  if (!isCreatingLesson) {
    return (
      <LessonsListView
        lessons={lessonsData?.data?.data || []}
        isLoadingLessons={false}
        isDeleting={isDeleting}
        deleteConfirmation={deleteConfirmation}
        selectedLesson={selectedLesson}
        isModalOpen={isModalOpen}
        lessonDetails={lessonDetails}
        isLoadingDetails={isLoadingDetails}
        onCreateLesson={handleCreateLesson}
        onViewDetails={handleViewDetails}
        onDeleteLesson={handleDeleteLesson}
        onCloseModal={() => setIsModalOpen(false)}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
      />
    );
  }

  return (
    <LessonCreationWizard
      currentStep={currentStep}
      selectedLessonType={selectedLessonType}
      lessonTitle={lessonTitle}
      selectedAIModel={selectedAIModel}
      currentSubCategory={currentSubCategory}
      prompt={prompt}
      generatedContent={generatedContent}
      isGenerating={isGenerating}
      isCreatingLessonApi={isCreatingLessonApi}
      isSavingQuestionSet={isSavingQuestionSet}
      apiError={apiError}
      generationSuccess={generationSuccess}
      createdLessonId={createdLessonId}
      getSubCategories={getSubCategories}
      getExamplePrompt={getExamplePrompt}
      formatGeneratedContent={formatGeneratedContent}
      onCancel={handleCancelCreate}
      onBackToStep1={() => setCurrentStep(1)}
      onSetLessonType={setSelectedLessonType}
      onSetLessonTitle={setLessonTitle}
      onSetAIModel={setSelectedAIModel}
      onSetPrompt={setPrompt}
      onTitleNext={handleTitleNext}
      onGenerateQuestion={handleGenerateQuestion}
      onNextSubCategory={handleNextSubCategory}
      onReGenerate={handleReGenerate}
    />
  );
};

export default LessonsContainer;