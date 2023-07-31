import React, { useEffect } from "react";
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
  "001": "stanley",
  "002": "eddie",
  "003": "nathan",
};

const Trip: React.FC = () => {
  const graph: Graph = SKYTRAIN_DATA.buildGraph();
  const Waterfront: Station = newStation("001", "00", true);
  const route = useRoute<TripRouteProp>();
  const { user, characterid, todo, navigation } = route.params;
  const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);
  // TODO: find viable trip and display a random one
  const viableTrips = findViableTrips(graph, Waterfront, todo.time);
  // TODO: implement calculation of rewards
  const rewardMoney = 5;
  const rewardGems = 2;
  var money = -1;
  var gems = -1;

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
    const newMoney: number = money + rewardMoney;
    const newGems: number = gems + rewardGems;
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
      " arridasdaved during task " +
      todo.title
  );
  console.log(graph);
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
      <Text style={styles.text}>Waterfront to Richmond-Brighouse</Text>
      <Text style={styles.text}>Time elapsed: {todo.time} mins</Text>
      <Text style={styles.text}>
        Rewards: ${rewardMoney}, {rewardGems} gems
      </Text>
      <Button
        icon="chevron-left"
        mode="outlined"
        textColor="royalblue"
        onPress={() => {
          updateRewards();
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
