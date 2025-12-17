import type React from "react"
import type { Ticket } from "./types"
import { Calendar } from "lucide-react"

interface UserInfoSidebarProps {
  ticket: Ticket
}

export const UserInfoSidebar: React.FC<UserInfoSidebarProps> = ({ ticket }) => {
  //(ticket.rawData)
  //(ticket?.rawData?.data?.user?.name)
 return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        User Information
      </h2>

      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-bold text-lg">
          {ticket?.rawData?.data?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{ticket?.rawData?.data?.user?.name}</p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-300">{ticket?.rawData?.email}</p> */}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <p className="flex items-center text-gray-700 dark:text-gray-200">
          <Calendar size={16} className="mr-2 text-gray-400 dark:text-gray-400" /> 
          <span className="font-medium mr-1">Joined : </span> {ticket?.rawData?.data?.createdAt.slice(0, 10) || "N/A"}
        </p>
        
      </div>
    </div>
  )
}
