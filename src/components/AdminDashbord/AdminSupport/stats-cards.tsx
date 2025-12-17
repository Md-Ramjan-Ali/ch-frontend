import React from "react"
import type { Ticket } from "./types"
import { useGetTicketStatsQuery } from "@/redux/features/tickets/ticketsApi"

interface StatsCardsProps {
  tickets: Ticket[]
  isAdmin: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({ tickets }) => {
  const { data: statsData } = useGetTicketStatsQuery()

  const totalResolved = tickets.filter(
    (t) => t.status === "Resolved"
  ).length

  const stats = [
    {
      label: "Total Tickets",
      value: statsData?.totalTickets ?? tickets.length,
    },
    {
      label: "Open Tickets",
      value: statsData?.openTickets ?? 0,
    },
    {
      label: "Resolved Today",
      value: statsData?.resolvedToday ?? 0,
    },
    {
      label: "Total Resolved",
      value: totalResolved,
    },
    {
      label: "Avg Response Time",
      value: statsData?.avgResponseTime ?? "—",
    },
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
