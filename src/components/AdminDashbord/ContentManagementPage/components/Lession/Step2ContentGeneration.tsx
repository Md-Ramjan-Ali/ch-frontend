import React from 'react';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { LessonType, AIProvider, SubCategoryType } from './Type';

interface Step2ContentGenerationProps {
  lessonTitle: string;
  selectedLessonType: LessonType | '';
  selectedAIModel: AIProvider;
  currentSubCategory: SubCategoryType | '';
  subCategories: Array<{key: SubCategoryType, label: string, exercise: string}>;
  currentSubCategoryIndex: number;
  prompt: string;
  generatedContent: any;
  apiError: string | null;
  generationSuccess: boolean;
  isGenerating: boolean;
  isSavingQuestionSet: boolean;
  getExamplePrompt: (subCategory: SubCategoryType) => string;
  formatGeneratedContent: (content: any) => string;
  onSetPrompt: (prompt: string) => void;
  onGenerate: () => void;
  onReGenerate: () => void;
  onNextSubCategory: () => void;
  onBack: () => void;
}

const Step2ContentGeneration: React.FC<Step2ContentGenerationProps> = ({
  lessonTitle,
  selectedLessonType,
  selectedAIModel,
  currentSubCategory,
  subCategories,
  currentSubCategoryIndex,
  prompt,
  generatedContent,
  apiError,
  generationSuccess,
  isGenerating,
  isSavingQuestionSet,
  getExamplePrompt,
  formatGeneratedContent,
  onSetPrompt,
  onGenerate,
  onReGenerate,
  onNextSubCategory,
  onBack
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <button
          onClick={onBack}
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
          {subCategories.map((subCat, index) => (
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
            onChange={(e) => onSetPrompt(e.target.value)}
            placeholder={getExamplePrompt(currentSubCategory as SubCategoryType)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-lg"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              Be specific about the type of content, difficulty level, and any specific requirements.
            </div>
            <button
              onClick={() => onSetPrompt(getExamplePrompt(currentSubCategory as SubCategoryType))}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Load Example
            </button>
          </div>
        </div>

        <button
          onClick={onGenerate}
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
                {selectedAIModel === AIProvider.OPEN_AI ? 'OpenAI' : 'Grok'}
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
              onClick={onReGenerate}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-lg"
            >
              Re-generate Content
            </button>
            <button
              onClick={onNextSubCategory}
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
  );
};

export default Step2ContentGeneration;