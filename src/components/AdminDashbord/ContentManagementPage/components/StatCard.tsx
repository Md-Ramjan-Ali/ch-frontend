import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm flex justify-between items-start dark:bg-gray-800 transition-colors hover:shadow-md ${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
      }`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1 dark:text-gray-200">{value}</p>
      </div>
      <div className="text-blue-600 bg-blue-100 p-3 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;









// import React from 'react';

// interface StatCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
//   return ( 
//     <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-start dark:bg-gray-800">
//       <div>
//         <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{title}</p>
//         <p className="text-3xl font-bold text-slate-900 mt-1 dark:text-gray-200">{value}</p>
//       </div>
//       <div className="text-blue-600 bg-blue-100 p-3 rounded-full dark:bg-blue-700">
//         {icon}
//       </div>
//     </div>
//   );
// };

// export default StatCard;