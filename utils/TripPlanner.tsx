import { Station, Edge, Graph, newStation, newEdge } from "./Graph";

// Given start station and desired length, Find viable paths greater or equal to desired length
// return array of station paths
// RETURNS array of sorted arrays of stations that, if visited in order, will result in desired trip length. Empty if no findable path.
// graph: Adjacency list of stations and edges
// start: starting station
// desiredLength: desired trip length.
// TODO: algorithm that ensures there is a findable path for every reasonable timer length (5-120)
// TODO: Test connection stations
// TODO: Test reaching a deadend and turning around.
export function findViableTrips(
  graph: Graph,
  start: Station,
  desiredLength: number
): Station[][] {
  const paths: Station[][] = [];
  const visited: Set<Station> = new Set();

  // Helper to run DFS and search for paths
  function dfsHelper(
    current: Station,
    path: Station[],
    currentLength: number
  ): void {
    visited.add(current);
    path.push(current);

    if (currentLength >= desiredLength) {
      paths.push([...path]);
      // Terminate this path exploration in this direction
      return;
    } else {
      for (const neighbor of graph.getNeighbours(current)) {
        // for each neighbour edge of the current station
        if (!visited.has(neighbor.station)) {
          // if not visited, explore it as the next path recursively
          dfsHelper(neighbor.station, [...path], currentLength + neighbor.time);
        }
      }
    }
  }

  dfsHelper(start, [], 0);
  // console.log(paths);
  return paths;
}

// Use example: See tests
