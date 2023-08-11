import { FIREBASE_AUTH, FIRESTORE_DB } from "../api/FirebaseConfig";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import * as SKYTRAIN_DATA from "./SkytrainData";
import { getStationName } from "./SkytrainData";
import { Station } from "./Graph";
import { Reward, newReward, Tier } from "./GachaHandler";

export const LEVELUP_FRAGMENT_COST: number = 1;
export const BASE_FRAGMENT_REWARD: number = 5;
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

export const giveFragment = async (
  itemid: string,
  uid: string,
  amount: number
) => {
  console.log("Got " + amount + " fragments for " + getStationName(itemid));
  await updateDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
    fragments: increment(amount),
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

export const scaledRewardsCalc = (
  baseReward: number,
  multiplier: number,
  levelOfStart: number
): number => {
  const rewardMultiplier = levelOfStart / 10 + 1;
  const moneyReward = Math.round(baseReward * multiplier * rewardMultiplier);
  return moneyReward;
};

export const tripRewardHandler = async (
  uid: string,
  visited: Station[],
  visitedLength: number,
  levelOfStart: number
): Promise<Reward[]> => {
  const reward = scaledRewardsCalc(
    MONEY_PER_STATION,
    visitedLength,
    levelOfStart
  );
  const userRef = doc(FIRESTORE_DB, `users/${uid}`);
  await updateDoc(userRef, {
    money: increment(reward),
    gems: increment(reward),
  });
  console.log("Reward money:" + reward);

  const rewards: Reward[] = [];
  rewards.push(newReward("Money", Tier.THREE_STAR, reward, "cash-multiple")); // money reward
  // TODO: remove gems as a reward for trips and give out fragments received for each staton visited
  rewards.push(newReward("Gems", Tier.THREE_STAR, reward, "diamond")); // money reward

  const promises = visited.map(({ id }) => {
    const amt = scaledRewardsCalc(BASE_FRAGMENT_REWARD, 1, levelOfStart);
    rewards.push(newReward(getStationName(id), Tier.THREE_STAR, amt, "puzzle"));
    return giveFragment(id, uid, amt);
  });
  Promise.all(promises);
  return rewards;
};
