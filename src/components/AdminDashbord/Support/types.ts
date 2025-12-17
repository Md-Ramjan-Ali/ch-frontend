export interface Ticket {
  id: string;
  subject: string;
  user: string;
  email: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Billing' | 'Technical' | 'Account';
  lastUpdate: string;
  responses: number;
  status?: string;
  created?: string;
  assignedTo?: string;
  conversation?: Message[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isSupport?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  lastUpdate: string;
  views: number;
}
