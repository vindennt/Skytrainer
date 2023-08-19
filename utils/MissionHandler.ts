import { User } from "firebase/auth";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../api/FirebaseConfig";

// Denotes how often a mission should be reset
// TODO: implement checking mission conditions to reset their finish state
export enum ResetCondition {
  NEVER,
  DAILY,
  WEEKLY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

// Various events that will ahappen around the app's usage.
// Allows simple calling of updateMissions()
// TODO: implement tagging and sensing of custom trips
export enum MissionEvent {
  TRIP_FINISHED,
  CHARACTER_LEVELED,
  PURCHASE_MADE,
  GACHA_ROLL,
  CUSTOM_1, // If a custom daily trip is set, then it can be checked to see if the trup just run was connected to it
  CUSTOM_2,
  CUSTOM_3,
}

export interface MissionInfo {
  description: string;
  progress: number;
  condition: number;
  finishedDate: string;
  custom: boolean;
  reset: ResetCondition;
  reactsTo: MissionEvent;
}

export const newMissionInfo = (
  description: string,
  progress: number,
  condition: number,
  finishedDate: string,
  custom: boolean,
  reset: ResetCondition,
  reactsTo: MissionEvent
): MissionInfo => {
  return {
    description: description,
    progress: progress,
    condition: condition,
    finishedDate: finishedDate,
    custom: custom,
    reset: reset,
    reactsTo: reactsTo,
  };
};

// Conecrete set of resettable missions
// TODO: Have certain misisons reset on certain days/daily
// TODO: allow custom user-made missions
// TODO: push this info to the cloud for each individual
export var MISSIONS: Map<string, MissionInfo> = new Map([
  [
    "M001",
    newMissionInfo(
      "Finish 1 trip today",
      0,
      1,
      "",
      false,
      ResetCondition.DAILY,
      MissionEvent.TRIP_FINISHED
    ),
  ],
  [
    "M002",
    newMissionInfo(
      "Number of trips finished",
      0,
      -1,
      "",
      false,
      ResetCondition.NEVER,
      MissionEvent.TRIP_FINISHED
    ),
  ],
]);

// TODO: implement with redux so that global state can be updated
// For event, updates missions that react to that event
export const updateMissions = (event: MissionEvent) => {
  console.log("UPDATING MISSIONS FOR EVENT : " + event);
  // update all missions that react to event
  MISSIONS.forEach((missionInfo, key) => {
    if (missionInfo.condition === event) {
      missionInfo.progress++;
    }
  });
};

// TODO: implement
// set the mission data, such as updating progress or changing reset condition
const updateMission = async (id: string) => {
  // update doc here
  // e.g. set doc of id D001 to be true, so that when missions are viewed
  // it will render as true. New missions can be added with updates
  // without breaking old mission lists
};

export const resetMissions = () => {
  for (const [key, missionInfo] of MISSIONS) {
    // Update the progress property to 0
    missionInfo.progress = 0;
  }
};