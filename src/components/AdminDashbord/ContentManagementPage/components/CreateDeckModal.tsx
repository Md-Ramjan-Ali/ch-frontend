
import React, { useState } from 'react';
 import { useCreateCategoryMutation } from '@/redux/features/flashcards/flashcardsApi';
 
interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
 }

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
 
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const result = await createCategory({ title }).unwrap();
      
      if (result.success) {
        // Create the deck object for UI
        
        
      
        setTitle('');
       
        onClose();
      }
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  return (
    <div 
      className="absolute  inset-0  bg-opacity-60 backdrop-blur-md flex justify-center items-center  dark:bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Create New Category</h2>
          <p className="text-slate-500 mt-2 dark:text-gray-400">Add a new flashcard category to your Italian learning content</p>
        </div>
        
      

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="deck-title" className="block text-sm font-medium text-slate-700 dark:text-gray-200">
              Category Title *
            </label>
            <input
              id="deck-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter category title"
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              required
              disabled={isLoading}
            />
          </div>
          
          

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeckModal;









// import React, { useState } from 'react';
// import { Difficulty, FlashcardDeck, Category, Status } from './types';

// interface CreateDeckModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCreate: (newDeck: Omit<FlashcardDeck, 'id' | 'cards' | 'lastModified'>) => void;
// }

// const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose, onCreate }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
//   const [category, setCategory] = useState<Category>(Category.Reading);
//   const [status, setStatus] = useState<Status>(Status.Drafted);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !description.trim()) return;
//     onCreate({ title, description, difficulty, category, status, avgRating: 0 });
//     setTitle('');
//     setDescription('');
//     setDifficulty(Difficulty.Beginner);
//     setCategory(Category.Reading);
//     setStatus(Status.Drafted);
//     onClose();
//   };

//   return (
//     <div 
//       className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50 dark:bg-black/50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Create New Flashcard Deck</h2>
//           <p className="text-slate-500 mt-2 dark:text-gray-400">Add a new flashcard deck to your Italian learning content</p>
//         </div>
//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <div>
//             <label htmlFor="deck-title" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Deck Title</label>
//             <input
//               id="deck-title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter deck title"
//               className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Description</label>
//             <input
//               id="description"
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter deck description"
//               className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Difficulty Level</label>
//             <select
//               id="difficulty"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value as Difficulty)}
//               className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             >
//               {Object.values(Difficulty).map(level => (
//                 <option key={level} value={level}>{level}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Category</label>
//             <select
//               id="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value as Category)}
//               className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             >
//               {Object.values(Category).map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Status</label>
//             <select
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value as Status)}
//               className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             >
//               {Object.values(Status).map(stat => (
//                 <option key={stat} value={stat}>{stat}</option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
//           >
//             Create Deck
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateDeckModal;
