// format for rewards in the drop table where id is character id, and weight is probability weight
interface RewardTableElement {
  id: string;
  weight: number;
}

// helper function to increase readability creating a RewardTableElement
const newRTE = (id: string, weight: number): RewardTableElement => {
  return {
    id: id,
    weight: weight,
  };
};

// Format for rewards
export interface Reward {
  id: string;
  tier: Tier;
  quantity: number;
}

export const newReward = (id: string, tier: Tier, quanity: number): Reward => {
  return {
    id: id,
    tier: tier,
    quantity: quanity,
  };
};

// Concrete tiers for rewards
export enum Tier {
  THREE_STAR = "Three",
  FOUR_STAR = "Four",
  FIVE_STAR = "Five",
}

// Gacha mechanic "Pity" limit. If a user does not roll a Five Star Tiered reward in
// UNIVERSAL_FIVE_STAR_PITY rolls, next roll is gauranteed Five Star Tier
const UNIVERSAL_FIVE_STAR_PITY: number = 3;
// const UNIVERSAL_FOUR_STAR_PITY: number = 9;

// helper function that allows dynamic random reward generation based on weighted probability
function weightedRoll(rewardTable: RewardTableElement[]): RewardTableElement {
  let totalWeight = 0;
  rewardTable.forEach((element) => {
    totalWeight += element.weight;
  });
  console.log("total weighted roll : " + totalWeight);

  // roll number
  const randomNumber = Math.random() * totalWeight;
  console.log("Rolled weight : " + randomNumber);

  // get reward
  let currentWeight = 0;
  // let toReturn: RewardTableElement;
  // think of currentWeight as a stack pointer, and the weights are working up towards the randoml;y picked number
  for (const element of rewardTable) {
    const weight = element.weight;
    currentWeight += weight;
    console.log(
      "current weight before reward check : " +
        currentWeight +
        ", vs random number: " +
        randomNumber
    );
    if (randomNumber < currentWeight) {
      // const toReturn: RewardTableElement = newRTE(element.id, element.weight);
      // console.log(toReturn);
      return element;
    }
  }
  throw new Error("No reward found");
}

const tierRewardTable: RewardTableElement[] = [
  // newRTE(Tier.THREE_STAR, 1),
  newRTE(Tier.FOUR_STAR, 5),
  newRTE(Tier.FIVE_STAR, 1),
];

// const threeStarRewardTable: RewardTableElement[] = [newRTE("001", 1)];
// const fourStarRewardTable: RewardTableElement[] = [newRTE("002", 1)];
const fiveStarRewardTable: RewardTableElement[] = [
  newRTE("053", 1),
  newRTE("005", 1),
];

// Returns reward id and randomized tier of a randomized reward
// userFiveStarPity is compared to UNIVERSAL_FIVE_STAR_PITY to see if next reward is gauranteed Five star tier
export const gachaRoll = (
  // fourStarPity: number,
  userFiveStarPity: number
): Reward => {
  if (userFiveStarPity === UNIVERSAL_FIVE_STAR_PITY) {
    return {
      id: weightedRoll(fiveStarRewardTable).id,
      tier: Tier.FIVE_STAR,
      quantity: 1,
    };
  } else {
    const tier = weightedRoll(tierRewardTable);
    if (tier.id === Tier.FIVE_STAR) {
      return {
        id: weightedRoll(fiveStarRewardTable).id,
        tier: Tier.FIVE_STAR,
        quantity: 1,
      };
    } else if (tier.id === Tier.FOUR_STAR) {
      return {
        id: weightedRoll(fourStarRewardTable).id,
        tier: Tier.FOUR_STAR,
        quantity: 1,
      };
    } else {
      throw new Error("No tier found");
    }
  }

  //  else {
  //   return { id: weightedRoll(threeStarRewardTable).id, tier: Tier.THREE_STAR };
  // }
};

// TODO: put banner reward tables to be tied to a firestore database
const fourStarRewardTable: RewardTableElement[] = [
  // newRTE("001", 1),
  newRTE("002", 1),
  newRTE("003", 1),
  newRTE("004", 1),
  // newRTE("005", 1),
  newRTE("006", 1),
  newRTE("007", 1),
  newRTE("008", 1),
  newRTE("009", 1),
  newRTE("010", 1),
  newRTE("011", 1),
  newRTE("012", 1),
  newRTE("013", 1),
  newRTE("014", 1),
  newRTE("015", 1),
  newRTE("016", 1),
  newRTE("017", 1),
  newRTE("018", 1),
  newRTE("019", 1),
  newRTE("020", 1),
  newRTE("021", 1),
  newRTE("022", 1),
  newRTE("023", 1),
  newRTE("024", 1),
  newRTE("025", 1),
  newRTE("026", 1),
  newRTE("027", 1),
  newRTE("028", 1),
  newRTE("029", 1),
  newRTE("030", 1),
  newRTE("031", 1),
  newRTE("032", 1),
  newRTE("033", 1),
  newRTE("034", 1),
  newRTE("035", 1),
  newRTE("036", 1),
  newRTE("037", 1),
  newRTE("038", 1),
  newRTE("039", 1),
  newRTE("040", 1),
  newRTE("041", 1),
  newRTE("042", 1),
  newRTE("043", 1),
  newRTE("044", 1),
  newRTE("045", 1),
  newRTE("046", 1),
  newRTE("047", 1),
  newRTE("048", 1),
  newRTE("049", 1),
  newRTE("050", 1),
  newRTE("051", 1),
  newRTE("052", 1),
  // newRTE("053", 1),
];
