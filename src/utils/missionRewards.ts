export enum MissionData {
  CONSECUTIVE_DAYS = "days",
  TOTAL_MINS = "mins",
  TOTAL_TRIPS = "trips",
}

export interface Mission {
  description: string;
  milestone: number;
  type: MissionData;
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
    type: MissionData.CONSECUTIVE_DAYS,
  },
  {
    description: "Go on 3 Focus Trips",
    milestone: 3,
    type: MissionData.TOTAL_TRIPS,
  },
  {
    description: "Go on a Focus Trip 7 days in a row",
    milestone: 7,
    type: MissionData.CONSECUTIVE_DAYS,
  },
  {
    description: "Go on a Focus Trip 14 days in a row",
    milestone: 14,
    type: MissionData.CONSECUTIVE_DAYS,
  },
  {
    description: "Go on 10 Focus Trips",
    milestone: 10,
    type: MissionData.TOTAL_TRIPS,
  },
  {
    description: "Go on a Focus Trip 30 days in a row",
    milestone: 30,
    type: MissionData.CONSECUTIVE_DAYS,
  },
  {
    description: "Go on 1000 Focus Trips",
    milestone: 1000,
    type: MissionData.TOTAL_TRIPS,
  },
  {
    description: "Spend 9000 minutes on Focus Trips",
    milestone: 9000,
    type: MissionData.TOTAL_MINS,
  },
];
