import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { IconButton, Button as PaperButton } from "react-native-paper";
import { getStationName } from "../../utils/SkytrainData";
import Popup from "../../components/Popup";
import { Reward, Tier, gachaRoll } from "../../utils/GachaHandler";
import { gachaPurchase, unlockStation } from "../../utils/UnlockHandler";
import moment from "moment";

type Buyable = {
  name: string;
  cost: number;
  itemid: string;
};

const costPerRoll: number = 1;

const Gacha = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");
  const [money, setMoney] = useState(0);
  const [gems, setGems] = useState(0);
  const [pity, setPity] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("No gacha rolled");
  const [colour, setColour] = useState<string>("red");
  const [canRoll, setCanRoll] = useState<boolean>(true);

  useEffect(() => {
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
      setGems(userData?.gems);
      setPity(userData?.pity);
      // console.log("Pity: " + pity);
    });
    return () => unsub();
  }, [auth, displayName, uid, gems, pity]);

  const handleButtonClick = async () => {
    setCanRoll(false);
    try {
      await gachaPurchase(uid, gems, costPerRoll);
      // if no error is thrown, gems deducted so proceed
      console.log("gacha purchase success");
      const reward: Reward = gachaRoll(pity);
      if (reward.tier === Tier.FOUR_STAR) {
        unlockStation(reward.id, uid);
        setColour("purple");
        updatePity(1);
      } else if (reward.tier === Tier.FIVE_STAR) {
        unlockStation(reward.id, uid);
        setColour("gold");
        updatePity(0);
      }
      //  else {
      //   giveFragment(reward.id, uid);
      //   setColour("white");
      // }
      setPopupText(getStationName(reward.id));
      setShowPopup(true);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        setPopupText(error.message);
        setColour("red");
        setShowPopup(true);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  };

  const handleClosePopup = () => {
    setCanRoll(true);
    setShowPopup(false);
  };

  // updates user's gacha pity data
  const updatePity = (amt: number) => {
    if (amt === 0) {
      updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
        pity: 0,
      });
    } else {
      updateDoc(doc(FIRESTORE_DB, `users/${uid}`), {
        pity: increment(amt),
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        {/* <PaperButton
          icon="cash-multiple"
          style={styles.button}
          mode="outlined"
          textColor="gray"
          labelStyle={{ fontSize: 20 }} // icon size
        >
          <Text style={styles.text}>{money}</Text>
        </PaperButton> */}
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
      <View style={styles.container}>
        <PaperButton
          disabled={!canRoll}
          loading={!canRoll}
          icon="diamond-stone"
          style={styles.button}
          mode="contained"
          buttonColor="royalblue"
          labelStyle={{ fontSize: 20 }} // icon size
          onPress={handleButtonClick}
        >
          <Text>
            {costPerRoll} {"   "} Roll x1
          </Text>
        </PaperButton>
        <Popup
          visible={showPopup}
          onClose={handleClosePopup}
          backgroundColour={colour}
        >
          <Text style={styles.text}>{popupText}</Text>
        </Popup>
      </View>
    </View>
  );
};

export default Gacha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 5,
    flexWrap: "wrap",
  },
  currencyContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 16,
  },
  shopContainer: {
    width: "90%",
    maxWidth: "100%",
    maxHeight: "90%",
  },
  item: {
    padding: 10,
    margin: 7,
    marginHorizontal: 14,
    borderRadius: 20,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "cornflowerblue",
  },
});
