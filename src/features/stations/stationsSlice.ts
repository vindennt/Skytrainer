import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStations,
  unlockStation,
  levelUpStation,
} from "./stationsSliceHelpers";

// string: station id, number: station level
export interface StationsState {
  stations: Map<string, number>;
}

const initialState: StationsState = {
  stations: new Map<string, number>(),
};

const stationsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStation: (state, action) => {
      state.stations.set(action.payload.id, action.payload.level);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAllStations.fulfilled, (state, action) => {
      if (action.payload) {
        state.stations = action.payload;
        console.log("fetchAllStations fulfilled");
        console.log(action.payload);
      }
    });
    builder.addCase(unlockStation.fulfilled, (state, action) => {
      if (action.payload) {
        state.stations.set(action.payload, 0);
        console.log("unlockStation fulfilled: Unlocked " + action.payload);
      }
    });
    builder.addCase(levelUpStation.fulfilled, (state, action) => {
      if (action.payload) {
        const stationId: string = action.payload.stationId;
        const newLevel: number = action.payload.newLevel;
        state.stations.set(stationId, newLevel);
        console.log(
          "fetchAllStations fulfilled: Leveled up " +
            stationId +
            " to " +
            newLevel
        );
      }
    });
  },
});

export const { setStation } = stationsSlice.actions;
export {
  fetchAllStations,
  unlockStation,
  levelUpStation,
} from "@src/features/stations/stationsSliceHelpers";
export default stationsSlice.reducer;
