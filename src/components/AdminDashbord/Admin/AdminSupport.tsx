  import AdminSupportDashbord from '../AdminSupport/AdminSupportDashbord'

function AdminSupport() {
  return (
    <div>
      {/* <SupportDashbord/> */}
      <AdminSupportDashbord/>
    </div>
  )
}

export default AdminSupport













// import React, { useState } from 'react';
// import Dashboard from '../Support/Dashboard';
// import TicketDetail from '../Support/TicketDetail';
// import { tickets as ticketsData, conversations as conversationsData } from '../Support/data';
// import type { Ticket, TicketConversation, Message } from '../Support/types';

// const AdminSupport: React.FC = () => {
//   const [allTickets, setAllTickets] = useState<Ticket[]>(ticketsData);
//   const [allConversations, setAllConversations] = useState<TicketConversation[]>(conversationsData);
//   const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

//   const handleSelectTicket = (ticketId: string) => {
//     setSelectedTicketId(ticketId);
//   };

//   const handleBackToDashboard = () => {
//     setSelectedTicketId(null);
//   };
  
//   const handleUpdateTicket = (updatedTicket: Ticket) => {
//     setAllTickets(prevTickets => 
//       prevTickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket)
//     );
//   };

//   const handleAddMessage = (ticketId: string, content: string) => {
//     const newMessage: Message = {
//       id: Date.now(),
//       sender: 'Anna Verdi', // Assuming the current logged in support agent
//       role: 'Support',
//       timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
//       content,
//     };

//     setAllConversations(prev => {
//       const conversationIndex = prev.findIndex(c => c.ticketId === ticketId);
      
//       if (conversationIndex > -1) {
//         const updatedConversations = [...prev];
//         const updatedConversation = { ...updatedConversations[conversationIndex] };
//         updatedConversation.messages = [...updatedConversation.messages, newMessage];
//         updatedConversations[conversationIndex] = updatedConversation;
//         return updatedConversations;
//       } else {
//         const newConversation: TicketConversation = { ticketId, messages: [newMessage] };
//         return [...prev, newConversation];
//       }
//     });
//   };

//   const selectedTicket = allTickets.find(t => t.id === selectedTicketId);
//   const conversation = allConversations.find(c => c.ticketId === selectedTicket?.id);

//   return (
//     <div className="min-h-screen   text-gray-800   ">
//       {selectedTicket ? (
//         <TicketDetail 
//           ticket={selectedTicket} 
//           conversation={conversation ?? { ticketId: selectedTicket.id, messages: [] }} 
//           onBack={handleBackToDashboard}
//           onUpdateTicket={handleUpdateTicket}
//           onAddMessage={handleAddMessage}
//         />
//       ) : (
//         <Dashboard tickets={allTickets} onSelectTicket={handleSelectTicket} />
//       )}
//     </div>
//   );
// };

// export default AdminSupport;