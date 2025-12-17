import React, { useState } from 'react';
import ExerciseHeader from '../ExerciseHeader';
import NavigationButtons from './NavigationButtons';
import { Lightbulb } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  sentence: string;
  options: Option[];
  selectedAnswer: string | null;
}

interface Props {
  onPrev: () => void;
  onFinish: () => void;
}

const grammarQuestions: Question[] = [
  {
    id: 1,
    sentence: "Il libro _____ molto interessante.",
    options: [
      { id: 'A', text: 'è davvero molto interessante.' },
      { id: 'B', text: 'sembra essere molto interessante.' },
      { id: 'C', text: 'risulta molto interessante.' },
      { id: 'D', text: 'appare molto interessante.' },
    ],
    selectedAnswer: null,
  },
  {
    id: 2,
    sentence: "Loro _____ arrivati in tempo alla riunione.",
    options: [
      { id: 'A', text: 'sono' },
      { id: 'B', text: 'saranno' },
      { id: 'C', text: 'erano' },
      { id: 'D', text: 'fossero' },
    ],
    selectedAnswer: null,
  },
  {
    id: 3,
    sentence: "Noi _____ a Roma per le vacanze estive.",
    options: [
      { id: 'A', text: 'andiamo' },
      { id: 'B', text: 'andate' },
      { id: 'C', text: 'vanno' },
      { id: 'D', text: 'va' },
    ],
    selectedAnswer: null,
  },
  {
    id: 4,
    sentence: "Tu _____ mai stato in Italia prima d'ora?",
    options: [
      { id: 'A', text: 'sei' },
      { id: 'B', text: 'eri' },
      { id: 'C', text: 'saresti' },
      { id: 'D', text: 'fossi' },
    ],
    selectedAnswer: null,
  },
  {
    id: 5,
    sentence: "Domani noi _____ una grande festa per il compleanno di Anna.",
    options: [
      { id: 'A', text: 'facciamo' },
      { id: 'B', text: 'faremo' },
      { id: 'C', text: 'abbiamo fatto' },
      { id: 'D', text: 'stiamo facendo' },
    ],
    selectedAnswer: null,
  },
  {
    id: 6,
    sentence: "Se piove, noi non _____ al mare.",
    options: [
      { id: 'A', text: 'andremo' },
      { id: 'B', text: 'andiamo' },
      { id: 'C', text: 'siamo andati' },
      { id: 'D', text: 'andremmo' },
    ],
    selectedAnswer: null,
  },
];

const GrammarPractice: React.FC<Props> = ({ onPrev, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>(grammarQuestions);
  const [showTips, setShowTips] = useState(true);

  const handleSelect = (qid: number, oid: string) => {
    setQuestions(q => q.map(qs => qs.id === qid ? { ...qs, selectedAnswer: oid } : qs));
  };

  const completedCount = questions.filter(q => q.selectedAnswer !== null).length;
  const totalCount = questions.length;

  return (
    <div className="mx-auto rounded-xl bg-white dark:bg-gray-900 p-6 transition-colors duration-200">
      <ExerciseHeader
        title="Grammar Practice"
        description="Choose the correct grammatical form."
        progressLabel="Exercise 3/3"
        showTips={showTips}
        onToggleTips={() => setShowTips(!showTips)}
      />

      {/* Tips Section */}
      {showTips && (
        <div className="mt-6 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">Grammar Tips:</span>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-6">
            <li>• Pay attention to verb tenses and subject-verb agreement</li>
            <li>• Consider the context and time expressions</li>
            <li>• Look for clues in the sentence structure</li>
            <li>• Eliminate obviously incorrect options first</li>
          </ul>
        </div>
      )}

      {/* Instruction Card */}
      <div className='w-full bg-gray-100 dark:bg-gray-800 py-6 px-4 rounded-2xl mt-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200'>
        <p className='text-gray-800 dark:text-gray-200 font-medium text-lg'>
          Select the correct form for each sentence:
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Completed: {completedCount}/{totalCount}</span>
          <span>•</span>
          <span>Click on any option to select it</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 mb-6">
        <div 
          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        ></div>
      </div>

      {/* Questions Grid */}
      <div className='mt-6 flex flex-col gap-6'>
        {questions.map(q => (
          <div 
            key={q.id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <p className="mb-4 text-xl font-medium text-gray-900 dark:text-gray-100">
              {q.id}. {q.sentence}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map(o => (
                <button 
                  key={o.id} 
                  onClick={() => handleSelect(q.id, o.id)}
                  className={`p-4 border-2 rounded-lg text-base cursor-pointer text-left transition-all duration-200 ${
                    q.selectedAnswer === o.id 
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 shadow-sm' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className={`font-semibold ${
                    q.selectedAnswer === o.id 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {o.id}.
                  </span>
                  <span className="ml-2">{o.text}</span>
                </button>
              ))}
            </div>

            {/* Selection Feedback */}
            {q.selectedAnswer && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <span className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Option {q.selectedAnswer} selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Status */}
      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                All questions completed!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                You can review your answers or proceed to finish the exercise.
              </p>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons onPrev={onPrev} onNext={onFinish} />
    </div>
  );
};

export default GrammarPractice;