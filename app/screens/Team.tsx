import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { IconButton, Button as PaperButton } from "react-native-paper";
import { getStationName } from "../../utils/SKYTRAIN_DATA";
import Popup from "../../utils/Popup";
import { Reward, Tier, gachaRoll } from "../../utils/GachaHandler";
import {
  gachaPurchase,
  giveFragment,
  unlockStation,
} from "../../utils/UnlockHandler";
import moment from "moment";
import { Character } from "../../utils/TripMenu";
import GridSelector from "../../utils/GridSelector";

const Team = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");
  const isFocused = useIsFocused();
  const [money, setMoney] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [colour, setColour] = useState<string>("red");
  const [unlockedCharList, setUnlockedCharList] = useState<Character[]>([]);

  // var unlockedCharList: Character[] = [];
  const [character, setCharacter] = useState<string>("001");
  const [levelDisplay, setLevelDisplay] = useState<string>("0");
  const [fragmentDisplay, setFragmentDisplay] = useState<string>("0");
  const [unlockedDateDisplay, setUnlockedDateDisplay] = useState<string>("");

  const getUserCharacterData = async () => {
    setUnlockedCharList([]);
    const charQuery = query(
      collection(FIRESTORE_DB, `users/${uid}/characters`),
      where("unlocked", "==", true)
    ); // refer to todos collection in firestore
    const querySnapshot = await getDocs(charQuery);
    await querySnapshot.forEach((doc) => {
      const id: string = doc.id;
      // const stationRef = SKYTRAIN_DATA.STATION_MAP.get(doc.id);
      unlockedCharList.push({
        level: doc.data().level,
        id: id,
        name: getStationName(id), // Name of station from the map
      } as Character);
    });

    // if (unlockedCharList[0].name !== undefined) {
    //   setCharacter(unlockedCharList[0].name);
    // }
    // console.log("first name: " + unlockedCharList[0].name);
    // console.log("GETTING TEAM DISPLAY");
    // console.log(unlockedCharList);
    // console.log("DONE GETTING TEAM DISPLAY");
  };

  useEffect(() => {
    if (isFocused) {
      getUserCharacterData();
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUid(user.uid);
        setDisplayName(user.displayName);
        console.log(
          uid + " with name " + displayName + " is currently logged in"
        );
      }
    });
    // Fetch money and gems
    const userRef = doc(FIRESTORE_DB, `users/${uid}`);
    const unsub = onSnapshot(userRef, (doc) => {
      console.log("Shop screen: Money fetch: ", doc.data());
      const userData = doc.data();
      setMoney(userData?.money);
      // console.log("Pity: " + pity);
    });
    return () => unsub();
  }, [auth, displayName, uid, isFocused]);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const setDisplayInfo = async (id: string) => {
    console.log("Selected character: " + getStationName(id));
    setCharacter(id);
    const docRef = doc(FIRESTORE_DB, `users/${uid}/characters/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setLevelDisplay(docSnap.data().level);
      setFragmentDisplay(docSnap.data().fragments);
      setUnlockedDateDisplay(docSnap.data().dateUnlocked);
    } else {
      throw new Error("Doc does not exist");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollbarContainer}>
        <GridSelector
          characters={unlockedCharList}
          columns={1}
          onSelect={(item) => {
            setDisplayInfo(item.id);
          }}
        />
      </View>
      <View style={styles.displayContainer}>
        <PaperButton
          icon="cash-multiple"
          style={styles.button}
          mode="outlined"
          textColor="gray"
          labelStyle={{ fontSize: 20 }} // icon size
        >
          <Text style={styles.text}>{money}</Text>
        </PaperButton>

        <View style={styles.nameContainer}>
          <Text style={styles.text}>{getStationName(character)}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Level: {levelDisplay}</Text>
          <Text style={styles.text}>Fragments: {fragmentDisplay}</Text>
        </View>
        <PaperButton
          icon="chevron-double-up"
          disabled={true}
          style={styles.button}
          mode="contained"
          buttonColor="orange"
          labelStyle={{ fontSize: 20 }} // icon size
        >
          <Text style={styles.text}>Level Up</Text>
        </PaperButton>
      </View>
      <Popup
        visible={showPopup}
        text={popupText}
        onClose={handleClosePopup}
        backgroundColour={colour}
      />
    </View>
  );
};

export default Team;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "gray",
    flexDirection: "row",
  },
  button: {
    margin: 15,
    // flexWrap: "wrap",
  },
  currencyContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 16,
  },
  scrollbarContainer: {
    flexWrap: "wrap",
    backgroundColor: "pink",
  },
  displayContainer: {
    // flexWrap: "wrap",
    flex: 1,
    height: "100%",
    backgroundColor: "lightgray",
    alignItems: "center",
    padding: 10,
  },
  nameContainer: {
    // flex: 1,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "lavender",
    justifyContent: "center",
  },
});
