import React from 'react';

interface HeaderButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex cursor-pointer items-center gap-2 px-4 py-2 mb-6 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default HeaderButton;