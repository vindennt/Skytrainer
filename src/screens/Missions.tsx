import { useNavigation } from "@react-navigation/native";
import DailyFocusBox from "@src/components/DailyFocusBox";
import { PremiumCurrencyIcon } from "@src/components/IconGradient";
import { Popup } from "@src/components/Popup";
import QuickStartCard from "@src/components/QuickStartCard";
import { AuthState } from "@src/features/auth/authSlice";
import {
  selectDailyResetTime,
  selectLastFocusDate,
  selectFocusStreakDays,
  selectLastUsedStation,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { datesMatch, getTodayDMY, isConsecutiveDay } from "@src/utils/dates";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  UpdateQuickStartRequest,
  updateQuickStart,
} from "@src/features/quickStart/quickStartSliceHelpers";
import {
  selectCurrentQuickstartId,
  setQuickStartId,
} from "@src/features/skytrain/skytrainSlice";
import { setSelectedStation } from "@src/features/stations/stationsSlice";
import { LoadingIndicator } from "@src/components/LoadingIndicator";
import Layout from "@src/components/Layout";

const Missions = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const dailyResetTime: Date = useSelector(selectDailyResetTime);
  const lastFocusDate: Date | null = useSelector(selectLastFocusDate);
  const focusStreakDays: number = useSelector(selectFocusStreakDays);

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [displayedReward, setDisplayedReward] = useState<number>(0);

  const lastUsedStation: string = useSelector(selectLastUsedStation);

  const currentQuickstartId: string | null = useSelector(
    selectCurrentQuickstartId
  );

  const showPopup = (reward: number) => {
    setDisplayedReward(reward);
    setPopupVisible(true);
  };

  const handleDailyFocus = () => {
    const todayDMY: Date = getTodayDMY();
    const isSameFocusDay: boolean = datesMatch(
      todayDMY,
      new Date(lastFocusDate)
    );
    const newStreak: number =
      isSameFocusDay || isConsecutiveDay(new Date(lastFocusDate))
        ? focusStreakDays
        : 0;

    // if today is a new day, reset daily focus time
    // if (!datesMatch(new Date(lastFocusDate), now)) {
    if (!datesMatch(new Date(dailyResetTime), todayDMY)) {
      console.log("XXXXX NEW DAY: Restting daily missions");
      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          daily_focus_time: 0,
          daily_focus_claimed: 0,
          daily_reset_time: todayDMY,
          // last_focus_date: todayDMY,
          focus_streak_days: newStreak,
        },
      };
      dispatch(updateUserData(updateRequest));
    }
  };

  const handleQuickStartUpdate = (quickstartId: string) => {
    console.log("handleQuickStartUpdate running");
    if (session) {
      const updateRequest: UpdateQuickStartRequest = {
        session: session,
        id: quickstartId,
        date: getTodayDMY(),
      };
      dispatch(updateQuickStart(updateRequest));
    }
    dispatch(setQuickStartId(null));
  };

  const handleManualTrip = () => {
    navigation.navigate("Start Skytrain Trip" as never);
  };

  useEffect(() => {
    console.log("Mission useEffect");
    dispatch(setSelectedStation(lastUsedStation));
    handleDailyFocus();
    if (currentQuickstartId !== null) {
      handleQuickStartUpdate(currentQuickstartId);
    }
  }, []);

  return lastUsedStation === "000" ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.header}>Skytrain</Text>
        <View style={styles.secondaryContainer}>
          <DailyFocusBox popupCallback={(reward) => showPopup(reward)} />
          <View style={{ flex: 1 }}>
            <QuickStartCard />
          </View>
          <Button mode="contained" onPress={handleManualTrip}>
            Start a Focus Trip
          </Button>
          <Popup
            visible={popupVisible}
            onClose={() => {
              setPopupVisible(false);
            }}
          >
            <View style={styles.rewardContainer}>
              <Text style={[styles.headerText, { color: "white" }]}>
                Claimed Rewards
              </Text>
              <View style={styles.rewardTextContainer}>
                <PremiumCurrencyIcon />
                <Text style={[styles.text, { marginLeft: 6, color: "white" }]}>
                  {displayedReward}
                </Text>
              </View>
            </View>
          </Popup>
        </View>
      </View>
    </Layout>
  );
};

export default Missions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexWrap: "wrap",
    // maxHeight: "100%",
    // margin: 8,
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    // backgroundColor: "gray",
  },
  secondaryContainer: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
  miniText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  header: {
    marginLeft: 10,
    marginVertical: 15,
    fontSize: 30,
    fontWeight: "700",
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  rewardTextContainer: {
    // flex: 1,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
  },
  rewardContainer: {
    flex: 1,
    // backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  giftButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  missionList: {
    // flex: 1,
    // maxHeight: "100%",
  },
  missionDescription: {
    flex: 1,
    maxWidth: "80%",
  },
  tooltip: {
    flexDirection: "row",
    alignItems: "center",
    width: 70,
    // flex: 1,
    // flexWrap: "wrap",
  },
});
