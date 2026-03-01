import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Location {
  _id: string;
  name: string;
  type: "restaurant" | "bakery" | "grocery";
  status: "active" | "paused";
}

export const LocationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Locations"],
  endpoints: (builder) => ({
    // 🏪 GET ALL LOCATIONS (from your /location route)
    getLocations: builder.query<Location[], void>({
      query: () => "/location",
      transformResponse: (response: any) => {
        // Handles: { data: [...] } OR [...]
        return response?.data || response || [];
      },
      providesTags: ["Locations"],
    }),
  }),
});

export const { useGetLocationsQuery } = LocationApi;