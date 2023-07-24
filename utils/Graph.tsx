export type Station = {
  id: number;
  lineid: number;
  transfer: boolean;
};
type Time = number;

export function newStation(id: number, lineid: number): Station;
export function newStation(
  id: number,
  lineid: number,
  transfer: boolean
): Station;

export function newStation(
  id: number,
  lineid: number,
  transfer?: boolean
): Station {
  if (id < 0) {
    console.log("Cannot have negative id. Defaulting to 0");
    id = 0;
  }
  if (lineid < 0) {
    console.log("Cannot have negative line id. Defaulting to 0");
    lineid = 0;
  }
  return {
    id: id,
    lineid: lineid,
    transfer: transfer !== undefined ? transfer : false,
  };
}

export type Edge = {
  station: Station; // destination
  time: Time; // travel time (mins) from previous statino to destination
};

export function newEdge(station: Station, time: number): Edge {
  if (time < 0) {
    console.log("Cannot have negative time. Defaulting to 1");
    time = 1;
  }
  return {
    station: station,
    time: time,
  };
}

// Adjacency list that represents Stations and the time it takes to travel between each one
// Duplicate stations are not allowed
// Connected, undirected, unsorted graph. Directionality will be implemented with the traversal algorithm
export class Graph {
  // Use adjacency list
  private adjacencyList: Map<Station, Edge[]>;

  constructor() {
    this.adjacencyList = new Map<Station, Edge[]>();
  }

  addStation(station: Station): void {
    if (!this.adjacencyList.has(station)) {
      this.adjacencyList.set(station, []); // add new station without an edge
    }
  }

  // Undirected, so adding an edge one way will add it the other way too
  addEdge(source: Station, destination: Station, time: Time): void {
    this.addStation(source);
    this.addStation(destination);

    this.adjacencyList.get(source)?.push({ station: destination, time });
    this.adjacencyList.get(destination)?.push({ station: source, time });
  }

  getNeighbours(station: Station): Edge[] {
    return this.adjacencyList.get(station) || []; // return empty if no edges
  }

  getGraph(): Map<Station, Edge[]> {
    return this.adjacencyList;
  }

  // ***NOTE: This is the old, untested traversal algorithm that was more complex than necessary
  // // Traversal algorithm that keeps track of path length
  // // RETURNS array of sorted arrays of stations that, if visited in order, will result in desired trip length. null if no findable path.
  // // TODO: test building graph and traverse all possible paths within a certain total path length.
  // // TODO: make it return all possible results that fit, in one travel direction for now.
  // // TODO: algorithm that ensures there is a findable path for every reasonable timer length (5-120)
  // // TODO: trust in the natural recursion
  // // start: starting station
  // // goal: desired trip length
  // // length: current trip length
  // // visited: visited stations to avoid revisiting. Reset if transfer/deadend met
  // // path: path taken so far. Should be different for branching recursive calls
  // dfsViablePath(
  //   start: Station,
  //   goal: number,
  //   length: number,
  //   visited: Set<Station>,
  //   path: Station[],
  //   viableResults: Station[][]
  // ): Station[][] | null {
  //   // init viableResults if first iteration
  //   if (visited.size === 0) {
  //     viableResults = [];
  //   }

  //   visited.add(start);
  //   path.push(start);

  //   if (length >= goal) {
  //     console.log("Viable path found: " + path);
  //     viableResults.push(path);
  //   }

  //   for (const neighbor of this.getNeighbours(start)) {
  //     if (!visited.has(neighbor.station)) {
  //       const newPath = [...path];
  //       const newLength = length + neighbor.time;
  //       this.dfsViablePath(
  //         neighbor.station,
  //         goal,
  //         newLength,
  //         visited,
  //         newPath,
  //         viableResults
  //       ); // recursive call
  //     }
  //   }

  //   // console.log("No path found");
  //   return viableResults;
  // }
}
