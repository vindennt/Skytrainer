import React from "react";
import { useState } from "react";
// import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Todo } from "../app/screens/Home";
// import DropdownComponent from "../utils/Dropdown";
import DropDown from "react-native-paper-dropdown";
import { User } from "firebase/auth";
import { FIRESTORE_DB } from "../api/FirebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

interface TripMenuProps {
  item: Todo;
  //   startTrip: (todo: Todo, character: Character | undefined) => void; // Function prop to start the trip
  user: User | undefined; // "user" prop of type "User"
  modalCloseMethod: () => void;
  navigation: any;
}

// Dropdown menu prop only takes this form of data
export interface Character {
  label: string; // display name
  value: string; // character id
}

// const controlSelectState = useSelectState();
const characterList: Character[] = [
  {
    label: "Stanley",
    value: "Stanley",
  },
  {
    label: "Eddie",
    value: "Eddie",
  },
  {
    label: "Nathan",
    value: "Nathan",
  },
];

const TripMenu: React.FC<TripMenuProps> = ({
  //   startTrip,
  user,
  item,
  modalCloseMethod,
  navigation,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [character, setCharacter] = useState<Character>();

  const deleteTodo = async (todo: Todo) => {
    console.log("deleting todo: " + todo.title);
    if (user) {
      const ref = doc(FIRESTORE_DB, `todos/${user?.uid}/todos/${item.id}`);
      deleteDoc(ref);
      modalCloseMethod();
    }
  };

  const startTrip = (todo: Todo, character: Character | undefined): void => {
    // const username: string | null | undefined = user?.displayName;
    console.log(
      "Trip for todo " +
        todo.title +
        " started with character " +
        character +
        " for user " +
        user?.displayName
    );
    navigation.navigate("Trip", { name: user?.displayName });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.overview}>Task Details</Text> */}
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time + " minutes"}</Text>
      </View>
      <View
        style={{
          width: "80%",
        }}
      >
        <DropDown
          label={"Character"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={character}
          setValue={setCharacter}
          list={characterList}
          activeColor="blue"
          dropDownContainerMaxHeight={200}
          dropDownStyle={{ top: 300 }}
          dropDownItemStyle={{ backgroundColor: "white" }}
          dropDownItemSelectedStyle={{ backgroundColor: "white" }}
          dropDownItemTextStyle={{ backgroundColor: "white" }}
          theme={{
            colors: {
              background: "white", // Customize the primary color
            },
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          margin: 10,
          //   paddingHorizontal: 50,
        }}
      >
        {/* <Button onPress={() => {}} title="Edit" disabled={true} /> */}

        {/* TODO: Enable this button on release. Quick delete is useful */}
        <Button onPress={() => deleteTodo(item)} title="Delete" />
        <Button
          onPress={() => {
            console.log("starting trip for " + user?.uid);
            startTrip(item, character);
          }}
          title="Start"
          disabled={!character}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    alignItems: "center",
  },
  taskContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 15,
    // marginHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
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
