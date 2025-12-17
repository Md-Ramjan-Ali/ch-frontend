/* eslint-disable @typescript-eslint/no-explicit-any */
// admin-support-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import type { PageType, TabType, Ticket } from "./types"
import { DashboardHeader } from "./dashboard-header"
import { StatsCards } from "./stats-cards"
 
import { 
  useGetTicketsQuery, 
  useGetTicketStatsQuery, 
  useUpdateTicketStatusMutation, 
  useAddTicketMessageMutation,
  useGetTicketByIdQuery
} from "@/redux/features/tickets/ticketsApi"
import { TicketResponse } from "@/redux/features/tickets/tickets.types"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import { AdminDashboardContent } from "./dashboard-content"
import { AdminTicketDetailView } from "./ticket-detail-view"
import PageLoader from "@/Layout/PageLoader"
 

// Helper function to map API response to local Ticket type
const mapApiTicketToLocal = (apiTicket: TicketResponse): Ticket => {
  const user = apiTicket.user;
//   const lastMessage = apiTicket.messages[apiTicket.messages.length - 1];
  
  return {
    id: apiTicket.id,
    subject: apiTicket.subject,
    responses: apiTicket?.messages?.length,
    user: user?.name || user?.email?.split('@')[0],
    email: user?.email,
    priority: apiTicket?.priority?.charAt(0) + apiTicket?.priority?.slice(1).toLowerCase(),
    category: apiTicket?.status === 'RESOLVED' || apiTicket?.status === 'CLOSED' 
      ? 'Resolved' 
      : apiTicket?.status === 'IN_PROGRESS' 
        ? 'In Progress' 
        : 'Open',
    lastUpdate: new Date(apiTicket?.updatedAt).toLocaleDateString('en-GB'),
    status: apiTicket?.status === 'RESOLVED' || apiTicket?.status === 'CLOSED' ? 'Resolved' : 'Open',
    joined: new Date(user?.createdAt).toLocaleDateString('en-GB'),
    subscription: user?.stripeCustomerId ? 'Pro' : 'Free',
    created: new Date(apiTicket?.createdAt).toLocaleString('en-GB'),
    lastUpdateTime: new Date(apiTicket?.updatedAt).toLocaleTimeString('en-GB'),
    categoryDetail: 'Support',
    assignee: 'Unassigned',
    assigneeId: null,
    userId: user?.id,
    userData: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      createdAt: user?.createdAt,
      nativeLang: user?.nativeLang,
      targetLang: user?.targetLang,
      currentLevel: user?.currentLevel,
      subscription: user?.stripeCustomerId ? 'Pro' : 'Free',
    },
    conversation: apiTicket?.messages?.map(msg => ({
      id: msg?.id,
      sender: msg?.sender?.name || (msg?.sender?.role === 'USER' ? user?.name || 'User' : 'Support Agent'),
      role: msg?.sender?.role === 'USER' ? 'User' : 'Support',
      time: new Date(msg.createdAt).toLocaleString('en-GB'),
      message: msg?.message,
      senderId: msg?.senderId,
      senderRole: msg?.sender?.role,
      createdAt: msg?.createdAt,
    })),
    rawData: apiTicket, // Keep raw API data for reference
  };
};

export default function AdminSupportDashboard() {
    const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
    const [messageInput, setMessageInput] = useState<string>("")
    const [activeTab, setActiveTab] = useState<TabType>("allTickets")
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        page: 1,
        limit: 20,
        search: '',
    })
    
    // Get current admin info
    const { data: adminData } = useGetMeQuery({});
    // const adminId = adminData?.id;
    const adminName = adminData?.name || 'Admin';
    
    // Fetch all tickets with filters (ADMIN sees ALL tickets)
    const { data: ticketsData, isLoading: ticketsLoading, refetch: refetchTickets } = useGetTicketsQuery(filters);
  //("console from tickets",)
    // Fetch ticket stats for dashboard
    const { data: ticketStatsData } = useGetTicketStatsQuery();
    
    // Fetch selected ticket details
    const { data: selectedTicketData, refetch: refetchSelectedTicket } = useGetTicketByIdQuery(
      selectedTicketId!, 
      { skip: !selectedTicketId }
    );
    
    // Mutations
    const [updateTicketStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
    const [addTicketMessage, { isLoading: isSendingMessage }] = useAddTicketMessageMutation();
    
    const [tickets, setTickets] = useState<Ticket[]>([])
    //(tickets)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
     // Transform API data to local format for tickets list

     
 useEffect(() => {
  if (Array.isArray(ticketsData)) {
    const mapped = ticketsData.map(mapApiTicketToLocal);
    setTickets(mapped);
  } else {
    setTickets([]);
  }
}, [ticketsData]);



// useEffect(() => {
//   if (ticketsData?.data && Array.isArray(ticketsData.data)) {
//     setTickets(ticketsData.data.map(mapApiTicketToLocal));
//   } else {
//     setTickets([]);
//   }
// }, [ticketsData]);




    // Update selected ticket when data changes
    useEffect(() => {
      if (selectedTicketData) {
        const mappedTicket = mapApiTicketToLocal(selectedTicketData);
        setSelectedTicket(mappedTicket);
      }
    }, [selectedTicketData]);

    const handleViewTicket = (ticket: Ticket): void => {
        setSelectedTicketId(ticket.id)
        setCurrentPage("detail")
    }

    const handleBackToDashboard = (): void => {
        setCurrentPage("dashboard")
        setSelectedTicketId(null)
        setSelectedTicket(null)
        setMessageInput("")
    }

    const handleSendMessage = async (): Promise<void> => {
        if (messageInput.trim() === "" || !selectedTicketId) return

        try {
            await addTicketMessage({
                id: selectedTicketId,
                data: { message: messageInput.trim() }
            }).unwrap();

            // Refresh the selected ticket data
            refetchSelectedTicket();
            // Also refresh the tickets list
            refetchTickets();
            
            setMessageInput("");
            
        } catch (error: any) {
            console.error("Failed to send message:", error);
            alert(error?.data?.message || "Failed to send message");
        }
    }
 

    const handleMarkAsResolved = async (): Promise<void> => {
        if (!selectedTicketId) return

        try {
            await updateTicketStatus({
                id: selectedTicketId,
                data: { status: "RESOLVED" }
            }).unwrap();
            
            // Refresh data
            refetchSelectedTicket();
            refetchTickets();
            
        } catch (error: any) {
            console.error("Failed to update ticket status:", error);
            alert(error?.data?.message || "Failed to mark ticket as resolved");
        }
    }

    const handleUpdateTicketStatus = async (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
        try {
            await updateTicketStatus({
                id: ticketId,
                data: { status }
            }).unwrap();
            
            // Refresh data
            refetchTickets();
            if (selectedTicketId === ticketId) {
                refetchSelectedTicket();
            }
            
        } catch (error: any) {
            console.error("Failed to update ticket status:", error);
            alert(error?.data?.message || "Failed to update ticket status");
        }
    }

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    }

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    }

    const handleReplyToTicket = async (ticketId: string, message: string) => {
        try {
            await addTicketMessage({
                id: ticketId,
                data: { message }
            }).unwrap();
            
            // Refresh data
            refetchTickets();
            if (selectedTicketId === ticketId) {
                refetchSelectedTicket();
            }
            
        } catch (error: any) {
            console.error("Failed to send reply:", error);
            throw error;
        }
    }

    const isLoading = ticketsLoading && !selectedTicketId;

    // --- DASHBOARD PAGE RENDER ---
    if (currentPage === "dashboard") {
        if (isLoading) {
            return (
                <div className="min-h-screen font-sans flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400"><PageLoader/></p>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen font-sans">
                <DashboardHeader   />
                <StatsCards 
                    tickets={tickets} 
                    statsData={ticketStatsData}
                    isAdmin={true}
                />
                <AdminDashboardContent
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tickets={tickets}
                    onViewTicket={handleViewTicket}
                    onUpdateTicketStatus={handleUpdateTicketStatus}
                    onReplyToTicket={handleReplyToTicket}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onPageChange={handlePageChange}
                    totalPages={ticketsData?.meta?.totalPages || 1}
                    totalTickets={ticketsData?.meta?.total || 0}
                    adminName={adminName}
                />
            </div>
        )
    }

    // --- TICKET DETAIL PAGE RENDER ---
    if (currentPage === "detail" && selectedTicket) {
        return (
            <AdminTicketDetailView
ticketss={tickets}
                ticket={selectedTicket}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                onSendMessage={handleSendMessage}
                onMarkAsResolved={handleMarkAsResolved}
                onBackToDashboard={handleBackToDashboard}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                isSendingMessage={isSendingMessage}
                isUpdatingStatus={isUpdatingStatus}
                adminName={adminName}
                onRefreshTicket={() => {
                    refetchSelectedTicket();
                    refetchTickets();
                }}
            />
        )
    }

    return <div className="p-10 text-center"><PageLoader></PageLoader></div>
}