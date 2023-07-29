import React from "react";
import { useState } from "react";
// import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Todo } from "../app/screens/Home";
// import DropdownComponent from "../utils/Dropdown";
import {
  Appbar,
  DefaultTheme,
  Provider,
  Surface,
  ThemeProvider,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

interface TodoItemProps {
  item: Todo;
}

// const controlSelectState = useSelectState();
const commuterList = [
  {
    label: "Stanley",
    value: "1",
  },
  {
    label: "Eddie",
    value: "2",
  },
  {
    label: "Nathan",
    value: "3",
  },
];

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [commuter, setCommuter] = useState<string>();
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
          label={"Commuter"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={commuter}
          setValue={setCommuter}
          list={commuterList}
          activeColor="blue"
          dropDownContainerMaxHeight={200}
          dropDownItemStyle={{ backgroundColor: "white" }}
          dropDownItemSelectedStyle={{ backgroundColor: "white" }}
          dropDownItemTextStyle={{ backgroundColor: "white" }}
          theme={{
            colors: {
              background: "white", // Customize the primary color
            },
          }}
        />
        {/* TODO: implement character selection */}
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          //   paddingHorizontal: 50,
        }}
      >
        {/* <Button onPress={() => {}} title="Edit" disabled={true} /> */}

        {/* TODO: Enable this button on release. Quick delete is useful */}
        {/* <Button onPress={() => {}} title="Delete" disabled={true} /> */}
        <Button onPress={() => {}} title="Start" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
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
});

export default TodoItem;
