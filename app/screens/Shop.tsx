import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { IconButton, Button as PaperButton } from "react-native-paper";
import moment from "moment";
import { getStationName } from "../../utils/SKYTRAIN_DATA";

type Buyable = {
  name: string;
  cost: number;
  itemid: string;
};

const shopItems: Buyable[] = [
  { name: "Commercial-Broadway", cost: 1, itemid: "006" },
  { name: "Lougheed Town Centre", cost: 5, itemid: "023" },
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

  const unlockStation = async (itemid: string) => {
    console.log("Unlocking " + getStationName(itemid));
    const date = moment().utcOffset("-08:00").format();
    // setCurrentDate(date + "/" + month + "/" + year);
    await setDoc(doc(FIRESTORE_DB, "users", uid, "characters", itemid), {
      level: 1,
      fragments: 0,
      unlocked: true,
      dateUnlocked: date,
    });
  };

  const renderItem = ({ item }: { item: Buyable }) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <PaperButton
          icon="cash-multiple"
          style={styles.button}
          mode="contained"
          textColor="black"
          labelStyle={{ fontSize: 16 }}
          buttonColor="lightgray"
          onPressIn={() => unlockStation(item.itemid)}
        >
          <Text style={styles.text}>{item.cost}</Text>
        </PaperButton>
      </View>
    );
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
    backgroundColor: "pink",
  },
  item: {
    padding: 10,
    margin: 7,
    marginHorizontal: 14,
    borderRadius: 20,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
});
