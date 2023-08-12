import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  useIsFocused,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  Unsubscribe,
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
import { getStationName } from "../../utils/SkytrainData";
import Popup from "../../components/Popup";
import { Reward, Tier, gachaRoll } from "../../utils/GachaHandler";
import {
  stationLevelUp,
  gachaPurchase,
  // giveFragment,
  unlockStation,
} from "../../utils/UnlockHandler";
import moment from "moment";
import { Character } from "../../components/TripMenu";
import GridSelector from "../../components/GridSelector";
import { LEVELUP_COSTS } from "../../utils/UnlockHandler";

const Team = () => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState<User | null>(null);
  // const [uid, setUid] = useState<string>("undefined");

  const [unlockedCharList, setUnlockedCharList] = useState<Character[]>([]);
  const [money, setMoney] = useState(-1);
  const [character, setCharacter] = useState<Character>();
  const [name, setName] = useState<string>("Loading...");
  const [displayedLevel, setDisplayedLevel] = useState(0);
  const userLevelMapRef = useRef<Map<string, number>>(
    new Map<string, number>()
  );

  const [render, setRender] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [canUpgrade, setCanUpgrade] = useState<boolean>(false);

  // Attempt level up
  const levelUp = async () => {
    setCanUpgrade(false);
    setLoadingData(true);

    if (user && character) {
      const currentLevel = userLevelMapRef.current.get(character.id);
      if (currentLevel) {
        setDisplayedLevel(currentLevel + 1);
        userLevelMapRef.current.set(character.id, currentLevel + 1);
        stationLevelUp(character.id, money, currentLevel, user.uid);
      }

      // const docRef = doc(
      //   FIRESTORE_DB,
      //   `users/${user.uid}/characters/${character}`
      // );
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) {
      //   const currentFragments: number = docSnap.data().fragments;
      //   console.log("Attempting level up for " + character);
      // await stationLevelUp(character, money, levelDisplay, uid);
      // setDisplayInfo(character);
      setCanUpgrade(true);
    } else {
      console.log("Level up failed: user, charcter, or level undefined");
      // throw new Error(
      //   "Team menu levelup: Doc does not exist for id " + character
      // );
    }
    setLoadingData(false);
  };

  const canLevel = (level: number) => {
    setCanUpgrade(false);
    if (level === 50) {
      setCanUpgrade(false);
    }
    if (money === -1) {
      console.log("money hasnt even loaded");
    }
    if (money >= LEVELUP_COSTS[level - 1]) {
      setCanUpgrade(true);
    } else {
      setCanUpgrade(false);
    }
  };

  const setDisplayInfo = async (character: Character, user: User) => {
    if (user) {
      setLoadingData(true);
      if (displayedLevel === 0) {
        setDisplayedLevel(character.level);
      }
      setCharacter(character);
      setName(character.name);
      console.log("Team: Selected character: " + getStationName(character.id));

      const level = userLevelMapRef.current.get(character.id);
      if (level) {
        setDisplayedLevel(level);
        canLevel(level);
      } else {
        console.log("Level info doesnt exist for " + character);
      }
    }
    //   const docRef = doc(
    //     FIRESTORE_DB,
    //     `users/${user.uid}/characters/${character.id}`
    //   );
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     const level = docSnap.data().level;
    //     setDisplayedLevel(level);
    //   } else {
    //     console.log("setDisplayInfo docsnap doesnt exist for " + character);
    //   }
    // }
    setLoadingData(false);
  };

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const getUserCharacterData = async (user: User) => {
    if (user) {
      const charQuery = query(
        collection(FIRESTORE_DB, `users/${user.uid}/characters`),
        where("unlocked", "==", true)
      ); // refer to todos collection in firestore
      const newSubscription = onSnapshot(charQuery, {
        // observer
        next: async (snapshot) => {
          // console.log("UPDATING DISPLAYED TODOS");
          const fetchedChars: Character[] = []; // Array tracking todos of any type, not the same as the const
          await snapshot.forEach((doc) => {
            // console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
            const id = doc.id;
            const level = doc.data().level;
            fetchedChars.push({
              id: id,
              name: getStationName(doc.id),
              ...doc.data(),
            } as Character); // necessary line to pass typecheck
            userLevelMapRef.current.set(id, level);
          });
          setUnlockedCharList(fetchedChars); // set displayed list to fetched array
          if (fetchedChars.length > 0) {
            const defaultSelectionChar = fetchedChars[0];
            setDisplayInfo(defaultSelectionChar, user);
          } else {
            console.log("Team: empty Unlocked char list ");
          }
        },
      });
    } else {
      console.log("getUserCharacterData: no user");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("Team screen: " + user.uid + " is currently logged in");
        if (!render) {
          getUserCharacterData(user);
          setRender(true);
        }
      }
    });
  }, [auth]);

  useEffect(() => {
    if (user !== null && render) {
      const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);
      const unsub = onSnapshot(userRef, (doc) => {
        console.log("Team screen: Money fetch: ", doc.data());
        const userData = doc.data();
        setMoney(userData?.money);
        // console.log("Pity: " + pity);
      });
      return () => unsub();
    }

    // if (user !== null && character !== undefined) {
    //   setDisplayInfo(character, user);
    // }
  }, [user, render, money]);

  useEffect(() => {
    canLevel(displayedLevel);
  }, [displayedLevel, money]);

  return render ? (
    <View style={styles.container}>
      <View style={styles.scrollbarContainer}>
        <GridSelector
          characters={unlockedCharList}
          columns={1}
          onSelect={(item) => {
            if (user) {
              setCharacter(item);
              setDisplayInfo(item, user);
            }
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
        <View style={styles.infoContainer}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.text}>Level: {displayedLevel}</Text>
        </View>

        <View style={styles.levelContainer}>
          <PaperButton
            icon="cash-multiple"
            disabled={!canUpgrade || loadingData}
            loading={loadingData}
            style={styles.button}
            mode="contained"
            buttonColor="orange"
            labelStyle={{ fontSize: 20 }} // icon size
            onPressOut={levelUp}
          >
            <Text style={styles.text}>
              {displayedLevel >= 50 ? "MAX" : LEVELUP_COSTS[displayedLevel - 1]}{" "}
              {"  "} Level Up
            </Text>
          </PaperButton>
        </View>
      </View>
      {/* <Popup
        visible={showPopup}
        text={popupText}
        onClose={handleClosePopup}
        backgroundColour={colour}
      /> */}
    </View>
  ) : (
    <Text>Loading</Text>
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
    // backgroundColor: "pink",
  },
  displayContainer: {
    // flexWrap: "wrap",
    flex: 1,
    height: "100%",
    // backgroundColor: "lightgray",
    alignItems: "center",
    padding: 10,
  },
  nameContainer: {
    // flex: 1,
  },
  infoContainer: {
    flex: 1,
    // backgroundColor: "lavender",
    justifyContent: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "pink",
  },
});
