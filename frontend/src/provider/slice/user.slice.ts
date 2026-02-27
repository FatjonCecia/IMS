import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "user", // 👈 make this lowercase (cleaner & consistent)
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    removeUser(state) {   // ✅ remove action parameter
      state.user = null;
    },
  },
});

export const { removeUser, setUser } = UserSlice.actions;

// ✅ selector must match store key
export const UserSlicePath = (state: any) => state.user.user;

export default UserSlice.reducer;