import { createSlice } from "@reduxjs/toolkit";
import { Graph, Station } from "@features/skytrainTrip/Graph";
import { EDGE_LIST } from "@src/utils/skytrain";

// Builds and returns the graph from data above
// timeMultiplier represents scaling to apply to edge weights. Default is 1.
// The edge times used are idealized from Translink's table, but may need to be multiplied by ~1.2 to be more accurate
function buildGraph(timeMultiplier?: number): Graph {
  const multiplier = timeMultiplier ? timeMultiplier : 1;

  const graph: Graph = new Graph();
  EDGE_LIST.forEach((edge) => {
    graph.addEdge(edge.start, edge.destination, edge.time * multiplier);
  });
  return graph;
}

// skytrainGraph: Graph of the skytrain stations
// DEPRECATED: selectedStartStation: starting station for a trip NOTE: for now, try and use the stations selector to avoid redundancy. Stations UI should auto-scroll to the selected station
// viableTrip: the randomly selected viable trip from among all the trips return from TripFinder
// tripRewards: All rewards from the trip
export interface SkytrainState {
  skytrainGraph: Graph;
  viableTrips: Station[][];
  chosenViableTrip: Station[];
  // tripRewards: Reward[];
  //   selectedStartStation: Station | null;
}

const initialState: SkytrainState = {
  skytrainGraph: buildGraph(1),
  viableTrips: [],
  chosenViableTrip: [],
  // tripRewards: [],
  //   selectedStartStation: null,
};

const skytrainSlice = createSlice({
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

export const { setViableTrips, setChosenViableTrip } = skytrainSlice.actions;
export default skytrainSlice.reducer;
