import { Graph, Station, newStation } from "./Graph";

// Takes lineid to output name
type LineMap = Map<string, string>;
// info that a station id should give, necessary to build it
type StationInfo = { name: string; lineid: string };
// all the info that addEdge needs to push onto Graph's adjacency list
type EdgeToBuild = {
  start: Station;
  destination: Station;
  time: number;
};

// quickly define a stn's info to build
function stnToBuild(name: string, lineid: string): StationInfo {
  return { name: name, lineid: lineid };
}
// quickly define a stn's edge to be built
function edgeToBuild(
  start: string,
  destination: string,
  time: number
): EdgeToBuild {
  const startInfo = STATION_MAP.get(start);
  const destnInfo = STATION_MAP.get(destination);
  if (startInfo !== undefined && destnInfo !== undefined) {
    return {
      start: newStation(start, startInfo?.lineid),
      destination: newStation(destination, destnInfo?.lineid),
      time: time,
    };
  } else {
    throw new Error("Station does not exist");
  }
}

// TODO: Should be a globally  in Firestore
const LINE_MAP: LineMap = new Map<string, string>([
  ["00", "Expo Line"],
  ["01", "Millenium Line"],
  ["02", "Canada Line"],
  ["03", "Millenium Evergreen Extension"],
]);

// TODO: insert every station
// To translate station id to the station line id
const STATION_MAP: Map<string, StationInfo> = new Map();
STATION_MAP.set("001", stnToBuild("Waterfront", "00"));
STATION_MAP.set("002", stnToBuild("Burrard", "00"));
STATION_MAP.set("003", stnToBuild("Granville", "00"));
STATION_MAP.set("004", stnToBuild("Stadium-Chinatown", "00"));
STATION_MAP.set("005", stnToBuild("Main Street - Science World", "00"));
STATION_MAP.set("006", stnToBuild("Commercial-Broadway", "00"));
STATION_MAP.set("008", stnToBuild("Nanaimo", "00"));
STATION_MAP.set("007", stnToBuild("29th Avenue", "00"));
STATION_MAP.set("009", stnToBuild("Joyce - Collingwood", "00"));
STATION_MAP.set("010", stnToBuild("Patterson", "00"));
STATION_MAP.set("011", stnToBuild("Metrotown", "00"));
STATION_MAP.set("012", stnToBuild("Royal Oak", "00"));
STATION_MAP.set("013", stnToBuild("Edmonds", "00"));
STATION_MAP.set("014", stnToBuild("22nd Street", "00"));
STATION_MAP.set("015", stnToBuild("New Westminister", "00"));
STATION_MAP.set("016", stnToBuild("Columbia", "00"));
STATION_MAP.set("017", stnToBuild("Scott Road", "00"));
STATION_MAP.set("018", stnToBuild("Gateway", "00"));
STATION_MAP.set("019", stnToBuild("Surrey Central", "00"));
STATION_MAP.set("020", stnToBuild("King George", "00"));
STATION_MAP.set("021", stnToBuild("Sapperton", "00"));
STATION_MAP.set("022", stnToBuild("Braid", "00"));
STATION_MAP.set("023", stnToBuild("Lougheed Town Centre", "00"));
STATION_MAP.set("024", stnToBuild("Production Way University", "00"));

STATION_MAP.set("025", stnToBuild("VCC - Clark", "01"));
STATION_MAP.set("026", stnToBuild("Renfrew", "01"));
STATION_MAP.set("027", stnToBuild("Rupert", "01"));
STATION_MAP.set("028", stnToBuild("Gilmore", "01"));
STATION_MAP.set("029", stnToBuild("Brentwood", "01"));
STATION_MAP.set("030", stnToBuild("Holdom", "01"));
STATION_MAP.set("031", stnToBuild("Sperling - Burnaby Lake", "01"));
STATION_MAP.set("032", stnToBuild("Lake City", "01"));

STATION_MAP.set("033", stnToBuild("Burquitlam", "03"));
STATION_MAP.set("034", stnToBuild("Moody Centre", "03"));
STATION_MAP.set("035", stnToBuild("Inlet Centre", "03"));
STATION_MAP.set("036", stnToBuild("Coquitlam Central", "03"));
STATION_MAP.set("037", stnToBuild("Lincoln", "03"));
STATION_MAP.set("038", stnToBuild("Lafarge Lake - Douglas", "03"));

STATION_MAP.set("039", stnToBuild("Vancouver City Centre", "02"));
STATION_MAP.set("040", stnToBuild("Yaletown - Roundhouse", "02"));
STATION_MAP.set("041", stnToBuild("Olympic Village", "02"));
STATION_MAP.set("042", stnToBuild("Broadway - City Hall", "02"));
STATION_MAP.set("043", stnToBuild("King Edward", "02"));
STATION_MAP.set("044", stnToBuild("Oakridge - 41st Ave", "02"));
STATION_MAP.set("045", stnToBuild("Langara - 49th Ave", "02"));
STATION_MAP.set("046", stnToBuild("Marine Drive", "02"));
STATION_MAP.set("047", stnToBuild("Bridgeport", "02"));
STATION_MAP.set("048", stnToBuild("Aberdeen", "02"));
STATION_MAP.set("049", stnToBuild("Lansdowne", "02"));
STATION_MAP.set("050", stnToBuild("Richmond - Brighouse", "02"));
STATION_MAP.set("052", stnToBuild("Templeton", "02"));
STATION_MAP.set("051", stnToBuild("Sea Island Centre", "02"));
STATION_MAP.set("053", stnToBuild("YVR Airport", "02"));

// TODO: put a timescale? when building edges, everything is multiplied so that a long trip will not alwyas just loop around
const EDGE_LIST: EdgeToBuild[] = [
  // Expo line
  edgeToBuild("001", "002", 2),
  edgeToBuild("002", "003", 1),
  edgeToBuild("003", "004", 2),
  edgeToBuild("004", "005", 2),
  edgeToBuild("005", "006", 3),
  edgeToBuild("006", "007", 3),
  edgeToBuild("008", "009", 1),
  edgeToBuild("009", "010", 2),
  edgeToBuild("010", "011", 2),
  edgeToBuild("011", "012", 1),
  edgeToBuild("012", "013", 3),
  edgeToBuild("013", "014", 3),
  edgeToBuild("014", "015", 3),
  edgeToBuild("015", "016", 1),
  edgeToBuild("016", "017", 1),
  edgeToBuild("017", "018", 3),
  edgeToBuild("018", "019", 2),
  edgeToBuild("019", "020", 1),
  // Coumbia Sapperton
  edgeToBuild("016", "021", 3),
  edgeToBuild("021", "022", 2),
  edgeToBuild("022", "023", 3),
  edgeToBuild("023", "024", 2),
  // Millenium line
  edgeToBuild("025", "026", 1),
  edgeToBuild("026", "027", 3),
  edgeToBuild("027", "028", 1),
  edgeToBuild("028", "029", 2),
  edgeToBuild("029", "030", 2),
  edgeToBuild("030", "031", 2),
  edgeToBuild("031", "032", 3),
  // Lake city - production way
  edgeToBuild("032", "024", 2),
  // Evergreen extension
  edgeToBuild("023", "033", 3),
  edgeToBuild("033", "034", 5),
  edgeToBuild("034", "035", 2),
  edgeToBuild("035", "036", 3),
  edgeToBuild("036", "037", 2),
  edgeToBuild("037", "038", 1),
  // Canada line
  edgeToBuild("001", "039", 2),
  edgeToBuild("039", "040", 2),
  edgeToBuild("040", "041", 2),
  edgeToBuild("041", "042", 1),
  edgeToBuild("042", "043", 2),
  edgeToBuild("043", "044", 3),
  edgeToBuild("044", "045", 2),
  edgeToBuild("045", "046", 3),
  edgeToBuild("046", "047", 2),
  edgeToBuild("047", "048", 2),
  edgeToBuild("048", "049", 2),
  edgeToBuild("049", "050", 2),
  edgeToBuild("050", "051", 9),
  edgeToBuild("051", "052", 2),
  edgeToBuild("052", "053", 2),
];

// TODO: implement memoization on each calculation that is made, storing the start station and the time, and empty array if never existed
// TODO: Push graph data into a firestore entry to be accessed via queries

const SKYTRAIN_DATA = 5; // placeholder

export default SKYTRAIN_DATA;
