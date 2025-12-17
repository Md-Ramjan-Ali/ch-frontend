import React, { useState } from 'react';
import { Plan } from './types';
import { XIcon } from './icons';

interface AddNewPlanModalProps {
  onClose: () => void;
  onAddPlan: (newPlan: Omit<Plan, 'id' | 'activeUsers'>) => void;
}

const AddNewPlanModal: React.FC<AddNewPlanModalProps> = ({ onClose, onAddPlan }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  const handleAddFeature = () => {
    if (newFeature.trim() !== '' && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && price && description && features.length > 0) {
      onAddPlan({
        title,
        price: parseFloat(price),
        description,
        features,
        period: 'month',
      });
      onClose();
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all duration-300 scale-95 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-200">Add New Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (per month)</label>
            <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm dark:text-gray-400">€</span>
                </div>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-12 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500"
                    required
                    min="0"
                    step="0.01"
                />
            </div>
          </div>
          <div>
            <label htmlFor="feature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Feature</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a new feature"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center cursor-pointer px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Add
              </button>
            </div>
          </div>
          {features.length > 0 && (
            <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Added features:</p>
                <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full dark:bg-blue-700 dark:text-white">
                            {feature}
                            <button type="button" onClick={() => handleRemoveFeature(feature)} className="ml-2 text-blue-600 cursor-pointer hover:text-blue-800">
                                <XIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 cursor-pointer py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPlanModal;
