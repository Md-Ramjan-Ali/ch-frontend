/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import type { Ticket } from "./types"
import { Calendar, Star } from "lucide-react"
import { useGetTicketByIdQuery } from "@/redux/features/tickets/ticketsApi"

interface UserInfoSidebarProps {
  ticket: Ticket
}

export const UserInfoSidebar: React.FC<UserInfoSidebarProps> = ({ ticket }) => {

//(ticket)
  // const formattedTickets: Ticket[] = ticket.map((ticket: any) => ({
  //   id: ticket.id,
  //   subject: ticket.subject,
  //   responses: ticket.messages?.length || 0,
  //   user: ticket.messages?.[0]?.sender?.name || "User",
  //   email: ticket.messages?.[0]?.sender?.email || "Unknown",
  //   priority: ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase(),
  //   category: ticket.status === "RESOLVED" ? "Resolved" : "Open",
  //   lastUpdate: new Date(ticket.updatedAt).toLocaleDateString("en-GB"),
  // }));

const {data}=useGetTicketByIdQuery(ticket as any)
// //(data.data.subject)

//(data)


  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        User Information
      </h2>

      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-bold text-lg">
          {data?.data?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{data?.data?.user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{ticket.email}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <p className="flex items-center text-gray-700 dark:text-gray-200">
          <Calendar size={16} className="mr-2 text-gray-400 dark:text-gray-400" /> 
          <span className="font-medium mr-1">Joined: </span> {ticket.joined || data?.data?.user?.createdAt.slice(0, 10)}
        </p>
        <p className="flex items-center text-gray-700 dark:text-gray-200">
          <Star size={16} className="mr-2 text-gray-400 dark:text-gray-400" /> 
          <span className="font-medium">Current Level:</span>{" "}
          <span className="ml-1 font-medium text-green-600 dark:text-green-400">{ticket.subscription ||  data?.data?.user?.currentLevel}</span>
        </p>
      </div>
    </div>
  )
}
