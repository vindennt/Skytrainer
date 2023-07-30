import { Station, newStation } from "./Graph";

interface EdgeData {}
type StationMap = Map<string, Station>;
type LineMap = Map<string, string>;

const LINE_MAP: LineMap = new Map<string, string>([["001", "Expo Line"]]);

const STATION_MAP: StationMap = new Map<string, Station>([
  ["Broadway-Commerical", newStation("001", "002")],
]);
// TODO: insert every station

// TODO: build a map of every edge and export it
