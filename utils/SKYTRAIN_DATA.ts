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

const Waterfront: Station = newStation("001", "00", true);
const Burrard: Station = newStation("002", "00", false);
const Granville: Station = newStation("003", "00", false);
const StadiumChinatown: Station = newStation("004", "00", false);
const MainStreetScienceWorld: Station = newStation("005", "00", false);
const CommercialBroadway: Station = newStation("006", "00", false);
const Nanaimo: Station = newStation("007", "00", false);
const TwentyNinththAvenue: Station = newStation("008", "00", false);
const JoyceCollingwood: Station = newStation("009", "00", false);
const Patterson: Station = newStation("010", "00", false);
const Metrotown: Station = newStation("011", "00", false);
const RoyalOak: Station = newStation("012", "00", false);
const Edmonds: Station = newStation("013", "00", false);
const TwentySecondStreet: Station = newStation("014", "00", false);
const NewWestminister: Station = newStation("015", "00", false);
const Columbia: Station = newStation("016", "00", false);
const ScottRoad: Station = newStation("017", "00", false);
const Gateway: Station = newStation("018", "00", false);
const SurreyCentral: Station = newStation("019", "00", false);
const KingGeorge: Station = newStation("020", "00", false);

const Sapperton: Station = newStation("021", "00", false);
const Braid: Station = newStation("022", "00", false);
const LougheedTownCentre: Station = newStation("023", "00", true);
const ProductionWayUniversity: Station = newStation("024", "00", true);

const VCCClark: Station = newStation("025", "01", true);
const Renfrew: Station = newStation("026", "01", true);
const Rupert: Station = newStation("027", "01", true);
const Gilmore: Station = newStation("028", "01", true);
const Brentwood: Station = newStation("029", "01", true);
const Holdom: Station = newStation("030", "01", true);
const SperlingBurnabyLake: Station = newStation("031", "01", true);
const LakeCity: Station = newStation("032", "01", true);

const Burquitlam: Station = newStation("033", "03", true);
const MoodyCentre: Station = newStation("034", "03", true);
const InletCentre: Station = newStation("035", "03", true);
const CoquitlamCentral: Station = newStation("036", "03", true);
const Lincoln: Station = newStation("037", "03", true);
const LafargeLakeDouglas: Station = newStation("038", "03", true);

const VancouverCityCentre: Station = newStation("039", "02", true);
const YaletownRoundhouse: Station = newStation("040", "02", true);
const OlympicVillage: Station = newStation("041", "02", true);
const BroadwayCityHall: Station = newStation("042", "02", true);
const KingEdward: Station = newStation("043", "02", true);
const OakridgeFourtyFirstAve: Station = newStation("044", "02", true);
const LangaraFourtyNinthAve: Station = newStation("045", "02", true);
const MarineDrive: Station = newStation("046", "02", true);
const Bridgeport: Station = newStation("047", "02", true);
const Aberdeen: Station = newStation("048", "02", true);
const Lansdowne: Station = newStation("049", "02", true);
const RichmondBrighouse: Station = newStation("050", "02", true);
const Templeton: Station = newStation("051", "02", true);
const SeaIslandCentre: Station = newStation("052", "02", true);
const YVRAirport: Station = newStation("053", "02", true);

// To translate station id to the name
export const STATION_MAP: Map<string, string> = new Map();
STATION_MAP.set("001", "Waterfront");
STATION_MAP.set("002", "Burrard");
STATION_MAP.set("003", "Granville");
STATION_MAP.set("004", "Stadium-Chinatown");
STATION_MAP.set("005", "Main Street - ScienceWorld");
STATION_MAP.set("006", "Commercial-Broadway");
STATION_MAP.set("008", "Nanaimo");
STATION_MAP.set("007", "29thAvenue");
STATION_MAP.set("009", "Joyce-Collingwood");
STATION_MAP.set("010", "Patterson");
STATION_MAP.set("011", "Metrotown");
STATION_MAP.set("012", "RoyalOak");
STATION_MAP.set("013", "Edmonds");
STATION_MAP.set("014", "22nd Street");
STATION_MAP.set("015", "New Westminister");
STATION_MAP.set("016", "Columbia");
STATION_MAP.set("017", "ScottRoad");
STATION_MAP.set("018", "Gateway");
STATION_MAP.set("019", "Surrey Central");
STATION_MAP.set("020", "King George");

STATION_MAP.set("021", "Sapperton");
STATION_MAP.set("022", "Braid");
STATION_MAP.set("023", "Lougheed Town Centre");
STATION_MAP.set("024", "Production Way University");

STATION_MAP.set("025", "VCC Clark");
STATION_MAP.set("026", "Renfrew");
STATION_MAP.set("027", "Rupert");
STATION_MAP.set("028", "Gilmore");
STATION_MAP.set("029", "Brentwood");
STATION_MAP.set("030", "Holdom");
STATION_MAP.set("031", "Sperling Burnaby Lake");
STATION_MAP.set("032", "Lake City");

STATION_MAP.set("033", "Burquitlam");
STATION_MAP.set("034", "Moody Centre");
STATION_MAP.set("035", "Inlet Centre");
STATION_MAP.set("036", "Coquitlam Central");
STATION_MAP.set("037", "Lincoln");
STATION_MAP.set("038", "Lafarge Lake Douglas");

STATION_MAP.set("039", "Vancouver City Centre");
STATION_MAP.set("040", "Yaletown Roundhouse");
STATION_MAP.set("041", "Olympic Village");
STATION_MAP.set("042", "Broadway City Hall");
STATION_MAP.set("043", "King Edward");
STATION_MAP.set("044", "Oakridge 41stAve");
STATION_MAP.set("045", "Langara 49th Ave");
STATION_MAP.set("046", "Marine Drive");
STATION_MAP.set("047", "Bridgeport");
STATION_MAP.set("048", "Aberdeen");
STATION_MAP.set("049", "Lansdowne");
STATION_MAP.set("050", "Richmond Brighouse");
STATION_MAP.set("052", "Templeton");
STATION_MAP.set("051", "Sea Island Centre");
STATION_MAP.set("053", "YVR Airport");

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
  edgeToBuild(TwentySecondStreet, NewWestminister, 1),
  edgeToBuild(NewWestminister, Columbia, 1),
  edgeToBuild(ScottRoad, Gateway, 3),
  edgeToBuild(Gateway, SurreyCentral, 2),
  edgeToBuild(SurreyCentral, KingGeorge, 1),
  // Coumbia Sapperton
  edgeToBuild(Columbia, Sapperton, 3),
  edgeToBuild(Sapperton, Braid, 2),
  edgeToBuild(Braid, LougheedTownCentre, 3),
  edgeToBuild(LougheedTownCentre, ProductionWayUniversity, 2),
  // Millenium line
  edgeToBuild(VCCClark, Renfrew, 1),
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
  edgeToBuild(RichmondBrighouse, Templeton, 9),
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
