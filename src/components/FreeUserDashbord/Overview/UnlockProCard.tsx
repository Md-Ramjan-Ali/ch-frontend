// UnlockProCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface UnlockProCardProps {
  title: string; // Title (e.g., "Unlock Pro")
  description: string; // Description/Feature List
  buttonText: string; // Text for the call-to-action button (e.g., "Try 7 Days Free")
  onButtonClick?: () => void; // Optional: Function to call when the button is clicked
}

const UnlockProCard: React.FC<UnlockProCardProps> = ({ 
  title, 
  description, 
  buttonText, 
 }) => {
  return (
    <div className="p-6 sm:p-8 bg-gray-50 rounded-xl shadow-md mx-auto border border-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
      {/* --- Card Content --- */}
      <div className="mb-6">
        <div className="flex items-center mb-1">
          {/* Crown Icon */}
          <span className="text-2xl mr-3 text-yellow-500" role="img" aria-label="crown">
            👑
          </span>
          {/* Dynamically display the title */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        </div>
        
        {/* Dynamically display the description */}
        <p className="text-sm text-gray-600 ml-9 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* --- Gradient Button --- */}
      <Link to="/" 
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors inline-block"
        style={{ background: "linear-gradient(180deg, #667EEA 0%, #764BA2 100%)" }}
         aria-label="Unlock Pro Access"
      >
        {/* Dynamically display the button text */}
        {buttonText}
      </Link >
    </div>
  );
};

export default UnlockProCard;
