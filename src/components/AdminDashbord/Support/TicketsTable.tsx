import React from "react"
import { Ticket } from "./types"
import { getPriorityColor, getCategoryColor } from "./colors"

interface TicketsTableProps {
  tickets: Ticket[]
  onViewTicket: (ticket: Ticket) => void;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({ tickets, onViewTicket }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No tickets available. Create one to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Ticket ID", "Subject", "User", "Priority", "Category", "Last Update", "Action"].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y bg-white">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onViewTicket(ticket)}
            >
              <td className="px-6 py-4 font-medium text-gray-900">{ticket.id}</td>

              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{ticket.subject}</div>
                <div className="text-xs text-gray-500">{ticket.responses} responses</div>
              </td>

              <td className="px-6 py-4">
                <div className="text-gray-900">{ticket.user}</div>
                <div className="text-xs text-gray-500">{ticket.email}</div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`${getPriorityColor(
                    ticket.priority
                  )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {ticket.priority}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`${getCategoryColor(
                    ticket.category
                  )} px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {ticket.category}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-500">{ticket.lastUpdate}</td>

              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewTicket(ticket)
                  }}
                  className="text-blue-600 hover:underline font-medium transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
