import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
  _id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export const UserApi = createApi({
  reducerPath: 'UserApi',
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

  tagTypes: ['Users'],

  endpoints: (builder) => ({

    // 🔥 GET ALL INTERNAL USERS (matches your mongoose User model)
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/users', // IMPORTANT: must exist in backend
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.data || response || [];
      },
      providesTags: ['Users'],
    }),

    // ➕ CREATE USER (optional admin feature)
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    // ❌ DELETE USER
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // ✏️ UPDATE USER
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),

  }),
})

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = UserApi