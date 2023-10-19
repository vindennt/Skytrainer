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
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import {
  StationUnlockRequest,
  unlockStation,
} from "@src/features/stations/stationsSliceHelpers";
import { StationsState } from "@src/features/stations/stationsSlice";
import { useState } from "react";
import { LINE_ICON, getLineInfo } from "@src/utils/skytrain";
import { BlurView } from "expo-blur";
import { selectDarkTheme } from "@src/navigation/navSlice";

interface ProductCard {
  item: Buyable;
  onPurchase: () => void;
}

export const ProductCard: React.FC<ProductCard> = ({ item, onPurchase }) => {
  const theme = useTheme();
  const isDark = useSelector(selectDarkTheme);
  const dispatch = useDispatch<any>();
  const balance: number = useSelector(
    (state: { user: UserState }) => state.user.balance
  );
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const [loading, setLoading] = useState<boolean>(false);

  const canBuy: boolean = balance - item.cost >= 0;
  const lineInfo = getLineInfo(item.itemid);

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
    <View style={styles.parentContainer}>
      <BlurView intensity={50} tint="dark" style={[styles.container]}>
        <View
          style={[
            styles.innerContainer,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.horizontalContainer}>
            <Icon name={LINE_ICON} size={20} color={lineInfo.colour} />
            <Text style={styles.levelText}>{lineInfo.name}</Text>
          </View>
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
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    marginVertical: "20%",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    // backgroundColor: "gray",
  },
  container: {
    flex: 1,
    // borderRadius: 18,
    // marginTop: 40,
    // padding: 20,
  },
  innerContainer: {
    flex: 1,
    // borderRadius: 18,
    padding: 20,
    // marginTop: 40,
  },
  image: {
    flex: 1,
    // borderRadius: 18,
    width: 300,
    // height: 400,
    // height: "50%",
    // overflow: "hidden",
    // backgroundColor: "gray",
  },
  productName: {
    // marginTop: 22,
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
  levelText: {
    fontSize: 16,
    marginBottom: 10,
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
  horizontalContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 5,
    right: 5,
  },
});
