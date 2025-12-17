/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import type { TabType, Ticket, KnowledgeArticle, TeamMember } from "./types";
import { TicketsTable } from "./tickets-table";
import { Pagination } from "./pagination";
import { Modal } from "./modal";
import { useCreateTicketMutation, useGetMyTicketsQuery } from "@/redux/features/tickets/ticketsApi";

interface DashboardContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tickets: Ticket[];
  knowledgeArticles: KnowledgeArticle[];
  teamMembers: TeamMember[];
  onViewTicket: (ticket: Ticket) => void;
  onAddTicket: (ticket: Ticket) => void;
  userRole: string;
  currentUserId: string;

  priority?: string;
  category?: string;
  status?: string;
}


export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  tickets,
  onViewTicket,
  onAddTicket,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "MEDIUM",
   });
   const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
   
   // Fetch user's tickets on mount
   const { data: myTicketsData, isLoading: isLoadingTickets, refetch } = useGetMyTicketsQuery();
   //(tickets)
//(myTicketsData) 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await createTicket({
        subject: newTicket.subject,
        message: newTicket.message,
      }).unwrap();

      // Map the API response to local Ticket type
      const localTicket: Ticket = {
        id: result.id,
        subject: result.subject,
        responses: result.messages.length,
        user: result.user.name || result.user.email.split('@')[0],
        email: result.user.email,
        priority: result.priority.charAt(0) + result.priority.slice(1).toLowerCase(),
        category: result.status === 'RESOLVED' || result.status === 'CLOSED' 
          ? 'Resolved' 
          : result.status === 'IN_PROGRESS' 
            ? 'In Progress' 
            : 'Open',
        lastUpdate: new Date(result.updatedAt).toLocaleDateString('en-GB'),
        status: result.status === 'RESOLVED' || result.status === 'CLOSED' ? 'Resolved' : 'Open',
        joined: new Date(result.user.createdAt).toLocaleDateString('en-GB'),
        subscription: 'Pro',
        created: new Date(result.createdAt).toLocaleString('en-GB'),
        lastUpdateTime: new Date(result.updatedAt).toLocaleTimeString('en-GB'),
        categoryDetail: 'Support',
        assignee: 'Unassigned',
        conversation: result.messages.map(msg => ({
          sender: msg.sender?.name || (msg.sender?.role === 'USER' ? result.user.name || 'User' : 'Support Agent'),
          role: msg.sender?.role === 'USER' ? 'User' : 'Support',
          time: new Date(msg.createdAt).toLocaleString('en-GB'),
          message: msg.message,
        })),
      };

      onAddTicket(localTicket);
      setIsModalOpen(false);
      setNewTicket({ subject: "", message: "", priority: "MEDIUM" });
      
      // Refresh the tickets list
      refetch();
      
      alert("Ticket created successfully!");
    } catch (error: any) {
      console.error("Failed to create ticket:", error);
      alert(error?.data?.message || "Failed to create ticket. Please try again.");
    }
  };

  const renderActiveTabContent = () => {
    if (isLoadingTickets) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (myTicketsData && myTicketsData.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No support tickets yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first support ticket and we'll help you resolve any issues.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create First Ticket
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "allTickets":
        return <TicketsTable myTicketsData={myTicketsData} onViewTicket={onViewTicket} />;
     
      default:
        return null;
    }
  };
 


  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              My Support Tickets
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1 dark:text-gray-400">
              View and manage your support requests
            </p>
          </div>

          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium">
              <Filter size={18} />
              Filter
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition font-medium shadow-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Create Ticket
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-xl p-6 transition-colors duration-300">
          {renderActiveTabContent()}
        </div>

        {tickets.length > 0 && <Pagination />}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Ticket">
        <div className="flex flex-col gap-4 p-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Brief description of your issue"
              value={newTicket.subject}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={isCreating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              placeholder="Please provide detailed information about your issue..."
              value={newTicket.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              disabled={isCreating}
            />
          </div>

          

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleAddTicket}
              disabled={isCreating || !newTicket.subject.trim() || !newTicket.message.trim()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </span>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};










// "use client";

// import { useState } from "react";
// import { Filter, Plus } from "lucide-react";
// import type { TabType, Ticket, KnowledgeArticle, TeamMember } from "./types";
// // import { TabsBar } from "./tabs-bar";
// import { TicketsTable } from "./tickets-table";
// // import { KnowledgeBaseTable } from "./knowledge-base-table";
// // import { TeamManagementTable } from "./team-management-table";
// import { Pagination } from "./pagination";
// import { Modal } from "./modal";

// interface DashboardContentProps {
//   activeTab: TabType;
//   onTabChange: (tab: TabType) => void;
//   tickets: Ticket[];
//   knowledgeArticles: KnowledgeArticle[];
//   teamMembers: TeamMember[];
//   onViewTicket: (ticket: Ticket) => void;
//   onAddTicket: (ticket: Ticket) => void;
// }

// export const DashboardContent: React.FC<DashboardContentProps> = ({
//   activeTab,
//   onTabChange,
//   tickets,
//   // knowledgeArticles,
//   // teamMembers,
//   onViewTicket,
//   onAddTicket,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newTicket, setNewTicket] = useState({
//     subject: "",
//     user: "",
//     email: "",
//     priority: "Low",
//     category: "Open",
//     status: "Offline", // Added status field
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setNewTicket((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTicket = () => {
//     if (!newTicket.subject || !newTicket.user || !newTicket.email) return;

//     const ticket: Ticket = {
//       id: `TICK-${Math.floor(Math.random() * 1000)}`,
//       subject: newTicket.subject,
//       user: newTicket.user,
//       email: newTicket.email,
//       priority: newTicket.priority as "Low" | "Medium" | "High",
//       category: newTicket.category as "Open" | "In Progress" | "Resolved",
//       status: newTicket.status, // Use the status field
//       responses: 0,
//       lastUpdate: new Date().toLocaleDateString("en-GB"),
//     };

//     onAddTicket(ticket);
//     setIsModalOpen(false);
//     setNewTicket({ subject: "", user: "", email: "", priority: "Low", category: "Open", status: "Offline" });
//   };

//   const renderActiveTabContent = () => {
//     switch (activeTab) {
//       case "allTickets":
//         return <TicketsTable tickets={tickets} onViewTicket={onViewTicket} />;
//       // case "knowledgeBase":
//       //   return <KnowledgeBaseTable articles={knowledgeArticles} />;
//       // case "teamManagement":
//       //   return <TeamManagementTable members={teamMembers} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pb-10 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
//       <div className="rounded-xl overflow-hidden shadow-sm">
//         {/* Tabs */}
//         {/* <TabsBar activeTab={activeTab} onTabChange={onTabChange} /> */}

//         {/* Header */}
//         <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
//           <div className="mb-4 sm:mb-0">
//             <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
//               Flashcard Decks
//             </h2>
//             <p className="text-sm sm:text-base text-gray-500 mt-1 dark:text-gray-400">
//               Manage your Italian learning flashcard collections
//             </p>
//           </div>

//           <div className="flex gap-3 flex-wrap sm:flex-nowrap">
//             <button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium">
//               <Filter size={18} />
//               Filter
//             </button>

//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition font-medium shadow-sm"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <Plus size={18} />
//               Create Ticket
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-xl p-6 transition-colors duration-300">
//           {renderActiveTabContent()}
//         </div>

//         <Pagination />
//       </div>

//       {/* Create Ticket Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Ticket">
//         <div className="flex flex-col gap-4 p-2">
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             value={newTicket.subject}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           <input
//             type="text"
//             name="user"
//             placeholder="User Name"
//             value={newTicket.user}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="User Email"
//             value={newTicket.email}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />

//           <select
//             name="priority"
//             value={newTicket.priority}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>

//           <select
//             name="category"
//             value={newTicket.category}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           >
//             <option value="Open">Open</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Resolved">Resolved</option>
//           </select>

//           {/* Status Selection */}
//           <select
//             name="status"
//             value={newTicket.status}
//             onChange={handleInputChange}
//             className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           >
//             <option value="Online">Online</option>
//             <option value="Offline">Offline</option>
//           </select>

//           <button
//             onClick={handleAddTicket}
//             className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition font-medium shadow-sm"
//           >
//             Add Ticket
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };
