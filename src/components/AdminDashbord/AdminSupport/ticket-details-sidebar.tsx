import type React from "react"
import type { Ticket } from "./types"
import { PriorityTag } from "./priority-tag"
import { CategoryTag } from "./category-tag"

interface TicketDetailsSidebarProps {
  ticket: Ticket
}

export const TicketDetailsSidebar: React.FC<TicketDetailsSidebarProps> = ({ ticket }) => {
  //(ticket?.rawData?.data?.priority)
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4 dark:text-gray-200 dark:border-gray-700">Ticket Details</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Status</span>
          <CategoryTag category={ticket?.rawData?.data?.status || "N/A"} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Priority</span>
          <PriorityTag priority={ticket?.rawData?.data?.priority} />
        </div>
        
        <p className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Created</span>
          <span className="font-medium dark:text-gray-200">{ticket?.rawData?.data?.createdAt?.slice(0, 10) || "N/A"}</span>
        </p>
        <p className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Last Update</span>
          <span className="font-medium dark:text-gray-200">{ticket?.rawData?.data?.updatedAt?.slice(0, 10)|| "N/A"}</span>
        </p>
        <p className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Category</span>
          <span className="font-medium dark:text-gray-200">{ticket?.categoryDetail || "N/A"}</span>
        </p>
      </div>
    </div>
  )
}
