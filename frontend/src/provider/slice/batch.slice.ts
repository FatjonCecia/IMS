import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Batch {
  id: string;
  title: string;
  quantity: number;
  expirationDate: string;
  basePrice: number;
  offerPrice?: number;
  locationId: string;
}

interface BatchState {
  list: Batch[];
  loading: boolean;
}

const initialState: BatchState = {
  list: [],
  loading: false,
};

export const fetchBatches = createAsyncThunk<Batch[]>(
  "batches/fetch",
  async () => {
    const res = await fetch("/api/batches");
    return await res.json();
  }
);

const batchSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBatches.fulfilled, (state, action: PayloadAction<Batch[]>) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});

export default batchSlice.reducer;