import type React from "react";
import type { TeamMember } from "./types";
import { Star } from "lucide-react";

interface TeamManagementTableProps {
  members: TeamMember[];
}

export const TeamManagementTable: React.FC<TeamManagementTableProps> = ({ members }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Online":
        return "bg-green-500"; // Online status color
      case "Busy":
        return "bg-orange-500"; // Busy status color
      case "Offline":
        return "bg-gray-500"; // Offline status color
      default:
        return "bg-gray-400"; // Default color for unknown status
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Member</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Tickets Resolved</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Rating & status</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((memberItem: TeamMember, index: number) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{memberItem.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{memberItem.email}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{memberItem.role}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{memberItem.ticketsResolved}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                {memberItem.avgRating.toFixed(1)}
              </td>
              <td className="px-6 py-4 flex items-center">
                <span
                  className={`h-2 w-2 rounded-full inline-block mr-2 ${getStatusColor(memberItem.status)}`}
                ></span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{memberItem.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
