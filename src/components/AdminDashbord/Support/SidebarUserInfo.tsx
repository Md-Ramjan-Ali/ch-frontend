import React from "react";
import { Ticket } from "./types";

const SidebarUserInfo: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-4">
    <h2 className="text-lg font-semibold mb-4 text-gray-900">User Information</h2>
    <div className="space-y-2 text-sm text-gray-700">
      <p><span className="font-medium">Name:</span> {ticket.user}</p>
      <p><span className="font-medium">Email:</span> {ticket.email}</p>
      <p><span className="font-medium">Created:</span> {ticket.created}</p>
    </div>
  </div>
);

export default SidebarUserInfo;

