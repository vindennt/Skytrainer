import { createSlice } from "@reduxjs/toolkit";
import { MAX_QUICKSTARTS, QuickStart } from "./quickStartHandler";
import {
  fetchAllQuickStarts,
  addQuickStart,
  deleteQuickStart,
} from "./quickStartSliceHelpers";

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
    builder.addCase(addQuickStart.fulfilled, (state, action) => {
      if (action.payload) {
        console.log("addQuickStart fulfilled");
        console.log("Adding " + JSON.stringify(action.payload));
        const newList: QuickStart[] = [...state.quickstarts, action.payload];
        state.quickstarts = newList;
      }
    });
    builder.addCase(deleteQuickStart.fulfilled, (state, action) => {
      if (action.payload) {
        console.log("deleteQuickStart fulfilled for id " + action.payload);
        const newQuickstarts = state.quickstarts.filter(
          (quickstart) => quickstart.id !== action.payload
        );
        state.quickstarts = newQuickstarts;
      }
    });
  },
});

export const { addNewQuickStart } = quickStartSlice.actions;
export {
  fetchAllQuickStarts,
  addQuickStart,
  deleteQuickStart,
} from "@features/quickStart/quickStartSliceHelpers";
export default quickStartSlice.reducer;
