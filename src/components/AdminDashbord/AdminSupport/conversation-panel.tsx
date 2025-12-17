"use client";

import React from "react";
import { Send, Paperclip } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { Message, Ticket } from "./types";
import { useGetTicketByIdQuery } from "@/redux/features/tickets/ticketsApi";
import { IoPersonCircle } from "react-icons/io5";

interface ConversationPanelProps {
  ticket: Ticket;
  messageInput: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  isSendingMessage?: boolean;
  isAdmin: boolean;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  ticket,
  messageInput,
  onMessageChange,
  onSendMessage,
  isSendingMessage = false,
}) => {
  const ticketId = ticket?.rawData?.data?.id;

 




const { data: userdata, isLoading: userLoading } = useGetMeQuery({});
const currentUserRole = userdata?.data?.role;

// Only show reply input if current user is a USER
const canReply = !userLoading && currentUserRole === "SUPORT_MANAGER"||"SUPER_ADMIN";
//("Can reply?", canReply);



  // Fetch ticket details
  const { data: myTicket, isLoading: ticketLoading } = useGetTicketByIdQuery(ticketId);

  // Only the ticket owner can reply
  
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col min-h-full transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Conversation
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Messages between user and support team
        </p>
      </div>

      {/* Messages */}
   

<div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px] min-h-[300px]">
  {ticketLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        ) : (
          myTicket?.data?.messages?.map((msg: Message, index: number) => {
    // ⭐ ROLE BASED ALIGNMENT ⭐
          const isUserMessage =
              msg?.sender?.role === "SUPPORT_MANAGER" ||
              msg?.sender?.role === "SUPER_ADMIN";
    const justifyClass = isUserMessage ? "justify-end" : "justify-start";
    const flexRowClass = isUserMessage ? "flex-row-reverse" : "flex-row";

    const bubbleClass = isUserMessage
      ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white rounded-tr-none"
      : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-tl-none";

    const textAlignClass = isUserMessage ? "text-right" : "text-left";

    const senderColorClass = isUserMessage
      ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
      : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white";

    return (
      <div key={index} className={`flex ${justifyClass}`}>
        <div className={`flex items-start max-w-xl ${flexRowClass}`}>
          {/* Avatar */}
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${senderColorClass} mr-3`}
          >
            
<IoPersonCircle size={40} />




          </div>

          {/* Content */}
          <div className="flex flex-col">
            {/* Sender Info */}
            <div className={`text-xs mb-1 ${textAlignClass}`}>
              <span className="font-semibold">
              <span className="font-semibold">
  {msg.sender.role === "SUPPORT_MANAGER"||msg.sender.role === "SUPER_ADMIN" ? "You" : msg.sender.name}
</span>
               
                </span> ·{" "}
              {msg.sender.role} ·{" "}
             {msg.createdAt
  ? new Date(msg.createdAt).toLocaleTimeString()
  : ""}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-xl shadow-sm max-w-md ${bubbleClass}`}>
              <p className={`text-sm whitespace-pre-wrap ${isUserMessage ? 'text-white' : 'text-black dark:text-white'}`}>
                {msg.message}
              </p>

              {/* Attachment */}
              {msg.attachment && (
                <a
                  href="#"
                  className={`flex items-center mt-2 text-xs font-medium underline ${
                    isUserMessage
                      ? "text-blue-200"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <Paperclip size={12} className="mr-1" />
                  {msg.attachment}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }))}
</div>








      {/* Reply Input */}
      {canReply && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
  <div className="relative">
    <textarea
      value={messageInput}
      onChange={(e) => onMessageChange(e.target.value)}
      placeholder={
        canReply ? "Write your message here" : "You cannot reply to this ticket"
      }
      rows={3}
      className="w-full p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
      disabled={!canReply || isSendingMessage}
    />
    <button
      onClick={onSendMessage}
      className="absolute bottom-8 cursor-pointer right-5 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={!canReply || messageInput.trim() === "" || isSendingMessage}
      aria-label="Send message"
    >
      {isSendingMessage ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <Send size={20} />
      )}
    </button>
  </div>
</div>

      )}
    </div>
  );
};










// "use client"

// import React from "react";
// import { Send, Paperclip } from "lucide-react";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";
// import { Message, Ticket } from "./types";
// import { useGetMyTicketsQuery, useGetTicketByIdQuery } from "@/redux/features/tickets/ticketsApi";
 
// interface ConversationPanelProps {
//    messageInput: string;
//   onMessageChange: (message: string) => void;
//   onSendMessage: () => void;
//   isSendingMessage?: boolean;
// }

// export const ConversationPanel: React.FC<ConversationPanelProps> = ({
//   ticket,
//   messageInput,
//   onMessageChange,
//   onSendMessage,
//   isSendingMessage = false,
// }) => {
//   //(ticket.rawData.data.id)
//   // Get current logged-in user
//   const { data: userdata } = useGetMeQuery({});
//   const currentUserId = userdata?.data?.id;
//   const currentUserRole = userdata?.data?.role;
// const {data:myTicket}=useGetTicketByIdQuery(ticket.rawData.data.id)
// //(myTicket)

//    // Determine if current user can reply (USER can reply only to their own ticket)
//   const canReply = myTicket?.data[0]?.messages?.map(data=>data?.sender?.role==userdata?.data?.role);
// //(canReply)
//   return (
//     <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col min-h-full transition-colors">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//           Conversation
//         </h2>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Messages between user and support team
//         </p>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px] min-h-[300px]">
//         {myTicket?.data[0]?.messages?.map((msg: Message, index: number) => {
//           // Determine alignment
//           const isUserMessage = msg?.sender.id === currentUserId;
//           const isAdminMessage =
//             msg?.sender.role === "ADMIN" || msg?.sender.role === "SUPPORT_MANAGER";
// //(isAdminMessage)
//           const justifyClass = isUserMessage ? "justify-end" : "justify-start";
//           const flexRowClass = isUserMessage ? "flex-row-reverse" : "flex-row";

//           const bubbleClass = isUserMessage
//             ? "bg-blue-600 text-white dark:bg-blue-700 rounded-tr-none"
//             : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none";

//           const textAlignClass = isUserMessage ? "text-right" : "text-left";
//           const senderColorClass = isUserMessage
//             ? "bg-blue-600 text-white dark:bg-blue-700"
//             : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200";

//           return (
//             <div key={index} className={`flex ${justifyClass}`}>
//               <div className={`flex items-start max-w-xl ${flexRowClass}`}>
//                 {/* Avatar */}
//                 <div
//                   className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${senderColorClass} mr-3`}
//                 >
//                   {msg.sender?.name?.split(" ")?.map((n) => n[0])?.join("")}
//                 </div>

//                 {/* Message Content */}
//                 <div className="flex flex-col">
//                   {/* Sender Info */}
//                   <div className={`text-xs mb-1 ${textAlignClass}`}>
//                     <span className="font-semibold">{msg.sender.name}</span> ·{" "}
//                     {msg.sender.role} · {new Date(msg.createdAt).toLocaleTimeString()}
//                   </div>

//                   {/* Message Bubble */}
//                   <div className={`p-4 rounded-xl shadow-sm max-w-md ${bubbleClass}`}>
//                     <p className="text-sm whitespace-pre-wrap">{msg.message}</p>

//                     {/* Attachment */}
//                     {msg.attachment && (
//                       <a
//                         href="#"
//                         className={`flex items-center mt-2 text-xs font-medium underline ${
//                           isUserMessage ? "text-blue-200" : "text-blue-600 dark:text-blue-400"
//                         }`}
//                       >
//                         <Paperclip size={12} className="mr-1" />
//                         {msg.attachment}
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Reply Input */}
//       {canReply && (
//         <div className="p-6 border-t border-gray-200 dark:border-gray-700">
//           <div className="relative">
//             <textarea
//               value={messageInput}
//               onChange={(e) => onMessageChange(e.target.value)}
//               placeholder="Write your message here"
//               rows={3}
//               className="w-full p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
//               disabled={isSendingMessage}
//             />
//             <button
//               onClick={onSendMessage}
//               className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={messageInput.trim() === "" || isSendingMessage}
//               aria-label="Send message"
//             >
//               {isSendingMessage ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Send size={20} />
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };









// "use client"

// import type React from "react"
// import type { Message, Ticket } from "./types"
// import { Send, Paperclip } from "lucide-react"

// interface ConversationPanelProps {
//   ticket: Ticket
//   messageInput: string
//   onMessageChange: (message: string) => void
//   onSendMessage: () => void
// }

// export const ConversationPanel: React.FC<ConversationPanelProps> = ({
//   ticket,
//   messageInput,
//   onMessageChange,
//   onSendMessage,
// }) => {
//   return (
//     <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col min-h-full transition-colors">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Conversation</h2>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Messages between user and support team
//         </p>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px] min-h-[300px]">
//         {(ticket.conversation || []).map((msg: Message, index: number) => (
//           <div
//             key={index}
//             className={`flex ${msg.role === "User" ? "justify-start" : "justify-end"}`}
//           >
//             <div
//               className={`flex items-start max-w-xl ${
//                 msg.role === "User" ? "flex-row" : "flex-row-reverse"
//               }`}
//             >
//               {/* Avatar */}
//               <div
//                 className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
//                   msg.role === "User"
//                     ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200 mr-3"
//                     : "bg-blue-600 text-white dark:bg-blue-700 ml-3"
//                 }`}
//               >
//                 {msg.sender
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </div>

//               {/* Message Content */}
//               <div className="flex flex-col">
//                 {/* Sender Info */}
//                 <div
//                   className={`text-xs mb-1 ${
//                     msg.role === "User"
//                       ? "text-gray-700 dark:text-gray-300 text-left"
//                       : "text-gray-200 dark:text-gray-300 text-right"
//                   }`}
//                 >
//                   <span className="font-semibold">{msg.sender}</span> · {msg.role} ·{" "}
//                   {msg.time.substring(msg.time.lastIndexOf(" ") + 1)}
//                 </div>

//                 {/* Message Bubble */}
//                 <div
//                   className={`p-4 rounded-xl shadow-sm max-w-md  ${
//                     msg.role === "User"
//                       ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none"
//                       : "bg-blue-600 text-white dark:bg-blue-700 rounded-tr-none"
//                   }`}
//                 >
//                   <p className="text-sm whitespace-pre-wrap">{msg.message}</p>

//                   {/* Attachment */}
//                   {msg.attachment && (
//                     <a
//                       href="#"
//                       className={`flex items-center mt-2 text-xs font-medium underline ${
//                         msg.role === "User" ? "text-blue-600 dark:text-blue-400" : "text-blue-200"
//                       }`}
//                     >
//                       <Paperclip size={12} className="mr-1" />
//                       {msg.attachment}
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Reply Input */}
//       <div className="p-6 border-t border-gray-200 dark:border-gray-700">
//         <div className="relative">
//           <textarea
//             value={messageInput}
//             onChange={(e) => onMessageChange(e.target.value)}
//             placeholder="Write your message here"
//             rows={3}
//             className="w-full p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
//           />
//           <button
//             onClick={onSendMessage}
//             className="absolute bottom-3 right-3 cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400"
//             disabled={messageInput.trim() === ""}
//             aria-label="Send message"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
