/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import type { Ticket } from "./types"
import { useGetMyTicketsQuery } from "@/redux/features/tickets/ticketsApi"
import PageLoader from "@/Layout/PageLoader"

interface StatsCardsProps {
  tickets: Ticket[]
  statsData?: {
    totalTickets: number
    openTickets: number
    inProgressTickets: number
    resolvedTickets: number
    averageResponseTime: string
  }
  userRole?: string
}

export const StatsCards: React.FC<StatsCardsProps> = ({ tickets, statsData, userRole }) => {
  //(tickets,statsData,userRole)

     const { data: myTicketsData, isLoading: isLoadingTickets } = useGetMyTicketsQuery();
     //(tickets)
  //(myTicketsData,"MyTicketsData") 
console.log(myTicketsData,"myticketsdata")
if (isLoadingTickets) {
    return (
     <>
     <PageLoader/></>
        
        )}





  const rawTickets = Array.isArray(myTicketsData )
    ? myTicketsData
    // : myTicketsData?.tickets || myTicketsData?.data || [];
    : [];

// Format API response for display
  const formattedTickets: Ticket[] = rawTickets.map((ticket: any) => ({
    id: ticket.id,
    subject: ticket.subject,
    responses: ticket.messages?.length || 0,
    user: ticket.messages?.[0]?.sender?.name || "User",
    email: ticket.messages?.[0]?.sender?.email || "Unknown",
    priority: ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase(),
    category: ticket.status === "RESOLVED" ? "Resolved" : "Open",
    lastUpdate: new Date(ticket.updatedAt).toLocaleDateString("en-GB"),
  }));

//(formattedTickets)

  // Use API stats if available for admin, otherwise calculate from local tickets
  const openTickets = statsData 
    ? statsData.openTickets + statsData.inProgressTickets
    : tickets.filter(t => t.category === "Open" || t.category === "Resolved").length;

  const stats = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
    ? [
        { label: "Total Tickets", value: statsData?.totalTickets || tickets.length },
        { label: "Open Tickets", value: openTickets },
        { label: "Resolved Today", value: statsData?.resolvedTickets || 0 },
        { label: "Avg Response Time", value: statsData?.averageResponseTime || "2.4 Hours" },
        { label: "Satisfaction", value: "4.6/5" },
      ]
    : [
        { label: "My Tickets", value: formattedTickets.length },
        { label: "Open Tickets", value: formattedTickets.filter(t => t.category === "Open").length },
        { label: "Resolved", value: formattedTickets.filter(t => t.category === "Resolved").length },
        { label: "Avg Response Time", value: "2.4 Hours" },
        { label: "Last Update", value: formattedTickets.length > 0 ? formattedTickets[0].lastUpdate : "N/A" },
      ]

  return (
    <div className="px-8 py-6 dark:bg-gray-800 mb-4 rounded-md">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}












// import React from "react"
// import type { Ticket } from "./types"

// interface StatsCardsProps {
//   tickets: Ticket[]
// }

// export const StatsCards: React.FC<StatsCardsProps> = ({ tickets }) => {
//   const openTickets = tickets.filter(
//     (t) => t.category === "Open" || t.category === "In Progress"
//   ).length

//   // Centralized card config for easy scaling
//   const stats = [
//     { label: "Total Tickets", value: tickets.length },
//     { label: "Open Tickets", value: openTickets },
//     { label: "Resolved Today", value: 8 },
//     { label: "Avg Response Time", value: "2.4 Hours" },
//     { label: "Satisfaction", value: "4.6/5" },
//   ]

//   return (
//     <div className="px-8 py-6 dark:bg-gray-800 mb-4 rounded-md">
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md"
//           >
//             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//               {stat.label}
//             </p>
//             <p className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100">
//               {stat.value}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
