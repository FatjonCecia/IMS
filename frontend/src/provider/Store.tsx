import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { UserSlice } from "./slice/user.slice";
import sidebarReducer from "./slice/Sidebar.slice"; // ✅ import this

export const store = configureStore({
  reducer: {
    [UserSlice.name]: UserSlice.reducer, // "UserSlice"
    sidebar: sidebarReducer,            // ✅ must match selector
  },
});

setupListeners(store.dispatch);