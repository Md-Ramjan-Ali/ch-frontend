"use client"

import { useState, useEffect } from "react"
import type {
    PageType,
    TabType,
    Ticket,
} from "./types"
import { DashboardHeader } from "./dashboard-header"
import { StatsCards } from "./stats-cards"
import { DashboardContent } from "./dashboard-content"
import { TicketDetailView } from "./ticket-detail-view"
  import { TicketResponse } from "@/redux/features/tickets/tickets.types"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import {   useGetMyTicketsQuery, useGetTicketsQuery, useGetTicketStatsQuery } from "@/redux/features/tickets/ticketsApi"
 
// Helper function to map API response to local Ticket type
const mapApiTicketToLocal = (apiTicket: TicketResponse): Ticket => {
  const user = apiTicket.user;
   
  return {
    id: apiTicket.id,
    subject: apiTicket.subject,
    responses: apiTicket.messages.length,
    user: user.name || user.email.split('@')[0],
    email: user.email,
    priority: apiTicket.priority.charAt(0) + apiTicket.priority.slice(1).toLowerCase(),
    category: apiTicket.status === 'RESOLVED' || apiTicket.status === 'CLOSED' 
      ? 'Resolved' 
      : apiTicket.status === 'IN_PROGRESS' 
        ? 'In Progress' 
        : 'Open',
    lastUpdate: new Date(apiTicket.updatedAt).toLocaleDateString('en-GB'),
    status: apiTicket.status === 'RESOLVED' || apiTicket.status === 'CLOSED' ? 'Resolved' : 'Open',
    joined: new Date(user.createdAt).toLocaleDateString('en-GB'),
    subscription: 'Pro', // This would come from user subscription data
    created: new Date(apiTicket.createdAt).toLocaleString('en-GB'),
    lastUpdateTime: new Date(apiTicket.updatedAt).toLocaleTimeString('en-GB'),
    categoryDetail: 'Support', // Default category
    assignee: 'Unassigned', // You might want to add assignee to your API
    conversation: apiTicket.messages.map(msg => ({
      sender: msg.sender?.name || (msg.sender?.role === 'USER' ? user.name || 'User' : 'Support Agent'),
      role: msg.sender?.role === 'USER' ? 'User' : 'Support',
      time: new Date(msg.createdAt).toLocaleString('en-GB'),
      message: msg.message,
    })),
  };
};

export default function UserSupportDashboard() {
    const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>()
    const [messageInput, setMessageInput] = useState<string>("")
    const [activeTab, setActiveTab] = useState<TabType>("allTickets")
    //(selectedTicket)
    // Get current user info
    const { data: userData, isLoading: userLoading } = useGetMeQuery({});
    const currentUserId = userData?.id;
    const userRole = userData?.role;
 
    // Fetch tickets based on user role
    const { data: adminTicketsData, isLoading: adminTicketsLoading } = useGetTicketsQuery(
      userRole === 'USER' || userRole === 'USER' 
        ? { page: 1, limit: 20 }
        : { page: 1, limit: 20, userId: currentUserId },
      { skip: !currentUserId }
    );
    
    const { data: myTicketsData, isLoading: myTicketsLoading } = useGetMyTicketsQuery(
      undefined,
      { skip: userRole === 'USER' || userRole === 'USER' || !currentUserId }
    );
    
    const { data: ticketStatsData } = useGetTicketStatsQuery(undefined, {
      skip: !(userRole === 'USER' || userRole === 'USER')
    });
    
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [knowledgeArticles] = useState([])
    const [teamMembers] = useState([])
//(tickets)
    // Transform API data to local format
    useEffect(() => {
      if (userRole === 'USER' || userRole === 'USER') {
        if (adminTicketsData?.data) {
          const mappedTickets = adminTicketsData.data.map(mapApiTicketToLocal);
          setTickets(mappedTickets);
          // Auto-select first ticket for admin
          if (mappedTickets.length > 0 && !selectedTicket) {
            setSelectedTicket(mappedTickets[0]);
          }
        }
      } else if (myTicketsData) {
        const mappedTickets = myTicketsData.map(mapApiTicketToLocal);
        setTickets(mappedTickets);
        // Auto-select first ticket for user
        if (mappedTickets.length > 0 && !selectedTicket) {
          setSelectedTicket(mappedTickets[0]);
        }
      }
    }, [adminTicketsData, myTicketsData, userRole]);

    const handleViewTicket = (ticket: Ticket): void => {
        setSelectedTicket(ticket)
        setCurrentPage("detail")
    }

    const handleBackToDashboard = (): void => {
        setCurrentPage("dashboard")
        setSelectedTicket(null)
        setMessageInput("")
    }

   



    

    const handleAddTicket = (ticket: Ticket): void => {
        setTickets((prev) => [...prev, ticket])
    }

    const handleMarkAsResolved = async (): Promise<void> => {
        if (!selectedTicket) return

        // You would call useUpdateTicketStatusMutation here
        // For now, just update local state
        const updatedTickets = tickets.map((t) =>
            t.id === selectedTicket.id
                ? ({
                    ...t,
                    status: "Resolved",
                    category: "Resolved",
                } as Ticket)
                : t,
        )
        setTickets(updatedTickets)
        setSelectedTicket((prev) => prev ? { ...prev, status: "Resolved", category: "Resolved" } : null)
    }

    const isLoading = userLoading || adminTicketsLoading || myTicketsLoading

    // --- DASHBOARD PAGE RENDER ---
    if (currentPage === "dashboard") {
        if (isLoading) {
            return (
                <div className="min-h-screen font-sans flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen font-sans">
                <DashboardHeader />
                <StatsCards 
                    tickets={tickets} 
                    statsData={ticketStatsData}
                    userRole={userRole}
                />
                <DashboardContent
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tickets={tickets}
                    knowledgeArticles={knowledgeArticles}
                    teamMembers={teamMembers}
                    onViewTicket={handleViewTicket}
                    onAddTicket={handleAddTicket}
                    userRole={userRole}
                    currentUserId={currentUserId}
                />
            </div>
        )
    }

    // --- TICKET DETAIL PAGE RENDER ---
    if (currentPage === "detail" && selectedTicket) {
        return (
            <TicketDetailView
                ticket={selectedTicket}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                 onMarkAsResolved={handleMarkAsResolved}
                onBackToDashboard={handleBackToDashboard}
                userRole={userRole}
                currentUserId={currentUserId}
            />
        )
    }

    return <div className="p-10 text-center">Loading Dashboard...</div>
}














// "use client"

// import { useState } from "react"
// import type {
//     PageType,
//     TabType,
//     Ticket,
//     KnowledgeArticle,
//     TeamMember,
//     Message,
// } from "./types"
// import { DashboardHeader } from "./dashboard-header"
// import { StatsCards } from "./stats-cards"
// import { DashboardContent } from "./dashboard-content"
// import { TicketDetailView } from "./ticket-detail-view"

// const initialTickets: Ticket[] = [
//     {
//         id: "TICK-001",
//         subject: "Cannot access Pro features after payment",
//         responses: 3,
//         user: "Marco Rossi",
//         email: "marco.rossi@email.com",
//         priority: "High",
//         category: "In Progress",
//         lastUpdate: "29/09/2025",
//         status: "Open",
//         joined: "2023-05-15",
//         subscription: "Pro",
//         created: "2024-09-29 14:30",
//         lastUpdateTime: "2024-09-29 15:45",
//         categoryDetail: "Billing",
//         assignee: "Anna Verdi",
//         conversation: [
//             {
//                 sender: "Marco Rossi",
//                 role: "User",
//                 time: "2024-09-29 14:30",
//                 message:
//                     "Hi, I upgraded to Pro yesterday and made the payment, but I still can't access the advanced grammar lessons and unlimited flashcards. My payment was processed successfully according to my bank statement. Can you please help me resolve this issue?",
//                 attachment: "payment-receipt.pdf",
//             },
//             {
//                 sender: "Anna Verdi",
//                 role: "Support",
//                 time: "2024-09-29 14:45",
//                 message:
//                     "Hi Marco, thank you for contacting us. I can see your payment was processed successfully. Let me check your account status and subscription details. I'll get back to you within the next hour with a solution.",
//             },
//         ],
//     },
//     {
//         id: "TICK-006",
//         subject: "Flashcard deck is loading incorrectly",
//         responses: 1,
//         user: "Giulia Bianchi",
//         email: "giulia.bianchi@email.com",
//         priority: "Medium",
//         category: "Open",
//         lastUpdate: "30/09/2025",
//     },
//     {
//         id: "TICK-007",
//         subject: "Request for a new feature: verb conjugation practice",
//         responses: 0,
//         user: "Luca Esposito",
//         email: "luca.esposito@email.com",
//         priority: "Low",
//         category: "Resolved",
//         lastUpdate: "01/10/2025",
//     },
//     {
//         id: "TICK-008",
//         subject: "Mobile app crashing on Android 14",
//         responses: 4,
//         user: "Sofia Ricci",
//         email: "sofia.ricci@email.com",
//         priority: "High",
//         category: "In Progress",
//         lastUpdate: "01/10/2025",
//     },
//     {
//         id: "TICK-009",
//         subject: "Question about annual subscription renewal",
//         responses: 2,
//         user: "Davide Gallo",
//         email: "davide.gallo@email.com",
//         priority: "Medium",
//         category: "Open",
//         lastUpdate: "02/10/2025",
//     },
// ]

// const initialKnowledgeArticles: KnowledgeArticle[] = [
//     {
//         id: "KB-01",
//         title: "Troubleshooting Payment & Access Issues",
//         category: "Billing",
//         views: 1205,
//         lastEdited: "2025-09-15",
//         author: "Anna Verdi",
//     },
//     {
//         id: "KB-02",
//         title: "How to Use the Advanced Grammar Lessons",
//         category: "Features",
//         views: 890,
//         lastEdited: "2025-09-28",
//         author: "Marco Gialli",
//     },
//     {
//         id: "KB-03",
//         title: "Guide to Importing Custom Flashcards",
//         category: "Flashcards",
//         views: 540,
//         lastEdited: "2025-10-01",
//         author: "Giulia Bianchi",
//     },
// ]

// const teamMembers: TeamMember[] = [
//     {
//         id: "TM-01",
//         name: "Anna Verdi",
//         role: "Senior Agent",
//         email: "anna.v@corp.com",
//         ticketsResolved: 154,
//         avgRating: 4.8,
//         status: "Online",
//     },
//     {
//         id: "TM-02",
//         name: "Marco Gialli",
//         role: "Billing Specialist",
//         email: "marco.g@corp.com",
//         ticketsResolved: 82,
//         avgRating: 4.5,
//         status: "Busy",
//     },
//     {
//         id: "TM-03",
//         name: "Sofia Ricci",
//         role: "Technical Support",
//         email: "sofia.r@corp.com",
//         ticketsResolved: 110,
//         avgRating: 4.7,
//         status: "Online",
//     },
// ]

// export default function UserSupportDashbord() {
//     const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
//     const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0])
//     const [messageInput, setMessageInput] = useState<string>("")
//     const [activeTab, setActiveTab] = useState<TabType>("allTickets")
//     const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
//     const [knowledgeArticles, ] = useState<KnowledgeArticle[]>(initialKnowledgeArticles)

//     const handleViewTicket = (ticket: Ticket): void => {
//         setSelectedTicket(ticket)
//         setCurrentPage("detail")
//     }


//     const handleBackToDashboard = (): void => {
//         setCurrentPage("dashboard")
//         setSelectedTicket(null)
//         setMessageInput("")
//     }

//     const handleSendMessage = (): void => {
//         if (messageInput.trim() === "" || !selectedTicket) return

//         const now = new Date()
//         const newMessage: Message = {
//             sender: selectedTicket.assignee || "Support Agent",
//             role: "Support",
//             time: now
//                 .toLocaleString("en-US", {
//                     year: "numeric",
//                     month: "numeric",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 })
//                 .replace(",", ""),
//             message: messageInput.trim(),
//         }

//         const updatedTickets = tickets.map((t) =>
//             t.id === selectedTicket.id && t.lastUpdate === selectedTicket.lastUpdate
//                 ? {
//                     ...t,
//                     conversation: [...(t.conversation || []), newMessage],
//                     responses: (t.responses || 0) + 1,
//                     lastUpdate: now.toLocaleDateString("en-GB"),
//                     lastUpdateTime: now.toLocaleString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                     }),
//                 }
//                 : t,
//         )

//         setTickets(updatedTickets)
//         const updatedSelectedTicket =
//             updatedTickets.find((t) => t.id === selectedTicket.id && t.lastUpdate !== selectedTicket.lastUpdate) ||
//             selectedTicket

//         setSelectedTicket(updatedSelectedTicket)
//         setMessageInput("")
//     }


//     const handleAddTicket = (ticket: Ticket): void => {
//         setTickets((prev) => [...prev, ticket])
//     }
//     const handleMarkAsResolved = (): void => {
//         if (!selectedTicket) return

//         const updatedTickets = tickets.map((t) =>
//             t.id === selectedTicket.id && t.lastUpdate === selectedTicket.lastUpdate
//                 ? ({
//                     ...t,
//                     status: "Resolved",
//                     category: "Resolved",
//                 } as Ticket)
//                 : t,
//         )
//         setTickets(updatedTickets)
//         setSelectedTicket((prev) => (prev ? { ...prev, status: "Resolved", category: "Resolved" } : null))
//     }

//     // --- DASHBOARD PAGE RENDER ---
//     if (currentPage === "dashboard") {
//         return (
//             <div className="min-h-screen font-sans">
//                 <DashboardHeader />
//                 <StatsCards tickets={tickets} />
//                 <DashboardContent
//                     activeTab={activeTab}
//                     onTabChange={setActiveTab}
//                     tickets={tickets}
//                     knowledgeArticles={knowledgeArticles}
//                     teamMembers={teamMembers}
//                     onViewTicket={handleViewTicket}
//                     onAddTicket={handleAddTicket}
//                 />
//             </div>
//         )
//     }

//     // --- TICKET DETAIL PAGE RENDER ---
//     if (currentPage === "detail" && selectedTicket) {
//         return (
//             <TicketDetailView
//                 ticket={selectedTicket}
//                 messageInput={messageInput}
//                 onMessageChange={setMessageInput}
//                 onSendMessage={handleSendMessage}
//                 onMarkAsResolved={handleMarkAsResolved}
//                 onBackToDashboard={handleBackToDashboard}
//             />
//         )
//     }

//     return <div className="p-10 text-center">Loading Dashboard...</div>
// }