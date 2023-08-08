import { FIREBASE_AUTH, FIRESTORE_DB } from "../api/FirebaseConfig";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import * as SKYTRAIN_DATA from "./SkytrainData";
import { getStationName } from "./SkytrainData";

export const LEVELUP_FRAGMENT_COST: number = 1;

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

export const gemPurchase = async (
  itemid: string,
  uid: string,
  userGems: number,
  cost: number,
  mapFn: (itemid: string, uid: string) => Promise<void>
) => {
  if (userGems >= cost) {
    const updatePromise = updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
      gems: increment(-1 * cost),
    });
    const fnPromise = mapFn(itemid, uid);
    await Promise.all([updatePromise, fnPromise]);
    return;
  } else {
    throw new Error("Not enough gems");
  }
};

export const gachaPurchase = async (
  uid: string,
  userGems: number,
  cost: number
) => {
  console.log("attempting gacha purchase");
  if (userGems >= cost) {
    await updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
      gems: increment(-1 * cost),
    });
    return;
  } else {
    throw new Error("Not enough gems");
  }
};
