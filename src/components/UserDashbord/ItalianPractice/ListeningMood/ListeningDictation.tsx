
import React from 'react';

interface ListeningDictationProps {
  dictationText: string;
  userText: string;
  onTextChange: (text: string) => void;
  continueCallback: () => void;
}

const ListeningDictation: React.FC<ListeningDictationProps> = ({ 
  dictationText, 
  userText, 
  onTextChange, 
  continueCallback 
}) => {
  const targetWords = dictationText ? dictationText.split(/\s+/).length : 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const handleClearText = () => {
    onTextChange('');
  };

  const handleContinue = () => {
    continueCallback();
  };

  const wordCount = userText.trim() === '' ? 0 : userText.trim().split(/\s+/).length;

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Instruction */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          Listen carefully and write what you hear
        </p>
        {dictationText && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Original text length: {targetWords} words
          </p>
        )}
      </div>

      {/* Text Area */}
      <div className="mb-4">
        <textarea
          value={userText}
          onChange={handleTextChange}
          placeholder="Type what you hear here...."
          className="w-full h-40 p-4 bg-[#EBEBEB] dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:bg-indigo-50 dark:focus:bg-indigo-900"
        />
      </div>

      {/* Word Count */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Word Written: <span className="font-medium">{wordCount}</span>
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Target: <span className="font-medium">{targetWords}</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleClearText}
          className="px-8 py-3 cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear Text
        </button>
        <button
          onClick={handleContinue}
          className="px-8 py-3 cursor-pointer bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ListeningDictation;









// import React, { useState } from 'react';

// interface ListeningDictationProps {
//   continueCallback: () => void; // <-- callback prop
// }

// const ListeningDictation: React.FC<ListeningDictationProps> = ({ continueCallback }) => {
//   const [text, setText] = useState('');
//   const targetWords = 30;

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//   };

//   const handleClearText = () => {
//     setText('');
//   };

//   const handleContinue = () => {
//     continueCallback();
//   };

//   const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

//   return (
//     <div className="mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
//       {/* Instruction */}
//       <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
//         <p className="text-gray-800 dark:text-gray-200 font-medium">
//           Listen carefully and write what you hear
//         </p>
//       </div>

//       {/* Text Area */}
//       <div className="mb-4">
//         <textarea
//           value={text}
//           onChange={handleTextChange}
//           placeholder="Type what you hear here...."
//           className="w-full h-40 p-4 bg-[#EBEBEB] dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:bg-indigo-50 dark:focus:bg-indigo-900"
//         />
//       </div>

//       {/* Word Count */}
//       <div className="flex justify-between items-center mb-6">
//         <span className="text-sm text-gray-600 dark:text-gray-400">
//           Word Written: <span className="font-medium">{wordCount}</span>
//         </span>
//         <span className="text-sm text-gray-600 dark:text-gray-400">
//           Target: <span className="font-medium">{targetWords}</span>
//         </span>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={handleClearText}
//           className="px-8 py-3 cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//         >
//           Clear Text
//         </button>
//         <button
//           onClick={handleContinue}
//           className="px-8 py-3 cursor-pointer bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ListeningDictation;
