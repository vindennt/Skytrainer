import { imageBustMap } from "@src/utils/imageMappings";
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  Alert,
} from "react-native";
import { useTheme, Text, Title, Button } from "react-native-paper";
import { shopData, Buyable } from "@src/utils/shop";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import {
  UpdateNumericalBalanceRequest,
  UpdateUserRequest,
  updateBalance,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import {
  StationUnlockRequest,
  unlockStation,
} from "@src/features/stations/stationsSliceHelpers";
import { StationsState } from "@src/features/stations/stationsSlice";
import { useState } from "react";

interface ProductCard {
  item: Buyable;
  onPurchase: () => void;
}

export const ProductCard: React.FC<ProductCard> = ({ item, onPurchase }) => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const balance: number = useSelector(
    (state: { user: UserState }) => state.user.balance
  );
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const [loading, setLoading] = useState<boolean>(false);

  const canBuy: boolean = balance - item.cost >= 0;

  const handlePurchase = () => {
    setLoading(true);
    const newBalance = balance - item.cost;
    if (newBalance < 0) {
      throw new Error(
        "ProductCard: " + balance + " cannot afford cost " + item.cost
      );
    }
    const balanceUpdateRequest: UpdateUserRequest = {
      session: session,
      update: { balance: newBalance },
    };
    const unlockRequest: StationUnlockRequest = {
      session: session,
      stationId: item.itemid,
    };
    dispatch(updateUserData(balanceUpdateRequest));
    dispatch(unlockStation(unlockRequest));
    Alert.alert("Purchase success!");
    onPurchase();
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const imageSource: ImageSourcePropType = imageBustMap[
    item.itemid
  ] as ImageSourcePropType;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.bottomText}>
        <View style={styles.price}>
          <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
          <Text style={styles.priceText}>{item.cost}</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {
            console.log("Pressed Buy");
            handlePurchase();
          }}
          disabled={!canBuy || loading}
          loading={loading}
        >
          BUY
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingHorizontal: 30,
    // margin: 20,
    // padding: 30,
    // height: 300,
    height: "80%",
    // width: "90%",
    // width: 150,
    // flex: 1,
    // flexWrap: "wrap",
  },
  image: {
    // flex: 1,
    borderRadius: 18,
    width: 300,
    // height: 400,
    height: "80%",
    // backgroundColor: "gray",
  },
  productName: {
    marginTop: 22,
    fontSize: 16,
    fontWeight: "600",
    // position: "absolute",

    // top: 167,
    // left: 26,
  },
  price: {
    // marginTop: 78,
    marginTop: 22,
    flexDirection: "row",
    // fontWeight: "bold",
  },
  priceText: {
    marginLeft: 6,
    fontSize: 16,
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
