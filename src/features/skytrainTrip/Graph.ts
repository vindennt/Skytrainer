// Regex: station or line id can contain only be strings in the form of a number
type CustomID = string & { __custom_id__: never };
const isValidID = (id: string): id is CustomID =>
  /^[0-9]+$/.test(id) && id.length > 0;

// Skytrain Station, which represent graph vertices. id = station id, lineid = skytrain line, such as Expo Line.
// transfer = whether the station links to another line
export type Station = {
  id: CustomID;
  lineid: CustomID;
  transfer: boolean;
};

// Travel time, represents weighted graph edges
// station: starting station
// time: travel time between the two vertices, represented as an edge weight
export type Edge = {
  station: Station;
  time: number;
};

// Skytrain connections represented as a Graph, which uses an Adjacency list that
// represents skytrain stations (vertuces) and the time it takes to travel to other stations (edges)
// Duplicate stations are not allowed
// Connected and undirected Graph.
export class Graph {
  private adjacencyList: Map<Station, Edge[]>;

  constructor() {
    this.adjacencyList = new Map<Station, Edge[]>();
  }

  // Add new station to the graph without an empty adjacency list
  addStation(station: Station): void {
    if (!this.adjacencyList.has(station)) {
      this.adjacencyList.set(station, []);
    }
  }

  // Adds edge between source and destination station.Edge is added to both's adjacency lists
  addEdge(source: Station, destination: Station, time: number): void {
    this.addStation(source);
    this.addStation(destination);

    this.adjacencyList.get(source)?.push({ station: destination, time });
    this.adjacencyList.get(destination)?.push({ station: source, time });
  }

  // Returns adjacency list of input station. Return empty if no edges
  getNeighbours(station: Station): Edge[] {
    if (this.adjacencyList.get(station) === undefined) {
      throw new Error(
        "Station of ID " +
          station.id +
          " has no neighbours in graph " +
          this.adjacencyList
      );
    }
    return this.adjacencyList.get(station) || [];
  }

  // Returns entire adjacency list
  getGraph(): Map<Station, Edge[]> {
    return this.adjacencyList;
  }
}

// Constructor for a station
export function newStation(id: string, lineid: string): Station;
export function newStation(
  id: string,
  lineid: string,
  transfer: boolean
): Station;
export function newStation(
  id: string,
  lineid: string,
  transfer?: boolean
): Station {
  if (!isValidID(id) || !isValidID(lineid)) {
    throw new Error("Invalid station id or lineid");
  }
  return {
    id,
    lineid,
    transfer: transfer !== undefined ? transfer : false,
  };
}

// Sets a station as an edge
export function setTransfer(station: Station): void {
  station.transfer = true;
  return;
}

// Constructor for an edge
export function newEdge(station: Station, time: number): Edge {
  if (time <= 0) {
    throw new Error("Invalid time");
  }
  return {
    station: station,
    time: time,
  };
}
