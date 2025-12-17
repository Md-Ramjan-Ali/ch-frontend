
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import type {
  CreateTicketRequest,
  TicketResponse, 
 TicketsListResponse,
  TicketMetaResponse,
} from "./tickets.types";

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // USER: Create a new support ticket
    createTicket: builder.mutation<TicketResponse, CreateTicketRequest>({
      query: (data) => ({
        url: "/tickets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tickets", "TicketStats"],
    }),

    // ADMIN: Get all tickets with optional filters
    // getTickets: builder.query<TicketsListResponse, { 
    //   page?: number; 
    //   limit?: number; 
    //   status?: string; 
    //   priority?: string; 
    //   userId?: string;
    // }>({
    //   query: (params) => ({
    //     url: "/tickets",
    //     method: "GET",
    //     params,
    //   }),
    //   providesTags: ["Tickets"],
    // }),


getTickets: builder.query<TicketsListResponse, any>({
  query: (filters) => ({
    url: "/tickets",
    params: filters,
  }),
}),
 

    // USER: Get all your own tickets
    getMyTickets: builder.query<TicketResponse[], void>({
      query: () => ({
        url: "/tickets/my-tickets",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // ADMIN: Get ticket statistics/metadata
    getTicketStats: builder.query<TicketMetaResponse, void>({
      query: () => ({
        url: "/tickets/meta",
        method: "GET",
      }),
      providesTags: ["TicketStats"],
    }),

    // ADMIN/USER: Get a single ticket by ID
    getTicketById: builder.query<TicketResponse, string, {ticket:string}>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Tickets", id }],
    }),

    // USER/ADMIN: Add a message to an existing ticket
    addTicketMessage: builder.mutation({
      query: ({ id, data }) => ({
    if (id:any,data:any) {
      console.log(id,data)
    },
        url: `/tickets/${id}/message`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Tickets", id }],
    }),

    // ADMIN: Update ticket status
    updateTicketStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tickets/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Tickets", id }, "TicketStats"],
    }),

  }),
});

export const {
  useCreateTicketMutation,
  useGetTicketsQuery,
  useGetMyTicketsQuery,
  useGetTicketStatsQuery,
  useGetTicketByIdQuery,
  useAddTicketMessageMutation,
  useUpdateTicketStatusMutation,
} = ticketsApi;










// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseApi } from "@/redux/hooks/baseApi";
// import type {
//   CreateTicketRequest,
//   TicketResponse,
//   AddTicketMessageRequest,
//   UpdateTicketStatusRequest,
//   TicketsListResponse,
// } from "./tickets.types";

// export const ticketsApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     // USER: Create a new support ticket
//     createTicket: builder.mutation<TicketResponse, CreateTicketRequest>({
//       query: (data) => ({
//         url: "/tickets",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Tickets"],
//     }),

//     // ADMIN: Get all tickets with optional filters
//     getTickets: builder.query<TicketsListResponse, { page?: number; limit?: number; status?: string; priority?: string }>({
//       query: (params) => ({
//         url: "/tickets",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["Tickets"],
//     }),

//     // USER: Get all your own tickets
//     getMyTickets: builder.query<TicketResponse[], void>({
//       query: () => ({
//         url: "/tickets/my-tickets",
//         method: "GET",
//       }),
//       providesTags: ["Tickets"],
//     }),

//     // ADMIN: Get a single ticket by ID
//     getTicketById: builder.query<TicketResponse, string>({
//       query: (id) => ({
//         url: `/tickets/${id}`,
//         method: "GET",
//       }),
//       providesTags: (_result, _error, id) => [{ type: "Tickets", id }],
//     }),

//     // USER: Add a message to an existing ticket
//     addTicketMessage: builder.mutation<TicketResponse, { id: string; message: AddTicketMessageRequest }>({
//       query: ({ id, message }) => ({
//         url: `/tickets/${id}/message`,
//         method: "POST",
//         body: message,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [{ type: "Tickets", id }],
//     }),

//     // ADMIN: Update ticket status
//     updateTicketStatus: builder.mutation<TicketResponse, { id: string; status: UpdateTicketStatusRequest }>({
//       query: ({ id, status }) => ({
//         url: `/tickets/${id}/status`,
//         method: "PATCH",
//         body: status,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [{ type: "Tickets", id }],
//     }),

//   }),
// });

// export const {
//   useCreateTicketMutation,
//   useGetTicketsQuery,
//   useGetMyTicketsQuery,
//   useGetTicketByIdQuery,
//   useAddTicketMessageMutation,
//   useUpdateTicketStatusMutation,
// } = ticketsApi;
