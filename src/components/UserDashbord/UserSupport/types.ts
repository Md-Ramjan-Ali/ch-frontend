/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Message {
  sender: {
    id?: string
    name?: string
    role?: "USER" | "SUPPORT_MANAGER" | "SUPER_ADMIN" | string  
  }
  role: "USER" | "SUPER_ADMIN"| "CONTENT_MANAGER"|"SUPORT_MANAGER" |string|any
  time: string
  message: string
  attachment?: string
  ticket: string
  conversation:[]|any
  createdAt: string
  updatedAt: string 
 }

// export interface Ticket {
//   id?: any
//   title: string
//   description: string
//    subject: string
//   responses: number
//   user: string
//   email: string
//   priority: "High" | "Medium" | "Low" |any
//   category: "In Progress" | "Resolved" | "Open"
//   lastUpdate: string
//   status?: string
//   joined?: string
//   subscription?: string
//   created?: string
//   lastUpdateTime?: string
//   categoryDetail?: string
//   assignee?: string
//   conversation?: Message[]|any
  
 
// }
export interface Ticket {
  id?: string|undefined

  // 👇 you are returning subject, NOT title
  subject: string

  responses: number
  user: string
  email: string

  priority: "High" | "Medium" | "Low" | string
  category: "In Progress" | "Resolved" | "Open"

  lastUpdate: string
  status?: string
  joined?: string
  subscription?: string
  created?: string
  lastUpdateTime?: string
  categoryDetail?: string
  assignee?: string

  // 👇 UI conversation type
  conversation?: UiMessage[]
}

export interface UiMessage {
  sender: string
  role: "User" | "Support"| string
  time?: string
  message: string
  attachment?: string
  subject?:any
   createdAt?: string
  updatedAt?: string
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
 