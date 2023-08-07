interface RewardTableElement {
  id: string;
  weight: number;
}

const newRTE = (id: string, weight: number): RewardTableElement => {
  return {
    id: id,
    weight: weight,
  };
};

// type Reward = {
//   id: string;
//   tier: string;
// };

enum Tier {
  THREE_STAR = "Three",
  FOUR_STAR = "Four",
  FIVE_STAR = "Five",
}

// const tiers: string[] = [Tier.THREE_STAR, Tier.FOUR_STAR, Tier.FIVE_STAR];
// const tierWeights: number[] = [6, 3, 1];

const UNIVERSAL_FIVE_STAR_PITY: number = 89;
const UNIVERSAL_FOUR_STAR_PITY: number = 9;

// helper for gacha roll
function weightedRoll(rewardTable: RewardTableElement[]): RewardTableElement {
  let totalWeight = 0;
  rewardTable.forEach((element) => {
    totalWeight += element.weight;
  });

  // roll number
  const randomNumber = Math.random() * totalWeight;

  // get reward
  let currentWeight = 0;
  // think of currentWeight as a stack pointer, and the weights are working up towards the randoml;y picked number
  rewardTable.forEach((element) => {
    const weight = element.weight;
    currentWeight += weight;
    if (randomNumber <= currentWeight) {
      return element;
    }
  });

  throw new Error("No reward found");
  //   const totalWeight = objects.reduce(
  //     (sum, obj) => sum + obj[Object.keys(obj)[0]],
  //     0
  //   );

  // get total weight based on data input
  //   for (const reward of tierRewardTable) {
  //     const weight = Object.values(reward)[0];
  //     totalWeight += weight;
  //   }

  //   for (const obj of rewardTable) {
  //     const weight = obj[Object.keys(obj)[0]];
  //     currentWeight += weight;
  //     if (randomNumber <= currentWeight) {
  //       return obj;
  //     }
  //   }
}
// const weightedRoll = (rewards: string[], weights: number[]): string => {
//   // Get weighted total
//   let totalWeight: number = 0;
//   weights.forEach((weight) => {
//     totalWeight += weight;
//   });
//   const roll: number = Math.random() * totalWeight; // + 1 allows it to reach max
//   console.log("Rolled: " + roll);
//   let cumulativeTotal = 0;
//   // since roll will always bewithin range of [0, totalWeight], this iuteration wil always end
//   for (let i = 0; i < weights.length; i++) {
//     cumulativeTotal += weights[i];
//     if (roll <= cumulativeTotal) {
//       return rewards[i];
//     }
//   }
//   throw new Error("Roll matches no tier");
// };

const tierRewardTable: RewardTableElement[] = [
  newRTE(Tier.THREE_STAR, 1),
  newRTE(Tier.FOUR_STAR, 1),
  newRTE(Tier.FIVE_STAR, 1),
];

const threeStarRewardTable: RewardTableElement[] = [newRTE("001", 1)];
const fourStarRewardTable: RewardTableElement[] = [newRTE("002", 1)];
const fiveStarRewardTable: RewardTableElement[] = [newRTE("053", 1)];

// returns reward id and tier
// pity influences reward tier
const gachaRoll = (
  fourStarPity: number,
  fiveStarPity: number
): RewardTableElement => {
  const tier = weightedRoll(tierRewardTable);
  if (tier.id === Tier.FIVE_STAR) {
    return weightedRoll(fiveStarRewardTable);
  } else if (tier.id === Tier.FOUR_STAR) {
    return weightedRoll(fourStarRewardTable);
  } else {
    return weightedRoll(threeStarRewardTable);
  }
};

// TODO: put banner reward tables to be tied to a firestore database
// const fourStarRewardTable: RewardTableElement[] = [
//   newRTE("001", 1),
//   newRTE("002", 1),
//   newRTE("003", 1),
//   newRTE("004", 1),
//   newRTE("005", 1),
//   newRTE("006", 1),
//   newRTE("007", 1),
//   newRTE("008", 1),
//   newRTE("009", 1),
//   newRTE("010", 1),
//   newRTE("011", 1),
//   newRTE("012", 1),
//   newRTE("013", 1),
//   newRTE("014", 1),
//   newRTE("015", 1),
//   newRTE("016", 1),
//   newRTE("017", 1),
//   newRTE("018", 1),
//   newRTE("019", 1),
//   newRTE("020", 1),
//   newRTE("021", 1),
//   newRTE("022", 1),
//   newRTE("023", 1),
//   newRTE("024", 1),
//   newRTE("025", 1),
//   newRTE("026", 1),
//   newRTE("027", 1),
//   newRTE("028", 1),
//   newRTE("029", 1),
//   newRTE("030", 1),
//   newRTE("031", 1),
//   newRTE("032", 1),
//   newRTE("033", 1),
//   newRTE("034", 1),
//   newRTE("035", 1),
//   newRTE("036", 1),
//   newRTE("037", 1),
//   newRTE("038", 1),
//   newRTE("039", 1),
//   newRTE("040", 1),
//   newRTE("041", 1),
//   newRTE("042", 1),
//   newRTE("043", 1),
//   newRTE("044", 1),
//   newRTE("045", 1),
//   newRTE("046", 1),
//   newRTE("047", 1),
//   newRTE("048", 1),
//   newRTE("049", 1),
//   newRTE("050", 1),
//   newRTE("051", 1),
//   newRTE("052", 1),
//   newRTE("053", 1),
// ];
