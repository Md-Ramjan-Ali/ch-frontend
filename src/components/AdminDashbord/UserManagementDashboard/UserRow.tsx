
import React from 'react';
import { Edit2, Ban } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Pro' | 'Free';
  status: 'Active' | 'Inactive' | 'Suspended';
  progress: number;
  avatar: string | null;
  subscriptionPlan?: 'FREE' | 'PRO';
  isActive?: boolean;
    xp?: number; 
    lessonsCompleted?: number; 
    totalMinutesStudied?: number; 
}

interface UserRowProps {
  user: User;
  avatarColor: string;
  onEdit?: (id: string) => void;
  onSuspend?: (id: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, avatarColor, onEdit, onSuspend }) => {
  // Get first letter of name for avatar
  const avatarLetter = user.name.charAt(0).toUpperCase();
  
  // Map subscription plan to role
  const userRole = user.subscriptionPlan === 'PRO' ? 'Pro' : 'Free';
  
  // Map isActive to status
  const userStatus = user.isActive ? 'Active' : (user.status === 'Suspended' ? 'Suspended' : 'Inactive');
  
  // Calculate progress based on XP or lessons completed (you can adjust this logic)
  const progress = user.progress || Math.min((user.xp|| 0) / 10, 100);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm mr-3`}
          >
            {avatarLetter}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.email}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${userRole === 'Pro' ? 'text-orange-500' : 'text-gray-600'} dark:text-orange-400`}>
          {userRole}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            userStatus === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : userStatus === 'Suspended'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {userStatus}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
            {Math.round(progress)}%
          </span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit && onEdit(user.id)} 
            className="text-blue-600 cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onSuspend && onSuspend(user.id)}
            className="text-red-600 cursor-pointer hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;









// import React from 'react';
// import { Edit2, Ban } from 'lucide-react';

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'Pro' | 'Free';
//   status: 'Active' | 'Suspended';
//   progress: number;
//   avatar: string;
// }

// interface UserRowProps {
//   user: User;
//   avatarColor: string;
//   onEdit?: () => void;
// }

// const UserRow: React.FC<UserRowProps> = ({ user, avatarColor, onEdit }) => {
//   return (
//     <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm mr-3`}>
//             {user.avatar}
//           </div>
//           <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span className={`text-sm font-medium ${user.role === 'Pro' ? 'text-orange-500' : 'text-gray-600'} dark:text-orange-400`}>
//           {user.role}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span
//           className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//             user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           } `}
//         >
//           {user.status}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.progress}%</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         <div className="flex items-center gap-2">
//           <button onClick={onEdit} className="text-blue-600 cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">
//             <Edit2 className="w-4 h-4" />
//           </button>
//           <button className="text-red-600 cursor-pointer hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">
//             <Ban className="w-4 h-4" />
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default UserRow;
