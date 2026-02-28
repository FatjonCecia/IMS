import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { UserSlice } from "./slice/user.slice";
import sidebarReducer from "./slice/Sidebar.slice";

import { UserApi } from "../provider/queries/Users.query"; 
import { AuthApi } from "../provider/queries/Auth.query";

export const store = configureStore({
  reducer: {
    [UserSlice.name]: UserSlice.reducer,
    sidebar: sidebarReducer,

    // ✅ ADD BOTH API REDUCERS
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
  },

  // ✅ ADD BOTH MIDDLEWARES
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(AuthApi.middleware)
      .concat(UserApi.middleware),
});

setupListeners(store.dispatch);