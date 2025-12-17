// CategoryDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetCategoryWithCardsQuery,
  useCreateFlashcardMutation,
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
  useBulkUploadCsvMutation,
} from '@/redux/features/flashcards/flashcardsApi';
import { CreateFlashcardRequest, Flashcard } from '@/redux/features/flashcards/flashcards.types';
 
const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categoryId = parseInt(id || '0');
  
  const { data: categoryData, isLoading, refetch } = useGetCategoryWithCardsQuery(categoryId);
  const [createFlashcard] = useCreateFlashcardMutation();
  const [updateFlashcard] = useUpdateFlashcardMutation();
  const [deleteFlashcard] = useDeleteFlashcardMutation();
  const [bulkUploadCsv] = useBulkUploadCsvMutation();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [newCard, setNewCard] = useState<CreateFlashcardRequest>({
    frontText: '',
    backText: '',
    categoryId,
  });

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFlashcard(newCard).unwrap();
      setNewCard({ frontText: '', backText: '', categoryId });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to create flashcard:', error);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    
    try {
      await updateFlashcard({
        id: editingCard.id,
        data: { frontText: editingCard.frontText, backText: editingCard.backText },
      }).unwrap();
      setEditingCard(null);
      refetch();
    } catch (error) {
      console.error('Failed to update flashcard:', error);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await deleteFlashcard(cardId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete flashcard:', error);
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) return;
    
    try {
      await bulkUploadCsv({ file: csvFile, categoryId }).unwrap();
      setCsvFile(null);
      refetch();
    } catch (error) {
      console.error('Failed to upload CSV:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!categoryData?.success || !categoryData.data) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600">Category not found</h2>
          // Update the back button navigation:
<button 
  onClick={() => navigate('/admin/content/flashcards')}
  className="mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
>
  ← Back to Categories
</button>
        </div>
      </div>
    );
  }

  const category = categoryData.data;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin/content/flashcards')}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Categories
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Created: {new Date(category.createdAt).toLocaleDateString()} • 
            Cards: {category.cards?.length || 0}
          </p>
        </div>

        {/* Bulk Upload Section */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Bulk Upload CSV</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleBulkUpload}
              disabled={!csvFile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload CSV
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            CSV format: frontText,backText (one per line)
          </p>
        </div>

        {/* Create New Card Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Flashcard</h2>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Front Text</label>
                <input
                  type="text"
                  value={newCard.frontText}
                  onChange={(e) => setNewCard({ ...newCard, frontText: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Back Text</label>
                <input
                  type="text"
                  value={newCard.backText}
                  onChange={(e) => setNewCard({ ...newCard, backText: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Card Modal */}
        {editingCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Flashcard</h2>
              <form onSubmit={handleUpdateCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Front Text</label>
                  <input
                    type="text"
                    value={editingCard.frontText}
                    onChange={(e) => setEditingCard({ ...editingCard, frontText: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Back Text</label>
                  <input
                    type="text"
                    value={editingCard.backText}
                    onChange={(e) => setEditingCard({ ...editingCard, backText: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Flashcards ({category.cards?.length || 0})</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Card
            </button>
          </div>
          
          {category.cards && category.cards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Front</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Back</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.cards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{card.frontText}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{card.backText}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCard(card)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No flashcards yet. Create your first card!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;