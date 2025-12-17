// PracticeAreaCard.tsx
import React from 'react';

interface PracticeAreaCardProps {
  icon: string; // Unicode or an Icon component
  skill: string;
  lessonsCompleted: number;
  progress: number; // 0-100
  iconColor: string; // Tailwind color class (e.g., 'text-skill-blue')
}

const FreeUserPracticeAreaCard: React.FC<PracticeAreaCardProps> = ({ icon, skill, lessonsCompleted, progress, iconColor }) => (
  <div className="bg-white p-4 rounded-xl shadow-custom">
    <div className="flex items-center mb-3">
      <div className={`p-2 rounded-lg text-white ${iconColor === 'text-skill-blue' ? 'bg-skill-blue' : iconColor === 'text-skill-orange' ? 'bg-skill-orange' : iconColor === 'text-skill-green' ? 'bg-skill-green' : 'bg-skill-purple'}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="ml-3">
        <h3 className="text-md font-medium text-gray-800">{skill}</h3>
        <p className="text-sm text-gray-500">{lessonsCompleted} Lessons completed</p>
      </div>
    </div>
    
    {/* Progress Bar */}
    <div className="h-2 bg-gray-200 rounded-full mb-1">
      <div 
        className={`h-2 rounded-full ${iconColor === 'text-skill-blue' ? 'bg-skill-blue' : iconColor === 'text-skill-orange' ? 'bg-skill-orange' : iconColor === 'text-skill-green' ? 'bg-skill-green' : 'bg-skill-purple'}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-sm text-gray-500 font-medium">{progress}% Completed</p>
  </div>
);

export default FreeUserPracticeAreaCard;