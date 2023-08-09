import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Types/NavigationTypes";
import { Button } from "react-native-paper";
import { findViableTrips } from "../../utils/TripFinder";
import * as SKYTRAIN_DATA from "../../utils/SkytrainData";
import { getStationName } from "../../utils/SkytrainData";
import { Graph } from "../../utils/Graph";
import {
  MONEY_PER_STATION,
  tripRewardHandler,
  moneyRewardCalc,
} from "../../utils/UnlockHandler";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { user, characterid, characterLevel, todo, navigation } = route.params;
  const startingStnName: string = getStationName(characterid);
  // reward calculation
  const [stationsPassed, setStationsPassed] = useState<number>(0);
  const [firstStationName, setFirstStationName] = useState<string>("");
  const [lastStationName, setLastStationName] = useState<string>("");
  // Trip details
  const stationToRetrieve = SKYTRAIN_DATA.STATION_MAP.get(characterid);
  const graph: Graph = SKYTRAIN_DATA.buildGraph();

  const getViableTrips = async () => {
    try {
      return findViableTrips(graph, stationToRetrieve?.[1], todo.time);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  };

  const runTripAndRewards = async () => {
    const viableTrips = await getViableTrips();
    if (viableTrips !== undefined) {
      const randomIndex = Math.floor(Math.random() * viableTrips.length);
      const randomArray = viableTrips[randomIndex];
      const firstStation = randomArray[0];
      const lastStation = randomArray[randomArray.length - 1];
      setFirstStationName(getStationName(firstStation.id));
      setLastStationName(getStationName(lastStation.id));
      setStationsPassed(randomArray.length);
      // console.log("stations passed: " + stationsPassed);
      tripRewardHandler(user.uid, randomArray, stationsPassed, characterLevel);
    } else {
      console.log("No viable trips to be logged");
    }
  };

  useEffect(() => {
    console.log(startingStnName + " arrived during task " + todo.title);
    runTripAndRewards();
    todo.done = true;
  }, [stationsPassed]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            backgroundColor: "lightgray",
            padding: 12,
            margin: 12,
          },
        ]}
      >
        Character {startingStnName} arrived during task {todo.title}
      </Text>
      <Text style={styles.text}>
        {firstStationName} to {lastStationName}
      </Text>
      <Text style={styles.text}>Time elapsed: {todo.time} mins</Text>
      <Text style={styles.text}>{characterLevel}</Text>
      <Text style={styles.text}>
        Rewards: ${moneyRewardCalc(stationsPassed, characterLevel)},{" "}
        {moneyRewardCalc(stationsPassed, characterLevel)} gems
      </Text>
      <Button
        icon="chevron-left"
        // mode="outlined"
        textColor="royalblue"
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.button}
        labelStyle={{ fontSize: 25 }} // icon size
      >
        <Text style={styles.text}>Return</Text>
      </Button>
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    margin: 4,
  },
  button: {
    margin: 5,
  },
});
