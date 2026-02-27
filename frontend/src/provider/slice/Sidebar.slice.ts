import { createSlice } from "@reduxjs/toolkit";

export const SidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    collapsed: false,
    toggle: false,
  },
  reducers: {
    toggleSidebar(state) {
      state.toggle = !state.toggle;
    },
    collapseSidebar(state) {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleSidebar, collapseSidebar } = SidebarSlice.actions;

// ✅ CORRECT SELECTOR (must match store key)
export const SidebarSlicePath = (state: any) => state.sidebar;

export default SidebarSlice.reducer;