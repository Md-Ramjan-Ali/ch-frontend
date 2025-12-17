import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Calendar, Star, Send, ArrowLeft, Paperclip, CheckCircle, Menu, X } from 'lucide-react';

// --- INTERFACES ---

interface Message {
  sender: string;
  role: 'User' | 'Support';
  time: string;
  message: string;
  attachment?: string;
}

interface Ticket {
  id: string;
  subject: string;
  responses: number;
  user: string;
  email: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'In Progress' | 'Resolved' | 'Open';
  lastUpdate: string;
  // Detail page specific properties
  status?: string;
  joined?: string;
  subscription?: string;
  created?: string;
  lastUpdateTime?: string;
  categoryDetail?: string;
  assignee?: string;
  conversation?: Message[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  views: number;
  lastEdited: string;
  author: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  ticketsResolved: number;
  status: 'Online' | 'Offline' | 'Busy';
  avgRating: number;
}

type PageType = 'dashboard' | 'detail';
type TabType = 'allTickets' | 'knowledgeBase' | 'teamManagement';

// --- INITIAL DATA ---

const initialTickets: Ticket[] = [
    { id: 'TICK-001', subject: 'Cannot access Pro features after payment', responses: 3, user: 'Marco Rossi', email: 'marco.rossi@email.com', priority: 'High', category: 'In Progress', lastUpdate: '29/09/2025', 
      status: 'Open', joined: '2023-05-15', subscription: 'Pro', created: '2024-09-29 14:30', lastUpdateTime: '2024-09-29 15:45', categoryDetail: 'Billing', assignee: 'Anna Verdi', 
      conversation: [
        { sender: 'Marco Rossi', role: 'User', time: '2024-09-29 14:30', message: 'Hi, I upgraded to Pro yesterday and made the payment, but I still can\'t access the advanced grammar lessons and unlimited flashcards. My payment was processed successfully according to my bank statement. Can you please help me resolve this issue?', attachment: 'payment-receipt.pdf' },
        { sender: 'Anna Verdi', role: 'Support', time: '2024-09-29 14:45', message: 'Hi Marco, thank you for contacting us. I can see your payment was processed successfully. Let me check your account status and subscription details. I\'ll get back to you within the next hour with a solution.' }
      ]
    },
    { id: 'TICK-002', subject: 'Flashcard deck is loading incorrectly', responses: 1, user: 'Giulia Bianchi', email: 'giulia.bianchi@email.com', priority: 'Medium', category: 'Open', lastUpdate: '30/09/2025' },
    { id: 'TICK-003', subject: 'Request for a new feature: verb conjugation practice', responses: 0, user: 'Luca Esposito', email: 'luca.esposito@email.com', priority: 'Low', category: 'Resolved', lastUpdate: '01/10/2025' },
    { id: 'TICK-004', subject: 'Mobile app crashing on Android 14', responses: 4, user: 'Sofia Ricci', email: 'sofia.ricci@email.com', priority: 'High', category: 'In Progress', lastUpdate: '01/10/2025' },
    { id: 'TICK-005', subject: 'Question about annual subscription renewal', responses: 2, user: 'Davide Gallo', email: 'davide.gallo@email.com', priority: 'Medium', category: 'Open', lastUpdate: '02/10/2025' }
];

const initialKnowledgeArticles: KnowledgeArticle[] = [
    { id: 'KB-01', title: 'Troubleshooting Payment & Access Issues', category: 'Billing', views: 1205, lastEdited: '2025-09-15', author: 'Anna Verdi' },
    { id: 'KB-02', title: 'How to Use the Advanced Grammar Lessons', category: 'Features', views: 890, lastEdited: '2025-09-28', author: 'Marco Gialli' },
    { id: 'KB-03', title: 'Guide to Importing Custom Flashcards', category: 'Flashcards', views: 540, lastEdited: '2025-10-01', author: 'Giulia Bianchi' },
];

const teamMembers: TeamMember[] = [
    { id: 'TM-01', name: 'Anna Verdi', role: 'Senior Agent', email: 'anna.v@corp.com', ticketsResolved: 154, status: 'Online', avgRating: 4.8 },
    { id: 'TM-02', name: 'Marco Gialli', role: 'Billing Specialist', email: 'marco.g@corp.com', ticketsResolved: 82, status: 'Busy', avgRating: 4.5 },
    { id: 'TM-03', name: 'Sofia Ricci', role: 'Technical Support', email: 'sofia.r@corp.com', ticketsResolved: 110, status: 'Online', avgRating: 4.7 },
];

// --- UTILITY COMPONENTS ---

const PriorityTag: React.FC<{ priority: string }> = ({ priority }) => {
    let colorClass;
    switch (priority) {
        case 'High': colorClass = 'bg-red-500'; break;
        case 'Medium': colorClass = 'bg-orange-400'; break;
        case 'Low': colorClass = 'bg-teal-500'; break;
        default: colorClass = 'bg-gray-400'; break;
    }
    return (
        <span className={`${colorClass} text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`}>
            {priority}
        </span>
    );
};

const CategoryTag: React.FC<{ category: string }> = ({ category }) => {
    let colorClass, darkColorClass;
    switch (category) {
        case 'In Progress': 
            colorClass = 'text-blue-600 bg-blue-100/70';
            darkColorClass = 'dark:text-blue-300 dark:bg-blue-900/50';
            break;
        case 'Resolved': 
            colorClass = 'text-green-600 bg-green-100/70';
            darkColorClass = 'dark:text-green-300 dark:bg-green-900/50';
            break;
        case 'Open': 
            colorClass = 'text-pink-600 bg-pink-100/70';
            darkColorClass = 'dark:text-pink-300 dark:bg-pink-900/50';
            break;
        default: 
            colorClass = 'text-gray-600 bg-gray-100/70';
            darkColorClass = 'dark:text-gray-300 dark:bg-gray-700/50';
            break;
    }
    return (
        <span className={`${colorClass} ${darkColorClass} px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`}>
            {category}
        </span>
    );
};

// --- MAIN COMPONENT ---

const SupportDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0]);
    const [messageInput, setMessageInput] = useState<string>('');
    const [activeTab, setActiveTab] = useState<TabType>('allTickets');
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [knowledgeArticles] = useState<KnowledgeArticle[]>(initialKnowledgeArticles);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Helper Functions
    const handleViewTicket = (ticket: Ticket): void => {
        setSelectedTicket(ticket);
        setCurrentPage('detail');
        setMobileMenuOpen(false);
    };

    const handleBackToDashboard = (): void => {
        setCurrentPage('dashboard');
        setSelectedTicket(null);
        setMessageInput('');
    };

    const handleSendMessage = (): void => {
        if (messageInput.trim() === '' || !selectedTicket) return;

        const now = new Date();
        const newMessage: Message = {
            sender: selectedTicket.assignee || 'Support Agent',
            role: 'Support',
            time: now.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
            message: messageInput.trim(),
        };

        const updatedTickets = tickets.map(t => 
            t.id === selectedTicket.id && t.lastUpdate === selectedTicket.lastUpdate
                ? {
                    ...t,
                    conversation: [...(t.conversation || []), newMessage],
                    responses: (t.responses || 0) + 1,
                    lastUpdate: now.toLocaleDateString('en-GB'),
                    lastUpdateTime: now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  }
                : t
        );

        setTickets(updatedTickets);
        const updatedSelectedTicket = updatedTickets.find(t => 
            t.id === selectedTicket.id && 
            t.lastUpdate !== selectedTicket.lastUpdate
        ) || selectedTicket; 
        
        setSelectedTicket(updatedSelectedTicket);
        setMessageInput('');
    };

    const handleMarkAsResolved = (): void => {
        if (!selectedTicket) return;

        const updatedTickets = tickets.map(t =>
            t.id === selectedTicket.id && t.lastUpdate === selectedTicket.lastUpdate
                ? ({
                      ...t,
                      status: 'Resolved',
                      category: 'Resolved',
                  } as Ticket)
                : t
        );
        setTickets(updatedTickets);
        setSelectedTicket(prev => prev ? { ...prev, status: 'Resolved', category: 'Resolved' } : null);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Online': return 'bg-green-500';
            case 'Busy': return 'bg-orange-500';
            case 'Offline': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    // Dark mode classes
    const bgClass = darkMode ? 'dark:bg-gray-900' : 'bg-gray-50';
    const textClass = darkMode ? 'dark:text-white' : 'text-gray-900';
    const cardBgClass = darkMode ? 'dark:bg-gray-800' : 'bg-white';
    const borderClass = darkMode ? 'dark:border-gray-700' : 'border-gray-200';
    const inputBgClass = darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : 'bg-white border-gray-300';

    // Tab Content Rendering
    const renderActiveTabContent = () => {
        const tableHeaderClass = darkMode 
            ? 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300' 
            : 'bg-gray-50 border-gray-200 text-gray-500';
        
        const tableRowClass = darkMode 
            ? 'dark:border-gray-700 dark:hover:bg-gray-700' 
            : 'border-gray-200 hover:bg-gray-50';
        
        const tableTextClass = darkMode 
            ? 'dark:text-gray-300' 
            : 'text-gray-900';

        switch (activeTab) {
            case 'allTickets':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Ticket ID</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Subject</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden sm:table-cell">User</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Priority</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden md:table-cell">Category</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden lg:table-cell">Last Update</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}>
                                {tickets.map((ticket: Ticket, index: number) => (
                                    <tr key={index} className={`${tableRowClass} cursor-pointer`} onClick={() => handleViewTicket(ticket)}>
                                        <td className={`px-3 sm:px-6 py-4 text-sm font-medium ${tableTextClass}`}>{ticket.id}</td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className={`text-sm font-medium ${tableTextClass}`}>{ticket.subject}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">{ticket.user}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.responses} replies</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                                            <div className={`text-sm ${tableTextClass}`}>{ticket.user}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.email}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4"><PriorityTag priority={ticket.priority} /></td>
                                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell"><CategoryTag category={ticket.category} /></td>
                                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{ticket.lastUpdate}</td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleViewTicket(ticket); }}
                                                className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'knowledgeBase':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">ID</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Title</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden sm:table-cell">Category</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden md:table-cell">Views</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden lg:table-cell">Last Edited</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden md:table-cell">Author</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}>
                                {knowledgeArticles.map((article: KnowledgeArticle, index: number) => (
                                    <tr key={index} className={`${tableRowClass} cursor-pointer`}>
                                        <td className={`px-3 sm:px-6 py-4 text-sm font-medium ${tableTextClass}`}>{article.id}</td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm font-medium ${tableTextClass}`}>{article.title}</td>
                                        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                                            <span className="text-purple-600 bg-purple-100/70 dark:text-purple-300 dark:bg-purple-900/50 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm ${tableTextClass} hidden md:table-cell`}>{article.views.toLocaleString()}</td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm ${tableTextClass} hidden lg:table-cell`}>{article.lastEdited}</td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm ${tableTextClass} hidden md:table-cell`}>{article.author}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'teamManagement':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={tableHeaderClass}>
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Member</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden sm:table-cell">Role</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Tickets</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium hidden md:table-cell">Rating</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}>
                                {teamMembers.map((member: TeamMember, index: number) => (
                                    <tr key={index} className={`${tableRowClass} cursor-pointer`}>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className={`text-sm font-medium ${tableTextClass}`}>{member.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell">{member.email}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">{member.role}</div>
                                        </td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm ${tableTextClass} hidden sm:table-cell`}>{member.role}</td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm ${tableTextClass}`}>{member.ticketsResolved}</td>
                                        <td className={`px-3 sm:px-6 py-4 text-sm font-medium ${tableTextClass} items-center gap-1 hidden md:table-cell`}>
                                            <Star size={14} className="text-yellow-400 fill-yellow-400 inline mr-1" />
                                            {member.avgRating.toFixed(1)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <span className={`h-2 w-2 rounded-full inline-block mr-2 ${getStatusColor(member.status)}`}></span>
                                            <span className={`text-sm ${tableTextClass}`}>{member.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    };

    // --- DASHBOARD PAGE RENDER ---
    if (currentPage === 'dashboard') {
        return (
            <div className={`min-h-screen ${bgClass} ${textClass} font-sans transition-colors duration-200`}>
                {/* Header */}
                <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${cardBgClass} shadow-sm`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Support Dashboard</h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your platform today.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Dark Mode Toggle */}
                            <button 
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                {darkMode ? '🌙' : '☀️'}
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium text-sm sm:text-base">
                                <Plus size={18} />
                                <span className="hidden sm:inline">Add New Plan</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        {/* Stat Cards */}
                        <div className={`${cardBgClass} p-4 sm:p-6 rounded-lg shadow-sm border ${borderClass}`}>
                            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 mb-1">Total Tickets</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{tickets.length}</p>
                        </div>
                        <div className={`${cardBgClass} p-4 sm:p-6 rounded-lg shadow-sm border ${borderClass}`}>
                            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 mb-1">Open Tickets</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{tickets.filter(t => t.category === 'Open' || t.category === 'In Progress').length}</p>
                        </div>
                        <div className={`${cardBgClass} p-4 sm:p-6 rounded-lg shadow-sm border ${borderClass} col-span-2 lg:col-span-1`}>
                            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 mb-1">Resolved Today</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">8</p>
                        </div>
                        <div className={`${cardBgClass} p-4 sm:p-6 rounded-lg shadow-sm border ${borderClass} col-span-2 lg:col-span-1`}>
                            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 mb-1">Avg Response</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">2.4h</p>
                        </div>
                        <div className={`${cardBgClass} p-4 sm:p-6 rounded-lg shadow-sm border ${borderClass} col-span-2 lg:col-span-1`}>
                            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 mb-1">Satisfaction</p>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">4.6/5</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <div className={`rounded-xl ${cardBgClass} shadow-lg border ${borderClass}`}>
                        {/* Tabs Bar */}
                        <div className="p-3 sm:p-4 rounded-t-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className={`flex gap-1 sm:gap-2 p-1 sm:p-2 ${darkMode ? 'dark:bg-gray-700' : 'bg-gray-200'} rounded-lg w-full sm:w-auto overflow-x-auto`}>
                                <button
                                    onClick={() => setActiveTab('allTickets')}
                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer rounded-md transition whitespace-nowrap ${
                                        activeTab === 'allTickets' 
                                            ? `${darkMode ? 'dark:bg-gray-600 dark:text-white' : 'bg-white shadow-md text-gray-800'}` 
                                            : `${darkMode ? 'dark:text-gray-300 dark:hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-50'}`
                                    }`}
                                >
                                    All Tickets
                                </button>
                                <button
                                    onClick={() => setActiveTab('knowledgeBase')}
                                    className={`px-3 sm:px-4 py-2 cursor-pointer text-xs sm:text-sm font-medium rounded-md transition whitespace-nowrap ${
                                        activeTab === 'knowledgeBase' 
                                            ? `${darkMode ? 'dark:bg-gray-600 dark:text-white' : 'bg-white shadow-md text-gray-800'}` 
                                            : `${darkMode ? 'dark:text-gray-300 dark:hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-50'}`
                                    }`}
                                >
                                    Knowledge Base
                                </button>
                                <button
                                    onClick={() => setActiveTab('teamManagement')}
                                    className={`px-3 sm:px-4 py-2 cursor-pointer text-xs sm:text-sm font-medium rounded-md transition whitespace-nowrap ${
                                        activeTab === 'teamManagement' 
                                            ? `${darkMode ? 'dark:bg-gray-600 dark:text-white' : 'bg-white shadow-md text-gray-800'}` 
                                            : `${darkMode ? 'dark:text-gray-300 dark:hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-50'}`
                                    }`}
                                >
                                    Team Management
                                </button>
                            </div>
                        </div>

                        {/* Section Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b dark:border-gray-700">
                            <div>
                                <h2 className="text-lg font-semibold">Support Management</h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage tickets, knowledge base, and team</p>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                                <button className={`border ${borderClass} text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm w-full sm:w-auto justify-center`}>
                                    <Filter size={16} />
                                    <span className="hidden sm:inline">Filter</span>
                                </button>
                                <button className="bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium text-sm w-full sm:w-auto justify-center">
                                    <Plus size={16} />
                                    <span className="hidden sm:inline">Create Ticket</span>
                                    <span className="sm:hidden">New</span>
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Table Content */}
                        {renderActiveTabContent()}

                        {/* Pagination */}
                        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t ${borderClass} flex flex-col sm:flex-row justify-between items-center gap-3`}>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">Showing 1 to {tickets.length} of {tickets.length} tickets</p>
                            <div className="flex gap-1 items-center">
                                <button className={`p-1 sm:p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border ${borderClass}`}>
                                    <ChevronLeft size={16} className="text-gray-400" />
                                </button>
                                <button className="cursor-pointer px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md">1</button>
                                <button className={`cursor-pointer px-2 sm:px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm ${darkMode ? 'dark:text-gray-300' : 'text-gray-600'}`}>2</button>
                                <button className={`cursor-pointer px-2 sm:px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm ${darkMode ? 'dark:text-gray-300' : 'text-gray-600'}`}>3</button>
                                <button className={`p-1 sm:p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border ${borderClass}`}>
                                    <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- TICKET DETAIL PAGE RENDER ---
    if (currentPage === 'detail' && selectedTicket) {
        const ticket = selectedTicket;

        return (
            <div className={`min-h-screen ${bgClass} ${textClass} font-sans flex flex-col transition-colors duration-200`}>
                {/* Detail Header */}
                <div className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b ${borderClass} ${cardBgClass} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <button onClick={handleBackToDashboard} className={`flex cursor-pointer items-center ${darkMode ? 'dark:text-gray-300 dark:hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition font-medium text-sm sm:text-base`}>
                            <ArrowLeft size={18} className="mr-2" />
                            <span className="hidden sm:inline">Back to Dashboard</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button 
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                {darkMode ? '🌙' : '☀️'}
                            </button>
                            <button 
                                onClick={handleMarkAsResolved}
                                className={`bg-blue-600 text-white cursor-pointer px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium text-sm sm:text-base ${ticket.status === 'Resolved' ? 'opacity-50 cursor-not-allowed bg-green-600' : ''}`}
                                disabled={ticket.status === 'Resolved'}
                            >
                                {ticket.status === 'Resolved' ? <CheckCircle size={16} /> : null}
                                <span className="hidden sm:inline">
                                    {ticket.status === 'Resolved' ? 'Resolved' : 'Mark As Resolved'}
                                </span>
                                <span className="sm:hidden">
                                    {ticket.status === 'Resolved' ? 'Done' : 'Resolve'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ticket Title */}
                <div className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ${cardBgClass} border-b ${borderClass}`}>
                    <h1 className="text-xl sm:text-2xl font-semibold">Ticket {ticket.id}</h1>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-1">{ticket.subject}</p>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="flex flex-col lg:flex-row h-full gap-4 sm:gap-6 lg:gap-8">
                        
                        {/* Conversation Panel (Left) */}
                        <div className={`flex-1 ${cardBgClass} rounded-lg shadow-lg flex flex-col min-h-full border ${borderClass}`}>
                            <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                                <h2 className="text-lg sm:text-xl font-semibold">Conversation</h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Messages between user and support team</p>
                            </div>
                            
                            {/* Messages */}
                            <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[500px] sm:max-h-[600px] min-h-[300px]">
                                {(ticket.conversation || []).map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'User' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`flex items-start max-w-full lg:max-w-xl ${msg.role === 'User' ? 'flex-row' : 'flex-row-reverse'}`}>
                                            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${darkMode ? 'dark:bg-gray-600' : 'bg-gray-200'} flex items-center justify-center text-xs sm:text-sm font-bold ${darkMode ? 'dark:text-gray-300' : 'text-gray-600'} ${msg.role === 'User' ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'}`}>
                                                {msg.sender.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className={`text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} mb-1 ${msg.role === 'User' ? 'text-left' : 'text-right'}`}>
                                                    <span className={`font-semibold ${darkMode ? 'dark:text-gray-300' : 'text-gray-800'}`}>{msg.sender}</span> · {msg.role} · {msg.time.substring(msg.time.lastIndexOf(' ') + 1)}
                                                </div>
                                                <div className={`p-3 sm:p-4 rounded-xl shadow-sm ${
                                                    msg.role === 'User' 
                                                        ? `${darkMode ? 'dark:bg-gray-700 dark:text-gray-300' : 'bg-gray-100 text-gray-800'} rounded-tl-none` 
                                                        : 'bg-blue-600 text-white rounded-tr-none'
                                                }`}>
                                                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.message}</p>
                                                    {msg.attachment && (
                                                        <a href="#" className={`flex items-center mt-2 text-xs font-medium underline ${
                                                            msg.role === 'User' 
                                                                ? 'text-blue-600 dark:text-blue-400' 
                                                                : 'text-blue-200'
                                                        }`}>
                                                            <Paperclip size={12} className="mr-1" />
                                                            {msg.attachment}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            <div className={`p-4 sm:p-6 border-t ${darkMode ? 'dark:border-gray-700 dark:bg-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="relative">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Write your message here"
                                        rows={3}
                                        className={`w-full p-3 pr-12 sm:pr-16 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none ${inputBgClass} ${textClass} text-sm sm:text-base`}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="absolute bottom-3 right-3 cursor-pointer bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400"
                                        disabled={messageInput.trim() === ''}
                                        aria-label="Send message"
                                    >
                                        <Send size={16} className="sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
                            
                            {/* User Information */}
                            <div className={`${cardBgClass} rounded-lg shadow-lg p-4 sm:p-6 border ${borderClass}`}>
                                <h2 className="text-lg font-semibold border-b dark:border-gray-700 pb-3 mb-4">User Information</h2>
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-bold text-base sm:text-lg">
                                        {ticket.user[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate">{ticket.user}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{ticket.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    <p className="flex items-center"><Calendar size={14} className="mr-2 text-gray-400" /> <span className="text-gray-500 dark:text-gray-400">Joined:</span> <span className="font-medium ml-1 truncate">{ticket.joined || 'N/A'}</span></p>
                                    <p className="flex items-center"><Star size={14} className="mr-2 text-gray-400" /> <span className="text-gray-500 dark:text-gray-400">Subscription:</span> <span className="font-medium ml-1 text-green-600 dark:text-green-400 truncate">{ticket.subscription || 'Basic'}</span></p>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className={`${cardBgClass} rounded-lg shadow-lg p-4 sm:p-6 border ${borderClass}`}>
                                <h2 className="text-lg font-semibold border-b dark:border-gray-700 pb-3 mb-4">Ticket Details</h2>
                                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                                        <CategoryTag category={ticket.status || 'N/A'} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Priority</span>
                                        <PriorityTag priority={ticket.priority} />
                                    </div>
                                    <p className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Assignee</span>
                                        <span className="font-medium truncate">{ticket.assignee || 'Unassigned'}</span>
                                    </p>
                                    <p className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Created</span>
                                        <span className="font-medium truncate">{ticket.created || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Last Update</span>
                                        <span className="font-medium truncate">{ticket.lastUpdateTime || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Category</span>
                                        <span className="font-medium truncate">{ticket.categoryDetail || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-10 text-center ${bgClass} ${textClass}`}>
            Loading Dashboard...
        </div>
    );
};

export default SupportDashboard;