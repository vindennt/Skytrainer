import React from "react";
import { useState, useEffect } from "react";
// import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Todo } from "../app/screens/Home";
// import DropdownComponent from "../utils/Dropdown";
import DropDown from "react-native-paper-dropdown";
import { User } from "firebase/auth";
import { FIRESTORE_DB } from "../api/FirebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import GridSelector from "./GridSelector";
import * as SKYTRAIN_DATA from "../utils/SkytrainData";
import { getStationName } from "../utils/SkytrainData";

interface TripMenuProps {
  item: Todo;
  //   startTrip: (todo: Todo, character: Character | undefined) => void; // Function prop to start the trip
  user: User | undefined; // "user" prop of type "User"
  modalCloseMethod: () => void;
  navigation: any;
  uid: string;
}

// Dropdown menu prop only takes this form of data
export type Character = {
  name: string; // display name
  id: string; // character id
  // level: number;
};

// const controlSelectState = useSelectState();
export var characterList: Character[] = [];

const TripMenu: React.FC<TripMenuProps> = ({
  //   startTrip,
  user,
  item,
  modalCloseMethod,
  navigation,
  uid,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [character, setCharacter] = useState<string>("001");
  const isFocused = useIsFocused();
  const [isPopupVisible, setPopupVisible] = useState(true);
  // const [characterList, setCharacterList] = useState<Character[]>([]);

  const getUserCharacterData = async () => {
    characterList = [];
    const charQuery = query(
      collection(FIRESTORE_DB, `users/${uid}/characters`),
      where("unlocked", "==", true)
    ); // refer to todos collection in firestore
    const querySnapshot = await getDocs(charQuery);
    await querySnapshot.forEach((doc) => {
      const id: string = doc.id;
      // const stationRef = SKYTRAIN_DATA.STATION_MAP.get(doc.id);
      characterList.push({
        // TODO: implement fragments and leveling
        // level: doc.data().level,
        id: id,
        name: getStationName(id), // Name of station from the map
      } as Character);
    });
    console.log("GETTING CHARACTER LIST");
    console.log(characterList);
    console.log("DONE GETTING CHARACTER LIST");
  };

  useEffect(() => {
    getUserCharacterData();
    // Recheck todos. Delete ones that just finished
    if (isFocused) {
      // If item is done (just came from Trip), delete it
      if (item.done) {
        deleteTodo(item);
      }
    }
  }, [isFocused, item]);

  const deleteTodo = async (todo: Todo) => {
    console.log("deleting todo: " + todo.title);
    if (user) {
      const ref = doc(FIRESTORE_DB, `todos/${user?.uid}/todos/${item.id}`);
      deleteDoc(ref);
      modalCloseMethod();
    }
  };

  const startTrip = (todo: Todo, character: string): void => {
    // const username: string | null | undefined = user?.displayName;
    console.log(
      "Trip for todo " +
        todo.title +
        " started with character " +
        character +
        " for user " +
        user?.displayName
    );

    navigation.navigate("Trip", {
      user: user,
      characterid: character,
      todo: todo,
      navigation: navigation,
    });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.overview}>Task Details</Text> */}
      <View
        style={{
          marginTop: 15,
          width: "90%",
          alignItems: "center",
        }}
      >
        <View
          // style={{ backgroundColor: "royalblue", padding: 16, borderRadius: 8 }}
          style={{
            // justifyContent: "center",
            backgroundColor: "royalblue",
            justifyContent: "space-between",
            padding: 10,
            borderRadius: 12,
            minHeight: "55%",
            maxHeight: "55%",
            maxWidth: "100%",
            minWidth: "80%",
          }}
        >
          <GridSelector
            // visible={isPopupVisible}
            characters={characterList}
            columns={2}
            onSelect={(item) => {
              console.log("Selected character: " + item.name);
              setCharacter(item.id);
            }}
          />
        </View>

        <View style={styles.taskContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{item.time + " minutes"}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            // margin: 10,
            //   paddingHorizontal: 50,
          }}
        >
          {/* <Button onPress={() => {}} title="Edit" disabled={true} /> */}

          {/* TODO: Enable this button on release. Quick delete is useful */}
          <Button onPress={() => deleteTodo(item)} title="Delete" />
          <Button
            onPress={() => {
              if (character === undefined) {
                console.log("character is undefined");
              } else {
                console.log("starting trip for " + user?.uid);
                startTrip(item, character);
              }
            }}
            title="Start"
            disabled={!character}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    alignItems: "center",
    flex: 1,
    // backgroundColor: "gray",
    justifyContent: "space-between",
  },
  taskContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 15,
    // marginHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    maxHeight: "30%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    fontSize: 18,
  },
  id: {
    fontSize: 14,
    color: "gray",
  },
  status: {
    fontSize: 14,
    color: "gray",
  },
  overview: {
    fontSize: 20,
  },
  button: {
    margin: 20,
  },
});

export default TripMenu;
