import { createSlice } from "@reduxjs/toolkit";
import { Graph, Station } from "@src/features/skytrain/Graph";
import { EDGE_LIST } from "@src/utils/skytrain";
import { buildGraph } from "@features/skytrain/TripFinder";
import { TripReward } from "../reward/TripRewardHandler";

// skytrainGraph: Graph of the skytrain stations
// DEPRECATED: selectedStartStation: starting station for a trip NOTE: for now, try and use the stations selector to avoid redundancy. Stations UI should auto-scroll to the selected station
// currentTrip: array of station ids being visited during the current trip
// currentRewards: Reward that will be given when the trip is finished
export interface SkytrainState {
  skytrainGraph: Graph;
  trip: string[];
  rewards: TripReward;
  currentQuickstartId: string | null;
}

const initialState: SkytrainState = {
  skytrainGraph: buildGraph(1),
  trip: [],
  rewards: { total: 0, contributors: [] },
  currentQuickstartId: null,
};

const skytrainSlice = createSlice({
  name: "skytrain",
  initialState,
  reducers: {
    setGraph: (state, action) => {
      state.skytrainGraph = buildGraph(action.payload);
      // console.log(state.skytrainGraph);
    },
    setTrip: (state, action) => {
      state.trip = action.payload;
      console.log(state.trip);
    },
    setRewards: (state, action) => {
      state.rewards = action.payload;
      console.log(state.rewards);
    },
    setQuickStartId: (state, action) => {
      state.currentQuickstartId = action.payload;
      console.log(state.currentQuickstartId);
    },
  },
});

export const { setTrip, setRewards, setGraph, setQuickStartId } =
  skytrainSlice.actions;
export default skytrainSlice.reducer;

export const selectRewards = (state: { skytrain: SkytrainState }) =>
  state.skytrain.rewards;
export const selectTrip = (state: { skytrain: SkytrainState }) =>
  state.skytrain.trip;
