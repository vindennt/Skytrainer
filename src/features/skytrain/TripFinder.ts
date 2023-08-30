import { EDGE_LIST, getStation } from "@src/utils/skytrain";
import { Station, Graph } from "@src/features/skytrain/Graph";

// Given start station and desired length, find a trip of time equal or greater than desired length
// RETURNS array of stations that, if visited in order, will result in a trip equal to or greater than desired trip length.
// RETURNS Empty array if no findable path. Jest tests verified there is always a path for a time of 5-120 mins.

// graph: Adjacency list of stations and edges
// start: starting station
// desiredLength: desired trip length in minutes

// Note about Transfer stations: Adjacent transfer stations will not loop traversal between each other

export function findViableTrips(
  graph: Graph,
  start: Station | undefined,
  desiredLength: number
): Station[][] {
  const viablePaths: Station[][] = [];

  // Helper to run DFS and search for paths, adding any viable trips to viablePaths
  // current: current station
  // currentLength: current path length (duration) in minutes
  // visited: set of visited Stations. Every recursive call has their own visited set, necessary to allow loops
  function dfsHelper(
    current: Station | undefined,
    path: Station[],
    currentLength: number,
    visited: Set<Station>
  ): void {
    // If no current station, return
    if (!current) {
      return;
    }

    // Helper to reset visited, except for station just visited, which allows re-traversal onto transfer stations
    // This allows inifnite traversal for any trip length
    function resetVisited(current: Station) {
      const justVisited = path[path.length - 2];
      visited = new Set<Station>();
      visited.add(justVisited);
      visited.add(current);
    }

    visited.add(current);
    path.push(current);

    // If current path is a viable path, add it to viablePaths and terminate traversal
    if (
      currentLength >= desiredLength &&
      !viablePaths.some((p) => areEqual(p, path))
    ) {
      viablePaths.push([...path]);
      return;
    } else {
      // If current path is not yet viable, check neighbours to find path forward
      const neighbours = graph.getNeighbours(current);
      // *** Infinite loop part 1/2
      // *** If traversal is at a transfer station, delete everyone already visited, except station just visited
      // *** This allows traversal to retransfer onto a station already visited without backtracking
      // *** The station just visited is kept in visited so that traversal does not immediately backtrack onto it
      if (current.transfer) {
        resetVisited(current);
      }

      for (const neighbour of neighbours) {
        // *** Infinite loop part 2/2
        // *** If coming upon an already visited transfer station, you are allowed to revisit it if you did not just visit it
        if (neighbour.station.transfer) {
          resetVisited(current);
        }

        // Recursively traverse unvisited stations
        if (!visited.has(neighbour.station)) {
          dfsHelper(
            neighbour.station,
            [...path],
            currentLength + neighbour.time,
            new Set(visited) // create copy so that each recursive call is unique
          );
        }
      }
    }
  }

  // console.log("____STARTING FROM " + start.id);
  dfsHelper(start, [], 0, new Set());
  // console.log(paths);
  if (viablePaths.length === 0) {
    throw new Error(
      "No solution found for " + desiredLength + " min trip from " + start?.id
    );
  } else {
    return viablePaths;
  }
}

// Helper function to check if two paths are equal
function areEqual(path1: Station[], path2: Station[]): boolean {
  if (path1.length !== path2.length) {
    return false;
  }
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] !== path2[i]) {
      return false;
    }
  }
  return true;
}

// Returns one random trip from among all possible trips that could be taken
function findRandomViableTrip(
  graph: Graph,
  startId: string,
  desiredLength: number
): Station[] {
  const startStation: Station = getStation(startId);
  const viableTrips: Station[][] = findViableTrips(
    graph,
    startStation,
    desiredLength
  );
  const randomIndex: number = Math.floor(Math.random() * viableTrips.length);
  return viableTrips[randomIndex];
}

// Returns string ids of random trip from among all possible trips that could be taken
export function findRandomViableTripIds(
  graph: Graph,
  startId: string,
  desiredLength: number
): string[] {
  const viableTrip: Station[] = findRandomViableTrip(
    graph,
    startId,
    desiredLength
  );
  const idsOfViableTrips: string[] = viableTrip.map((station) => station.id);
  return idsOfViableTrips;
}

// Builds and returns the graph from edgelist
// timeMultiplier represents scaling to apply to edge weights. Default is 1.
// The edge times used are idealized from Translink's table, but may need to be multiplied by ~1.2 to be more accurate
export function buildGraph(timeMultiplier?: number): Graph {
  const multiplier = timeMultiplier ? timeMultiplier : 1;

  const graph: Graph = new Graph();
  EDGE_LIST.forEach((edge) => {
    graph.addEdge(edge.start, edge.destination, edge.time * multiplier);
  });
  return graph;
}
