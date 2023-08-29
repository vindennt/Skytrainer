export const PERMANENT_PRICE: number = 10;
export const LIMITED_PRICE: number = 160;

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
  type: "limited",
};
