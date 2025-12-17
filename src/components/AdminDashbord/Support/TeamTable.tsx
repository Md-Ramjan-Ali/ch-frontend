import React from "react";
import { TeamMember } from "./types";

interface Props {
  teamMembers: TeamMember[];
}

const TeamTable: React.FC<Props> = ({ teamMembers }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
        {teamMembers.map((member) => (
          <tr key={member.id}>
            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {member.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
              {member.role}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.online
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {member.online ? "Online" : "Offline"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TeamTable;
