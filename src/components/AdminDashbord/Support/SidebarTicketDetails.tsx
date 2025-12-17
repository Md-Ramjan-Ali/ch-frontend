import React from "react";
import { Ticket, TeamMember } from "./types";
import { getPriorityColor, getCategoryColor } from "./colors";

interface Props {
  ticket: Ticket;
  teamMembers: TeamMember[];
}

const SidebarTicketDetails: React.FC<Props> = ({ ticket, teamMembers }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 transition-colors duration-300">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
      Ticket Details
    </h2>
    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <p>
        <span className="font-medium text-gray-900 dark:text-gray-100">Status:</span>{" "}
        {ticket.status}
      </p>
      <p>
        <span className="font-medium text-gray-900 dark:text-gray-100">Priority:</span>{" "}
        <span
          className={`${getPriorityColor(
            ticket.priority
          )} text-white px-2 py-1 rounded-full text-xs`}
        >
          {ticket.priority}
        </span>
      </p>
      <p>
        <span className="font-medium text-gray-900 dark:text-gray-100">Category:</span>{" "}
        <span
          className={`${getCategoryColor(
            ticket.category
          )} px-2 py-1 rounded-full text-xs text-gray-900 dark:text-gray-100`}
        >
          {ticket.category}
        </span>
      </p>
      <p>
        <span className="font-medium text-gray-900 dark:text-gray-100">Assigned To:</span>{" "}
        {teamMembers.find((m) => m.name === ticket.assignedTo)?.name || "Unassigned"}
      </p>
    </div>
  </div>
);

export default SidebarTicketDetails;
