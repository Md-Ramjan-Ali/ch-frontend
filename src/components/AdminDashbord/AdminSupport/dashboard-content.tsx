// admin-dashboard-content.tsx
"use client";

import { useState } from "react";
import { Filter,  Search , Eye, MessageSquare } from "lucide-react";
import type { TabType, Ticket } from "./types";
 import { Modal } from "./modal";
 import { AdminTicketsTable } from "./tickets-table";

interface AdminDashboardContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => void;
  onReplyToTicket: (ticketId: string, message: string) => void;
  filters: {
    status: string;
    priority: string;
    page: number;
    limit: number;
    search: string;
  };
  onFilterChange: (filters: Partial<AdminDashboardContentProps['filters']>) => void;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalTickets: number;
  adminName?: string;
}

export const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  
  tickets,
  onViewTicket,
  onUpdateTicketStatus,
  onReplyToTicket,
  filters,
  onFilterChange,
  
  totalTickets,
  adminName,
}) => {
  //(tickets)
   const [showFilters, setShowFilters] = useState(false);
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; ticketId: string; ticketSubject: string }>({
    isOpen: false,
    ticketId: '',
    ticketSubject: ''
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
   
 
 

 

  const handleStatusFilter = (status: string) => {
    onFilterChange({ status: status || '' });
  };

  const handlePriorityFilter = (priority: string) => {
    onFilterChange({ priority: priority || '' });
  };

  const handleSearch = (searchTerm: string) => {
    onFilterChange({ search: searchTerm });
  };

  const handleQuickReply = (ticketId: string, ticketSubject: string) => {
    setReplyModal({
      isOpen: true,
      ticketId,
      ticketSubject
    });
    setReplyMessage('');
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replyModal.ticketId) return;

    setIsReplying(true);
    try {
      await onReplyToTicket(replyModal.ticketId, replyMessage.trim());
      setReplyModal({ isOpen: false, ticketId: '', ticketSubject: '' });
      setReplyMessage('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  // Quick action buttons for each ticket
  const renderQuickActions = (ticket: Ticket) => (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleQuickReply(ticket.id, ticket.subject);
        }}
        className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition"
        title="Quick Reply"
      >
        <MessageSquare size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewTicket(ticket);
        }}
        className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
        title="View Details"
      >
        <Eye size={16} />
      </button>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              All Support Tickets
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1 dark:text-gray-400">
              {adminName && `Logged in as: ${adminName} • `} 
              Total tickets: {totalTickets} • Showing: {tickets.length}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
        
            
            <button
              className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            
          </div>
        </div>

        {/* Search and Stats Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets by subject, user, email, or ID..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            
             
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handlePriorityFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
 <select
                  onChange={() => {
                    // Implement sorting logic
                    //("Sort by:", e.target.value);
                  }}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority_high">Priority (High to Low)</option>
                  <option value="priority_low">Priority (Low to High)</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    onFilterChange({ status: '', priority: '', search: '' });
                  }}
                  className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-xl p-6 transition-colors duration-300">
          <AdminTicketsTable
            tickets={tickets}
            onViewTicket={onViewTicket}
            onUpdateTicketStatus={onUpdateTicketStatus}
            onQuickReply={handleQuickReply}
            renderQuickActions={renderQuickActions}
          />
        </div>

        {/* Pagination */}
        
      </div>

      

      {/* Quick Reply Modal */}
      <Modal 
        isOpen={replyModal.isOpen} 
        onClose={() => setReplyModal({ isOpen: false, ticketId: '', ticketSubject: '' })}
        title={`Quick Reply to: ${replyModal.ticketSubject}`}
      >
        <div className="flex flex-col gap-4 p-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Reply *
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              disabled={isReplying}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReplyModal({ isOpen: false, ticketId: '', ticketSubject: '' })}
              className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
              disabled={isReplying}
            >
              Cancel
            </button>
            <button
              onClick={handleSendReply}
              disabled={isReplying || !replyMessage.trim()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isReplying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </span>
              ) : (
                "Send Reply"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};