import { REWARD_MULTIPLIERS } from "@src/utils/levels";
import { BASE_TRIP_REWARD, getStationName } from "@src/utils/skytrain";

// Given a list of station ids:
// for each station visited, get their level from user's station level, which gives multipler to multiply reward by
// return an array of trip reward objects. Each contsin a unique id for flatlist purposes, name, and amt

// id represents position in the path the station was
// stationName is name of station visited
// contribution is that station's respective contribution to the rewards, which was based on its level
export interface RewardContributor {
  id: string;
  stationName: string;
  contribution: number;
}

export interface TripReward {
  total: number;
  contributors: RewardContributor[];
}

export const getRewards = (
  path: string[],
  stations: Map<string, number>
): TripReward => {
  let idGen: number = 0;
  let totalReward: number = 0;
  let contributors: RewardContributor[] = [];

  path.forEach((stationId) => {
    // (1/3) Add scaled contribution to cumulative total
    const level: number | undefined = stations.get(stationId);
    if (level === undefined) {
      throw new Error("Missing level for " + stationId);
    }
    const contribution = BASE_TRIP_REWARD * REWARD_MULTIPLIERS[level];
    totalReward += contribution;
    idGen++;
    // (2/3) Push the new RewardContributor object
    const contributor: RewardContributor = {
      id: idGen.toString(),
      stationName: getStationName(stationId),
      contribution: contribution,
    };
    contributors.push(contributor);
  });
  // (3/3) Return the final result
  const reward: TripReward = {
    total: totalReward,
    contributors: contributors,
  };
  return reward;
};
