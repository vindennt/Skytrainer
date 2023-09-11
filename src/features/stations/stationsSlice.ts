import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStations,
  unlockStation,
  levelUpStation,
} from "./stationsSliceHelpers";

// Represents the station id and level of user's unlocked stations
// string: station id, number: station level
// selectedStation: stationId of selected station in stations menu
export interface StationsState {
  stations: Map<string, number>;
  selectedStation: string;
}

const initialState: StationsState = {
  stations: new Map<string, number>(),
  selectedStation: "001",
};

const stationsSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    setStation: (state, action) => {
      state.stations.set(action.payload.id, action.payload.level);
    },

    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAllStations.fulfilled, (state, action) => {
      if (action.payload) {
        state.stations = action.payload;
        // Grab first entry as the default selected station
        const firstKey = action.payload.keys().next().value;
        state.selectedStation = firstKey;
        console.log("fetchAllStations fulfilled");
        console.log(action.payload);
      }
    });
    builder.addCase(unlockStation.fulfilled, (state, action) => {
      if (action.payload) {
        state.stations.set(action.payload, 1);
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

export const { setStation, setSelectedStation } = stationsSlice.actions;
export {
  fetchAllStations,
  unlockStation,
  levelUpStation,
} from "@src/features/stations/stationsSliceHelpers";
export default stationsSlice.reducer;
