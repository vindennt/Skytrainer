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
import {
  MISSIONS,
  MissionInfo,
  resetMissions,
} from "../../utils/MissionHandler";
import Navbar, { RouterProps } from "../../components/Navbar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

// const startTrip = (todo: Todo, character: Character | undefined): void => {
//   console.log(
//     "Trip for todo " + todo.title + " started with character " + character
//   );
// };

const Index = ({ navigation }: RouterProps) => {
  return <Navbar navigation={navigation}></Navbar>;
};

export default Index;

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
