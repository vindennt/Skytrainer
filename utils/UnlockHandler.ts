import { FIREBASE_AUTH, FIRESTORE_DB } from "../api/FirebaseConfig";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import * as SKYTRAIN_DATA from "./SkytrainData";
import { getStationName } from "./SkytrainData";
import { Station } from "./Graph";
import { Reward, newReward, Tier } from "./GachaHandler";

// export const LEVELUP_FRAGMENT_COST: number = 1;
export const LEVELUP_COSTS: number[] = [
  1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161, 171,
  181, 191, 201, 211, 221, 231, 241, 251, 261, 271, 281, 291, 301, 311, 321,
  331, 341, 351, 361, 371, 381, 391, 401, 411, 421, 431, 441, 451, 461, 471,
  481, 491, 500,
];
// export const BASE_FRAGMENT_REWARD: number = 5;
export const MONEY_PER_STATION: number = 5;

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

// export const giveFragment = async (
//   itemid: string,
//   uid: string,
//   amount: number
// ) => {
//   console.log("Got " + amount + " fragments for " + getStationName(itemid));
//   await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
//     fragments: increment(amount),
//   });
// };

export const updateMoney = async (
  uid: string,
  amount: number,
  multiplier: number
) => {
  updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
    money: increment(multiplier * amount),
  });
};

export const stationLevelUp = async (
  id: string,
  currentMoney: number,
  currentLevel: number,
  uid: string
) => {
  const cost = LEVELUP_COSTS[currentLevel - 1];
  if (currentMoney >= cost) {
    console.log("Level up approved for " + id);
    await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", id), {
      level: increment(1),
      // fragments: increment(cost * -1),
      unlocked: true,
    });
    await updateMoney(uid, cost, -1);
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
    const updatePromise = updateMoney(uid, cost, -1);
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

export const scaledRewardsCalc = (
  baseReward: number,
  multiplier: number,
  levelOfStart: number | undefined
): number => {
  if (levelOfStart) {
    const rewardMultiplier = levelOfStart / 10 + 1;
    const moneyReward = Math.round(baseReward * multiplier * rewardMultiplier);
    return moneyReward;
  }
  return 0;
};

export const tripRewardHandler = async (
  uid: string,
  visited: Station[],
  visitedLength: number,
  // levelOfStart: number
  levelList: Map<string, number>
): Promise<[Reward[], number]> => {
  // let reward = scaledRewardsCalc(
  //   MONEY_PER_STATION,
  //   visitedLength,
  //   levelList.get(visited[0].id) // get level of first visited station
  // );
  // const userRef = doc(FIRESTORE_DB, `users/${uid}`);
  // updateDoc(userRef, {
  //   money: increment(reward),
  //   gems: increment(reward),
  // });

  const rewards: Reward[] = [];
  // rewards.push(newReward("Money", Tier.THREE_STAR, reward, "cash-multiple")); // money reward
  // rewards.push(newReward("Gems", Tier.THREE_STAR, reward, "diamond")); // money reward

  let reward: number = 0;
  const promises = visited.map(({ id }) => {
    const amt = scaledRewardsCalc(MONEY_PER_STATION, 1, levelList.get(id));
    reward += amt;
    rewards.push(
      newReward(getStationName(id), Tier.THREE_STAR, amt, "cash-multiple")
    );
    // return giveFragment(id, uid, amt);
  });
  await Promise.all(promises);
  // rewards.push(newReward("000", Tier.THREE_STAR, reward, "cash-multiple")); // To communicate the total reward money to Trip without redundantly recalculating it
  const userRef = doc(FIRESTORE_DB, `users/${uid}`);
  updateDoc(userRef, {
    money: increment(reward),
    gems: increment(reward),
  });
  console.log("Reward money:" + reward);
  return [rewards, reward];
};
