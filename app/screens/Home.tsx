// Todo list modified from Simon Grimm Tutorial: https://www.youtube.com/watch?v=TwxdOFcEah4

import TRANSLINK_API_KEY from "../../apikey"; //TODO:  Set up rate limits and proxy server at deployment
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
import Gacha from "./Gacha";
import Shop from "./Shop";
import Team from "./Team";
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

const fiveMinuteTimer = () => {};
const tenMinuteTimer = () => {};
const thirtyMinuteTimer = () => {};
const sixtyMinuteTimer = () => {};

const Home = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<Todo[]>([]); // Displayed list of todos
  const [todo, setTodo] = useState(""); // Set todo from user input
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");

  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.translink.ca/rttiapi/v1/buses?apikey=${TRANSLINK_API_KEY}&routeNo=099`,
      {
        headers: {
          Accept: "application/JSON", // Specify JSON in the Accept header
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setApiData(data));
    console.log("-----------Start of call");
    console.log(apiData);
    console.log("-----------End of call");

    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName);
        console.log(
          uid + " with name " + displayName + " is currently logged in"
        );
      }
    });

    const todoRef = collection(FIRESTORE_DB, `todos/${uid}/todos`); // refer to todos collection in firestore
    const subscriber = onSnapshot(todoRef, {
      // observer
      next: (snapshot) => {
        // console.log("UPDATING DISPLAYED TODOS");
        const fetchedtodos: Todo[] = []; // Array tracking todos of any type, not the same as the const
        snapshot.forEach((doc) => {
          console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
          fetchedtodos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo); // necessary line to pass typecheck
        });
        setTodos(fetchedtodos); // set displayed list to fetched array
        // console.log("FINISHED UPDATING DISPLAYED TODOS");
      },
    });
    return () => subscriber(); // Remove subscription to clear it
  }, [auth, displayName, uid]);

  const addTodo = async () => {
    await addDoc(collection(FIRESTORE_DB, `toddasdaos/${uid}/todos`), {
      title: todo,
      done: false,
    });
    setTodo(""); // reset todo to empty after new one added
    console.log("added todo: " + todo);
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

      <Button onPress={fiveMinuteTimer} title="5 min" />
      <Button onPress={tenMinuteTimer} title="10 min" />
      <Button onPress={thirtyMinuteTimer} title="30 min" />
      <Button onPress={sixtyMinuteTimer} title="60 min" />

      {/* <Button onPress={() => navigation.navigate("Gacha")} title="Gacha" />
      <Button onPress={() => navigation.navigate("Shop")} title="Shop" />
      <Button onPress={() => navigation.navigate("Team")} title="Team" />
      <Button onPress={() => navigation.navigate("Account")} title="Account" /> */}
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    padding: 10,
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
