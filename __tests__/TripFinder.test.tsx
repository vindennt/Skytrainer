import React from "react";
import { Graph, Edge, Station, newStation, newEdge } from "../utils/Graph";
import { findViableTrips } from "../utils/TripFinder";
import * as SKYTRAIN_DATA from "../utils/SKYTRAIN_DATA";

// Template test
// test("TEMPLATE", () => {
//   expect(12345678).toStrictEqual(12345678);
// });
//

// (4, 7) -3- (8, 7) -5- (42, 7) -68- (140,80)
const largeGraph = new Graph();
const stationFourSeven = newStation("4", "7");
const stationEightSeven = newStation("8", "7");
const stationFourtyTwoSeven = newStation("42", "7");
const stationHundredFourtySeven = newStation("140", "7");
largeGraph.addEdge(stationFourSeven, stationEightSeven, 3);
largeGraph.addEdge(stationEightSeven, stationFourtyTwoSeven, 5);
largeGraph.addEdge(stationFourtyTwoSeven, stationHundredFourtySeven, 68);
// expected result
const expectedShortPath = [[stationFourSeven, stationEightSeven]];
const expectedMedPath = [
  [stationFourSeven, stationEightSeven, stationFourtyTwoSeven],
];
const expectedLongPath = [
  [
    stationFourSeven,
    stationEightSeven,
    stationFourtyTwoSeven,
    stationHundredFourtySeven,
  ],
];
test("findViableTrips; return one path, deadend start, one way", () => {
  expect(findViableTrips(largeGraph, stationFourSeven, 1)).toStrictEqual(
    expectedShortPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 2)).toStrictEqual(
    expectedShortPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 3)).toStrictEqual(
    expectedShortPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 4)).toStrictEqual(
    expectedMedPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 8)).toStrictEqual(
    expectedMedPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 20)).toStrictEqual(
    expectedLongPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 75)).toStrictEqual(
    expectedLongPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 76)).toStrictEqual(
    expectedLongPath
  );
  expect(findViableTrips(largeGraph, stationFourSeven, 100)).toStrictEqual([]); // no viable path
});

const expectedMiddleShortPath = [[stationEightSeven, stationFourtyTwoSeven]];
const expectedMiddleMedPath = [
  [stationEightSeven, stationFourSeven],
  [stationEightSeven, stationFourtyTwoSeven],
];
const expectedMiddleLongPath = [
  [stationEightSeven, stationFourtyTwoSeven, stationHundredFourtySeven],
];

test("findViableTrips; return two paths, middle start, two way", () => {
  expect(findViableTrips(largeGraph, stationEightSeven, 2)).toStrictEqual(
    expectedMiddleMedPath
  );
  expect(findViableTrips(largeGraph, stationEightSeven, 4)).toStrictEqual(
    expectedMiddleShortPath
  );
  expect(findViableTrips(largeGraph, stationEightSeven, 6)).toStrictEqual(
    expectedMiddleLongPath
  );
  expect(findViableTrips(largeGraph, stationEightSeven, 100)).toStrictEqual([]); // no viable paths
});

// (1, 2) -5- (2, 2) -6- (3, 2) -3- (4, 2)
//            (2, 2) -3- (11, 3) -5- (12, 3) -10- (13, 3)
// At transfer station (2, 2), ensure that lines 2 and 3 are explored in all directions
const transferGraph = new Graph();
const stnOneTwo = newStation("1", "2");
const stnTwoTwo = newStation("2", "2", true);
const stnThreeTwo = newStation("3", "2");
const stnFourTwo = newStation("4", "2");
const stnElevenThree = newStation("11", "3");
const stnTwelveThree = newStation("12", "3");
const stnThirtnThree = newStation("13", "3");
transferGraph.addEdge(stnOneTwo, stnTwoTwo, 5);
transferGraph.addEdge(stnTwoTwo, stnThreeTwo, 6);
transferGraph.addEdge(stnThreeTwo, stnFourTwo, 3);
transferGraph.addEdge(stnTwoTwo, stnElevenThree, 3);
transferGraph.addEdge(stnElevenThree, stnTwelveThree, 5);
transferGraph.addEdge(stnTwelveThree, stnThirtnThree, 10);

// TODO
// console.log(findViableTrips(transferGraph, stnTwoTwo, 15));
test("findViableTrips; transfer stations have multiple paths explored", () => {
  expect(findViableTrips(transferGraph, stnTwoTwo, 2)).toStrictEqual([
    [stnTwoTwo, stnOneTwo],
    [stnTwoTwo, stnThreeTwo],
    [stnTwoTwo, stnElevenThree],
  ]);
  expect(findViableTrips(transferGraph, stnTwoTwo, 6)).toStrictEqual([
    [stnTwoTwo, stnThreeTwo],
    [stnTwoTwo, stnElevenThree, stnTwelveThree],
  ]);
  expect(findViableTrips(transferGraph, stnTwoTwo, 9)).toStrictEqual([
    [stnTwoTwo, stnThreeTwo, stnFourTwo],
    [stnTwoTwo, stnElevenThree, stnTwelveThree, stnThirtnThree],
  ]);
  expect(findViableTrips(transferGraph, stnTwoTwo, 15)).toStrictEqual([
    [stnTwoTwo, stnElevenThree, stnTwelveThree, stnThirtnThree],
  ]);
});

// (1, 2) -5- (2, 2) -6- (3, 2) -3- (4, 2) -7- (13, 3)
//            (2, 2) -3- (11, 3) -5- (12, 3) -10- (13, 3)
// (2, 2) and (13, 3) allow for a loop that satisfies further trip conditions

test("findViableTrips; if transfer station loop exists, traverse onto it", () => {
  const loopGraph = new Graph();
  const stnOneTwo = newStation("1", "2");
  const stnTwoTwo = newStation("2", "2", true);
  const stnThreeTwo = newStation("3", "2");
  const stnFourTwo = newStation("4", "2");
  const stnElevenThree = newStation("11", "3");
  const stnTwelveThree = newStation("12", "3");
  const stnThirtnThreeT = newStation("13", "3", true);
  loopGraph.addEdge(stnOneTwo, stnTwoTwo, 5);
  loopGraph.addEdge(stnTwoTwo, stnThreeTwo, 6);
  loopGraph.addEdge(stnThreeTwo, stnFourTwo, 3);
  loopGraph.addEdge(stnTwoTwo, stnElevenThree, 3);
  loopGraph.addEdge(stnElevenThree, stnTwelveThree, 5);
  loopGraph.addEdge(stnTwelveThree, stnThirtnThreeT, 10);
  loopGraph.addEdge(stnThirtnThreeT, stnFourTwo, 7);

  expect(findViableTrips(loopGraph, stnOneTwo, 30)).toStrictEqual([
    [
      stnOneTwo,
      stnTwoTwo,
      stnThreeTwo,
      stnFourTwo,
      stnThirtnThreeT,
      stnTwelveThree,
    ],
    [
      stnOneTwo,
      stnTwoTwo,
      stnElevenThree,
      stnTwelveThree,
      stnThirtnThreeT,
      stnFourTwo,
    ],
  ]);
});
// console.log(findViableTrips(loopGraph, stnOneTwo, 30));

// (1, 2) -5- (2, 2) -6- (3, 2) -3- (4, 2) -7- (13, 3)
//            (2, 2) -3- (11, 3) -5- (12, 3) -10- (13, 3)
// (2, 2) and (13, 3) allow for a loop that satisfies further trip conditions
test("findViableTrips; loop back to same line", () => {
  const loopGraph = new Graph();
  const stnOneTwo = newStation("1", "2");
  const stnTwoTwo = newStation("2", "2", true);
  const stnThreeTwo = newStation("3", "2");
  const stnFourTwo = newStation("4", "2");
  const stnElevenThree = newStation("11", "3");
  const stnTwelveThree = newStation("12", "3");
  const stnThirtnThreeT = newStation("13", "3", true);
  loopGraph.addEdge(stnOneTwo, stnTwoTwo, 5);
  loopGraph.addEdge(stnTwoTwo, stnThreeTwo, 6);
  loopGraph.addEdge(stnThreeTwo, stnFourTwo, 3);
  loopGraph.addEdge(stnTwoTwo, stnElevenThree, 3);
  loopGraph.addEdge(stnElevenThree, stnTwelveThree, 5);
  loopGraph.addEdge(stnTwelveThree, stnThirtnThreeT, 10);
  loopGraph.addEdge(stnThirtnThreeT, stnFourTwo, 7);
  // console.log(findViableTrips(loopGraph, stnOneTwo, 47));
  expect(findViableTrips(loopGraph, stnOneTwo, 47)).toEqual([
    [
      stnOneTwo,
      stnTwoTwo,
      stnThreeTwo,
      stnFourTwo,
      stnThirtnThreeT,
      stnTwelveThree,
      stnElevenThree,
      stnTwoTwo,
      stnThreeTwo,
      stnFourTwo,
    ],
    [
      stnOneTwo,
      stnTwoTwo,
      stnElevenThree,
      stnTwelveThree,
      stnThirtnThreeT,
      stnFourTwo,
      stnThreeTwo,
      stnTwoTwo,
      stnElevenThree,
      stnTwelveThree,
    ],
  ]);
});

// Actual graph testing

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
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

const Waterfront: Station = newStation("001", "00", true);
const Burrard: Station = newStation("002", "00", false);
const Granville: Station = newStation("003", "00", false);
const StadiumChinatown: Station = newStation("004", "00", false);
const MainStreetScienceWorld: Station = newStation("005", "00", false);
const CommercialBroadway: Station = newStation("006", "00", true);
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
const ProductionWayUniversity: Station = newStation("024", "00", false);

const VCCClark: Station = newStation("025", "01", false);
const Renfrew: Station = newStation("026", "01", false);
const Rupert: Station = newStation("027", "01", false);
const Gilmore: Station = newStation("028", "01", false);
const Brentwood: Station = newStation("029", "01", false);
const Holdom: Station = newStation("030", "01", false);
const SperlingBurnabyLake: Station = newStation("031", "01", false);
const LakeCity: Station = newStation("032", "01", false);

const Burquitlam: Station = newStation("033", "03", false);
const MoodyCentre: Station = newStation("034", "03", false);
const InletCentre: Station = newStation("035", "03", false);
const CoquitlamCentral: Station = newStation("036", "03", false);
const Lincoln: Station = newStation("037", "03", false);
const LafargeLakeDouglas: Station = newStation("038", "03", false);

const VancouverCityCentre: Station = newStation("039", "02", false);
const YaletownRoundhouse: Station = newStation("040", "02", false);
const OlympicVillage: Station = newStation("041", "02", false);
const BroadwayCityHall: Station = newStation("042", "02", false);
const KingEdward: Station = newStation("043", "02", false);
const OakridgeFourtyFirstAve: Station = newStation("044", "02", false);
const LangaraFourtyNinthAve: Station = newStation("045", "02", false);
const MarineDrive: Station = newStation("046", "02", false);
const Bridgeport: Station = newStation("047", "02", false);
const Aberdeen: Station = newStation("048", "02", false);
const Lansdowne: Station = newStation("049", "02", false);
const RichmondBrighouse: Station = newStation("050", "02", false);
const Templeton: Station = newStation("051", "02", false);
const SeaIslandCentre: Station = newStation("052", "02", false);
const YVRAirport: Station = newStation("053", "02", false);

// TODO: put a timescale? when building edges, everything is multiplied so that a long trip will not alwyas just loop around
export const NEDGE_LIST: EdgeToBuild[] = [
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

export function buildTestGraph(): Graph {
  const SKYTRAIN_GRAPH: Graph = new Graph();
  NEDGE_LIST.forEach((edgeToAdd) => {
    SKYTRAIN_GRAPH.addEdge(
      edgeToAdd.start,
      edgeToAdd.destination,
      edgeToAdd.time
    );
  });
  return SKYTRAIN_GRAPH;
}

var graph: Graph = buildTestGraph();
var comparisonGraph: Graph = SKYTRAIN_DATA.buildGraph();
// console.log(graph.getGraph());
// console.log(comparisonGraph.getGraph());
test("Whether imported graph is same as in-house", () => {
  expect(comparisonGraph).toMatchObject(graph);
});

test("Whether imported graph gets same neigbhours", () => {
  expect(comparisonGraph.getNeighbours(SKYTRAIN_DATA.Waterfront)).toMatchObject(
    graph.getNeighbours(Waterfront)
  );
});

console.log(graph.getNeighbours(Waterfront));
console.log(comparisonGraph.getNeighbours(SKYTRAIN_DATA.Waterfront));

// const thing = SKYTRAIN_DATA.STATION_MAP.get("001");
// console.log("THING: " + thing + thing?.[1]);

const testActualGraph: Graph = new Graph();
testActualGraph.addEdge(ScottRoad, Gateway, 3);
testActualGraph.addEdge(Gateway, SurreyCentral, 2);
testActualGraph.addEdge(SurreyCentral, KingGeorge, 1);
// console.log(testActualGraph.getGraph());
// console.log(findViableTrips(testActualGraph, KingGeorge, 5));

// const STATION_MAP: Map<string, StationInfo> = SKYTRAIN_DATA.STATION_MAP;
test("findViableTrips; Actual skytrain graph", () => {
  expect(findViableTrips(testActualGraph, ScottRoad, 2)).toEqual([
    [ScottRoad, Gateway],
  ]);
  expect(findViableTrips(testActualGraph, KingGeorge, 2)).toEqual([
    [KingGeorge, SurreyCentral, Gateway],
  ]);

  expect(findViableTrips(graph, ScottRoad, 2)).toEqual([[ScottRoad, Gateway]]);
  expect(findViableTrips(graph, KingGeorge, 2)).toEqual([
    [KingGeorge, SurreyCentral, Gateway],
  ]);
  expect(findViableTrips(comparisonGraph, SKYTRAIN_DATA.ScottRoad, 2)).toEqual([
    [SKYTRAIN_DATA.ScottRoad, SKYTRAIN_DATA.Gateway],
  ]);
  const gatewayProxy = SKYTRAIN_DATA.STATION_MAP.get("018");
  // console.log("THING: " + gatewayProxy + gatewayProxy?.[1]);
  expect(findViableTrips(comparisonGraph, SKYTRAIN_DATA.KingGeorge, 2)).toEqual(
    [[SKYTRAIN_DATA.KingGeorge, SKYTRAIN_DATA.SurreyCentral, gatewayProxy?.[1]]]
  );
});
