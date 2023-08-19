import { User } from "firebase/auth";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../api/FirebaseConfig";

// Infrastructure for long term achievements
// probably integrate this with missions since uses very similar logic
const ACHIEVEMENTS: Map<string, string> = new Map([
  ["A001", "Complete 1 trip"],
  ["A002", "level up 1 character"],
  ["A003", "Roll 1 time"],
  ["A004", "Complete 20 trips"],
]);

// check if mission exists and that user exists
export const achievementCheck = (id: string, user: User) => {
  if (user && ACHIEVEMENTS.has(id)) {
    doneAchievement(id, user);
  }
};

// set the mission as complete within user file
const doneAchievement = async (id: string, user: User) => {
  setDoc(doc(FIRESTORE_DB, `users/${user.uid}`), {
    // update doc here
    // e.g. set doc of id D001 to be true, so that when missions are viewed
    // it will render as true. New missions can be added with updates
    // without breaking old mission lists
  });
};
