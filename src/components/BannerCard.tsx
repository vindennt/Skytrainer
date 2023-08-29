import { useTheme, Card, Text, Button } from "react-native-paper";
import { View, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GradientIcon } from "@components/IconGradient";
import { BannerInfo, LIMITED_PRICE, PERMANENT_PRICE } from "@utils/gacha";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { gachaRoll } from "@src/features/reward/GachaHandler";
import { useState } from "react";
import { StationsState } from "@src/features/stations/stationsSlice";
import {
  UpdateNumericalBalanceRequest,
  updateBalance,
  updateTickets,
} from "@src/features/user/userSliceHelpers";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import {
  StationUnlockRequest,
  unlockStation,
} from "@src/features/stations/stationsSliceHelpers";

interface BannerCardProps {
  banner: BannerInfo;
  popupCallback: (rewardId: string) => void;
}

const getTimeRemaining = (startDate: Date, endDate: Date): string => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  return `Time remaining: ${remainingDays} days and ${remainingHours} hours`;
};

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  popupCallback,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const permanent: boolean = banner.type === "permanent";
  const balance: number = !permanent
    ? useSelector((state: { user: UserState }) => state.user.tickets)
    : useSelector((state: { user: UserState }) => state.user.balance);
  const price: number = permanent ? PERMANENT_PRICE : LIMITED_PRICE;
  const canBuy: boolean = balance >= price;
  const dateInfo =
    !permanent && banner.startDate !== undefined && banner.endDate !== undefined
      ? getTimeRemaining(banner.startDate, banner.endDate)
      : " ";
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const handlePressBuy = () => {
    if (isRolling) {
      Alert.alert("Please wait until the current roll is finished");
      return;
    }
    setIsRolling(true);
    console.log("Starting Gacha roll");
    const rewardId: string = gachaRoll(1);

    // Deduct right balance
    const balanceUpdateRequest: UpdateNumericalBalanceRequest = {
      session: session,
      newBalance: balance - price,
    };
    if (permanent) {
      dispatch(updateBalance(balanceUpdateRequest));
    } else {
      dispatch(updateTickets(balanceUpdateRequest));
    }

    // Handle dupes and unlocking
    if (stations.get(rewardId) !== undefined) {
      // handle
    } else {
      // handle
      //   const unlockRequest: StationUnlockRequest = {
      //     session: session,
      //     stationId: rewardId,
      //   };
      //   dispatch(unlockStation(unlockRequest));
    }

    popupCallback(rewardId);
    console.log(rewardId);
    setIsRolling(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.inverseOnSurface },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("@src/public/images/banner_001.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text variant="titleLarge" style={styles.titleText}>
          {banner.title}
        </Text>
        <Text style={[styles.dateText, { color: theme.colors.outline }]}>
          {dateInfo}
        </Text>
        <Text style={styles.subText}>{banner.description}</Text>
        <View style={styles.actionContainer}>
          <View style={styles.price}>
            {permanent ? (
              <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
            ) : (
              <GradientIcon
                name="credit-card-chip"
                size={20}
                colors={["white", "#faa93e", "hotpink", "cyan", "blue"]}
                start={{ x: 0.5, y: 0.15 }}
                end={{ x: 0.9, y: 1 }}
                locations={[0, 0.15, 0.35, 0.7, 1]}
              />
            )}
            <Text style={styles.priceText}>{price.toString()}</Text>
          </View>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handlePressBuy}
            disabled={!canBuy || isRolling}
            loading={isRolling}
          >
            Roll
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    // padding: 22,
    flex: 1,
    width: "100%",
    borderRadius: 12,
  },
  contentContainer: {
    // marginTop: 10,
    padding: 30,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 170,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // height: "10vh",
  },
  imageContainer: {
    // flex: 1,
    // height: "40%",
  },
  titleText: {
    fontWeight: "600",
  },
  subText: {
    marginTop: 20,
    fontSize: 17,
  },
  dateText: {
    marginTop: 5,
    fontSize: 15,
  },
  actionContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    // borderRadius: 12
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
});
