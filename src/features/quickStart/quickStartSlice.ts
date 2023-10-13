import { createSlice } from "@reduxjs/toolkit";
import { MAX_QUICKSTARTS, QuickStart } from "./quickStartHandler";
import {
  fetchAllQuickStarts,
  addQuickStart,
  deleteQuickStart,
  updateQuickStart,
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

        const qsToAdd: QuickStart = {
          ...action.payload,
          stationId: action.payload.start_id,
          lastFinished: null,
        };
        console.log("Adding " + JSON.stringify(qsToAdd));

        const newList: QuickStart[] = [...state.quickstarts, qsToAdd];
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
    builder.addCase(updateQuickStart.fulfilled, (state, action) => {
      if (
        action.payload &&
        typeof action.payload === "object" &&
        "id" in action.payload &&
        "date" in action.payload
      ) {
        console.log("updateQuickStart fulfilled");
        console.log("Updating " + action.payload.id + action.payload.date);
        const id: string = action.payload.id;
        const date: Date = action.payload.date;

        state.quickstarts.map((quickstart) => {
          if (quickstart.id === id) {
            quickstart.lastFinished = date;
          }
        });
        console.log("updateQuickStart: done updating local state");
      }
    });
  },
});

export const { addNewQuickStart } = quickStartSlice.actions;
export {
  fetchAllQuickStarts,
  addQuickStart,
  deleteQuickStart,
  updateQuickStart,
} from "@features/quickStart/quickStartSliceHelpers";
export default quickStartSlice.reducer;
