/* eslint-disable @typescript-eslint/no-explicit-any */

// tickets.types.ts
export interface CreateTicketRequest {
  subject: string;
  message: string;
}

export interface AddTicketMessageRequest {
  message: string;
  id:string;
  senderId:string;
  sender:string;
}

export interface UpdateTicketStatusRequest {
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export interface TicketUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  subscription?: string;
  joined?: string;
  nativeLang?: string;
  targetLang?: string;
  currentLevel?: string;
  createdAt: string;
  stripeCustomerId:any
}

export interface TicketResponse {
  id: string;
  userId: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority:any;
  responses:any;
  email:string;
  name:string;
  avatar:string;
   createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  user: TicketUser;
  data?: any; // optional
   conversation:any;
  rawData?: any; // optional
  tickets?: any; // optional
 }


export interface TicketsListResponse {
  data: TicketResponse[
     
  ];
   
   meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TicketMetaResponse {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  averageResponseTime: string;
}



export interface TicketMetaResponse {
  totalTickets: number
  openTickets: number
  resolvedToday: number
  avgResponseTime: string
}






// // tickets.types.ts

// export interface TicketMessage {
//   id: string;
//   ticketId: string;
//   senderId: string;
//   message: string;
//   createdAt: string;
// }

// export interface Ticket {
//   id: string;
//   userId: string;
//   subject: string;
//   status: "OPEN" | "RESOLVED" | "PENDING" | "CLOSED";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   createdAt: string;
//   updatedAt: string;
//   messages: TicketMessage[];
// }

// export interface CreateTicketRequest {
//   subject: string;
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   message: string;
// }

// export interface AddTicketMessageRequest {
//   message: string;
// }

// export interface UpdateTicketStatusRequest {
//   status: "OPEN" | "RESOLVED" | "PENDING" | "CLOSED";
// }

// export interface TicketResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: Ticket;
// }