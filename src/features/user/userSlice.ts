import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchDisplayNameBySession } from "@src/features/user/userSliceHelpers";

import {
  fetchAllUserData,
  updateDisplayName,
  updateBalance,
  updateTickets,
  updatePity,
} from "@src/features/user/userSliceHelpers";

export interface UserState {
  user_id: string;
  display_name: string;
  created_at: string;
  last_login: string;
  balance: number;
  tickets: number;
  permanent_pity: number;
  limited_pity: number;
  total_trip_time: number;
  total_trips_finished: number;
  user_data_processes: number;
}

const initialState: UserState = {
  user_id: "",
  display_name: "",
  created_at: "",
  last_login: "",
  balance: 0,
  tickets: 0,
  permanent_pity: 0,
  limited_pity: 0,
  total_trip_time: 0,
  total_trips_finished: 0,
  user_data_processes: 0,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setDisplayName: (state, action) => {
      state.display_name = action.payload;
    },
    setCreationDate: (state, action) => {
      state.created_at = action.payload;
    },
    setLastLogin: (state, action) => {
      state.last_login = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
      console.log("Setting balance: " + action.payload);
    },
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setPermanentPity: (state, action) => {
      state.permanent_pity = action.payload;
    },
    setLimitedPity: (state, action) => {
      state.limited_pity = action.payload;
    },
    setTotalTripTime: (state, action) => {
      state.total_trip_time = action.payload;
    },
    setTotalTripsFinished: (state, action) => {
      state.total_trips_finished = action.payload;
    },
    incrementUserDataProcesses: (state, action) => {
      state.user_data_processes += action.payload;
      console.log("Processes: " + state.user_data_processes);
    },
    setUserDataProcesses: (state, action) => {
      state.user_data_processes = action.payload;
      console.log("Processes: " + state.user_data_processes);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUserData.fulfilled, (state, action) => {
      console.log(
        "fetchAllUserData fulfilled: " + JSON.stringify(action.payload, null, 2)
      );
      state.display_name = action.payload.display_name;
      state.created_at = action.payload.created_at;
      state.last_login = action.payload.last_login;
      state.balance = action.payload.balance;
      state.tickets = action.payload.tickets;
      state.permanent_pity = action.payload.permanent_pity;
      state.limited_pity = action.payload.limited_pity;
      state.total_trip_time = action.payload.total_trip_time;
      state.total_trips_finished = action.payload.total_trips_finished;
      state.user_data_processes = state.user_data_processes - 1;
    });
    builder.addCase(updateDisplayName.fulfilled, (state, action) => {
      if (action.payload) state.display_name = action.payload;
      console.log("updateDisplayName fulfilled: " + state.display_name);
      state.user_data_processes = state.user_data_processes - 1;
    });
    builder.addCase(updateBalance.fulfilled, (state, action) => {
      // console.log(action.payload);
      if (action.payload !== undefined) state.balance = action.payload;
      console.log("updateBalance fulfilled: " + state.balance);
      state.user_data_processes = state.user_data_processes - 1;
    });
    builder.addCase(updateTickets.fulfilled, (state, action) => {
      // console.log(action.payload);
      if (action.payload !== undefined) state.tickets = action.payload;
      console.log("updateTickets fulfilled: " + state.tickets);
      state.user_data_processes = state.user_data_processes - 1;
    });
    builder.addCase(updatePity.fulfilled, (state, action) => {
      if (action.payload?.permanent_pity !== undefined) {
        state.permanent_pity = action.payload.permanent_pity;
      } else if (action.payload?.limited_pity !== undefined) {
        state.limited_pity = action.payload.limited_pity;
      }
      console.log(
        "updatePity fulfilled, permanent : " +
          state.permanent_pity +
          " limited: " +
          state.limited_pity
      );
      state.user_data_processes = state.user_data_processes - 1;
      console.log("Processes: " + state.user_data_processes);
    });
  },
});

export const {
  setUserId,
  setDisplayName,
  setCreationDate,
  setLastLogin,
  setBalance,
  setTickets,
  setPermanentPity,
  setLimitedPity,
  setTotalTripTime,
  setTotalTripsFinished,
  incrementUserDataProcesses,
  setUserDataProcesses,
} = userSlice.actions;
// export { fetchDisplayNameBySession } from "@src/features/user/userSliceHelpers";
export {
  fetchAllUserData,
  updateDisplayName,
  updateBalance,
  updateTickets,
  updatePity,
} from "@src/features/user/userSliceHelpers";
export default userSlice.reducer;
