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

  // const [render, setRender] = useState<boolean>(false);
  const render = useRef<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [canPay, setCanPay] = useState<boolean>(false);

  const [subscription, setSubscription] = useState<Unsubscribe>();

  // Attempt level up
  const levelUp = () => {
    setLoadingData(true);

    if (user && character) {
      const currentLevel = userLevelMapRef.current.get(character.id);
      if (currentLevel) {
        const cost = LEVELUP_COSTS[currentLevel - 1];
        if (money >= cost) {
          // Update local display values
          setMoney(money - LEVELUP_COSTS[currentLevel - 1]);
          userLevelMapRef.current.set(character.id, currentLevel + 1);
          setDisplayedLevel(currentLevel + 1);
          // update cloud data
          stationLevelUp(character.id, money, currentLevel, user.uid);
        }
        // if (await stationLevelUp(character.id, money, currentLevel, user.uid)) {
        //   setMoney(money - LEVELUP_COSTS[currentLevel - 1]);
        //   userLevelMapRef.current.set(character.id, currentLevel + 1);
        //   setDisplayedLevel(currentLevel + 1);
        // }
      }
    } else {
      console.log("Level up failed: user, charcter, or level undefined");
    }
    setLoadingData(false);
  };

  const canLevel = (level: number) => {
    setCanPay(false);
    if (money === -1) {
      console.log("canLevel: money hasnt loaded");
    }
    if (money >= LEVELUP_COSTS[level - 1]) {
      console.log("canLevel: Yes");
      setCanPay(true);
    } else {
      console.log("canLevel: No");
      setCanPay(false);
    }
  };

  // Is only called if user exists
  const setDisplayInfo = async (character: Character, user: User) => {
    console.log("-------SetDisplayInfo for char " + character.name);
    setLoadingData(true);

    if (render.current === false) {
      // if first time settinng a level
      console.log("Render is false, so first time setting display info");
      setDisplayedLevel(character.level);
    }
    setCharacter(character);
    setName(character.name);
    console.log(
      "setDisplayInfo: Selected character: " + getStationName(character.id)
    );

    const level = userLevelMapRef.current.get(character.id);
    if (level !== undefined) {
      console.log("setDisplayInfo: displayed level: " + level);
      setDisplayedLevel(level);
      canLevel(level);
    } else {
      console.log("Level info doesnt exist for " + character);
    }

    setLoadingData(false);
  };

  const getUserCharacterData = async (user: User) => {
    console.log("Running getUserCharacterData");
    if (user) {
      const charQuery = query(
        collection(FIRESTORE_DB, `users/${user.uid}/characters`),
        where("unlocked", "==", true)
      );
      const querySnapshot = await getDocs(charQuery);
      const fetchedChars: Character[] = []; // Array tracking todos of any type, not the same as the const
      await querySnapshot.forEach((doc) => {
        // console.log(doc.data()); // keep doc.data() instead of just doc to log relevant data
        const id = doc.id;
        const level = doc.data().level;
        fetchedChars.push({
          id: id,
          name: getStationName(doc.id),
          ...doc.data(),
        } as Character); // necessary line to pass typecheck
        // Create local cache for faster rendering
        userLevelMapRef.current.set(id, level);
      });
      // Set Default char
      if (fetchedChars.length > 0) {
        console.log("getUserCharacterData calling setUnlockedCharList");
        setUnlockedCharList(fetchedChars); // set displayed list to fetched array for rendering GridSelector
        const defaultSelectionChar = fetchedChars[0];
        console.log("getUserCharacterData calling setDisplayInfo");
        setDisplayInfo(defaultSelectionChar, user);
      } else {
        console.log("Team: empty Unlocked char list ");
      }
    } else {
      console.log("getUserCharacterData: no user");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("Team screen: " + user.uid + " is currently logged in");
        if (!render.current) {
          getUserCharacterData(user);
          render.current = true;

          const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);
          const fetchMoney = async () => {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              const money = docSnap.data().money;
              console.log("Fetched money: " + money);
              setMoney(money);
              // setRender(true);
            } else {
              console.log("Money fetch docsnap doesnt exist!");
            }
          };
          fetchMoney();
        }
      }
    });
  }, [auth]);

  // useEffect(() => {
  //   if (character && user) {
  //     // canLevel(displayedLevel);
  //     setDisplayInfo(character, user); // TODO: turnign this off removes al ot of repeate calls, but also allows it to revert to waterfront
  //   }
  // }, [displayedLevel]);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return render ? (
    <View style={styles.container}>
      <View style={styles.scrollbarContainer}>
        <GridSelector
          characters={unlockedCharList}
          columns={1}
          onSelect={(item) => {
            if (user) {
              // setCharacter(item);
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
            // disabled={!canUpgrade || loadingData}
            disabled={displayedLevel >= 40 || loadingData || !canPay}
            loading={loadingData}
            style={styles.button}
            mode="contained"
            buttonColor="orange"
            labelStyle={{ fontSize: 20 }} // icon size
            onPressOut={() => {
              levelUp();
            }}
          >
            <Text style={styles.text}>
              {displayedLevel >= 40 ? "MAX" : LEVELUP_COSTS[displayedLevel - 1]}{" "}
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
