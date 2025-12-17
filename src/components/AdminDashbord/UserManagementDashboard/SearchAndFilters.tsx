import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: 'All Role' | 'Pro' | 'Free';
  setRoleFilter: React.Dispatch<React.SetStateAction<'All Role' | 'Pro' | 'Free'>>;
  statusFilter: 'All Status' | 'Active' | 'Suspended';
  setStatusFilter: React.Dispatch<React.SetStateAction<'All Status' | 'Active' | 'Suspended' >>;
 }

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="rounded-lg p-6 mb-6 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-200 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <select
          className="px-4 py-2 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-700"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'All Role' | 'Pro' | 'Free')}
        >
          <option>All Role</option>
          <option>Pro</option>
          <option>Free</option>
        </select>

        {/* Status Filter */}
        <select
          className="px-4 py-2 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All Status' | 'Active' | 'Suspended')}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilters;










// import React from 'react';
// import { Search } from 'lucide-react';

// interface SearchAndFiltersProps {
//   searchTerm: string;
//   setSearchTerm: (value: string) => void;
//   roleFilter: 'All Role' | 'Pro' | 'Free';
//   setRoleFilter: React.Dispatch<React.SetStateAction<'All Role' | 'Pro' | 'Free'>>;
//   statusFilter: 'All Status' | 'Active' | 'Suspended';
//   setStatusFilter: React.Dispatch<React.SetStateAction<'All Status' | 'Active' | 'Suspended'>>;
// }

// const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
//   searchTerm,
//   setSearchTerm,
//   roleFilter,
//   setRoleFilter,
//   statusFilter,
//   setStatusFilter,
// }) => {
//   return (
//     <div className="rounded-lg p-6 mb-6 bg-white dark:bg-gray-800">
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Search Input */}
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-200 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search ..."
//             className="w-full pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Role Filter */}
//         <select
//           className="px-4 py-2 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-700"
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value as 'All Role' | 'Pro' | 'Free')}
//         >
//           <option>All Role</option>
//           <option>Pro</option>
//           <option>Free</option>
//         </select>

//         {/* Status Filter */}
//         <select
//           className="px-4 py-2 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-700"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as 'All Status' | 'Active' | 'Suspended')}
//         >
//           <option>All Status</option>
//           <option>Active</option>
//           <option>Suspended</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default SearchAndFilters;
