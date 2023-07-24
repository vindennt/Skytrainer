export type Station = {
  id: number;
  lineid: number;
};
type Time = number;

export function newStation(id: number, lineid: number): Station {
  if (id < 0) {
    console.log("Cannot have negative id. Defaulting to 0");
    id = 0;
  }
  return {
    id: id,
    lineid: lineid,
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

  // Traversal algorithm that keeps track of path length
  // TODO: test building graph and traverse all possible paths within a certain total path length.
  // TODO: make it return all possible results that fit, in one travel direction for now.
  dfsWithLength(
    start: Station,
    end: Station,
    visited: Set<Station>,
    path: Station[],
    length: number
  ): [Station[], number] | null {
    visited.add(start);
    path.push(start);

    if (start === end) {
      console.log(path);
      return [path, length]; // Found the end vertex, return the path and length
    }

    for (const neighbor of this.getNeighbours(start)) {
      if (!visited.has(neighbor.station)) {
        const newPath = [...path];
        const newLength = length + neighbor.time;
        this.dfsWithLength(neighbor.station, end, visited, newPath, newLength); // recursive call
      }
    }

    console.log("No path found");
    return null;
  }
}

// TEST USAGE
// const testStation: Station = { id: 1, lineid: 2 };

// const graph = new Graph();
// graph.addEdge(testStation, testStation, 10);
// graph.addEdge(testStation, testStation, 15);
// graph.addEdge(testStation, testStation, 5);

// console.log(graph.getGraph());
// console.log(graph.getNeighbors(testStation));
