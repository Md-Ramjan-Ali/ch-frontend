import React from "react";
 import totalusericon from "../../../assets/Dashbord/fi_8.svg";
import activeusericon from "../../../assets/Dashbord/fi_9.svg";
import subscribicon from "../../../assets/Dashbord/fi_10.svg";
 import { useGetUserMetadataQuery } from "@/redux/features/userManagement/usermanagementApi";

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  loading: boolean;
}

const AdminStatsCards: React.FC = () => {
  const { data: metadata, isLoading } = useGetUserMetadataQuery({});
//(metadata)
  const stats: StatCard[] = [
    { 
      label: "Total Users", 
      value: metadata?.data.totalUsers || 0, 
      icon: totalusericon,
      loading: isLoading 
    },
    { 
      label: "Suspended Users", 
      value: metadata?.data.suspendedUsers || 0, 
      icon: totalusericon,
      loading: isLoading 
    },
    { 
      label: "Active Users", 
      value: metadata?.data.activeUsers || 0, 
      icon: activeusericon,
      loading: isLoading 
    },
    { 
      label: "Pro Subscribers", 
      value: metadata?.data.proSubscribers || 0, 
      icon: subscribicon,
      loading: isLoading 
    },
    
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-gray-800 dark:text-gray-200 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium text-base dark:text-gray-400">
              {item.label}
            </span>
            <img
              src={item.icon}
              alt={item.label}
              className="w-6 h-6 object-contain"
            />
          </div>
          {item.loading ? (
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <div className="text-2xl text-[#333] font-bold dark:text-gray-200">
              {item.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;













// import React from "react";
// import totalusericon from "../../../assets/Dashbord/fi_8.svg";
// import activeusericon from "../../../assets/Dashbord/fi_9.svg";
// import subscribicon from "../../../assets/Dashbord/fi_10.svg";
// import revenueicon from "../../../assets/Dashbord/fi_11.svg";

 

// interface StatCard {
//   label: string;
//   value: string | number;
//   icon: string; // ✅ fixed type
// }

// const AdminStatsCards: React.FC = () => {
//   const stats: StatCard[] = [
//     { label: "Total Users", value: 342, icon: totalusericon },
//     { label: "Active Users", value: 241, icon: activeusericon },
//     { label: "Pro Subscribers", value: 133, icon: subscribicon },
//     { label: "Monthly Revenue", value: "$12,847", icon: revenueicon },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//       {stats.map((item, idx) => (
// <div key={idx} className="bg-white dark:bg-gray-800 dark:text-gray-200 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-gray-500 font-medium text-base dark:text-gray-400">{item.label}</span>
//             <img
//               src={item.icon}
//               alt={item.label}
//               className="w-6 h-6 object-contain"
//             />
//           </div>
//           <div className="text-2xl text-[#333] font-bold dark:text-gray-200">{item.value}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminStatsCards;
