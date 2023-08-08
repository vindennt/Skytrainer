import { Station, Edge, Graph, newStation, newEdge } from "./Graph";
// import * as SKYTRAIN_DATA from "../utils/SKYTRAIN_DATA";

// Given start station and desired length, Find viable paths greater or equal to desired length
// return array of station paths
// RETURNS array of sorted arrays of stations that, if visited in order, will result in desired trip length. Empty if no findable path.
// Note about Graph: Adjacent transfer stations will not loop each other
// graph: Adjacency list of stations and edges
// start: starting station
// desiredLength: desired trip length.
// TODO: algorithm that ensures there is a findable path for every reasonable timer length (5-120)

// const SKYTRAIN_GRAPH: Graph = ;

export function findViableTrips(
  graph: Graph,
  start: Station | undefined,
  desiredLength: number
): Station[][] {
  // const graph = SKYTRAIN_GRAPH;
  console.log("---------STARTING findViableTrips finished");
  const paths: Station[][] = [];

  // Helper to run DFS and search for paths, adding viable to paths
  // RETURNS void
  // current: current station
  // currentLength: current path length
  // visited: visited Stations. Every recursive call has their own visited set, allowing loops
  function dfsHelper(
    current: Station | undefined,
    path: Station[],
    currentLength: number,
    visited: Set<Station>
  ): void {
    if (!current) {
      return; // no current station
    }
    visited.add(current);
    path.push(current);

    // If viable path found
    if (
      currentLength >= desiredLength &&
      !paths.some((p) => areEqual(p, path))
    ) {
      paths.push([...path]);
      // Terminate this path exploration in this direction
      return;
    } else {
      const neighbours = graph.getNeighbours(current);
      for (const neighbour of neighbours) {
        // Delete viable tranfser station neighbours from visited to allow looping
        if (
          isLoopableTransfer(
            neighbour.station,
            path,
            visited.has(neighbour.station)
          )
        ) {
          visited.delete(neighbour.station);
          // Allow revisiting stations along new line that is about to be traversed
          visited.forEach((visitedStation) => {
            if (
              visitedStation !== neighbour.station &&
              current.lineid !== visitedStation.lineid
            ) {
              visited.delete(visitedStation);
            }
          });
        }

        // Traverse unvisited stations
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
  if (paths.length === 0) {
    throw new Error(
      "No solution found for " + desiredLength + " min trip from " + start?.id
    );
  } else {
    console.log("---------findViableTrips finished");
    console.log(paths);
    return paths;
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
// If neighbour is an already explored transfer station that hasnt just been visited, it can be looped
function isLoopableTransfer(
  neighbour: Station,
  path: Station[],
  visited: boolean
) {
  return (
    visited &&
    neighbour.transfer &&
    !areEqual([neighbour], [path[path.length - 2]])
  );
}
// Use example: See tests
