import { Station, Edge, Graph, newStation, newEdge } from "./Graph";

// Given start station and desired length, Find viable paths greater or equal to desired length
// return array of station paths
// RETURNS array of sorted arrays of stations that, if visited in order, will result in desired trip length. Empty if no findable path.
// graph: Adjacency list of stations and edges
// start: starting station
// desiredLength: desired trip length.
// TODO: algorithm that ensures there is a findable path for every reasonable timer length (5-120)
// TODO: Test connection stations
export function findViableTrips(
  graph: Graph,
  start: Station,
  desiredLength: number
): Station[][] {
  const paths: Station[][] = [];

  // Helper to run DFS and search for paths
  function dfsHelper(
    current: Station,
    path: Station[],
    currentLength: number,
    visited: Set<Station> // allows every recursive call to have their own visited set.
    // TODO: block duplicate paths from being added
  ): void {
    visited.add(current);
    path.push(current);

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
        // for each neighbour edge of the current station
        if (
          neighbour.station.transfer &&
          visited.has(neighbour.station) &&
          !areEqual([neighbour.station], [path[path.length - 2]])
        ) {
          visited.delete(neighbour.station); // ONLY DELETE IT AFTER after recursive call?
          visited.forEach((visitedStation) => {
            if (
              visitedStation !== neighbour.station &&
              current.lineid !== visitedStation.lineid
            ) {
              visited.delete(visitedStation);
              console.log(
                visitedStation.id +
                  " with id " +
                  visitedStation.lineid +
                  " deleted"
              );
            }
          });
          // If the neighbour station has transfer = true, allow re-traversing stations with a different line-id
          // dfsHelper(
          //   neighbour.station,
          //   [...path],
          //   currentLength + neighbour.time,
          //   // this visited set should only contains stations with its own line id
          //   visited
          // );
        }

        if (!visited.has(neighbour.station)) {
          console.log(
            "going to visit: " +
              neighbour.station.id +
              " from " +
              current.id +
              ". Current path length:" +
              path.length
          );
          // if not visited, explore it as the next path recursively
          dfsHelper(
            neighbour.station,
            [...path],
            currentLength + neighbour.time,
            new Set(visited)
          );
        } else {
          // console.log("visited already has " + neighbour.station.id);
        }
      }
    }
  }

  console.log("____STARTING FROM " + start.id);
  dfsHelper(start, [], 0, new Set());
  // console.log(paths);
  return paths;
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

// Use example: See tests
