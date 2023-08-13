import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import {
  IconButton,
  Button as PaperButton,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { unlockStation, coinPurchase } from "../../utils/UnlockHandler";
import Popup from "../../components/Popup";

type Buyable = {
  name: string;
  cost: number;
  itemid: string;
  category: string;
};

const shopItems: Buyable[] = [
  { name: "Waterfront", cost: 10, itemid: "001", category: "00" },
  { name: "Burrard", cost: 1, itemid: "002", category: "00" },
  { name: "Granville", cost: 10, itemid: "003", category: "00" },
  { name: "Stadium-Chinatown", cost: 10, itemid: "004", category: "00" },
  {
    name: "Main Street - ScienceWorld",
    cost: 10,
    itemid: "005",
    category: "00",
  },
  { name: "Commercial-Broadway", cost: 10, itemid: "006", category: "00" },
  { name: "Nanaimo", cost: 10, itemid: "008", category: "00" },
  { name: "29th Avenue", cost: 10, itemid: "007", category: "00" },
  { name: "Joyce-Collingwood", cost: 10, itemid: "009", category: "00" },
  { name: "Patterson", cost: 10, itemid: "010", category: "00" },
  { name: "Metrotown", cost: 10, itemid: "011", category: "00" },
  { name: "Royal Oak", cost: 10, itemid: "012", category: "00" },
  { name: "Edmonds", cost: 10, itemid: "013", category: "00" },
  { name: "22nd Street", cost: 10, itemid: "014", category: "00" },
  { name: "New Westminister", cost: 10, itemid: "015", category: "00" },
  { name: "Columbia", cost: 10, itemid: "016", category: "00" },
  { name: "Scott Road", cost: 10, itemid: "017", category: "00" },
  { name: "Gateway", cost: 10, itemid: "018", category: "00" },
  { name: "Surrey Central", cost: 10, itemid: "019", category: "00" },
  { name: "King George", cost: 10, itemid: "020", category: "00" },
  { name: "Sapperton", cost: 10, itemid: "021", category: "00" },
  { name: "Braid", cost: 10, itemid: "022", category: "00" },
  { name: "Lougheed Town Centre", cost: 10, itemid: "023", category: "00" },
  {
    name: "Production Way University",
    cost: 10,
    itemid: "024",
    category: "00",
  },
  { name: "VCC Clark", cost: 10, itemid: "025", category: "01" },
  { name: "Renfrew", cost: 10, itemid: "026", category: "01" },
  { name: "Rupert", cost: 10, itemid: "027", category: "01" },
  { name: "Gilmore", cost: 10, itemid: "028", category: "01" },
  { name: "Brentwood Town Centre", cost: 10, itemid: "029", category: "01" },
  { name: "Holdom", cost: 10, itemid: "030", category: "01" },
  { name: "Sperling Burnaby Lake", cost: 10, itemid: "031", category: "01" },
  { name: "Lake City", cost: 10, itemid: "032", category: "01" },
  { name: "Burquitlam", cost: 10, itemid: "033", category: "03" },
  { name: "Moody Centre", cost: 10, itemid: "034", category: "03" },
  { name: "Inlet Centre", cost: 10, itemid: "035", category: "03" },
  { name: "Coquitlam Central", cost: 10, itemid: "036", category: "03" },
  { name: "Lincoln", cost: 10, itemid: "037", category: "03" },
  { name: "Lafarge Lake Douglas", cost: 10, itemid: "038", category: "03" },
  { name: "Vancouver City Centre", cost: 10, itemid: "039", category: "02" },
  { name: "Yaletown Roundhouse", cost: 10, itemid: "040", category: "02" },
  { name: "Olympic Village", cost: 10, itemid: "041", category: "02" },
  { name: "Broadway City Hall", cost: 10, itemid: "042", category: "02" },
  { name: "King Edward", cost: 10, itemid: "043", category: "02" },
  { name: "Oakridge 41stAve", cost: 10, itemid: "044", category: "02" },
  { name: "Langara 49th Ave", cost: 10, itemid: "045", category: "02" },
  { name: "Marine Drive", cost: 10, itemid: "046", category: "02" },
  { name: "Bridgeport", cost: 10, itemid: "047", category: "02" },
  { name: "Aberdeen", cost: 10, itemid: "048", category: "02" },
  { name: "Lansdowne", cost: 10, itemid: "049", category: "02" },
  { name: "Richmond Brighouse", cost: 10, itemid: "050", category: "02" },
  { name: "Templeton", cost: 10, itemid: "052", category: "02" },
  { name: "Sea Island Centre", cost: 10, itemid: "051", category: "02" },
  { name: "YVR Airport", cost: 10, itemid: "053", category: "02" },
];

const Shop = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  const [uid, setUid] = useState<string>("default");
  const [money, setMoney] = useState(0);
  const [gems, setGems] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [canBuy, setCanBuy] = useState<boolean>(true);

  const render = useRef<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState("00");
  const filteredShopItems =
    selectedCategory === "All"
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    console.log(render.current);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUid(user.uid);
        console.log(
          "Shop: " +
            user.uid +
            " with name " +
            user.displayName +
            " is currently logged in"
        );

        const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);
        const fetchMoney = async () => {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            render.current = true;
            const money = docSnap.data().money;
            const gems = docSnap.data().gems;
            console.log("Fetched money: " + money);
            console.log("Fetched gems: " + gems);
            setMoney(money);
            setGems(gems);
          } else {
            console.log("Shop: Money fetch docsnap doesnt exist!");
          }
        };
        fetchMoney();
      }
    });
  }, [auth]);

  const handlePurchase = async (item: Buyable) => {
    setCanBuy(false);
    try {
      if (money >= item.cost) {
        handleButtonClick("Purchase success!");
        setMoney(money - item.cost);
        coinPurchase(item.itemid, uid, money, item.cost, unlockStation);
      } else {
        // This should not be reachable since the button should be disabled
        handleButtonClick("Shop: Not enough money");
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        handleButtonClick(error.message);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  };

  const renderItem = ({ item }: { item: Buyable }) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <PaperButton
          // disabled={!canBuy}
          disabled={!canBuy || money < item.cost}
          compact={true}
          icon="cash-multiple"
          style={styles.button}
          mode="contained"
          textColor="black"
          labelStyle={{ fontSize: 16 }}
          buttonColor="whitesmoke"
          onPress={() => handlePurchase(item)}
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

  const ShopTab = ({
    title,
    icon,
    category,
  }: {
    title: string;
    icon: string;
    category: string;
  }) => {
    return (
      <Chip
        style={styles.chip}
        mode="flat"
        onPress={() => setSelectedCategory(category)}
        selected={selectedCategory === category}
        showSelectedOverlay={true}
        compact={true}
      >
        {title}
      </Chip>
    );
  };

  return render.current ? (
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
      <SafeAreaView style={styles.container}>
        <ScrollView
          horizontal
          style={{
            flexDirection: "row",
            margin: 5,
          }}
        >
          <ShopTab title="All" icon="train" category="All" />
          <ShopTab title="Expo" icon="train" category="00" />
          <ShopTab title="Millenium" icon="train" category="01" />
          <ShopTab title="Canada" icon="train" category="02" />
          <ShopTab title="Evergreen" icon="train" category="03" />
        </ScrollView>
        <FlatList
          data={filteredShopItems}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
        <Popup
          visible={showPopup}
          text={popupText}
          onClose={handleClosePopup}
        />
      </SafeAreaView>
    </View>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={"gray"} size={"large"} />
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
    flex: 1,
    padding: 20,
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
    // maxWidth: "100%",
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
    // height: 120,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "cornflowerblue",
  },
  listContainer: {
    alignItems: "center",
    // justifyContent: "space-between",
    alignContent: "space-between",
    flexGrow: 1,
    margin: 5,
  },
  chip: {
    margin: 5,
    backgroundColor: "gold",
  },
});
