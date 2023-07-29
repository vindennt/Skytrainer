// Todo list modified from Simon Grimm Tutorial: https://www.youtube.com/watch?v=TwxdOFcEah4

import OPENWEATHER_API_KEY from "../../api/apikey"; //TODO:  Set up rate limits and proxy server at deployment
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { NavigationProp } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
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
import { Entypo } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated from "react-native-reanimated";

const METRO_VANCOUVER_COORDINATES = {
  latitude: 49.232937,
  longtidute: -123.0299,
};

// Interface for Todo data structure
export interface Todo {
  title: string;
  done: boolean;
  id: string;
  time: number;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const setTimer = () => {};

const Home = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<Todo[]>([]); // Displayed list of todos
  const [todo, setTodo] = useState(""); // Set todo from user input
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");
  const bottomSheetModalRef = useRef<any>(null);
  const snapPoints = ["45%"]; // size of modal
  const [item, setItem] = useState<Todo>({
    title: "default",
    done: false,
    id: "0",
    time: 0,
  }); // Will be a ToDo that gets rendered in the modal
  const [isOpen, setIsOpen] = useState(false); // Modal open state

  const [weather, setWeather] = useState<null | any>();
  const fetchWeather = async () => {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${METRO_VANCOUVER_COORDINATES.latitude}&lon=${METRO_VANCOUVER_COORDINATES.longtidute}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const weather = (await data.json()) as any;
    setWeather(weather);
    // navigation.setOptions({
    //   title: weather?.weather[0].main + Math.trunc(weather?.main.temp) + "°C ",
    // });
    navigation.setOptions({ headerTitle: () => <HomeHeader /> });
  };
  function HomeHeader() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.nameBox}>Welcome {displayName}</Text>
        <View style={styles.weatherBox}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`,
            }}
          />
          <Text style={{ color: "white" }}>
            {weather?.weather[0].main}, {Math.trunc(weather?.main.temp)}
            °C
          </Text>
        </View>
      </View>
    );
  }
  const [range, setRange] = useState(25);
  const [sliding, setSliding] = useState("Inactive");

  useEffect(() => {
    fetchWeather();
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
    if (canAddToDo()) {
      const title = todo;
      setTodo(""); // reset todo to empty after new one added
      await addDoc(collection(FIRESTORE_DB, `todos/${uid}/todos`), {
        title: title,
        done: false,
        time: range,
      });
      console.log("added todo: " + todo);
      // canAddTodo = true;
    }
  };

  const canAddToDo = () => {
    if (todo === "" || range === 0) {
      return false;
    }
    // canAddTodo = false;
    return true;
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

    const handlePresentModal = () => {
      // setIsOpen(true);
      bottomSheetModalRef?.current?.present();
      setItem(item);
      console.log("set item as : " + item.title);
      setTimeout(() => {
        setIsOpen(true);
      }, 100);
    };

    return (
      <View style={styles.todosContainer}>
        <TouchableOpacity
          onPress={(item) => handlePresentModal()}
          style={styles.todo}
        >
          {item.done && (
            <Ionicons name="md-checkmark-circle" size={30} color="green" />
          )}
          {!item.done && <Entypo name="circle" size={32} color="black" />}

          <Text style={styles.todosText}>
            {item.title + ", " + item.time + " mins"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteItem}>
          <Ionicons name="trash-bin-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: isOpen ? "lightgray" : "gainsboro" },
        ]}
      >
        <View style={styles.container}>
          {/* <Button onPress={() => navigation.navigate("Gacha")} title="Gacha" />
      <Button onPress={() => navigation.navigate("Shop")} title="Shop" />
      <Button onPress={() => navigation.navigate("Team")} title="Team" /> */}
          <Button
            onPress={() => navigation.navigate("Account")}
            title="Account"
          />
          <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
          <View style={styles.setTodoContainer}>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="New task"
                onChangeText={(text: string) => setTodo(text)}
                value={todo}
              />
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{range + " mins"}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={120}
                lowerLimit={0}
                upperLimit={120}
                value={25} // initial value
                step={5}
                minimumTrackTintColor="#085cac"
                maximumTrackTintColor="silver"
                tapToSeek={true}
                thumbTintColor="#085cac"
                onValueChange={(value) => {
                  setRange(value);
                  // console.log(value);
                }}
                onSlidingStart={() => setSliding("Sliding")}
                onSlidingComplete={() => setSliding("Inactive")}
              ></Slider>
            </View>
            {/* <Text style={styles.timer}>{sliding}</Text> */}

            <Button
              onPress={addTodo}
              title="Add task"
              disabled={!canAddToDo()}
            />
          </View>
          {todos.length == 0 && (
            <View style={styles.blankflatList}>
              <Text style={{ fontSize: 20, color: "white" }}>
                All tasks finished
              </Text>
            </View>
          )}
          {todos.length > 0 && (
            <View
              style={{
                borderRadius: 12,
                backgroundColor: "#ffdd25",
              }}
            >
              <FlatList
                style={styles.flatList}
                data={todos}
                renderItem={renderTodo}
                // renderItem={({ item }) => <Text>{item.title}</Text>}
                keyExtractor={(item: Todo) => item.id}
              />
            </View>
          )}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 30 }}
            onDismiss={() => setIsOpen(false)}
          >
            <Text>{item.title + item.done + item.time}</Text>
          </BottomSheetModal>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    borderColor: "whitesmoke",
    padding: 10,
    marginVertical: 10,
    // backgroundColor: "#fff",
    backgroundColor: "whitesmoke",
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
  tinyLogo: {
    width: 30,
    height: 30,
    // alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    marginRight: 10,
  },
  weatherBox: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    // paddingHorizontal: 10,
    paddingRight: 30,
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 5,
  },
  slider: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
  },
  timerContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  setTodoContainer: {
    // padding: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  nameBox: {
    alignItems: "center",
    // backgroundColor: "orange",
    color: "white",
  },
  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
    flex: 1,
  },
  flatList: {
    // minHeight: "20%",
    height: 150,
    paddingVertical: 2,
    paddingHorizontal: 5,
    flexGrow: 0,
    borderRadius: 12,
    elevation: 5,
    // backgroundColor: "#ffdd25",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  shadow: {
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  blankflatList: {
    // maxHeight: "20%",
    height: 40,
    backgroundColor: "lightsteelblue",
    paddingHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
