/* eslint-disable @typescript-eslint/no-explicit-any */
// admin-ticket-detail-view.tsx
"use client"

import type React from "react"
import type { Ticket } from "./types"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { ConversationPanel } from "./conversation-panel"
import { UserInfoSidebar } from "./user-info-sidebar"
import { TicketDetailsSidebar } from "./ticket-details-sidebar"

interface AdminTicketDetailViewProps {
  ticket: Ticket
  messageInput: string
  onMessageChange: (message: string) => void
  onSendMessage: () => void
  onMarkAsResolved: () => void
  onBackToDashboard: () => void
  onUpdateTicketStatus: (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => void
  isSendingMessage?: any
  isUpdatingStatus?: any
  adminName?: string
  onRefreshTicket?: any
  ticketss?: any
}

export const AdminTicketDetailView: React.FC<AdminTicketDetailViewProps> = ({
  ticket,
  messageInput,
  onMessageChange,
  onSendMessage,
  onMarkAsResolved,
  onBackToDashboard,
  
}) => {
  
 
  //(ticket?.rawData?.data)
 

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Detail Header */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            
            
          
            
            <button
              onClick={onMarkAsResolved}
              disabled={ticket.status === "Resolved"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                ticket.status === "Resolved"
                  ? "bg-blue-600 text-white opacity-50 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              {ticket.status === "Resolved" && <CheckCircle size={18} />}
              {ticket.status === "Resolved" ? "Resolved" : "Mark As Resolved"}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Title and Status */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl"> <span>{ticket?.rawData?.data?.user?.name}</span></h1>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
             
             Ticket : {ticket?.rawData?.data?.id} 
              
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{ticket.subject}</p>
          </div>
          
          
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex h-full gap-8">
          {/* Conversation Panel (Left) */}
          <div className="flex-1">
            <ConversationPanel
              ticket={ticket}
              messageInput={messageInput}
              onMessageChange={onMessageChange}
              onSendMessage={onSendMessage}
              isAdmin={true}
            />
          </div>

          {/* Sidebar (Right) */}
          <div className="w-80 space-y-6">
            <UserInfoSidebar ticket={ticket} />
            <TicketDetailsSidebar ticket={ticket} />
            
            {/* Admin Actions Panel */}
            {/* <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">
                Admin Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => onUpdateTicketStatus(ticket.id, "IN_PROGRESS")}
                  className="w-full text-left px-4 py-2 rounded-lg cursor-pointer bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                >
                  Mark as In Progress
                </button>
                <button
                  onClick={() => onUpdateTicketStatus(ticket.id, "RESOLVED")}
                  className="w-full text-left px-4 py-2 cursor-pointer rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition"
                >
                  Mark as Resolved
                </button>
                
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};