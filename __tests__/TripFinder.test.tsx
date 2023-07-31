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
  console.log(findViableTrips(loopGraph, stnOneTwo, 47));
  expect(findViableTrips(loopGraph, stnOneTwo, 47)).toStrictEqual([
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

// const actualGraph: Graph = SKYTRAIN_DATA.buildGraph();
const ScottRoad: Station = newStation("017", "00", false);
const Gateway: Station = newStation("018", "00", false);
const SurreyCentral: Station = newStation("019", "00", false);
const KingGeorge: Station = newStation("020", "00", false);
const testActualGraph: Graph = new Graph();
testActualGraph.addEdge(ScottRoad, Gateway, 3);
testActualGraph.addEdge(Gateway, SurreyCentral, 2);
testActualGraph.addEdge(SurreyCentral, KingGeorge, 1);
console.log(findViableTrips(testActualGraph, KingGeorge, 5));
// const STATION_MAP: Map<string, StationInfo> = SKYTRAIN_DATA.STATION_MAP;
test("findViableTrips; Actual skytrain graph", () => {
  expect(findViableTrips(testActualGraph, ScottRoad, 2)).toStrictEqual([
    [ScottRoad, Gateway],
  ]);
  expect(findViableTrips(testActualGraph, KingGeorge, 2)).toStrictEqual([
    [KingGeorge, SurreyCentral, Gateway],
  ]);
  SKYTRAIN_DATA.buildGraph();

  console.log(SKYTRAIN_DATA.SKYTRAIN_GRAPH.getGraph());
  expect(
    findViableTrips(SKYTRAIN_DATA.SKYTRAIN_GRAPH, ScottRoad, 2)
  ).toStrictEqual([[ScottRoad, Gateway]]);
  expect(
    findViableTrips(SKYTRAIN_DATA.SKYTRAIN_GRAPH, KingGeorge, 2)
  ).toStrictEqual([[KingGeorge, SurreyCentral, Gateway]]);
});
