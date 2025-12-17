import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Step1Setup from './Step1Setup';
import Step2ContentGeneration from './Step2ContentGeneration';
import { LessonType, AIProvider, SubCategoryType } from './Type';

interface LessonCreationWizardProps {
  currentStep: number;
  selectedLessonType: LessonType | '';
  lessonTitle: string;
  selectedAIModel: AIProvider;
  currentSubCategory: SubCategoryType | '';
  prompt: string;
  generatedContent: any;
  isGenerating: boolean;
  isCreatingLessonApi: boolean;
  isSavingQuestionSet: boolean;
  apiError: string | null;
  generationSuccess: boolean;
  createdLessonId: string | null;
  getSubCategories: (type: LessonType | '') => Array<{key: SubCategoryType, label: string, exercise: string}>;
  getExamplePrompt: (subCategory: SubCategoryType) => string;
  formatGeneratedContent: (content: any) => string;
  onCancel: () => void;
  onBackToStep1: () => void;
  onSetLessonType: (type: LessonType) => void;
  onSetLessonTitle: (title: string) => void;
  onSetAIModel: (model: AIProvider) => void;
  onSetPrompt: (prompt: string) => void;
  onTitleNext: () => void;
  onGenerateQuestion: () => void;
  onNextSubCategory: () => void;
  onReGenerate: () => void;
}

const LessonCreationWizard: React.FC<LessonCreationWizardProps> = ({
  currentStep,
  selectedLessonType,
  lessonTitle,
  selectedAIModel,
  currentSubCategory,
  prompt,
  generatedContent,
  isGenerating,
  isCreatingLessonApi,
  isSavingQuestionSet,
  apiError,
  generationSuccess,
  createdLessonId,
  getSubCategories,
  getExamplePrompt,
  formatGeneratedContent,
  onCancel,
  onBackToStep1,
  onSetLessonType,
  onSetLessonTitle,
  onSetAIModel,
  onSetPrompt,
  onTitleNext,
  onGenerateQuestion,
  onNextSubCategory,
  onReGenerate
}) => {
  const subCategories = getSubCategories(selectedLessonType);
  const currentSubCategoryIndex = subCategories.findIndex(s => s.key === currentSubCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onCancel}
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
                onClick={onCancel}
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
        {currentStep === 1 ? (
          <Step1Setup
            selectedLessonType={selectedLessonType}
            lessonTitle={lessonTitle}
            selectedAIModel={selectedAIModel}
            isCreatingLessonApi={isCreatingLessonApi}
            onSetLessonType={onSetLessonType}
            onSetLessonTitle={onSetLessonTitle}
            onSetAIModel={onSetAIModel}
            onNext={onTitleNext}
            onCancel={onCancel}
          />
        ) : (
          <Step2ContentGeneration
            lessonTitle={lessonTitle}
            selectedLessonType={selectedLessonType}
            selectedAIModel={selectedAIModel}
            currentSubCategory={currentSubCategory}
            subCategories={subCategories}
            currentSubCategoryIndex={currentSubCategoryIndex}
            prompt={prompt}
            generatedContent={generatedContent}
            apiError={apiError}
            generationSuccess={generationSuccess}
            isGenerating={isGenerating}
            isSavingQuestionSet={isSavingQuestionSet}
            getExamplePrompt={getExamplePrompt}
            formatGeneratedContent={formatGeneratedContent}
            onSetPrompt={onSetPrompt}
            onGenerate={onGenerateQuestion}
            onReGenerate={onReGenerate}
            onNextSubCategory={onNextSubCategory}
            onBack={onBackToStep1}
          />
        )}
      </div>
    </div>
  );
};

export default LessonCreationWizard;