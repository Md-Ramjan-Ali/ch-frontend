// admin-tickets-table.tsx
"use client"

import { useState } from "react"
import type { Ticket } from "./types"
import { PriorityTag } from "./priority-tag"
import { CategoryTag } from "./category-tag"
import { MoreVertical, User, Mail, MessageSquare, Eye } from "lucide-react"
import { Pagination } from "./pagination"

interface AdminTicketsTableProps {
  tickets: Ticket[]
  onViewTicket: (ticket: Ticket) => void
  onUpdateTicketStatus: (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => void
  onQuickReply?: (ticketId: string, ticketSubject: string) => void
  renderQuickActions?: (ticket: Ticket) => React.ReactNode
}

export const AdminTicketsTable: React.FC<AdminTicketsTableProps> = ({ 
  tickets, 
  onViewTicket, 
  onUpdateTicketStatus,
  onQuickReply,
  renderQuickActions 
}) => {
  //(tickets)
  const [showActions, setShowActions] = useState<string | null>(null);

  const handleStatusChange = (ticketId: string, newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    onUpdateTicketStatus(ticketId, newStatus);
    setShowActions(null);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return "Just now";
  };

const ITEMS_PER_PAGE = 10

const [currentPage, setCurrentPage] = useState(1)

const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE)

const paginatedTickets = tickets.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
)
 

//(paginatedTickets)

 

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No tickets found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {tickets.length === 0 ? "No tickets available" : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 border-b dark:bg-gray-700 dark:border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Ticket ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Last Update</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Quick Actions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">More</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedTickets.map((ticket: Ticket) => {


//(ticket.rawData.id)
            return (

(
            <tr 
              key={ticket.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onViewTicket(ticket)}
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{ticket.id}</div>
                 
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                   <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-200">{ticket.subject}</div>
                <div className="text-xs text-gray-500">{ticket.responses} replies</div>
              </td>
                  </div>
                  
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-900 dark:text-gray-200">{ticket.user}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Mail size={10} />
                      {ticket.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <PriorityTag priority={ticket.priority} />
              </td>
              <td className="px-6 py-4">
                <CategoryTag category={ticket.category} />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-200">
                  {ticket.lastUpdate}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(ticket?.lastUpdateTime || ticket?.created || new Date().toISOString())}
                </div>
              </td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                {renderQuickActions ? (
                  renderQuickActions(ticket)
                ) : (
                  <div className="flex gap-2">
                    {onQuickReply && (
                      <button
                        onClick={() => onQuickReply(ticket.id, ticket.subject)}
                        className="p-1.5 hidden bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                        title="Quick Reply"
                      >
                        <MessageSquare size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onViewTicket(ticket.rawData.id)}
                      className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(showActions === ticket.id ? null : ticket.id);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
                
                {showActions === ticket.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                        Change Status
                      </div>
                      <button
                        onClick={() => handleStatusChange(ticket.id, "OPEN")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ↻ Mark as Open
                      </button>
                      <button
                        onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ⚙️ Mark as In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(ticket.id, "RESOLVED")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✓ Mark as Resolved
                      </button>
                      <button
                        onClick={() => handleStatusChange(ticket.id, "CLOSED")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                      >
                        ✕ Close Ticket
                      </button>
                      
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                        Actions
                      </div>
                      <button
                        onClick={() => {
                          onViewTicket(ticket);
                          setShowActions(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        👁️ View Full Details
                      </button>
                      {onQuickReply && (
                        <button
                          onClick={() => {
                            onQuickReply(ticket.id, ticket.subject);
                            setShowActions(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          💬 Quick Reply
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ticket.id);
                          setShowActions(null);
                          alert("Ticket ID copied!");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        📋 Copy Ticket ID
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ticket.email);
                          setShowActions(null);
                          alert("Email copied!");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        📧 Copy User Email
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          )


            )
              

          })}
        </tbody>
      </table>

<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

    </div>
  );
};