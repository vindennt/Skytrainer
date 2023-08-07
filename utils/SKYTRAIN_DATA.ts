import { Graph, Station, newStation } from "./Graph";

// all the info that addEdge needs to push onto Graph's adjacency list
// quickly create a stn's info object
// export type StationInfo = { name: string; lineid: string; transfer: boolean };
// function stnInfo(name: string, lineid: string, transfer: boolean): StationInfo {
//   return { name: name, lineid: lineid, transfer: transfer };
// }

// quickly define a stn's edge to be built
export type EdgeToBuild = {
  start: Station;
  destination: Station;
  time: number;
};
function edgeToBuild(
  start: Station,
  destination: Station,
  time: number
): EdgeToBuild {
  return {
    start: start,
    destination: destination,
    time: time,
  };
}

// Takes lineid to output name
export type LineMap = Map<string, string>;
// info that a station id should give, necessary to build it
// TODO: Should be a globally accessible from Firestore
export const LINE_MAP: LineMap = new Map<string, string>([
  ["00", "Expo Line"],
  ["01", "Millenium Line"],
  ["02", "Canada Line"],
  ["03", "Millenium Evergreen Extension"],
]);

export const Waterfront: Station = newStation("001", "00", true);
export const Burrard: Station = newStation("002", "00", false);
export const Granville: Station = newStation("003", "00", false);
export const StadiumChinatown: Station = newStation("004", "00", false);
export const MainStreetScienceWorld: Station = newStation("005", "00", false);
export const CommercialBroadway: Station = newStation("006", "00", true);
export const Nanaimo: Station = newStation("007", "00", false);
export const TwentyNinththAvenue: Station = newStation("008", "00", false);
export const JoyceCollingwood: Station = newStation("009", "00", false);
export const Patterson: Station = newStation("010", "00", false);
export const Metrotown: Station = newStation("011", "00", false);
export const RoyalOak: Station = newStation("012", "00", false);
export const Edmonds: Station = newStation("013", "00", false);
export const TwentySecondStreet: Station = newStation("014", "00", false);
export const NewWestminister: Station = newStation("015", "00", false);
export const Columbia: Station = newStation("016", "00", false);
export const ScottRoad: Station = newStation("017", "00", false);
export const Gateway: Station = newStation("018", "00", false);
export const SurreyCentral: Station = newStation("019", "00", false);
export const KingGeorge: Station = newStation("020", "00", false);
export const Sapperton: Station = newStation("021", "00", false);
export const Braid: Station = newStation("022", "00", false);
export const LougheedTownCentre: Station = newStation("023", "00", true);
export const ProductionWayUniversity: Station = newStation("024", "00", true);
export const VCCClark: Station = newStation("025", "01", false);
export const Renfrew: Station = newStation("026", "01", false);
export const Rupert: Station = newStation("027", "01", false);
export const Gilmore: Station = newStation("028", "01", false);
export const Brentwood: Station = newStation("029", "01", false);
export const Holdom: Station = newStation("030", "01", false);
export const SperlingBurnabyLake: Station = newStation("031", "01", false);
export const LakeCity: Station = newStation("032", "01", false);
export const Burquitlam: Station = newStation("033", "03", false);
export const MoodyCentre: Station = newStation("034", "03", false);
export const InletCentre: Station = newStation("035", "03", false);
export const CoquitlamCentral: Station = newStation("036", "03", false);
export const Lincoln: Station = newStation("037", "03", false);
export const LafargeLakeDouglas: Station = newStation("038", "03", false);
export const VancouverCityCentre: Station = newStation("039", "02", false);
export const YaletownRoundhouse: Station = newStation("040", "02", false);
export const OlympicVillage: Station = newStation("041", "02", false);
export const BroadwayCityHall: Station = newStation("042", "02", false);
export const KingEdward: Station = newStation("043", "02", false);
export const OakridgeFourtyFirstAve: Station = newStation("044", "02", false);
export const LangaraFourtyNinthAve: Station = newStation("045", "02", false);
export const MarineDrive: Station = newStation("046", "02", false);
export const Bridgeport: Station = newStation("047", "02", false);
export const Aberdeen: Station = newStation("048", "02", false);
export const Lansdowne: Station = newStation("049", "02", false);
export const RichmondBrighouse: Station = newStation("050", "02", false);
export const Templeton: Station = newStation("051", "02", false);
export const SeaIslandCentre: Station = newStation("052", "02", false);
export const YVRAirport: Station = newStation("053", "02", false);

// To translate station id to the name
export const STATION_MAP: Map<string, [string, Station]> = new Map();
STATION_MAP.set("001", ["Waterfront", Waterfront]);
STATION_MAP.set("002", ["Burrard", Burrard]);
STATION_MAP.set("003", ["Granville", Granville]);
STATION_MAP.set("004", ["Stadium-Chinatown", StadiumChinatown]);
STATION_MAP.set("005", ["Main Street - ScienceWorld", MainStreetScienceWorld]);
STATION_MAP.set("006", ["Commercial-Broadway", CommercialBroadway]);
STATION_MAP.set("008", ["Nanaimo", Nanaimo]);
STATION_MAP.set("007", ["29th Avenue", TwentyNinththAvenue]);
STATION_MAP.set("009", ["Joyce-Collingwood", JoyceCollingwood]);
STATION_MAP.set("010", ["Patterson", Patterson]);
STATION_MAP.set("011", ["Metrotown", Metrotown]);
STATION_MAP.set("012", ["Royal Oak", RoyalOak]);
STATION_MAP.set("013", ["Edmonds", Edmonds]);
STATION_MAP.set("014", ["22nd Street", TwentySecondStreet]);
STATION_MAP.set("015", ["New Westminister", NewWestminister]);
STATION_MAP.set("016", ["Columbia", Columbia]);
STATION_MAP.set("017", ["Scott Road", ScottRoad]);
STATION_MAP.set("018", ["Gateway", Gateway]);
STATION_MAP.set("019", ["Surrey Central", SurreyCentral]);
STATION_MAP.set("020", ["King George", KingGeorge]);

STATION_MAP.set("021", ["Sapperton", Sapperton]);
STATION_MAP.set("022", ["Braid", Braid]);
STATION_MAP.set("023", ["Lougheed Town Centre", LougheedTownCentre]);
STATION_MAP.set("024", ["Production Way University", ProductionWayUniversity]);

STATION_MAP.set("025", ["VCC Clark", VCCClark]);
STATION_MAP.set("026", ["Renfrew", Renfrew]);
STATION_MAP.set("027", ["Rupert", Rupert]);
STATION_MAP.set("028", ["Gilmore", Gilmore]);
STATION_MAP.set("029", ["Brentwood Town Centre", Brentwood]);
STATION_MAP.set("030", ["Holdom", Holdom]);
STATION_MAP.set("031", ["Sperling Burnaby Lake", SperlingBurnabyLake]);
STATION_MAP.set("032", ["Lake City", LakeCity]);

STATION_MAP.set("033", ["Burquitlam", Burquitlam]);
STATION_MAP.set("034", ["Moody Centre", MoodyCentre]);
STATION_MAP.set("035", ["Inlet Centre", InletCentre]);
STATION_MAP.set("036", ["Coquitlam Central", CoquitlamCentral]);
STATION_MAP.set("037", ["Lincoln", Lincoln]);
STATION_MAP.set("038", ["Lafarge Lake Douglas", LafargeLakeDouglas]);

STATION_MAP.set("039", ["Vancouver City Centre", VancouverCityCentre]);
STATION_MAP.set("040", ["Yaletown Roundhouse", YaletownRoundhouse]);
STATION_MAP.set("041", ["Olympic Village", OlympicVillage]);
STATION_MAP.set("042", ["Broadway City Hall", BroadwayCityHall]);
STATION_MAP.set("043", ["King Edward", KingEdward]);
STATION_MAP.set("044", ["Oakridge 41stAve", OakridgeFourtyFirstAve]);
STATION_MAP.set("045", ["Langara 49th Ave", LangaraFourtyNinthAve]);
STATION_MAP.set("046", ["Marine Drive", MarineDrive]);
STATION_MAP.set("047", ["Bridgeport", Bridgeport]);
STATION_MAP.set("048", ["Aberdeen", Aberdeen]);
STATION_MAP.set("049", ["Lansdowne", Lansdowne]);
STATION_MAP.set("050", ["Richmond Brighouse", RichmondBrighouse]);
STATION_MAP.set("052", ["Templeton", Templeton]);
STATION_MAP.set("051", ["Sea Island Centre", SeaIslandCentre]);
STATION_MAP.set("053", ["YVR Airport", YVRAirport]);

// takes station id and outputs name in streamlined way
export function getStationName(id: string): string {
  const ref = STATION_MAP.get(id);
  if (ref !== undefined) {
    return ref?.[0];
  } else {
    throw new Error("No such station ID");
  }
}

// TODO: put a timescale? when building edges, everything is multiplied so that a long trip will not alwyas just loop around
export const EDGE_LIST: EdgeToBuild[] = [
  // Expo line
  edgeToBuild(Waterfront, Burrard, 2),
  edgeToBuild(Burrard, Granville, 1),
  edgeToBuild(Granville, StadiumChinatown, 2),
  edgeToBuild(StadiumChinatown, MainStreetScienceWorld, 2),
  edgeToBuild(MainStreetScienceWorld, CommercialBroadway, 3),
  edgeToBuild(CommercialBroadway, Nanaimo, 3),
  edgeToBuild(Nanaimo, TwentyNinththAvenue, 1),
  edgeToBuild(TwentyNinththAvenue, JoyceCollingwood, 2),
  edgeToBuild(JoyceCollingwood, Patterson, 2),
  edgeToBuild(Patterson, Metrotown, 1),
  edgeToBuild(Metrotown, RoyalOak, 3),
  edgeToBuild(RoyalOak, Edmonds, 3),
  edgeToBuild(Edmonds, TwentySecondStreet, 3),
  edgeToBuild(TwentySecondStreet, NewWestminister, 3),
  edgeToBuild(NewWestminister, Columbia, 1),
  edgeToBuild(Columbia, ScottRoad, 1),
  edgeToBuild(ScottRoad, Gateway, 3),
  edgeToBuild(Gateway, SurreyCentral, 2),
  edgeToBuild(SurreyCentral, KingGeorge, 1),
  // Coumbia Sapperton
  edgeToBuild(Columbia, Sapperton, 3),
  edgeToBuild(Sapperton, Braid, 2),
  edgeToBuild(Braid, LougheedTownCentre, 3),
  edgeToBuild(LougheedTownCentre, ProductionWayUniversity, 2),
  // Millenium line
  edgeToBuild(VCCClark, CommercialBroadway, 1),
  edgeToBuild(CommercialBroadway, Renfrew, 3),
  edgeToBuild(Renfrew, Rupert, 3),
  edgeToBuild(Rupert, Gilmore, 1),
  edgeToBuild(Gilmore, Brentwood, 2),
  edgeToBuild(Brentwood, Holdom, 2),
  edgeToBuild(Holdom, SperlingBurnabyLake, 2),
  edgeToBuild(SperlingBurnabyLake, LakeCity, 3),
  edgeToBuild(LakeCity, ProductionWayUniversity, 2),
  // Evergreen extension
  edgeToBuild(LougheedTownCentre, Burquitlam, 3),
  edgeToBuild(Burquitlam, MoodyCentre, 5),
  edgeToBuild(MoodyCentre, InletCentre, 2),
  edgeToBuild(InletCentre, CoquitlamCentral, 3),
  edgeToBuild(CoquitlamCentral, Lincoln, 2),
  edgeToBuild(Lincoln, LafargeLakeDouglas, 1),
  // Canada line
  edgeToBuild(Waterfront, VancouverCityCentre, 2),
  edgeToBuild(VancouverCityCentre, YaletownRoundhouse, 2),
  edgeToBuild(YaletownRoundhouse, OlympicVillage, 2),
  edgeToBuild(OlympicVillage, BroadwayCityHall, 1),
  edgeToBuild(BroadwayCityHall, KingEdward, 2),
  edgeToBuild(KingEdward, OakridgeFourtyFirstAve, 3),
  edgeToBuild(OakridgeFourtyFirstAve, LangaraFourtyNinthAve, 2),
  edgeToBuild(LangaraFourtyNinthAve, MarineDrive, 3),
  edgeToBuild(MarineDrive, Bridgeport, 2),
  edgeToBuild(Bridgeport, Aberdeen, 2),
  edgeToBuild(Aberdeen, Lansdowne, 2),
  edgeToBuild(Lansdowne, RichmondBrighouse, 2),
  edgeToBuild(Bridgeport, Templeton, 5),
  edgeToBuild(Templeton, SeaIslandCentre, 2),
  edgeToBuild(SeaIslandCentre, YVRAirport, 2),
];

// TODO: implement memoization on each calculation that is made, storing the start station and the time, and empty array if never existed
// TODO: Push graph data into a firestore entry to be accessed via queries

export function buildGraph(): Graph {
  const SKYTRAIN_GRAPH: Graph = new Graph();
  EDGE_LIST.forEach((edgeToAdd) => {
    SKYTRAIN_GRAPH.addEdge(
      edgeToAdd.start,
      edgeToAdd.destination,
      edgeToAdd.time
    );
  });
  return SKYTRAIN_GRAPH;
}
//  default SKYTRAIN_GRAPH;

// export function buildGraph(): Graph {
//   const SKYTRAIN_GRAPH = new Graph();
//   EDGE_LIST.forEach((edgeToAdd) => {
//     SKYTRAIN_GRAPH.addEdge(
//       edgeToAdd.start,
//       edgeToAdd.destination,
//       edgeToAdd.time
//     );
//   });
//   return SKYTRAIN_GRAPH;
// }
