import { createSlice } from "@reduxjs/toolkit";
import { MAX_QUICKSTARTS, QuickStart } from "./quickStartHandler";
import { fetchAllQuickStarts, addQuickStart } from "./quickStartSliceHelpers";

export interface QuickStartState {
  quickstarts: QuickStart[];
}

const initialState: QuickStartState = {
  quickstarts: [],
};

const quickStartSlice = createSlice({
  name: "quickStart",
  initialState,
  reducers: {
    addNewQuickStart: (state, action) => {
      if (state.quickstarts.length < MAX_QUICKSTARTS) {
        state.quickstarts.push(action.payload.id);
      } else {
        throw new Error(
          "Max quickStarts reached; shouldn't be able to add more"
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAllQuickStarts.fulfilled, (state, action) => {
      if (action.payload) {
        state.quickstarts = action.payload;
        console.log("fetchAllQuickStarts fulfilled");
        console.log(action.payload);
      }
    });
  },
});

export const { addNewQuickStart } = quickStartSlice.actions;
export {
  fetchAllQuickStarts,
  addQuickStart,
} from "@features/quickStart/quickStartSliceHelpers";
export default quickStartSlice.reducer;
