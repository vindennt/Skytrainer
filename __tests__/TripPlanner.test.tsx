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
  expect(findViableTrips(largeGraph, stationEightSeven, 100)).toStrictEqual([]);
});
