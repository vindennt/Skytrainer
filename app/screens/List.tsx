import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<any[]>([]); // Displayed list of todos
  const [todo, setTodo] = useState(""); // Set todo from user input

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, "todos"); // refer to todos collection in firestore
    const subscriber = onSnapshot(todoRef, {
      // observer
      next: (snapshot) => {
        console.log("UPDATING DISPLAYED TODOS");
        const todos: any[] = []; // Array tracking todos of any type
        snapshot.docs.forEach((doc) => {
          console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
          todos.push({
            id: doc.id,
            ...doc.data(), // ... means repeat for all data from doc.data
          });
        });
        setTodos(todos); // set displayed list to fetched array
        console.log("FINISHED UPDATING DISPLAYED TODOS");
      },
    });

    return () => subscriber(); // Remove subscription to clear it
  }, []);

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
