import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { fetchDisplayNameBySession } from "@src/features/user/userSliceHelpers";

export interface UserState {
  user_id: string;
  display_name: string;
  created_at: string;
  last_login: string;
  balance: number;
  tickets: number;
  pity: number;
  total_trip_time: number;
  total_trips_finished: number;
}

const initialState: UserState = {
  user_id: "",
  display_name: "",
  created_at: "",
  last_login: "",
  balance: 0,
  tickets: 0,
  pity: 0,
  total_trip_time: 0,
  total_trips_finished: 0,
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
    },
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setPity: (state, action) => {
      state.pity = action.payload;
    },
    setTotalTripTime: (state, action) => {
      state.total_trip_time = action.payload;
    },
    setTotalTripsFinished: (state, action) => {
      state.total_trips_finished = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDisplayNameBySession.fulfilled, (state, action) => {
      state.display_name = action.payload;
      console.log("Displayname state: " + state.display_name);
    });
    // builder.addCase(fetchAllUserData.fulfilled, (state, action) => {
    //   state.display_name = action.payload;
    //   console.log("Displayname state: " + state.display_name);
    // });
  },
});

export const {
  setUserId,
  setDisplayName,
  setCreationDate,
  setLastLogin,
  setBalance,
  setTickets,
  setPity,
  setTotalTripTime,
  setTotalTripsFinished,
} = userSlice.actions;
export { fetchDisplayNameBySession } from "@src/features/user/userSliceHelpers";
export default userSlice.reducer;
