import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🔥 Proper Type (remove any[])
export interface Batch {
  id: string;
  title: string;
  quantity: number;
  basePrice: number;
  offerPrice?: number | null;
  expirationDate: string;
  locationId: string;
}

export interface CreateBatchDto {
  title: string;
  quantity: number;
  basePrice: number;
  expirationDate: string;
  locationId: string;
}

export const BatchApi = createApi({
  reducerPath: "batchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      // 🔒 Robust token handling (production-safe)
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Batches"],
  endpoints: (builder) => ({
    // 📊 GET ALL BATCHES (Dashboard)
    getBatches: builder.query<Batch[], void>({
      query: () => "/inventory/batches",
      transformResponse: (response: any): Batch[] => {
        console.log("API RESPONSE:", response);

        // 🔥 Handles all backend shapes:
        // { data: [...] }
        // { batches: [...] }
        // [...]
        return (
          response?.data ||
          response?.batches ||
          response ||
          []
        );
      },
      providesTags: ["Batches"],
    }),

    // ➕ CREATE BATCH (REAL LIFE FEATURE)
    createBatch: builder.mutation<Batch, CreateBatchDto>({
      query: (body) => ({
        url: "/inventory/batches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Batches"], // 🔄 auto refresh dashboard
    }),

    // 🏷 ACTIVATE OFFER
    activateOffer: builder.mutation<
      any,
      { id: string; offerPrice: number }
    >({
      query: ({ id, offerPrice }) => ({
        url: `/inventory/batches/${id}/activate-offer`,
        method: "POST",
        body: { offerPrice },
      }),
      invalidatesTags: ["Batches"], // auto refetch
    }),

    // ❌ DEACTIVATE OFFER
    deactivateOffer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/inventory/batches/${id}/deactivate-offer`,
        method: "POST",
      }),
      invalidatesTags: ["Batches"], // auto refetch
    }),

    // ✏️ OPTIONAL (Future: edit quantity, title, etc.)
    updateBatch: builder.mutation<
      Batch,
      { id: string; body: Partial<CreateBatchDto> }
    >({
      query: ({ id, body }) => ({
        url: `/inventory/batches/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Batches"],
    }),
  }),
});

export const {
  useGetBatchesQuery,
  useCreateBatchMutation, // 🔥 NEW (for adding data in real life)
  useActivateOfferMutation,
  useDeactivateOfferMutation,
  useUpdateBatchMutation,
} = BatchApi;