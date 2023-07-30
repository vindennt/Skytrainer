type CustomID = string & { __custom_id__: never };
const isValidID = (id: string): id is CustomID =>
  /^[0-9]+$/.test(id) && id.length > 0; // regex: id can contain only numbers

export type Station = {
  id: CustomID;
  lineid: CustomID;
  transfer: boolean; // is a transfer station? ; Whether a station is adjacent to a station from a different line
};
type Time = number;

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
    throw new Error("Invalid id or lineid"); // Handle invalid input, you can also return a default or null station object here if needed.
  }

  return {
    id,
    lineid,
    transfer: transfer !== undefined ? transfer : false,
  };
}

export type Edge = {
  station: Station; // destination
  time: Time; // travel time (mins) from previous statino to destination
};

export function newEdge(station: Station, time: number): Edge {
  if (time < 0) {
    // console.log("Cannot have negative time. Defaulting to 1");
    throw new Error("Invalid time");
    // time = 1;
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
}
