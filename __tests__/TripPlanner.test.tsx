import React from "react";
import { Graph, Edge, Station, newStation, newEdge } from "../utils/Graph";
import { findViableTrips } from "../utils/TripPlanner";

// Template test
test("TEMPLATE", () => {
  expect(12345678).toStrictEqual(12345678);
});
//

// (4, 7) -3- (8, 7) -5- (42, 0) -68- (140,80)
const largeGraph = new Graph();
const stationFourSeven = newStation(4, 7);
const stationEightSeven = newStation(8, 7);
const stationFourtyTwoZero = newStation(42, 0);
const stationHundredFourtyEighty = newStation(140, 80);
largeGraph.addEdge(stationFourSeven, stationEightSeven, 3);
largeGraph.addEdge(stationEightSeven, stationFourtyTwoZero, 5);
largeGraph.addEdge(stationFourtyTwoZero, stationHundredFourtyEighty, 68);
// expected result
const expectedShortPath = [[stationFourSeven, stationEightSeven]];
const expectedMedPath = [
  [stationFourSeven, stationEightSeven, stationFourtyTwoZero],
];
const expectedLongPath = [
  [
    stationFourSeven,
    stationEightSeven,
    stationFourtyTwoZero,
    stationHundredFourtyEighty,
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

// (4, 7) -3- (8, 7) -5- (42, 0) -68- (140,80)
// const largeGraph = new Graph();
// const stationFourSeven = newStation(4, 7);
// const stationEightSeven = newStation(8, 7);
// const stationFourtyTwoZero = newStation(42, 0);
// const stationHundredFourtyEighty = newStation(140, 80);
// largeGraph.addEdge(stationFourSeven, stationEightSeven, 3);
// largeGraph.addEdge(stationEightSeven, stationFourtyTwoZero, 5);
// largeGraph.addEdge(stationFourtyTwoZero, stationHundredFourtyEighty, 68);
// // expected result
// const expectedShortPath = [[stationFourSeven, stationEightSeven]];
const expectedMiddleShortPath = [[stationEightSeven, stationFourtyTwoZero]];
const expectedMiddleMedPath = [
  [stationEightSeven, stationFourSeven],
  [stationEightSeven, stationFourtyTwoZero],
];
const expectedMiddleLongPath = [
  [stationEightSeven, stationFourtyTwoZero, stationHundredFourtyEighty],
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
const stnOneTwo = newStation(1, 2);
const stnTwoTwo = newStation(2, 2);
const stnThreeTwo = newStation(3, 2);
const stnFourTwo = newStation(4, 2);
const stnElevenThree = newStation(11, 3);
const stnTwelveThree = newStation(12, 3);
const stnThirtnThree = newStation(13, 3);
transferGraph.addEdge(stnOneTwo, stnTwoTwo, 5);
transferGraph.addEdge(stnTwoTwo, stnThreeTwo, 6);
transferGraph.addEdge(stnThreeTwo, stnFourTwo, 3);
transferGraph.addEdge(stnTwoTwo, stnElevenThree, 3);
transferGraph.addEdge(stnElevenThree, stnTwelveThree, 5);
transferGraph.addEdge(stnTwelveThree, stnThirtnThree, 10);
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