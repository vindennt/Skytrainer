import { FIREBASE_AUTH, FIRESTORE_DB } from "../api/FirebaseConfig";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import * as SKYTRAIN_DATA from "./SkytrainData";
import { getStationName } from "./SkytrainData";
import { Station } from "./Graph";

export const LEVELUP_FRAGMENT_COST: number = 1;
export const MONEY_PER_STATION = 5;

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
  console.log("Bought 50 fragments for " + getStationName(itemid));
  await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
    fragments: increment(50),
  });
};

export const fragmentLevelUp = async (
  id: string,
  currentFragments: number,
  uid: string
) => {
  if (currentFragments >= LEVELUP_FRAGMENT_COST) {
    console.log("Level up approved for " + id);
    await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", id), {
      level: increment(1),
      fragments: increment(LEVELUP_FRAGMENT_COST * -1),
      unlocked: true,
    });
    return;
  } else {
    console.log("Level up not approved");
  }
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

export const moneyRewardCalc = (
  visitedLength: number,
  levelOfStart: number
): number => {
  const rewardMultiplier = levelOfStart / 10 + 1;
  const moneyReward = Math.round(
    MONEY_PER_STATION * visitedLength * rewardMultiplier
  );
  return moneyReward;
};

export const tripRewardHandler = async (
  uid: string,
  visited: Station[],
  visitedLength: number,
  levelOfStart: number
) => {
  const reward = moneyRewardCalc(visitedLength, levelOfStart);
  const userRef = doc(FIRESTORE_DB, `users/${uid}`);
  await updateDoc(userRef, {
    money: increment(reward),
    gems: increment(reward),
  });
  return;
};
