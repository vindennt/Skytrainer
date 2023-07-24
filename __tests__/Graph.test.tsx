import React from "react";
import { Graph, Edge, Station, newStation, newEdge } from "../utils/Graph";

// Template test
test("TEMPLATE", () => {
  expect(12345678).toStrictEqual(12345678);
});
//

const testStationZeroOne: Station = newStation(0, 1);
test("newStation; station instantiation", () => {
  expect(testStationZeroOne?.id).toBe(0);
  expect(testStationZeroOne.lineid).toBe(1);
});

const testStationNegativeOne: Station = newStation(-2, 4);
test("newStation; station instantiation if id is out of bounds", () => {
  expect(testStationNegativeOne?.id).toBe(0);
  expect(testStationNegativeOne.lineid).toBe(4);
});

const testStationTransfer: Station = newStation(2, 4, true);
const testStationNonTransfer: Station = newStation(2, 4, false);
const testStationUnspecifiedTransfer: Station = newStation(2, 4);
test("newStation; station instantiation with transfer specified", () => {
  expect(testStationTransfer.transfer).toBe(true);
  expect(testStationNonTransfer.transfer).toBe(false);
  expect(testStationUnspecifiedTransfer.transfer).toBe(false);
});

const testStationTwoNegativeOne: Station = newStation(2, -1);
test("newStation; station instantiation if lineid is out of bounds", () => {
  expect(testStationTwoNegativeOne?.id).toBe(2);
  expect(testStationTwoNegativeOne.lineid).toBe(0);
});

const testEdgeZeroFive: Edge = newEdge(testStationZeroOne, 5);
test("newEdge; edge instantiation", () => {
  expect(testEdgeZeroFive.station).toStrictEqual(testStationZeroOne);
  expect(testEdgeZeroFive.time).toBe(5);
});

const testEdgeZeroNegative: Edge = newEdge(testStationZeroOne, -10);
test("newEdge; edge instantiation with negative time", () => {
  expect(testEdgeZeroNegative.station).toStrictEqual(testStationZeroOne);
  expect(testEdgeZeroNegative.time).toBe(1);
});

const graph = new Graph();
const testGraph = new Map<Station, Edge[]>();
const testStationOneThree: Station = newStation(1, 3);
test("addStation; Adding Station", () => {
  graph.addStation(testStationOneThree);
  testGraph.set(testStationOneThree, []);
  expect(graph.getGraph()).toStrictEqual(testGraph);
});

const testStationTWoFour: Station = newStation(2, 4);
const graphRepeat = new Graph();
const testGraphRepeat = new Map<Station, Edge[]>();
test("addStation; Adding Same Station repeated shouldnt add duplicate", () => {
  graph.addStation(testStationTWoFour);
  graph.addStation(testStationTWoFour);
  testGraph.set(testStationTWoFour, []);
  expect(graphRepeat.getGraph()).toStrictEqual(testGraphRepeat);
});

const testStationTWoThree: Station = newStation(2, 3);
const testStationTWoThreeDupe: Station = newStation(2, 3);
const graphDupe = new Graph();
const testGraphDupe = new Map<Station, Edge[]>();
test("addStation; Adding Station same values should be blocked", () => {
  graph.addStation(testStationTWoThree);
  graph.addStation(testStationTWoThreeDupe);
  testGraph.set(testStationTWoThreeDupe, []);
  expect(graphDupe.getGraph()).toStrictEqual(testGraphDupe);
});

const graphAddTwo = new Graph();
const edgeNeighbourAddTwo = newEdge(testStationTWoFour, 3);
const resultArrayTwoThree = [edgeNeighbourAddTwo];
const edgeNeighbourAddTwoSecond = newEdge(testStationTWoThree, 3);
const resultArrayTwoFour = [edgeNeighbourAddTwoSecond];
test("addEdge; Bidirectional edges added", () => {
  //   graphAddTwo.addStation(testStationTWoThree);
  graphAddTwo.addEdge(testStationTWoThree, testStationTWoFour, 3);
  expect(graphAddTwo.getNeighbours(testStationTWoThree)).toStrictEqual(
    resultArrayTwoThree
  );
  expect(graphAddTwo.getNeighbours(testStationTWoFour)).toStrictEqual(
    resultArrayTwoFour
  );
});

// (4, 7) -3- (8, 7) -5- (42, 0) -68- (140,80)
const largeGraph = new Graph();
const stationFourSeven = newStation(4, 7);
const stationEightSeven = newStation(8, 7);
const stationFourtyTwoZero = newStation(42, 0);
const stationHundredFourtyEighty = newStation(140, 80);
const resultFourSeven = [newEdge(stationEightSeven, 3)];
const resultEightSeven = [
  newEdge(stationFourSeven, 3),
  newEdge(stationFourtyTwoZero, 5),
];
const resultFourtyTwoZero = [
  newEdge(stationEightSeven, 5),
  newEdge(stationHundredFourtyEighty, 68),
];
const resultHundredFourtyEighty = [newEdge(stationFourtyTwoZero, 68)];
test("addEdge; Large neighbour size", () => {
  largeGraph.addEdge(stationFourSeven, stationEightSeven, 3);
  largeGraph.addEdge(stationEightSeven, stationFourtyTwoZero, 5);
  largeGraph.addEdge(stationFourtyTwoZero, stationHundredFourtyEighty, 68);
  expect(largeGraph.getNeighbours(stationFourSeven)).toStrictEqual(
    resultFourSeven
  );
  expect(largeGraph.getNeighbours(stationEightSeven)).toStrictEqual(
    resultEightSeven
  );
  expect(largeGraph.getNeighbours(stationFourtyTwoZero)).toStrictEqual(
    resultFourtyTwoZero
  );
  expect(largeGraph.getNeighbours(stationHundredFourtyEighty)).toStrictEqual(
    resultHundredFourtyEighty
  );
});
