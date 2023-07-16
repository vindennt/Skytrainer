// Todo list modified from Simon Grimm Tutorial: https://www.youtube.com/watch?v=TwxdOFcEah4

import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import { User, onAuthStateChanged } from "firebase/auth";

// Interface for Todo data structure
export interface Todo {
  title: string;
  done: boolean;
  id: string;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<Todo[]>([]); // Displayed list of todos
  const [todo, setTodo] = useState(""); // Set todo from user input
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  const displayName = user ? user.displayName : "none";
  const uid = user ? user.uid : "default";

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, `todos/${uid}/todos`); // refer to todos collection in firestore
    const subscriber = onSnapshot(todoRef, {
      // observer
      next: (snapshot) => {
        console.log("UPDATING DISPLAYED TODOS");
        const fetchedtodos: Todo[] = []; // Array tracking todos of any type, not the same as the const
        snapshot.forEach((doc) => {
          console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
          fetchedtodos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo); // necessary line to pass typecheck
        });
        setTodos(fetchedtodos); // set displayed list to fetched array
        console.log("FINISHED UPDATING DISPLAYED TODOS");
      },
    });

    // const todoRef = collection(FIRESTORE_DB, "todos"); // refer to todos collection in firestore
    // const subscriber = onSnapshot(todoRef, {
    //   // observer
    //   next: (snapshot) => {
    //     console.log("UPDATING DISPLAYED TODOS");
    //     const fetchedtodos: Todo[] = []; // Array tracking todos of any type, not the same as the const
    //     snapshot.docs.forEach((doc) => {
    //       console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
    //       fetchedtodos.push({
    //         id: doc.id,
    //         ...doc.data().todo,
    //       } as Todo); // necessary line to pass typecheck
    //     });
    //     setTodos(fetchedtodos); // set displayed list to fetched array
    //     console.log(fetchedtodos.length);
    //     console.log("FINISHED UPDATING DISPLAYED TODOS");
    //   },
    // });

    return () => subscriber(); // Remove subscription to clear it
  }, []);

  const addTodo = async () => {
    await addDoc(collection(FIRESTORE_DB, `todos/${uid}/todos`), {
      title: todo,
      done: false,
    });
    console.log("added todo: " + todo);
    setTodo(""); // reset todo to empty after new one added

    //   const ref = doc(FIRESTORE_DB, "todos", uid);
    //   const newTodo = { title: todo, done: false };
    //   await updateDoc(ref, {
    //     todos: arrayUnion(newTodo),
    //   });
    //   setTodo(""); // reset todo to empty after new one added
  };

  // fn to display todos from fetched list
  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${uid}/todos/${item.id}`); // reference to single item
    // const ref = doc(FIRESTORE_DB, "todos", uid); // reference to single item

    const setDone = async () => {
      updateDoc(ref, { done: !item.done });
    };

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.todosContainer}>
        <TouchableOpacity onPress={setDone} style={styles.todo}>
          {item.done && (
            <Ionicons name="md-checkmark-circle" size={30} color="green" />
          )}
          {!item.done && <Entypo name="circle" size={32} color="black" />}

          <Text style={styles.todosText}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteItem}>
          <Ionicons name="trash-bin-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Welcome {displayName}</Text>
      {/* <Text>Welcome {displayName}</Text> */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <Button onPress={addTodo} title="Add todo" disabled={todo === ""} />
      </View>
      {todos.length > 0 && (
        <View>
          <FlatList
            data={todos}
            renderItem={renderTodo}
            // renderItem={({ item }) => <Text>{item.title}</Text>}
            keyExtractor={(item: Todo) => item.id}
          />
        </View>
      )}

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
    padding: 10,
    // justifyContent: "center", // center login contents
    // alignItems: "center",
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  todosContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  todosText: { flex: 1, paddingHorizontal: 4 },
  todo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
