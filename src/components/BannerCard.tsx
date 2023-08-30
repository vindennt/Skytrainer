import React from "react";
import { useTheme, Card, Text, Button } from "react-native-paper";
import { View, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GradientIcon } from "@components/IconGradient";
import {
  BannerInfo,
  DUPLICATE_LEVEL_RATE,
  LIMITED_CASHBACK_RATE,
  LIMITED_PRICE,
  PERMANENT_CASHBACK_RATE,
  PERMANENT_PRICE,
  Tier,
} from "@utils/gacha";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { gachaRoll } from "@src/features/reward/GachaHandler";
import { useState } from "react";
import { StationsState } from "@src/features/stations/stationsSlice";
import {
  UpdateNumericalBalanceRequest,
  UpdatePityRequest,
  UpdateUserRequest,
  updateBalance,
  updatePity,
  updateTickets,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import {
  StationLevelUpdateRequest,
  StationUnlockRequest,
  levelUpStation,
  unlockStation,
} from "@src/features/stations/stationsSliceHelpers";
import { MAX_LEVEL } from "@src/utils/levels";
import { getStationName, getTier } from "@utils/skytrain";

interface BannerCardProps {
  banner: BannerInfo;
  popupCallback: (rewardId: string) => void;
  popupVisible: boolean;
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
  popupVisible,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  let stations: Map<string, number> = new Map<string, number>();
  stations = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const permanent: boolean = banner.type === "permanent";
  const pity: number = permanent
    ? useSelector((state: { user: UserState }) => state.user.permanent_pity)
    : useSelector((state: { user: UserState }) => state.user.limited_pity);

  const balance: number = permanent
    ? useSelector((state: { user: UserState }) => state.user.balance)
    : useSelector((state: { user: UserState }) => state.user.tickets);
  const price: number = permanent ? PERMANENT_PRICE : LIMITED_PRICE;
  const canBuy: boolean = balance >= price;
  const dateInfo =
    !permanent && banner.startDate !== undefined && banner.endDate !== undefined
      ? getTimeRemaining(banner.startDate, banner.endDate)
      : " ";
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const handleUnlocks = (rewardId: string): number => {
    let excessLevels = 0;
    const currentLevel = stations.get(rewardId);
    if (currentLevel !== undefined) {
      console.log("Station already owned");
      // If pre owned, increment that station's level by DUPLICATE_LEVEL_RATE. For every excess level over MAX, give user cashback
      const newLevel = currentLevel + DUPLICATE_LEVEL_RATE;
      // Calcualte a curency cashback for the user
      if (newLevel > MAX_LEVEL) {
        excessLevels = newLevel - MAX_LEVEL;
      }

      if (currentLevel === MAX_LEVEL) {
        // If already at max level, return
        return excessLevels;
      } else {
        const levelUpdateRequest: StationLevelUpdateRequest = {
          session: session,
          stationId: rewardId,
          newLevel: newLevel > MAX_LEVEL ? MAX_LEVEL : newLevel,
        };
        dispatch(levelUpStation(levelUpdateRequest));
        Alert.alert(
          getStationName(rewardId) +
            " grew from level " +
            stations.get(rewardId) +
            " to level " +
            levelUpdateRequest.newLevel +
            "."
        );
      }

      // If not owned yet, unlock the station
    } else {
      const unlockRequest: StationUnlockRequest = {
        session: session,
        stationId: rewardId,
      };
      dispatch(unlockStation(unlockRequest));
    }
    return excessLevels;
  };

  const handlePressBuy = () => {
    if (isRolling) {
      Alert.alert("Please wait until the current roll is finished");
      return;
    }
    setIsRolling(true);
    console.log("Starting Gacha roll");
    if (balance - price < 0) {
      throw new Error(
        "BannerCard: " + balance + " cannot afford cost " + price
      );
    }
    const rewardId: string = gachaRoll(pity);

    // (1/4) Handle unlocks
    // For every excess level, return some cashback to corresponding currency
    const excessLevels: number = handleUnlocks(rewardId);
    // (2/4) Handle  money updates
    const balanceAdjusment: number = permanent
      ? excessLevels * PERMANENT_CASHBACK_RATE
      : excessLevels * LIMITED_CASHBACK_RATE;
    const newBalance = balance - price + balanceAdjusment;
    let balanceUpdateRequest: UpdateUserRequest = {
      session: session,
      update: permanent ? { balance: newBalance } : { tickets: newBalance },
    };
    // (3/4) Handle pity updates
    const rewardTier: string = getTier(rewardId);
    const newPity: number = rewardTier === Tier.FIVE_STAR ? 0 : pity + 1;
    balanceUpdateRequest = {
      ...balanceUpdateRequest,
      update: permanent
        ? { permanent_pity: newPity, ...balanceUpdateRequest.update }
        : { limited_pity: newPity, ...balanceUpdateRequest.update },
    };
    // (4/4) dispatch changes to redux and server
    dispatch(updateUserData(balanceUpdateRequest));

    if (balanceAdjusment > 0)
      Alert.alert(
        "Returned " + balanceAdjusment + " currency points as cashback"
      );

    popupCallback(rewardId);
    console.log(rewardId);
    setTimeout(() => {
      setIsRolling(false);
    }, 500);
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
            disabled={!canBuy || isRolling || popupVisible}
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
