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

export enum DailyFocusRewards {
  FIRST_MILESTONE = 5,
  SECOND_MILESTONE = 10,
  THIRD_MILESTONE = 15,
}

export const MissionsList: Mission[] = [
  {
    description: "Go on a Focus Trip 2 days in a row",
    milestone: 2,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 160,
  },
  {
    description: "Go on a Focus Trip 5 days in a row",
    milestone: 5,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 160,
  },

  {
    description: "Go on a Focus Trip 7 days in a row",
    milestone: 7,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 680,
  },
  {
    description: "Go on a Focus Trip 14 days in a row",
    milestone: 14,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 1600,
  },

  {
    description: "Go on a Focus Trip 30 days in a row",
    milestone: 30,
    type: MissionType.CONSECUTIVE_DAYS,
    reward: 2400,
  },
  {
    description: "Go on 3 Focus Trips",
    milestone: 3,
    type: MissionType.TOTAL_TRIPS,
    reward: 280,
  },
  {
    description: "Go on 10 Focus Trips",
    milestone: 10,
    type: MissionType.TOTAL_TRIPS,
    reward: 1600,
  },
  {
    description: "Go on 20 Focus Trips",
    milestone: 20,
    type: MissionType.TOTAL_TRIPS,
    reward: 1600,
  },
  {
    description: "Spend 30 minutes on Focus Trips",
    milestone: 30,
    type: MissionType.TOTAL_MINS,
    reward: 160,
  },
  {
    description: "Spend 1 hour on Focus Trips",
    milestone: 60,
    type: MissionType.TOTAL_MINS,
    reward: 320,
  },
  {
    description: "Spend 2 hours on Focus Trips",
    milestone: 120,
    type: MissionType.TOTAL_MINS,
    reward: 320,
  },
  {
    description: "Spend 12 hours on Focus Trips",
    milestone: 720,
    type: MissionType.TOTAL_MINS,
    reward: 1600,
  },
  {
    description: "Spend 1 day's length on Focus Trips",
    milestone: 1440,
    type: MissionType.TOTAL_MINS,
    reward: 2400,
  },
  {
    description: "Spend over 9000 minutes on Focus Trips",
    milestone: 9001,
    type: MissionType.TOTAL_MINS,
    reward: 9001,
  },
];

// Prevents the user from claiming a reward tier more than once
// Returns a currentclaimed dialy focus rewards minutes adjusted for inflation
export const readjustClaimedMinutes = (
  firstMilestone: number,
  secondMilestone: number,
  thirdMilestone: number,
  newFirstMilestone: number,
  newSecondMilestone: number,
  newThirdMilestone: number,
  currentClaimedMins: number
): number => {
  if (currentClaimedMins >= thirdMilestone) {
    return newThirdMilestone;
  } else if (currentClaimedMins >= secondMilestone) {
    return newSecondMilestone;
  } else if (currentClaimedMins >= firstMilestone) {
    return newFirstMilestone;
  } else {
    return currentClaimedMins;
  }
};
