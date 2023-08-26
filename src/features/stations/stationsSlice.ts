import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStations, unlockStation } from "./stationsSliceHelpers";

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
      console.log(
        "fetchAllStations fulfilled: "
        // TODO: implement
      );
      console.log(action.payload);
    });
    builder.addCase(unlockStation.fulfilled, (state, action) => {
      console.log(
        "unlockWaterfront fulfilled: "
        // TODO: implement
      );
    });
  },
});

export const { setStation } = stationsSlice.actions;
// TODO: export thunks
export {
  fetchAllStations,
  unlockStation,
} from "@src/features/stations/stationsSliceHelpers";
export default stationsSlice.reducer;
