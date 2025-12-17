/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { PriorityTag } from "./priority-tag";
import { CategoryTag } from "./category-tag";

interface TicketsTableProps {
   myTicketsData?: any;
  onViewTicket: (ticketId: string  ) => void;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({ myTicketsData, onViewTicket }) => {
console.log(myTicketsData)
  // Detect the correct shape and extract ticket array
  const rawTickets = Array.isArray(myTicketsData)
    ? myTicketsData
    : myTicketsData?.tickets || myTicketsData?.data || [];

  // Format API response for display
  const formattedTickets = rawTickets.map((ticket: any) => ({
    id: ticket.id,
    subject: ticket.subject,
    responses: ticket.messages?.length || 0,
    user: ticket.messages?.[0]?.sender?.name || "User",
    email: ticket.messages?.[0]?.sender?.email || "Unknown",
    priority: ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase(),
    category: ticket.status === "RESOLVED" ? "Resolved" : "Open",
    lastUpdate: new Date(ticket.updatedAt).toLocaleDateString("en-GB"),
  }));
console.log(formattedTickets)
  if (!formattedTickets.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
        No tickets found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Ticket number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Last Update</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {formattedTickets.map((ticket:any, index:any) => {
            console.log(ticket)
            return(
              (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
             
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{index}</td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-200">{ticket.subject}</div>
                <div className="text-xs text-gray-500">{ticket.responses} replies</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">{ticket.user}</div>
                <div className="text-xs text-gray-500">{ticket.email}</div>
              </td>
              <td className="px-6 py-4"><PriorityTag priority={ticket.priority} /></td>
              <td className="px-6 py-4"><CategoryTag category={ticket.category} /></td>
              <td className="px-6 py-4 text-sm text-gray-500">{ticket.lastUpdate}</td>
              <td className="px-6 py-4">
                <button
                  className="text-blue-600 underline dark:text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTicket(ticket.id as any);
                   }}
                >
                  View
                </button>


 



              </td>
            </tr>
          )
            )
          })}
        </tbody>
      </table>
    </div>
  );
};
