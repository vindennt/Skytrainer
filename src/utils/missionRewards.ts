export enum MissionType {
  CONSECUTIVE_DAYS = "days",
  TOTAL_MINS = "mins",
  TOTAL_TRIPS = "trips",
}

export interface RewardProgress {
  progress: number;
  claimed: number;
  databaseType: string;
}

export interface Mission {
  description: string;
  milestone: number;
  type: MissionType;
  reward: number;
}

export enum FocusMilestone {
  FIRST_MILESTONE,
  SECOND_MILESTONE,
  THIRD_MILESTONE,
}

export enum FocusMilestoneTimes {
  FIRST_MILESTONE = 5,
  SECOND_MILESTONE = 10,
  THIRD_MILESTONE = 15,
}

export enum DailyFocusRewards {
  FIRST_MILESTONE = 5,
  SECOND_MILESTONE = 10,
  THIRD_MILESTONE = 15,
}

export const MissionsList: Mission[] = [
  {
    description: "Go on at least one Focus Trip 3 days in a row",
    milestone: 3,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 10,
  },

  {
    description: "Go on a Focus Trip 7 days in a row",
    milestone: 7,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 10,
  },
  {
    description: "Go on a Focus Trip 14 days in a row",
    milestone: 14,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 10,
  },

  {
    description: "Go on a Focus Trip 30 days in a row",
    milestone: 30,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 10,
  },
  {
    description: "Go on 3 Focus Trips",
    milestone: 3,
    type: MissionType.TOTAL_TRIPS,
    reward: 10,
  },
  {
    description: "Go on 10 Focus Trips",
    milestone: 10,
    type: MissionType.TOTAL_TRIPS,
    reward: 10,
  },
  {
    description: "Go on 1000 Focus Trips",
    milestone: 1000,
    type: MissionType.TOTAL_TRIPS,
    reward: 10,
  },
  // {
  //   description: "Spend 9000 minutes on Focus Trips",
  //   milestone: 9000,
  //   type: MissionType.TOTAL_MINS,
  //   reward: 10,
  // },
];
