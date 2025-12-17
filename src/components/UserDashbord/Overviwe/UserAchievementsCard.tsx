import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Achievement {
  name: string;
  icon: React.FC<any>;
  time: string;
  iconColor: string;
  bgColor: string;
}

interface AchievementsCardProps {
  achievements: Achievement[];
}

export const UserAchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => (
  <div className="bg-white dark:bg-[#34485D] rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Achievements</h3>
    <div className="space-y-3">
      {achievements.map((ach) => (
        <div
  key={ach.name}
  className={`flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-gray-100 dark:border-gray-700`}
>
  <div className={`p-2 rounded-lg ${ach.bgColor} mr-3`}>
    <ach.icon className={`w-5 h-5 ${ach.iconColor}`} />
  </div>
  <div className="flex-grow">
    <p className="font-medium text-gray-800 dark:text-gray-100">{ach.name}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{ach.time}</p>
  </div>
  <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
</div>
      ))}
    </div>
   
     <button
        
        className="w-full border cursor-pointer border-[#333] text-[#333]  mt-8 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-800 transition duration-150"
      >
          View All Achievements
      </button>
  </div>
);












// import React from 'react';
// import { TrendingUp } from 'lucide-react';

// interface Achievement {
//   name: string;
//   icon: React.FC<any>;
//   time: string;
//   iconColor: string;
//   bgColor: string;
// }

// interface AchievementsCardProps {
//   achievements: Achievement[];
// }

// export const UserAchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => (
//   <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//     <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
//     <div className="space-y-3">
//       {achievements.map((ach) => (
//         <div key={ach.name} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100">
//           <div className={`p-2 rounded-lg ${ach.bgColor} mr-3`}>
//             <ach.icon className={`w-5 h-5 ${ach.iconColor}`} />
//           </div>
//           <div className="flex-grow">
//             <p className="font-medium text-gray-800">{ach.name}</p>
//             <p className="text-xs text-gray-500">{ach.time}</p>
//           </div>
//           <TrendingUp className="w-4 h-4 text-gray-400" />
//         </div>
//       ))}
//     </div>
//     <button className="w-full mt-6 cursor-pointer bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition">
//       View All Achievements
//     </button>
//   </div>
// );
