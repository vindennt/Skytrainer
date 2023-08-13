import { User } from "firebase/auth";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../api/FirebaseConfig";

// Denotes how often a mission should be reset
// TODO: implement checking mission conditions to reset their finish state
export enum ResetCondition {
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
  CUSTOM, // If a custom daily trip is set, then it can be checked to see if the trup just run was connected to it
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
export const MISSIONS: Map<string, MissionInfo> = new Map([
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
]);

// TODO: implement
// For event, updates missions that react to that event
export const updateMissions = (event: MissionEvent, user: User) => {
  // update all missions that react to event
  if (user) {
  }
};

// TODO: implement
// set the mission data, such as updating progress or changing reset condition
const updateMission = async (id: string, user: User) => {
  setDoc(doc(FIRESTORE_DB, `users/${user.uid}`), {
    // update doc here
    // e.g. set doc of id D001 to be true, so that when missions are viewed
    // it will render as true. New missions can be added with updates
    // without breaking old mission lists
  });
};
