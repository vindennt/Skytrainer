export const PERMANENT_PRICE: number = 10;
export const LIMITED_PRICE: number = 1;
export const UNIVERSAL_FIVE_STAR_PITY: number = 3;
export const DUPLICATE_LEVEL_RATE: number = 10;
export const PERMANENT_CASHBACK_RATE: number = 50;
export const LIMITED_CASHBACK_RATE: number = 10;

export const FIVE_STAR_GRADIENT: string[] = [
  "gold",
  "rgba(77, 65, 5, 0.5)",
  "rgba(0, 0, 0, 0.5)",
];
export const FOUR_STAR_GRADIENT: string[] = [
  "rgba(151, 9, 222, 1)",
  "rgba(47, 3, 69, 0.5)",
  "rgba(0, 0, 0, 0.5)",
];

// TODO: remove this becuasej ust for testing purpseos
const currentDate = new Date();
const tenDaysLater = new Date();
tenDaysLater.setDate(currentDate.getDate() + 10);
tenDaysLater.setHours(currentDate.getHours() + 5);

// Rate up id set to "000" if no rate up
export interface BannerInfo {
  title: string;
  limitedStationId: string;
  rateUpIdOne: string;
  rateUpIdTwo: string;
  rateUpIdThree: string;
  startDate?: Date;
  endDate?: Date;
  description: string;
  type: "permanent" | "limited";
}

export const PermanentBannerInfo: BannerInfo = {
  title: "Wanderlust Invocation",
  limitedStationId: "001",
  rateUpIdOne: "000",
  rateUpIdTwo: "000",
  rateUpIdThree: "000",
  startDate: currentDate,
  endDate: tenDaysLater,
  description: "Here to stay",
  type: "permanent",
};

export const LimitedBannerInfo: BannerInfo = {
  title: "Wanderlust Invocation",
  limitedStationId: "001",
  rateUpIdOne: "000",
  rateUpIdTwo: "000",
  rateUpIdThree: "000",
  startDate: currentDate,
  endDate: tenDaysLater,
  description: "Increased drop rate of YVR Airport",
  type: "limited",
};

export enum Tier {
  FOUR_STAR = "FourStar",
  FIVE_STAR = "FiveStar",
}

export interface RewardTableElement {
  id: string;
  weight: number;
}

const newRTE = (id: string, weight: number): RewardTableElement => {
  return {
    id: id,
    weight: weight,
  };
};

export const tierRewardTable: RewardTableElement[] = [
  newRTE(Tier.FOUR_STAR, 5),
  newRTE(Tier.FIVE_STAR, 1),
];

// const threeStarRewardTable: RewardTableElement[] = [newRTE("001", 1)];
// const fourStarRewardTable: RewardTableElement[] = [newRTE("002", 1)];
export const fiveStarRewardTable: RewardTableElement[] = [newRTE("053", 1)];

export const fourStarRewardTable: RewardTableElement[] = [
  newRTE("001", 1),
  newRTE("002", 1),
  newRTE("003", 1),
  newRTE("004", 1),
  newRTE("005", 1),
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
