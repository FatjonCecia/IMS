import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { UserSlice } from "./slice/user.slice";
import sidebarReducer from "./slice/Sidebar.slice";

import { UserApi } from "../provider/queries/Users.query";
import { AuthApi } from "../provider/queries/Auth.query";
import { BatchApi } from "../provider/queries/Batch.query";
import { LocationApi } from "../provider/queries/Location.query"; // 🆕 ADD THIS

export const store = configureStore({
  reducer: {
    // Local slices
    [UserSlice.name]: UserSlice.reducer,
    sidebar: sidebarReducer,

    // RTK Query APIs (Server State)
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [BatchApi.reducerPath]: BatchApi.reducer,
    [LocationApi.reducerPath]: LocationApi.reducer, // 🆕 REQUIRED for locations dropdown
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(AuthApi.middleware)
      .concat(UserApi.middleware)
      .concat(BatchApi.middleware)
      .concat(LocationApi.middleware), // 🆕 ALSO REQUIRED
});

setupListeners(store.dispatch);

// ✅ Proper typed hooks support (Senior-level TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;