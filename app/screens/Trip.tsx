import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Types/NavigationTypes";
import { Button, IconButton } from "react-native-paper";
import { findViableTrips } from "../../utils/TripFinder";
import * as SKYTRAIN_DATA from "../../utils/SkytrainData";
import { getStationName } from "../../utils/SkytrainData";
import { Graph } from "../../utils/Graph";
import {
  MONEY_PER_STATION,
  tripRewardHandler,
  scaledRewardsCalc,
} from "../../utils/UnlockHandler";
import { Reward, newReward } from "../../utils/GachaHandler";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { user, characterid, levelList, todo, navigation } = route.params;
  const startingStnName: string = getStationName(characterid);
  // reward calculation
  const [stationsPassed, setStationsPassed] = useState<number>(0);
  const [firstStationName, setFirstStationName] = useState<string>("");
  const [lastStationName, setLastStationName] = useState<string>("");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalReward, setTotalReward] = useState<number>(0);
  // Trip details
  const stationToRetrieve = SKYTRAIN_DATA.STATION_MAP.get(characterid);
  const graph: Graph = SKYTRAIN_DATA.buildGraph();

  const getViableTrips = async () => {
    console.log("Trip: calling getViableTrips");
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
    console.log("Trip: running runTripAndREwards");
    const viableTrips = await getViableTrips();
    if (viableTrips !== undefined) {
      console.log("Yes viable trips to be logged");
      const randomIndex = Math.floor(Math.random() * viableTrips.length);
      const randomArray = viableTrips[randomIndex];
      setStationsPassed(randomArray.length);
      // console.log("stations passed: " + stationsPassed);
      // TODO: get the rewrds list of reward handler to display
      // setRewards(
      //   await tripRewardHandler(
      //     user.uid,
      //     randomArray,
      //     stationsPassed,
      //     levelList
      //   )
      // );

      const result: [Reward[], number] = await tripRewardHandler(
        user.uid,
        randomArray,
        stationsPassed,
        levelList
      );

      setRewards(result[0]);
      setTotalReward(result[1]);
      console.log(rewards);

      // const lastReward = rewards.pop();
      // if (lastReward !== undefined) {
      //   setTotalReward(lastReward.quantity);
      // }

      // TODO: maybe make these a promise alongside setRewards so that its more efficient?
      const firstStation = randomArray[0];
      const lastStation = randomArray[randomArray.length - 1];
      setFirstStationName(getStationName(firstStation.id));
      setLastStationName(getStationName(lastStation.id));
    } else {
      console.log("No viable trips to be logged");
    }
  };

  const renderItem = ({ item }: { item: Reward }) => (
    <View style={styles.item}>
      <View style={styles.leftContent}>
        <Text style={styles.text}>{item.id}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>{item.quantity}</Text>
        {/* {item.icon && <IconButton icon={item.icon} size={16} />} */}
      </View>
    </View>
  );

  // const RewardListFooter = () => {
  //   return (
  //     <View style={styles.item}>
  //       <Text>Total: {totalReward}</Text>
  //     </View>
  //   );
  // };

  // TODO: I think the stationsPassed dependency is what is causing so many reruns
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
          },
        ]}
      >
        Character {startingStnName} arrived during task {todo.title}
      </Text>
      <Text style={styles.text}>
        {firstStationName} to {lastStationName}
      </Text>
      <Text style={styles.text}>Time elapsed: {todo.time} mins</Text>
      {/* <Text style={styles.text}>Level: {levelList.get(characterid)}</Text> */}

      <FlatList
        data={rewards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.rewardList}
      />
      <View style={styles.totalitem}>
        <View style={styles.leftContent}>
          <Text style={styles.text}>Total</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton icon="cash-multiple" size={18} />
          <Text style={styles.text}>{totalReward}</Text>
        </View>
      </View>

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
    padding: 30,
    // backgroundColor: "pink",
  },
  text: {
    fontSize: 18,
    margin: 4,
  },
  button: {
    margin: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "green",
  },
  totalitem: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // padding: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "papayawhip",
    marginBottom: 30,
  },
  rewardList: {
    backgroundColor: "white",
    maxHeight: "33%",
    width: "100%",
    marginTop: 30,
    // maxWidth: "50%",
    // margin: 30,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
