// AdvancedAnalyticsCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AdvancedAnalyticsCardProps {
  prodata?: string | boolean;
  hasUsedTrial?: boolean | string;
}



const FreeUserAdvancedAnalyticsCard: React.FC<AdvancedAnalyticsCardProps> = () => {
  return (
    <div className="
      p-6 md:p-8 
      rounded-xl 
      shadow-2xl 
      text-white 
   
      
      mt-8
    "   style={{ background: "linear-gradient(180deg, #667EEA 0%, #764BA2 100%)" }}>
      
      <div className="flex items-center mb-6">
        {/* Icon (Simulated) */}
        <span className="
          text-2xl mr-3 
          p-1 
          rounded 
          bg-white/10 
          shadow-md
        " role="img" aria-label="chart with checkmark">
          <span className="text-green-300">✓</span>📊
        </span>
        
        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-wide">
          Advanced Analytics
        </h1>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium tracking-wider mb-1">
          CEFR Domain Analysis
        </h2>
        <p className="text-white/80 text-sm">
          See detailed performance across all language domains
        </p>
      </div>

<button>
        <Link to='/'
        className="
          flex items-center 
          px-5 py-2 
          cursor-pointer
          rounded-xl 
          bg-white/10 
          hover:bg-white/20 
          transition-colors 
          text-white 
          font-medium 
          shadow-md
        "
      >
        <span className="text-xl mr-2 text-yellow-400" role="img" aria-label="crown">
          👑
        </span>
        Upgrade To Pro
      </Link>
</button>

    </div>
  );
};

export default FreeUserAdvancedAnalyticsCard;