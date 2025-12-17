/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Message {
    sender: {
    id?: string;
    name?: string;
    role?: "USER" | "SUPPORT_MANAGER" | "SUPER_ADMIN" | string;
    avatar?: string;
  };
   time: string
  message: string
  attachment?: string
  role?: string
  senderId?: string
  createdAt?: string
  name?: string
  avatar?: string
  id?: string
  senderRole?: string
}

// Update your types.ts to include admin-specific fields
export interface Ticket {
  id: string;
  subject: string;
  responses: number;
  user: string;
  email: string;
   
  category: "In Progress" | "Open" | "Resolved";
  lastUpdate: string;
  status: "Open" | "Resolved";
  joined?: string;
  subscription?: string;
  created?: string;
  lastUpdateTime?: string;
  categoryDetail?: string;
  assignee?: string;
  assigneeId?: string | null;
  userId?: string;
  priority: "High" | "Medium" | "Low" |string;
  userData?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    createdAt: string;
    nativeLang?: string;
    targetLang?: string;
    currentLevel?: string;
    subscription?: string;
  };
  conversation?: Array<{
    id?: string;
    sender: string;
    role: "User" | "Support";
    time: string;
    message: string;
    senderId?: string;
    senderRole?: string;
    createdAt?: string;
    attachment?: string;
  }>;
  rawData?: any; // Store raw API response
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  views: number
  lastEdited: string
  author: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  ticketsResolved: number
  avgRating: number
  status: "Online" | "Offline" | "Busy"
}

export type PageType = "dashboard" | "detail"
export type TabType = "allTickets" | "knowledgeBase" | "teamManagement"
