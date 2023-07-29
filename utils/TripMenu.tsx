import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Todo } from "../app/screens/Home";

interface TodoItemProps {
  item: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.overview}>Task Details</Text>
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time + " minutes"}</Text>
        <Text style={styles.time}>Commuter: Eddie</Text>
        {/* <Text style={styles.status}>{item.done ? "Done" : "Not Done"}</Text> */}
        {/* <Text style={styles.id}>{"ID: " + item.id}</Text> */}
      </View>
      <Button onPress={() => {}} title="Start" />
      {/* <Button onPress={() => {}} title="Edit" disabled={true} /> */}
      {/* TODO: implement character selection */}
      <Button onPress={() => {}} title="Change Commuter" disabled={true} />
      {/* TODO: Enable this button on release. Quick delete is useful */}
      <Button onPress={() => {}} title="Delete" disabled={true} />
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
