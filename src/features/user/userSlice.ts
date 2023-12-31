import { createSlice } from "@reduxjs/toolkit";

import {
  updateUserData,
  fetchAllUserData,
  UserUpdate,
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
  slider: number;
  last_used_station: string;
  daily_reset_time: Date;
  last_focus_date: Date;
  daily_focus_time: number;
  focus_streak_days: number;
  daily_focus_claimed: number;
  focus_streak_days_record: number;
  focus_streak_days_claimed: number;
  total_trip_time_claimed: number;
  total_trips_finished_claimed: number;
  first_milestone: number;
  second_milestone: number;
  third_milestone: number;
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
  slider: 25,
  last_used_station: "001",
  daily_reset_time: new Date(),
  last_focus_date: new Date(),
  daily_focus_time: 0,
  focus_streak_days: 0,
  daily_focus_claimed: 0,
  focus_streak_days_record: 0,
  focus_streak_days_claimed: 0,
  total_trip_time_claimed: 0,
  total_trips_finished_claimed: 0,
  first_milestone: 5,
  second_milestone: 10,
  third_milestone: 20,
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
    setSlider: (state, action) => {
      state.slider = action.payload;
    },
    setLastUsedStation: (state, action) => {
      state.last_used_station = action.payload;
    },
    setDailyResetTime: (state, action) => {
      state.daily_reset_time = action.payload;
    },
    setlastFocusDate: (state, action) => {
      state.last_focus_date = action.payload;
    },
    setDailyFocusTime: (state, action) => {
      state.daily_focus_time = action.payload;
    },
    setFocusStreakDays: (state, action) => {
      state.focus_streak_days = action.payload;
    },
    setDailyFocusClaimed: (state, action) => {
      state.daily_focus_claimed = action.payload;
    },
    setFocusStreakDaysRecord: (state, action) => {
      state.focus_streak_days_record = action.payload;
    },
    setFirstMilestone: (state, action) => {
      state.first_milestone = action.payload;
    },
    setSecondMilestone: (state, action) => {
      state.second_milestone = action.payload;
    },
    setThirdMilestone: (state, action) => {
      state.third_milestone = action.payload;
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
      state.slider = action.payload.slider;
      state.last_used_station = action.payload.last_used_station;
      state.daily_reset_time = action.payload.daily_reset_time;
      state.last_focus_date = action.payload.last_focus_date;
      state.daily_focus_time = action.payload.daily_focus_time;
      state.focus_streak_days = action.payload.focus_streak_days;
      state.daily_focus_claimed = action.payload.daily_focus_claimed;
      state.focus_streak_days_record = action.payload.focus_streak_days_record;
      state.focus_streak_days_claimed =
        action.payload.focus_streak_days_claimed;
      state.total_trip_time_claimed = action.payload.total_trip_time_claimed;
      state.total_trips_finished_claimed =
        action.payload.total_trips_finished_claimed;
      state.first_milestone = action.payload.first_milestone;
      state.second_milestone = action.payload.second_milestone;
      state.third_milestone = action.payload.third_milestone;
    });
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      const data: UserUpdate | undefined = action.payload;
      console.log("updateUserData fulfilled: " + JSON.stringify(data, null, 2));
      // TODO: find a more elegant way to do this without typescript crying
      if (data !== undefined) {
        if (data.display_name !== undefined)
          state.display_name = data.display_name;
        if (data.created_at !== undefined) state.created_at = data.created_at;
        if (data.last_login !== undefined) state.last_login = data.last_login;
        if (data.balance !== undefined) state.balance = data.balance;
        if (data.tickets !== undefined) state.tickets = data.tickets;
        if (data.permanent_pity !== undefined)
          state.permanent_pity = data.permanent_pity;
        if (data.limited_pity !== undefined)
          state.limited_pity = data.limited_pity;
        if (data.total_trip_time !== undefined)
          state.total_trip_time = data.total_trip_time;
        if (data.total_trips_finished !== undefined)
          state.total_trips_finished = data.total_trips_finished;
        if (data.slider !== undefined) state.slider = data.slider;
        if (data.last_used_station !== undefined)
          state.last_used_station = data.last_used_station;
        if (data.daily_reset_time !== undefined)
          state.daily_reset_time = data.daily_reset_time;
        if (data.last_focus_date !== undefined)
          state.last_focus_date = data.last_focus_date;
        if (data.daily_focus_time !== undefined)
          state.daily_focus_time = data.daily_focus_time;
        if (data.focus_streak_days !== undefined)
          state.focus_streak_days = data.focus_streak_days;
        if (data.daily_focus_claimed !== undefined)
          state.daily_focus_claimed = data.daily_focus_claimed;
        if (data.focus_streak_days_record !== undefined)
          state.focus_streak_days_record = data.focus_streak_days_record;
        if (data.focus_streak_days_claimed !== undefined)
          state.focus_streak_days_claimed = data.focus_streak_days_claimed;
        if (data.total_trip_time_claimed !== undefined)
          state.total_trip_time_claimed = data.total_trip_time_claimed;
        if (data.total_trips_finished_claimed !== undefined)
          state.total_trips_finished_claimed =
            data.total_trips_finished_claimed;
        if (data.first_milestone !== undefined)
          state.first_milestone = data.first_milestone;
        if (data.second_milestone !== undefined)
          state.second_milestone = data.second_milestone;
        if (data.third_milestone !== undefined)
          state.third_milestone = data.third_milestone;
      }
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
  setSlider,
  setLastUsedStation,
  setDailyResetTime,
  setlastFocusDate,
  setDailyFocusTime,
  setFocusStreakDays,
  setDailyFocusClaimed,
} = userSlice.actions;
// export { fetchDisplayNameBySession } from "@src/features/user/userSliceHelpers";
export {
  fetchAllUserData,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
export default userSlice.reducer;

export const selectUserId = (state: { user: UserState }) => state.user.user_id;
export const selectDisplayName = (state: { user: UserState }) =>
  state.user.display_name;
export const selectCreatedAt = (state: { user: UserState }) =>
  state.user.created_at;
export const selectLastLogin = (state: { user: UserState }) =>
  state.user.last_login;
export const selectBalance = (state: { user: UserState }) => state.user.balance;
export const selectTickets = (state: { user: UserState }) => state.user.tickets;
export const selectPermanentPity = (state: { user: UserState }) =>
  state.user.permanent_pity;
export const selectLimitedPity = (state: { user: UserState }) =>
  state.user.limited_pity;
export const selectTotalTripTime = (state: { user: UserState }) =>
  state.user.total_trip_time;
export const selectTotalTripsFinished = (state: { user: UserState }) =>
  state.user.total_trips_finished;
export const selectSlider = (state: { user: UserState }) => state.user.slider;
export const selectLastUsedStation = (state: { user: UserState }) =>
  state.user.last_used_station;
export const selectDailyResetTime = (state: { user: UserState }) =>
  state.user.daily_reset_time;
export const selectLastFocusDate = (state: { user: UserState }) =>
  state.user.last_focus_date;
export const selectDailyFocusTime = (state: { user: UserState }) =>
  state.user.daily_focus_time;
export const selectFocusStreakDays = (state: { user: UserState }) =>
  state.user.focus_streak_days;
export const selectDailyFocusClaimed = (state: { user: UserState }) =>
  state.user.daily_focus_claimed;
export const selectFocusStreakDaysRecord = (state: { user: UserState }) =>
  state.user.focus_streak_days_record;
export const selectFocusStreakDaysClaimed = (state: { user: UserState }) =>
  state.user.focus_streak_days_claimed;
export const selectTotalTripTimeClaimed = (state: { user: UserState }) =>
  state.user.total_trip_time_claimed;
export const selectTotalTripsFinishedClaimed = (state: { user: UserState }) =>
  state.user.total_trips_finished_claimed;
export const selectFirstMilestone = (state: { user: UserState }) =>
  state.user.first_milestone;
export const selectSecondMilestone = (state: { user: UserState }) =>
  state.user.second_milestone;
export const selectThirdMilestone = (state: { user: UserState }) =>
  state.user.third_milestone;
