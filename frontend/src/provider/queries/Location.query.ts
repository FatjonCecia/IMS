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
    // 🏪 GET ALL LOCATIONS
    getLocations: builder.query<Location[], void>({
      query: () => "/location",
      transformResponse: (response: any) => {
        // Supports both: { data: [...] } and [...]
        return response?.data || response || [];
      },
      providesTags: ["Locations"],
    }),

    // ➕ CREATE LOCATION (NEW - REQUIRED FOR ADD BUTTON)
    createLocation: builder.mutation<
      Location,
      { name: string; type: string; status: string }
    >({
      query: (body) => ({
        url: "/location",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Locations"], //  auto refresh table after create
    }),

    // (OPTIONAL BUT SENIOR LEVEL) UPDATE LOCATION
    updateLocation: builder.mutation<
      Location,
      { id: string; body: Partial<Location> }
    >({
      query: ({ id, body }) => ({
        url: `/location/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Locations"],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useCreateLocationMutation, //  YOU NEED THIS
  useUpdateLocationMutation, // optional
} = LocationApi;