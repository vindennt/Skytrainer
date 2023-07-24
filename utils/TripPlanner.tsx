import { Station, Edge, Graph, newStation, newEdge } from "./Graph";

// Given start station and desired length, Find viable paths greater or equal to desired length
// return array of station paths
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
      // Check if the current path length is greather than or equal to desired length
      paths.push([...path]);
      // Terminate this path exploration
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

// // Usage example
// const graph = new Graph();
// // ... Add stations and edges to the graph ...
// const startStation = newStation(1, 100); // Replace the station parameters with your desired starting station
// const desiredPathLength = 30; // Replace with your desired path length

// const pathsNearLength = findViableTrips(graph, startStation, desiredPathLength);
// console.log(pathsNearLength);
