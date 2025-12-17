import React from 'react';
import { Award, BarChart4 } from 'lucide-react'; // Using lucide-react for icons

const AdvancedAnalyticsCard: React.FC = () => {
  return (
    <div className="mt-8 p-8 rounded-2xl text-white shadow-xl 
                    bg-gradient-to-br from-indigo-700 to-purple-800 
                    transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]">
      
      {/* Title with Icon */}
      <div className="flex items-center mb-4">
        <BarChart4 className="w-6 h-6 mr-3 text-yellow-300" />
        <h2 className="text-2xl font-semibold">
          Advanced Analytics
        </h2>
      </div>

      {/* Subtitle/Description */}
      <h3 className="text-xl font-light opacity-90 mb-6">
        CEFR Domain Analysis
      </h3>
      <p className="text-sm opacity-75 mb-8">
        See detailed performance across all language domains
      </p>

      {/* Upgrade Button */}
      <button 
        className="flex items-center px-6 py-3 font-semibold cursor-pointer rounded-full 
                   bg-yellow-500 text-indigo-900 shadow-lg 
                   hover:bg-yellow-400 hover:shadow-xl transition-all duration-200"
        onClick={() => ('Upgrade To Pro clicked')}
      >
        <Award className="w-5 h-5 mr-2" />
        Upgrade To Pro
      </button>
    </div>
  );
};

export default AdvancedAnalyticsCard;