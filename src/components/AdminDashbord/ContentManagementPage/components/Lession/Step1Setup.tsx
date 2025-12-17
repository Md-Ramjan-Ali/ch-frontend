import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LessonType, AIProvider } from './Type';

interface Step1SetupProps {
  selectedLessonType: LessonType | '';
  lessonTitle: string;
  selectedAIModel: AIProvider;
  isCreatingLessonApi: boolean;
  onSetLessonType: (type: LessonType) => void;
  onSetLessonTitle: (title: string) => void;
  onSetAIModel: (model: AIProvider) => void;
  onNext: () => void;
  onCancel: () => void;
}

const Step1Setup: React.FC<Step1SetupProps> = ({
  selectedLessonType,
  lessonTitle,
  selectedAIModel,
  isCreatingLessonApi,
  onSetLessonType,
  onSetLessonTitle,
  onSetAIModel,
  onNext,
  onCancel
}) => {
  const lessonTypes = [
    { value: LessonType.READING, label: 'Reading', icon: '📖', description: 'Generate reading passages and comprehension questions' },
    { value: LessonType.WRITING, label: 'Writing', icon: '✍️', description: 'Create writing exercises and prompts' },
    { value: LessonType.LISTENING, label: 'Listening', icon: '👂', description: 'Generate audio exercises and dialogues' },
    { value: LessonType.SPEAKING, label: 'Speaking', icon: '🗣️', description: 'Create speaking practice exercises' }
  ];

  return (
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
          {lessonTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onSetLessonType(type.value)}
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
          onChange={(e) => onSetLessonTitle(e.target.value)}
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
            onClick={() => onSetAIModel(AIProvider.OPEN_AI)}
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
            onClick={() => onSetAIModel(AIProvider.GROK)}
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
          onClick={onCancel}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!selectedLessonType || !lessonTitle || !selectedAIModel || isCreatingLessonApi}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
        >
          {isCreatingLessonApi ? 'Creating Lesson...' : 'Continue to Content Creation'}
          <ArrowLeft size={20} className="ml-2 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Step1Setup;