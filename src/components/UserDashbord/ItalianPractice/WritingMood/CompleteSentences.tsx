import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import NavigationButtons from './NavigationButtons';
import ExerciseHeader from '../ExerciseHeader';

interface Sentence {
  id: number;
  prefix: string;
  blank: string;
  suffix: string;
  hint: string;
  userAnswer: string;
}

interface Props {
  onPrev: () => void;
  onNext: () => void;
}

const sentenceData: Sentence[] = [
  {
    id: 1,
    prefix: 'Maria',
    blank: '',
    suffix: '(andare) al cinema ogni venerdì.',
    hint: 'Third person singular of "andare"',
    userAnswer: '',
  },
  {
    id: 2,
    prefix: 'Io',
    blank: '',
    suffix: '(mangiare) una mela ogni mattina.',
    hint: 'First person singular of "mangiare"',
    userAnswer: '',
  },
  {
    id: 3,
    prefix: 'Noi',
    blank: '',
    suffix: '(avere) due cani e un gatto.',
    hint: 'First person plural of "avere"',
    userAnswer: '',
  },
  {
    id: 4,
    prefix: 'Loro',
    blank: '',
    suffix: '(parlare) molto bene l\'italiano.',
    hint: 'Third person plural of "parlare"',
    userAnswer: '',
  },
  {
    id: 5,
    prefix: 'Tu',
    blank: '',
    suffix: '(scrivere) una lettera a tua madre ogni settimana.',
    hint: 'Second person singular of "scrivere"',
    userAnswer: '',
  },
  {
    id: 6,
    prefix: 'Io',
    blank: '',
    suffix: '(dormire) otto ore ogni notte.',
    hint: 'First person singular of "dormire"',
    userAnswer: '',
  },
];

const CompleteSentences: React.FC<Props> = ({ onPrev, onNext }) => {
  const [sentences, setSentences] = useState<Sentence[]>(sentenceData);
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});
  const [showTips, setShowTips] = useState(true);

  const handleInputChange = (id: number, value: string) => {
    setSentences(sentences.map(s => (s.id === id ? { ...s, userAnswer: value } : s)));
  };

  const toggleHint = (id: number) => {
    setShowHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto rounded-xl bg-white dark:bg-gray-900 p-6 transition-colors duration-200">
      <ExerciseHeader
        title="Complete the Sentences"
        description="Fill in the blanks with the correct Italian words"
        progressLabel="Exercise 2/3"
        showTips={showTips}
        onToggleTips={() => setShowTips(!showTips)}
      />

      {/* Tips Section */}
      {showTips && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">Tips for this exercise:</span>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-6">
            <li>• Pay attention to the verb in parentheses</li>
            <li>• Consider the subject pronoun to determine the correct conjugation</li>
            <li>• Click the hint button if you need help</li>
          </ul>
        </div>
      )}

      <div className="space-y-4 mt-6">
        {sentences.map(s => (
          <div 
            key={s.id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap text-lg md:text-xl">
              <span className="text-gray-800 dark:text-gray-200">{s.prefix}</span>
              <input
                type="text"
                placeholder="..."
                value={s.userAnswer}
                onChange={e => handleInputChange(s.id, e.target.value)}
                className="px-3 py-2 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-w-[120px] focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              />
              <span className="text-gray-800 dark:text-gray-200">{s.suffix}</span>
            </div>
            
            {/* Hint Button */}
            <button 
              onClick={() => toggleHint(s.id)} 
              className={`flex mt-4 items-center gap-2 rounded-xl p-3 text-base cursor-pointer transition-all duration-200 ${
                showHints[s.id] 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Lightbulb className={`w-4 h-4 ${
                showHints[s.id] 
                  ? 'text-yellow-500 dark:text-yellow-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {showHints[s.id] ? s.hint : 'Click to show hint'}
            </button>

            {/* Feedback for filled answers */}
            {s.userAnswer && (
              <div className="mt-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <span className="text-sm text-green-700 dark:text-green-300">
                  ✓ Answer saved - you can always come back and change it
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Completed: {sentences.filter(s => s.userAnswer.trim() !== '').length} of {sentences.length}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Progress: {Math.round((sentences.filter(s => s.userAnswer.trim() !== '').length / sentences.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(sentences.filter(s => s.userAnswer.trim() !== '').length / sentences.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
};

export default CompleteSentences;