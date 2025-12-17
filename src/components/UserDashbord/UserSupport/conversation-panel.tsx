 


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Send, Paperclip } from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { Message, Ticket } from "./types";
import { useAddTicketMessageMutation, useGetTicketByIdQuery } from "@/redux/features/tickets/ticketsApi";
 import { IoPersonCircle } from "react-icons/io5";

interface ConversationPanelProps {
  ticket: Ticket;
  messageInput: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  isSendingMessage?: boolean;
  currentUserId?: string;
  userRole?: string;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  ticket,
  messageInput,
  onMessageChange,
   
}) => {
  const { data: userdata } = useGetMeQuery({});
  const currentUserRole = userdata?.data?.role;
//(ticket)
  // Load ticket details including 
  
  const { data: ticketData } = useGetTicketByIdQuery(ticket as any);
  const messages: Message[] = ticketData?.data?.messages ?? [];
 
  // Only USER can reply (based on your logic)
  const canReply = currentUserRole === "USER";

 const [addTicketMessage, { isLoading: isSendingMessage }] = useAddTicketMessageMutation();

  // Handle sending message
  const handleSendMessage = async () => {
    const ticketId = ticket;
    if (!ticketId || messageInput.trim() === "") return;

    try {
      // Call API to send message
      await addTicketMessage({
        // id: ticketId,
        id: ticket.id,
        data: { message: messageInput.trim() },
      }).unwrap();

      onMessageChange("");
      // Optionally, clear input immediately
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show toast or alert
    }
  };



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

    


<div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px] min-h-[300px]">
  {messages?.map((msg: Message, index: number) => {
    // ⭐ ROLE BASED ALIGNMENT ⭐
    const isUserMessage = msg.sender.role === "USER"; // right

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
  {msg.sender.role === "USER" ? "You" : msg.sender.name}
</span>
               
                </span> ·{" "}
              {msg.sender.role} ·{" "}
              {new Date(msg.createdAt).toLocaleTimeString()}
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
  })}
</div>










      {/* Reply Input */}
      {canReply && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <textarea
              value={messageInput}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Write your message here"
              rows={3}
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
              disabled={isSendingMessage}
            />

            <button
              onClick={handleSendMessage}
              className="absolute bottom-8 right-6 cursor-pointer bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={messageInput.trim() === "" || isSendingMessage}
            >
              {isSendingMessage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Send size={26} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};






 