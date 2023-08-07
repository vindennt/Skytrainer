import { FIREBASE_AUTH, FIRESTORE_DB } from "../api/FirebaseConfig";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import * as SKYTRAIN_DATA from "./SKYTRAIN_DATA";
import { getStationName } from "./SKYTRAIN_DATA";

export const unlockStation = async (itemid: string, uid: string) => {
  console.log("Unlocking " + getStationName(itemid));
  const date = moment().utcOffset("-08:00").format();
  await setDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
    level: 1,
    fragments: 0,
    unlocked: true,
    dateUnlocked: date,
  });
};

export const giveFragment = async (itemid: string, uid: string) => {
  console.log("Bought 10 fragments for " + getStationName(itemid));
  await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
    fragments: increment(50),
  });
};

export const coinPurchase = async (
  itemid: string,
  uid: string,
  userMoney: number,
  cost: number,
  mapFn: (itemid: string, uid: string) => Promise<void>
) => {
  if (userMoney >= cost) {
    const updatePromise = updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
      money: increment(-1 * cost),
    });
    const fnPromise = mapFn(itemid, uid);
    await Promise.all([updatePromise, fnPromise]);
    return;
  } else {
    throw new Error("Not enough money");
  }
};
