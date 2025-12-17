import React, { useState } from 'react';
import { PhraseOfTheDay as PhraseType } from './types';

const initialPhrase: PhraseType = {
  italian: '',
  englishTranslation: '',
  pronunciation: '',
  explanation: ''
};

const PhraseOfTheDay: React.FC = () => {
  const [phrase, setPhrase] = useState<PhraseType>(initialPhrase);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPhrase((prev: PhraseType) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //('Updated Phrase:', phrase);
    // Here you would typically make an API call to save the data
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Phrase of the Day</h2>
          <p className="text-slate-500 dark:text-slate-300 mt-1">Manage daily Italian phrases for user engagement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm space-y-6 max-w-2xl transition-colors">
       <div className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
  {/* Italian */}
  <div>
    <label
      htmlFor="italian"
      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
    >
      Italian
    </label>
    <input
      type="text"
      id="italian"
      name="italian"
      value={phrase.italian}
      onChange={handleChange}
      placeholder="Enter Italian phrase"
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* English Translation */}
  <div>
    <label
      htmlFor="englishTranslation"
      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
    >
      English Translation
    </label>
    <input
      type="text"
      id="englishTranslation"
      name="englishTranslation"
      value={phrase.englishTranslation}
      onChange={handleChange}
      placeholder="Enter English translation"
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* Pronunciation */}
  <div>
    <label
      htmlFor="pronunciation"
      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
    >
      Pronunciation
    </label>
    <input
      type="text"
      id="pronunciation"
      name="pronunciation"
      value={phrase.pronunciation}
      onChange={handleChange}
      placeholder="Enter pronunciation"
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* Explanation */}
  <div>
    <label
      htmlFor="explanation"
      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
    >
      Explanation
    </label>
    <textarea
      id="explanation"
      name="explanation"
      value={phrase.explanation}
      onChange={handleChange}
      rows={3}
      placeholder="Provide explanation"
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* Button */}
  <div>
    <button
      type="submit"
      className="w-full cursor-pointer bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-md"
    >
      Update Today's Phrase
    </button>
  </div>
</div>

      </form>

      {/* Custom input styles with dark mode */}
      <style>{`
        .input {
          border-radius: 0.5rem;
          padding: 0.65rem 1rem;
          border: 1px solid #cbd5e1;
          width: 100%;
          transition: all 0.15s ease-in-out;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          background-color: white;
          color: #1e293b;
        }

        .input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }

        /* light default for elements that also carry .input-dark */
        .input-dark {
          background-color: white;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        /* dark-mode override when a parent has .dark (Tailwind dark class strategy) */
        .dark .input-dark {
          background-color: #0f1724; /* darker bg for inputs in dark mode */
          color: #f1f5f9;
          border-color: #334155;
        }

        .dark .input-dark:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }

        .placeholder-gray-400::placeholder {
          color: #cbd5e1;
        }

        .dark .placeholder-gray-500::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PhraseOfTheDay;
