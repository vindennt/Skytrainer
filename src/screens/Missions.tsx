import { useNavigation } from "@react-navigation/native";
import DailyFocusBox from "@src/components/DailyFocusBox";
import {
  GradientIcon,
  PremiumCurrencyIcon,
} from "@src/components/IconGradient";
import { Popup } from "@src/components/Popup";
import QuickStartCard from "@src/components/QuickStartCard";
import { AuthState } from "@src/features/auth/authSlice";
import { UserState } from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { setMissionBadgeVisibility } from "@src/navigation/navSlice";
import { datesMatch, getTodayDMY } from "@src/utils/dates";
import * as React from "react";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import session from "redux-persist/es/storage/session";

const Missions = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const navigation = useNavigation();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const dailyResetTime: Date = useSelector(
    (state: { user: UserState }) => state.user.daily_reset_time
  );
  const lastFocusDate: Date | null = useSelector(
    (state: { user: UserState }) => state.user.last_focus_date
  );

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [displayedReward, setDisplayedReward] = useState<number>(0);

  const showPopup = (reward: number) => {
    setDisplayedReward(reward);
    setPopupVisible(true);
  };

  const handleDailyFocus = () => {
    const todayDMY: Date = getTodayDMY();

    // if today is a new day, reset daily focus time
    // if (!datesMatch(new Date(lastFocusDate), now)) {
    if (!datesMatch(todayDMY, new Date(lastFocusDate))) {
      console.log("XXXXX NEW DAY: Restting daily missions");
      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          daily_focus_time: 0,
          daily_focus_claimed: 0,
          daily_reset_time: todayDMY,
          last_focus_date: todayDMY,
        },
      };
      dispatch(updateUserData(updateRequest));
    }
  };

  // TODO: Sets a focus date as a prevous date for testing purposes
  const setOldFocusDates = () => {
    const testLastLoginDate = new Date(2023, 7, 1);
    // const testLastLoginDate = new Date();
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        daily_reset_time: testLastLoginDate,
        last_focus_date: testLastLoginDate,
      },
    };
    dispatch(updateUserData(updateRequest));
  };

  useEffect(() => {
    console.log("Mission useEffect");
    // setOldFocusDates();
    handleDailyFocus();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Missions.</Text>
      <DailyFocusBox popupCallback={(reward) => showPopup(reward)} />
      <QuickStartCard />
      <Popup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
        }}
      >
        <View style={styles.rewardContainer}>
          <Text style={styles.headerText}>Claimed Rewards</Text>
          <View style={styles.rewardTextContainer}>
            <PremiumCurrencyIcon />
            <Text style={[styles.text, { marginLeft: 6 }]}>
              {displayedReward}
            </Text>
          </View>
        </View>
      </Popup>
    </View>
  );
};

export default Missions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 8,
    // alignItems: "center",
    // justifyContent: "center",
    padding: 20,
    // backgroundColor: "pink",
  },
  text: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  rewardTextContainer: {
    flexDirection: "row",
  },
  rewardContainer: {
    // backgroundColor: "purple",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
  },
});
