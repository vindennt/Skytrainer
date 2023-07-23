type Station = {
  id: number;
  lineid: number;
};
type Time = number;

interface Edge {
  station: Station; // destination
  time: Time; // travel time (mins) from previous statino to destination
}

class Graph {
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

  addEdge(source: Station, destination: Station, time: Time): void {
    this.addStation(source);
    this.addStation(destination);

    this.adjacencyList.get(source)?.push({ station: destination, time });
  }

  getNeighbors(station: Station): Edge[] {
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
      return [path, length]; // Found the end vertex, return the path and length
    }

    for (const neighbor of this.getNeighbors(start)) {
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
const testStation: Station = { id: 1, lineid: 2 };

const graph = new Graph();
graph.addEdge(testStation, testStation, 10);
graph.addEdge(testStation, testStation, 15);
graph.addEdge(testStation, testStation, 5);

// console.log(graph.getGraph());
// console.log(graph.getNeighbors(testStation));
