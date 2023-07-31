import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Types/NavigationTypes";
import { Button } from "react-native-paper";
import { findViableTrips } from "../../utils/TripFinder";
import * as SKYTRAIN_DATA from "../../utils/SKYTRAIN_DATA";
import { Graph, Station, newStation } from "../../utils/Graph";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

interface StringToStringDictionary {
  [key: string]: string;
}
// TODO: implement firestore retrieval of character information
const CharacterTable: StringToStringDictionary = {
  "001": "001",
  "002": "002",
  "003": "003",
  "004": "004",
};

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { user, characterid, todo, navigation } = route.params;
  const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);

  // Trip details
  const stationToRetrieve = SKYTRAIN_DATA.STATION_MAP.get(characterid);
  var graph: Graph = SKYTRAIN_DATA.buildGraph();
  const viableTrips = findViableTrips(graph, stationToRetrieve?.[1], todo.time);
  let firstStationName: string | undefined = "";
  let lastStationName: string | undefined = "";

  // reward calculation
  let stationsPassed = 0;
  const rewardMoney = 5;
  const rewardGems = 2;
  var money = -1;
  var gems = -1;
  let calculatedMoneyReward = 0;
  let calculatedGemReward = 0;

  const getSnapshot = async () => {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("In-trip:", docSnap.data());
      console.log("money: " + docSnap.data().money);
      console.log("gems: " + docSnap.data().gems);
      money = docSnap.data().money;
      gems = docSnap.data().gems;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const updateRewards = async () => {
    await getSnapshot();
    // Set the "capital" field of the city 'DC'
    // console.log("Stations passed before calcs: " + stationsPassed);
    calculatedMoneyReward = rewardMoney * stationsPassed;
    // console.log(calculatedMoneyReward);
    calculatedGemReward = rewardGems * stationsPassed;
    const newMoney: number = calculatedMoneyReward + money;
    const newGems: number = calculatedGemReward + gems;
    console.log("new money should be: " + newMoney);
    console.log("new gems should be: " + newGems);
    await updateDoc(userRef, {
      money: newMoney,
      gems: newGems,
    });
  };

  // Log occurence
  console.log(
    "Character " +
      CharacterTable[characterid] +
      " arrived during task " +
      todo.title
  );
  // console.log(viableTrips);

  const tripLog = () => {
    const randomIndex = Math.floor(Math.random() * viableTrips.length);
    const randomArray = viableTrips[randomIndex];
    const firstStation = randomArray[0];
    const lastStation = randomArray[randomArray.length - 1];
    console.log(SKYTRAIN_DATA.STATION_MAP.get(firstStation?.id as string)?.[0]);
    console.log(SKYTRAIN_DATA.STATION_MAP.get(lastStation?.id as string)?.[0]);
    firstStationName = SKYTRAIN_DATA.STATION_MAP.get(
      firstStation?.id as string
    )?.[0];
    lastStationName = SKYTRAIN_DATA.STATION_MAP.get(
      lastStation?.id as string
    )?.[0];
    stationsPassed = randomArray.length;
    // console.log("stations passed: " + stationsPassed);
    updateRewards();
  };
  console.log(tripLog());
  todo.done = true;

  return (
    <View style={styles.container}>
      {/* <RenderTrip name={name}></RenderTrip> */}
      {/* <Text style={styles.text}>Name is {user?.displayName}</Text> */}
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
        Character {CharacterTable[characterid]} arrived during task {todo.title}
      </Text>
      <Text style={styles.text}>
        {firstStationName} to {lastStationName}
      </Text>
      <Text style={styles.text}>Time elapsed: {todo.time} mins</Text>
      <Text style={styles.text}>
        Rewards: ${stationsPassed * rewardMoney}, {stationsPassed * rewardGems}{" "}
        gems
      </Text>
      <Button
        icon="chevron-left"
        mode="outlined"
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
