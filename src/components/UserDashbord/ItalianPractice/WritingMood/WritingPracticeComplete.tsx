import React from 'react';
import { Check, TrendingUp, Target, Lightbulb, BookOpen, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExercisePerformance {
  name: string;
  score: number;
  percentage: number;
}

interface AreaForImprovement {
  title: string;
  description: string;
  practices: string[];
}

interface StudyPlanItem {
  id: number;
  text: string;
}

const WritingPracticeComplete: React.FC = () => {
  const navigate = useNavigate();

  const exercisePerformance: ExercisePerformance[] = [
    { name: 'Audio Comprehension', score: 8, percentage: 80 },
    { name: 'Dictation Exercise', score: 6, percentage: 60 },
    { name: 'Dialogue Sequencing', score: 8, percentage: 80 }
  ];

  const areasForImprovement: AreaForImprovement[] = [
    {
      title: 'Audio Comprehension',
      description: 'Difficulty understanding quick details',
      practices: [
        'Practice predicting content before listening',
        'Focus on key vocabulary recognition',
        'Listen to slower-paced audio initially',
        'Use transcripts to verify understanding',
        'Practice with different accents',
        'Build listening stamina gradually'
      ]
    },
    {
      title: 'Dictation Exercise',
      description: 'Difficulty understanding quick and details',
      practices: [
        'Start with shorter dictation segments',
        'Practice spelling of common words',
        'Focus on verb conjugations',
        'Build vocabulary systematically',
        'Use pause and replay effectively',
        'Review common sentence structures'
      ]
    },
    {
      title: 'Dialogue Sequencing',
      description: 'Difficulty understanding quick and details',
      practices: [
        'Study common dialogue patterns',
        'Practice with context clues',
        'Focus on transitional phrases',
        'Build conversation flow awareness',
        'Analyze real Italian conversations',
        'Practice logical sequencing'
      ]
    }
  ];

  const studyPlan: StudyPlanItem[] = [
    { id: 1, text: 'Begin with very basic Italian audio content' },
    { id: 2, text: 'Practice daily dictation for 15 minutes' },
    { id: 3, text: 'Focus on common verb conjugations' },
    { id: 4, text: 'Build vocabulary with themed word lists' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Writing Practice Complete!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You earned 10 points and 15 seconds streak!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center border border-green-100 dark:border-green-800 transition-colors duration-200">
            <div className="text-3xl font-bold text-gray-900 dark:text-green-100 mb-1">10</div>
            <div className="text-sm text-gray-600 dark:text-green-200">Earned Points</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center border border-blue-100 dark:border-blue-800 transition-colors duration-200">
            <div className="text-3xl font-bold text-gray-900 dark:text-blue-100 mb-1">75%</div>
            <div className="text-sm text-gray-600 dark:text-blue-200">Accuracy Rate</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center border border-purple-100 dark:border-purple-800 transition-colors duration-200">
            <div className="text-3xl font-bold text-gray-900 dark:text-purple-100 mb-1">30+</div>
            <div className="text-sm text-gray-600 dark:text-purple-200">XP Earned</div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 dark:border-purple-400 p-4 mb-6 rounded-r-lg transition-colors duration-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              Performance Analysis - Needs Improvement
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          Don't worry! Writing is often the most challenging skill. With targeted practice, you'll see rapid improvement.
        </p>

        {/* Exercise Performance */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Exercise Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exercisePerformance.map((exercise, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {exercise.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {exercise.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      exercise.percentage >= 80 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : exercise.percentage >= 60 
                        ? 'bg-yellow-500 dark:bg-yellow-400'
                        : 'bg-red-500 dark:bg-red-400'
                    }`}
                    style={{ width: `${exercise.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Areas for Improvement</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {areasForImprovement.map((area, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 hover:shadow-md">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{area.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{area.description}</p>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Recommended Practice:
                  </h4>
                  <ul className="space-y-1.5">
                    {area.practices.map((practice, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Check className="w-3 h-3 text-green-500 dark:text-green-400 mt-0.5" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Study Plan */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personalized Study Plan</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on your performance, here's what we recommend for your next study sessions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyPlan.map((item) => (
              <div key={item.id} className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 flex items-start gap-3 border border-teal-200 dark:border-teal-800 transition-colors duration-200 hover:shadow-md">
                <div className="w-8 h-8 bg-teal-600 dark:bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  {item.id}
                </div>
                <p className="text-sm text-gray-800 dark:text-teal-100 pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate("/user/practice")} 
            className="px-6 py-3 cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>
          <button className="px-6 cursor-pointer py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Next Writing Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingPracticeComplete;