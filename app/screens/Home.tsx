// Todo list modified from Simon Grimm Tutorial: https://www.youtube.com/watch?v=TwxdOFcEah4

import OPENWEATHER_API_KEY from "../../api/apikey"; //TODO:  Set up rate limits and proxy server at deployment
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import {
  View,
  Text,
  Button as Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { IconButton, Button as PaperButton, Badge } from "react-native-paper";
import Moment from "react-moment";
import "moment-timezone";
import { useCallback } from "react";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { NavigationProp } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import TripMenu from "../../components/TripMenu";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import Popup from "../../components/Popup";
import { MISSIONS, MissionInfo } from "../../utils/MissionHandler";

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

// const startTrip = (todo: Todo, character: Character | undefined): void => {
//   console.log(
//     "Trip for todo " + todo.title + " started with character " + character
//   );
// };

const Home = ({ navigation }: RouterProps) => {
  const [todos, setTodos] = useState<Todo[]>([]); // Displayed list of todos
  const [todo, setTodo] = useState(""); // wSet todo from user input
  // Firebase/store
  const [user, setUser] = useState<User>();
  const auth = FIREBASE_AUTH;

  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");
  const [money, setMoney] = useState(0);
  const [gems, setGems] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  // Ui compoennts
  const isFocused = useIsFocused();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [range, setRange] = useState(25);
  const [sliding, setSliding] = useState("Inactive");
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [missionBadge, setMissionBadge] = useState(true); // Mission badge visible? False if all missions are done
  const [popupVisible, setPopupVisible] = useState(false); // Mission badge visible? False if all missions are done
  const slider = {
    min: 0,
    max: 300,
    proportion: 120,
    visualStep: 1,
    step: 5,
  };
  const sliderInitial: number = (25 / slider.proportion) * slider.max;

  const [item, setItem] = useState<Todo>({
    title: "default",
    done: false,
    id: "0",
    time: 0,
  });
  const [weather, setWeather] = useState<null | any>();

  const fetchWeather = async () => {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${METRO_VANCOUVER_COORDINATES.latitude}&lon=${METRO_VANCOUVER_COORDINATES.longtidute}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const weather = (await data.json()) as any;
    setWeather(weather);
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

  const MissionPopup = () => {
    const renderItem = ({ item }: { item: MissionInfo }) => (
      <View
        style={[
          styles.container,
          {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <Text style={[styles.text, { marginRight: 30 }]}>
          {item.description}{" "}
        </Text>
        <View>
          {item.condition !== -1 && (
            <Text style={styles.text}>
              {item.progress}/{item.condition}
            </Text>
          )}
          {item.condition === -1 && (
            <Text style={styles.text}>{item.progress}</Text>
          )}
        </View>
      </View>
    );

    return (
      <View style={{ maxHeight: 300, width: "100%" }}>
        <FlatList
          data={[...MISSIONS.values()]} // Convert map values to an array
          renderItem={renderItem}
          keyExtractor={(item) => item.description} // You can use a unique identifier here
        />
      </View>
    );
  };

  useEffect(() => {
    fetchWeather();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUid(user.uid);
        setDisplayName(user.displayName);
        console.log(
          "Home: " +
            uid +
            " with name " +
            displayName +
            " is currently logged in"
        );
      }
    });

    // Fetch Todo list
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

    // Fetch money and gems
    const userRef = doc(FIRESTORE_DB, `users/${uid}`);
    const unsub = onSnapshot(userRef, (doc) => {
      console.log("Home: Money fetch user: ", doc.data());
      const userData = doc.data();
      setMoney(userData?.money);
      setGems(userData?.gems);
    });
    return () => {
      unsub();
      subscriber();
    };
  }, [auth, money]);

  const canAddToDo = () => {
    if (todo === "" || range === 0) {
      return false;
    }
    // canAddTodo = false;
    return true;
  };

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

  // fn to display todos from fetched list
  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${uid}/todos/${item.id}`); // reference to single item

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    const handlePresentModal = () => {
      // setIsOpen(true);
      bottomSheetModalRef?.current?.present();
      setItem(item);
      // console.log("set item as : " + item.title);
      setTimeout(() => {
        setIsOpen(true);
      }, 100);
    };

    return (
      <View style={styles.todosContainer}>
        <TouchableOpacity
          onPress={() => handlePresentModal()}
          style={styles.todo}
        >
          <Text style={styles.todosText}>
            {item.title + ", " + item.time + " mins"}
          </Text>
          {/* </Button> */}
        </TouchableOpacity>
        <IconButton
          icon="trash-can-outline"
          onPress={deleteItem}
          size={20}
          iconColor="red"
        />
      </View>
    );
  };

  // renders
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        // style={{ containerAnimatedStyle }}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}
        animatedIndex={{ value: 1 }}
        {...props}
      />
    ),
    []
  );

  // TODO: This is just sample unlocking method
  const unlockWaterfront = async () => {
    console.log("unlokcing waterfront");
    const date = moment().utcOffset("-08:00").format();
    // setCurrentDate(date + "/" + month + "/" + year);
    await setDoc(doc(FIRESTORE_DB, "users", uid, "characters", "001"), {
      level: 1,
      fragments: 0,
      unlocked: true,
      dateUnlocked: date,
    });
  };

  const closeModal = () => {
    bottomSheetModalRef?.current?.close();
  };

  return (
    <BottomSheetModalProvider>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        // accessible={false}
      >
        <View style={[styles.container]}>
          <View style={styles.currencyContainer}>
            <PaperButton
              icon="cash-multiple"
              style={styles.button}
              mode="outlined"
              textColor="gray"
              labelStyle={{ fontSize: 20 }} // icon size
            >
              <Text style={styles.text}>{money}</Text>
            </PaperButton>
            <PaperButton
              icon="diamond-stone"
              style={styles.button}
              mode="outlined"
              textColor="royalblue"
              labelStyle={{ fontSize: 20 }} // icon size
            >
              <Text style={styles.text}>{gems}</Text>
            </PaperButton>
          </View>

          <Button
            onPress={() => navigation.navigate("Account")}
            title="Account"
          />
          <Button onPress={() => navigation.navigate("Team")} title="Team" />
          <Button onPress={() => navigation.navigate("Shop")} title="Shop" />
          <Button onPress={() => navigation.navigate("Gacha")} title="Gacha" />
          <View>
            <Button onPress={() => setPopupVisible(true)} title="Missions" />
            <Badge visible={missionBadge} size={10} style={styles.badge} />
          </View>

          <View style={styles.setTodoContainer}>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="New task"
                onChangeText={(text: string) => setTodo(text)}
                value={todo}
                maxLength={35}
              />
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{range + " mins"}</Text>
              <Slider
                style={styles.slider}
                minimumValue={slider.min}
                maximumValue={slider.max}
                lowerLimit={slider.min}
                upperLimit={slider.max}
                value={sliderInitial} // initial value
                step={slider.visualStep}
                minimumTrackTintColor="#085cac"
                maximumTrackTintColor="silver"
                tapToSeek={true}
                thumbTintColor="#085cac"
                onValueChange={(value) => {
                  const newValue =
                    Math.round(
                      ((value / slider.max) * slider.proportion) / slider.step
                    ) * slider.step;
                  setRange(newValue);
                  // console.log(value);
                }}
                onSlidingStart={() => setSliding("Sliding")}
                onSlidingComplete={() => setSliding("Inactive")}
              ></Slider>
              <Button
                onPress={addTodo}
                title="Add task"
                disabled={!canAddToDo()}
              />
              {/* <Button
                style={styles.button}
                disabled={!canAddToDo()}
                onPress={addTodo}
                appearance="ghost"
              >
                Add Task
              </Button> */}
            </View>
            {/* <Text style={styles.timer}>{sliding}</Text> */}
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
                  marginTop: 5,
                }}
              >
                <FlatList
                  style={[
                    styles.flatList,
                    // { backgroundColor: isOpen ? "lightgray" : "#ffdd25" },
                  ]}
                  data={todos}
                  renderItem={renderTodo}
                  // renderItem={({ item }) => <Text>{item.title}</Text>}
                  keyExtractor={(item: Todo) => item.id}
                />
              </View>
            )}
            <Popup
              visible={popupVisible}
              onClose={() => setPopupVisible(false)}
              closeOnTapAnywhere={false}
              closeButtonVisible={true}
            >
              <MissionPopup />
            </Popup>
          </View>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            // snapPoints={snapPoints}
            bottomInset={46}
            detached={true}
            snapPoints={["60%"]}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
              borderRadius: 40,
              marginHorizontal: 20,
            }}
            onDismiss={() => setIsOpen(false)}
          >
            {/* <Text>{item.title + item.done + item.time}</Text> */}
            <TripMenu
              uid={uid}
              item={item}
              user={user}
              // startTrip={startTrip}
              modalCloseMethod={closeModal}
              navigation={navigation}
            ></TripMenu>
          </BottomSheetModal>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheetModalProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
    // backgroundColor: "lightgray", // save my eyes
    alignItems: "center",
  },
  form: {
    minWidth: "100%",
    // flex: 1,

    flexDirection: "row",
  },
  button: {
    margin: 2,
    flexWrap: "wrap",
  },
  text: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "whitesmoke",
    padding: 10,
    margin: 10,
    // marginVertical: 10,
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
    maxHeight: 50,
  },
  todosText: { flex: 1, paddingHorizontal: 4, fontSize: 16 },
  todo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tinyLogo: {
    width: 30,
    height: 30,
    // alignItems: "center",
    // backgroundColor: "li9ghtgray",
    borderRadius: 100,
    marginRight: 10,
  },
  weatherBox: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    // backgroundColor: "green",
    // paddingHorizontal: 10,
    paddingHorizontal: 40,
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 5,
  },
  slider: {
    width: "90%",
    height: 40,
    paddingHorizontal: 10,
  },
  timerContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  setTodoContainer: {
    // padding: 5,

    // padding: 10,
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
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
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
  currencyContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 0,
    backgroundColor: "red",
  },
});
