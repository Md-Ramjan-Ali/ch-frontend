/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import type { Ticket } from "./types"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { ConversationPanel } from "./conversation-panel"
import { UserInfoSidebar } from "./user-info-sidebar"
import { TicketDetailsSidebar } from "./ticket-details-sidebar"
import { useAddTicketMessageMutation, useGetTicketByIdQuery, useUpdateTicketStatusMutation } from "@/redux/features/tickets/ticketsApi"
  
interface TicketDetailViewProps {
  ticket: Ticket
  messageInput: string
  onMessageChange: (message: string) => void
   onMarkAsResolved: () => void
  onBackToDashboard: () => void
  userRole?: string
  currentUserId?: string
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  messageInput,
  onMessageChange,
   onMarkAsResolved,
  onBackToDashboard,
  userRole,
  currentUserId,
}) => {
  //(ticket)
  const [updateTicketStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
  const [addTicketMessage, { isLoading: isSendingMessage }] = useAddTicketMessageMutation();

 
  const { data: ticketData } = useGetTicketByIdQuery(ticket as any);
  const subject = ticketData?.data?.subject ?? [];
 
//(subject)

  const handleMarkAsResolved = async () => {
    if (!ticket || ticket.status === "Resolved") return;

    try {
      await updateTicketStatus({
        id: ticket.id,
        data: { status: "RESOLVED" }
      }).unwrap();
      
      onMarkAsResolved();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      alert("Failed to mark ticket as resolved");
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || !ticket) return;

    try {
      await addTicketMessage({
        id: ticket.id,
        data: { message: messageInput.trim() }
      }).unwrap();
      
       
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    }
  };

  // Only show "Mark as Resolved" button for admin/support staff
  const showResolveButton = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Detail Header */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            { userRole === 'USER'  ? 'Support Dashboard' : 'My Tickets'}
          </button>

          {showResolveButton && (
            <button
              onClick={handleMarkAsResolved}
              disabled={ticket.status === "Resolved" || isUpdatingStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                ticket.status === "Resolved" || isUpdatingStatus
                  ? "bg-green-600 text-white opacity-50 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              {(ticket.status === "Resolved" || isUpdatingStatus) && <CheckCircle size={18} />}
              {isUpdatingStatus ? "Updating..." : ticket.status === "Resolved" ? "Resolved" : "Mark As Resolved"}
            </button>
          )}
        </div>
      </div>

      {/* Ticket Title */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-300 mt-1"> Subject : {subject}</p>
        <h1 className="text-base  text-gray-600 dark:text-gray-100">
          Ticket :  {ticket as any}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex h-full gap-8">
          {/* Conversation Panel (Left) */}
          <ConversationPanel
            ticket={ticket}
            messageInput={messageInput}
            onMessageChange={onMessageChange}
            onSendMessage={handleSendMessage}
            isSendingMessage={isSendingMessage}
            currentUserId={currentUserId}
            userRole={userRole}
          />

          {/* Sidebar (Right) */}
          <div className="w-80 space-y-6">
            <UserInfoSidebar ticket={ticket} />
            <TicketDetailsSidebar ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  )
}











// "use client"

// import type React from "react"
// import type { Ticket } from "./types"
// import { ArrowLeft, CheckCircle } from "lucide-react"
// import { ConversationPanel } from "./conversation-panel"
// import { UserInfoSidebar } from "./user-info-sidebar"
// import { TicketDetailsSidebar } from "./ticket-details-sidebar"

// interface TicketDetailViewProps {
//   ticket: Ticket
//   messageInput: string
//   onMessageChange: (message: string) => void
//   onSendMessage: () => void
//   onMarkAsResolved: () => void
//   onBackToDashboard: () => void
// }

// export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
//   ticket,
//   messageInput,
//   onMessageChange,
//   onSendMessage,
//   onMarkAsResolved,
//   onBackToDashboard,
// }) => {
//   return (
//     <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
//       {/* Detail Header */}
//       <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={onBackToDashboard}
//             className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition font-medium"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             User Management
//           </button>

//           <button
//             onClick={onMarkAsResolved}
//             disabled={ticket.status === "Resolved"}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//               ticket.status === "Resolved"
//                 ? "bg-green-600 text-white opacity-50 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
//             }`}
//           >
//             {ticket.status === "Resolved" && <CheckCircle size={18} />}
//             {ticket.status === "Resolved" ? "Resolved" : "Mark As Resolved"}
//           </button>
//         </div>
//       </div>

//       {/* Ticket Title */}
//       <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800">
//         <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//           Ticket {ticket.id}
//         </h1>
//         <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{ticket.subject}</p>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 p-8 overflow-y-auto">
//         <div className="flex h-full gap-8">
//           {/* Conversation Panel (Left) */}
//           <ConversationPanel
//             ticket={ticket}
//             messageInput={messageInput}
//             onMessageChange={onMessageChange}
//             onSendMessage={onSendMessage}
//           />

//           {/* Sidebar (Right) */}
//           <div className="w-80 space-y-6">
//             <UserInfoSidebar ticket={ticket} />
//             <TicketDetailsSidebar ticket={ticket} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
