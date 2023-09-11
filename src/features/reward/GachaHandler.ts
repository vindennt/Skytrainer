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
// Currently, a rate up 5* means the 5* you roll is gauranteed to be that station id
export const gachaRoll = (
  userFiveStarPity: number = UNIVERSAL_FIVE_STAR_PITY,
  limitedRateUpId: string = "",
  fourStarRateUpIds: string[] = []
) => {
  const limited: boolean = limitedRateUpId !== "";
  // If user is "at pity", immediately give them a random FIVE_STAR Tier reward
  console.log("Rolling with pity: " + userFiveStarPity);
  if (userFiveStarPity === UNIVERSAL_FIVE_STAR_PITY) {
    if (limited) {
      // If Limited banner, five star means instantly give them  that station
      return limitedRateUpId;
    } else {
      // If not limited, then get a random 5*
      return getRandomReward(fiveStarRewardTable);
    }
  } else {
    const tier = getRandomReward(tierRewardTable);
    return tier === Tier.FIVE_STAR
      ? limited
        ? limitedRateUpId
        : getRandomReward(fiveStarRewardTable)
      : getRandomReward(fourStarRewardTable);
  }
};
