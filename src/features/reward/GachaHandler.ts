import {
  Tier,
  RewardTableElement,
  tierRewardTable,
  fourStarRewardTable,
  fiveStarRewardTable,
  UNIVERSAL_FIVE_STAR_PITY,
} from "@src/utils/gacha";

// Helper function that allows dynamic random reward generation based on weighted probability
const getRandomReward = (rewardTable: RewardTableElement[]): string => {
  // Sum total weight
  let totalWeight = 0;
  rewardTable.forEach((element) => {
    totalWeight += element.weight;
  });

  // Roll random number based on totalWeight
  const randomNumber = Math.random() * totalWeight;
  //   console.log("Rolled weight : " + randomNumber);

  // Get reward corresponding to roll
  // Treat currentWeight as a fixed stack pointer, and the weights are accumulating up towards the randomly picked number
  let currentWeight = 0;
  for (const element of rewardTable) {
    const weight = element.weight;
    currentWeight += weight;
    if (randomNumber < currentWeight) {
      return element.id;
    }
  }
  throw new Error("No reward found");
};

// Returns stationId of randomized reward
export const gachaRoll = (userFiveStarPity: number): string => {
  // If user is "at pity", immediately give them a random FIVE_STAR Tier reward
  console.log("Rolling with pity: " + userFiveStarPity);
  if (userFiveStarPity === UNIVERSAL_FIVE_STAR_PITY) {
    return getRandomReward(fiveStarRewardTable);
  } else {
    const tier = getRandomReward(tierRewardTable);
    return tier === Tier.FIVE_STAR
      ? getRandomReward(fiveStarRewardTable)
      : getRandomReward(fourStarRewardTable);
  }
};
