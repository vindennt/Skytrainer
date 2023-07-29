import React from "react";
// import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Todo } from "../app/screens/Home";
// import DropdownComponent from "../utils/Dropdown";

interface TodoItemProps {
  item: Todo;
}

// const controlSelectState = useSelectState();

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
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
