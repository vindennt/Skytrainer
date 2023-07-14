import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<any[]>([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {}, []);

  const addTodo = async () => {
    const doc = await addDoc(collection(FIRESTORE_DB, "todos"), {
      title: todo,
      done: false,
    });
    console.log("~ file: List.tsx.12 ~ addTodo ~ doc:", doc);
    setTodo(""); // reset todo to empty after new one added
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <Button onPress={addTodo} title="Add todo" disabled={todo === ""} />
      </View>
      <Button
        onPress={() => navigation.navigate("Details")}
        title="Open Details"
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center", // center login contents
    alignItems: "center",
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
});
