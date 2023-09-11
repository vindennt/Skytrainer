import {
  Tier,
  RewardTableElement,
  tierRewardTable,
  fourStarRewardTable,
  fiveStarRewardTable,
  UNIVERSAL_FIVE_STAR_PITY,
  FOUR_STAR_BOOSTED_WEIGHT,
} from "@src/utils/gacha";

// Helper function that allows dynamic random reward generation based on weighted probability
const getRandomReward = (
  rewardTable: RewardTableElement[],
  fourStarRateUpIds: string[] = []
): string => {
  // Sum total weight
  const limitedBanner: boolean = fourStarRateUpIds.length > 0;

  let totalWeight = 0;
  rewardTable.forEach((element) => {
    totalWeight += element.weight;
    // Adjust total weight for 4*s on rate up
    if (limitedBanner && fourStarRateUpIds.includes(element.id)) {
      totalWeight += FOUR_STAR_BOOSTED_WEIGHT;
    }
  });
  // Addon extra weight attributed to the boosted rate for any rate up four stars
  // fourStarRateUpIds.forEach((element) => {
  //   totalWeight += FOUR_STAR_BOOSTED_WEIGHT;
  // });

  // Roll random number based on totalWeight
  const randomNumber = Math.random() * totalWeight;
  //   console.log("Rolled weight : " + randomNumber);

  // Get reward corresponding to roll
  // Treat currentWeight as a fixed stack pointer, and the weights are accumulating up towards the randomly picked number
  let currentWeight = 0;
  for (const element of rewardTable) {
    let weight = element.weight;
    // If the four star is one of the limited rate ups, boost its weighted roll
    if (limitedBanner && fourStarRateUpIds.includes(element.id)) {
      weight += FOUR_STAR_BOOSTED_WEIGHT;
    }
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
  console.log(
    "Limited rate ups: " + limitedRateUpId + " and 4*: " + fourStarRateUpIds
  );
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
      : getRandomReward(fourStarRewardTable, fourStarRateUpIds);
  }
};
