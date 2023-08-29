import { createSlice } from "@reduxjs/toolkit";
import { Graph, Station } from "@features/skytrainTrip/Graph";
import { buildGraph } from "./SkytrainData";

// skytrainGraph: Graph of the skytrain stations
// DEPRECATED: selectedStartStation: starting station for a trip NOTE: for now, try and use the stations selector to avoid redundancy. Stations UI should auto-scroll to the selected station
// viableTrip: the randomly selected viable trip from among all the trips return from TripFinder
// tripRewards: All rewards from the trip
export interface SkytrainTripState {
  skytrainGraph: Graph;
  viableTrips: Station[][];
  chosenViableTrip: Station[];
  // tripRewards: Reward[];
  //   selectedStartStation: Station | null;
}

const initialState: SkytrainTripState = {
  skytrainGraph: buildGraph(1),
  viableTrips: [],
  chosenViableTrip: [],
  // tripRewards: [],
  //   selectedStartStation: null,
};

const skytrainTripSlice = createSlice({
  name: "skytrainTrip",
  initialState,
  reducers: {
    setViableTrips: (state, action) => {
      state.viableTrips = action.payload;
    },
    setChosenViableTrip: (state, action) => {
      state.chosenViableTrip = action.payload;
    },
    // setTripRewards: (state, action) => {
    //   state.tripRewards = action.payload;
    // },
  },
});

export const { setViableTrips, setChosenViableTrip } =
  skytrainTripSlice.actions;
export default skytrainTripSlice.reducer;
