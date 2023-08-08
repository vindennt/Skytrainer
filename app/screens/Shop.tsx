import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { IconButton, Button as PaperButton } from "react-native-paper";
import {
  unlockStation,
  giveFragment,
  coinPurchase,
} from "../../utils/UnlockHandler";
import Popup from "../../utils/Popup";

type Buyable = {
  name: string;
  cost: number;
  itemid: string;
};

const shopItems: Buyable[] = [
  { name: "Waterfront", cost: 10, itemid: "001" },
  { name: "Burrard", cost: 10, itemid: "002" },
  { name: "Granville", cost: 10, itemid: "003" },
  { name: "Stadium-Chinatown", cost: 10, itemid: "004" },
  { name: "Main Street - ScienceWorld", cost: 10, itemid: "005" },
  { name: "Commercial-Broadway", cost: 10, itemid: "006" },
  { name: "Nanaimo", cost: 10, itemid: "008" },
  { name: "29th Avenue", cost: 10, itemid: "007" },
  { name: "Joyce-Collingwood", cost: 10, itemid: "009" },
  { name: "Patterson", cost: 10, itemid: "010" },
  { name: "Metrotown", cost: 10, itemid: "011" },
  { name: "Royal Oak", cost: 10, itemid: "012" },
  { name: "Edmonds", cost: 10, itemid: "013" },
  { name: "22nd Street", cost: 10, itemid: "014" },
  { name: "New Westminister", cost: 10, itemid: "015" },
  { name: "Columbia", cost: 10, itemid: "016" },
  { name: "Scott Road", cost: 10, itemid: "017" },
  { name: "Gateway", cost: 10, itemid: "018" },
  { name: "Surrey Central", cost: 10, itemid: "019" },
  { name: "King George", cost: 10, itemid: "020" },
  { name: "Sapperton", cost: 10, itemid: "021" },
  { name: "Braid", cost: 10, itemid: "022" },
  { name: "Lougheed Town Centre", cost: 10, itemid: "023" },
  { name: "Production Way University", cost: 10, itemid: "024" },
  { name: "VCC Clark", cost: 10, itemid: "025" },
  { name: "Renfrew", cost: 10, itemid: "026" },
  { name: "Rupert", cost: 10, itemid: "027" },
  { name: "Gilmore", cost: 10, itemid: "028" },
  { name: "Brentwood Town Centre", cost: 10, itemid: "029" },
  { name: "Holdom", cost: 10, itemid: "030" },
  { name: "Sperling Burnaby Lake", cost: 10, itemid: "031" },
  { name: "Lake City", cost: 10, itemid: "032" },
  { name: "Burquitlam", cost: 10, itemid: "033" },
  { name: "Moody Centre", cost: 10, itemid: "034" },
  { name: "Inlet Centre", cost: 10, itemid: "035" },
  { name: "Coquitlam Central", cost: 10, itemid: "036" },
  { name: "Lincoln", cost: 10, itemid: "037" },
  { name: "Lafarge Lake Douglas", cost: 10, itemid: "038" },
  { name: "Vancouver City Centre", cost: 10, itemid: "039" },
  { name: "Yaletown Roundhouse", cost: 10, itemid: "040" },
  { name: "Olympic Village", cost: 10, itemid: "041" },
  { name: "Broadway City Hall", cost: 10, itemid: "042" },
  { name: "King Edward", cost: 10, itemid: "043" },
  { name: "Oakridge 41stAve", cost: 10, itemid: "044" },
  { name: "Langara 49th Ave", cost: 10, itemid: "045" },
  { name: "Marine Drive", cost: 10, itemid: "046" },
  { name: "Bridgeport", cost: 10, itemid: "047" },
  { name: "Aberdeen", cost: 10, itemid: "048" },
  { name: "Lansdowne", cost: 10, itemid: "049" },
  { name: "Richmond Brighouse", cost: 10, itemid: "050" },
  { name: "Templeton", cost: 10, itemid: "052" },
  { name: "Sea Island Centre", cost: 10, itemid: "051" },
  { name: "YVR Airport", cost: 10, itemid: "053" },
];

const Shop = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");
  const [money, setMoney] = useState(0);
  const [gems, setGems] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [canBuy, setCanBuy] = useState<boolean>(true);

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
    });
    return () => unsub();
  }, [auth, displayName, uid, money]);

  const renderItem = ({ item }: { item: Buyable }) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <PaperButton
          disabled={!canBuy}
          compact={true}
          icon="cash-multiple"
          style={styles.button}
          mode="elevated"
          textColor="black"
          labelStyle={{ fontSize: 16 }}
          buttonColor="whitesmoke"
          onPressIn={async () => {
            try {
              setCanBuy(false);
              await coinPurchase(
                item.itemid,
                uid,
                money,
                item.cost,
                unlockStation
              );
              handleButtonClick("Purchase success!");
            } catch (error: unknown) {
              console.log(error);
              if (error instanceof Error) {
                handleButtonClick(error.message);
              } else {
                throw new Error("Unexpected error occurred");
              }
            }
          }}
        >
          <Text style={styles.text}>{item.cost}</Text>
        </PaperButton>
      </View>
    );
  };

  const handleButtonClick = (text: string) => {
    setPopupText(text);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setCanBuy(true);
    setShowPopup(false);
  };

  return (
    <View style={styles.container}>
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
      <SafeAreaView style={styles.shopContainer}>
        <FlatList
          data={shopItems}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{
            alignItems: "center",
            // flex: 1,
            justifyContent: "space-between",
            alignContent: "space-between",
            flexGrow: 1,
            margin: 5,
            // width: "50%",
          }}
          renderItem={renderItem}
        />
        <Popup
          visible={showPopup}
          text={popupText}
          onClose={handleClosePopup}
        />
      </SafeAreaView>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
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
    // flex: 1,
    // backgroundColor: "pink",
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
