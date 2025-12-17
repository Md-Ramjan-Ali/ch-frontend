/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
 import CreateDeckModal from './CreateDeckModal';
import { EyeIcon,  BlockIcon } from './icons';
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
   useGetCategoryWithCardsQuery,
} from '@/redux/features/flashcards/flashcardsApi';
import { useNavigate } from 'react-router-dom';
import { FlashcardCategory } from '@/redux/features/flashcards/flashcards.types';

 

 
const FlashcardDecks: React.FC = () => {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading, error, refetch } = useGetAllCategoriesQuery();
  const {data: categoryWithCardsData  }= useGetCategoryWithCardsQuery(4);
  console.log(categoryWithCardsData)
 console.log(categoriesData)
   const [deleteCategory] = useDeleteCategoryMutation();
  // const [deleteFlashcard] = useDeleteFlashcardMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  // Convert API categories to FlashcardDeck format
  const decks: any = categoriesData?.success
    ? categoriesData.data.map((category: FlashcardCategory) => ({
        id: category.id,
        title: category.title,
        description: `Category ID: ${category.id}`,
         difficulty: category.difficulty ,
          lastModified:  category.createdAt 
       }))
    : [];

 


 

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category and all its cards?')) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleViewCategory = (id: number) => {
  navigate(`/admin/content/flashcards/category/${id}`);
};

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400">Error loading flashcard decks</div>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-200">Flashcard Categories</h2>
          <p className="text-slate-500 mt-1 dark:text-gray-400">Manage your Italian learning flashcard collections</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Category
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-gray-400">
            <thead className="text-xs text-slate-700 dark:text-gray-200 uppercase bg-slate-50 dark:bg-gray-700 tracking-wider">
              <tr>
                 <th scope="col" className="px-6 py-3">Title</th>
                 <th scope="col" className="px-6 py-3">Difficulty</th>
                 <th scope="col" className="px-6 py-3">Created At</th>
        
                
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {decks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-gray-400">
                    No flashcard categories found. Create your first category!
                  </td>
                </tr>
              ) : (
                decks.map((deck:any) => (
                  <tr key={deck.id} className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 hover:bg-slate-50/70 dark:hover:bg-gray-700">
                     
                    
                    
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-gray-200">
                      <div className="font-semibold">{deck.title}</div>
                    
                    </td>
                     <td className="px-6 py-4">{deck.difficulty} </td>
                     <td className="px-6 py-4">{deck.lastModified} </td>
                     
              
                   
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleViewCategory(deck.id)}
                          className="text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 transition-colors" 
                          aria-label="View"
                          title="View Category"
                        >
                          <EyeIcon />
                        </button>
                        {/* <button 
                          onClick={() => handleEditCategory(deck.id)}
                          className="text-slate-400 cursor-pointer hover:text-green-600 dark:hover:text-green-300 transition-colors" 
                          aria-label="Edit"
                          title="Edit Category"
                        >
                          <PencilIcon />
                        </button> */}
                        <button 
                          onClick={() => handleDeleteCategory(deck.id)}
                          className="text-slate-400 cursor-pointer hover:text-red-600 dark:hover:text-red-300 transition-colors" 
                          aria-label="Delete"
                          title="Delete Category"
                        >
                          <BlockIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    <div >
        <CreateDeckModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
       />
    </div>
    </div>
  );
};

export default FlashcardDecks;






 