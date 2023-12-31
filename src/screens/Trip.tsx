import { StackActions, useNavigation } from "@react-navigation/native";
import { AuthState } from "@src/features/auth/authSlice";
import {
  UpdateQuickStartRequest,
  updateQuickStart,
} from "@src/features/quickStart/quickStartSliceHelpers";
import {
  RewardContributor,
  TripReward,
} from "@src/features/reward/TripRewardHandler";
import {
  SkytrainState,
  selectCurrentQuickstartId,
  selectRewards,
  selectTrip,
  setQuickStartId,
} from "@src/features/skytrain/skytrainSlice";
import {
  UserState,
  selectSlider,
  selectTotalTripTime,
  selectTotalTripsFinished,
  selectBalance,
  selectDailyFocusTime,
  selectFocusStreakDays,
  selectFocusStreakDaysRecord,
  selectLastFocusDate,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { datesMatch, getTodayDMY, isConsecutiveDay } from "@src/utils/dates";
import { Session } from "@supabase/supabase-js";
import * as React from "react";
import { useEffect, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";

const Trip = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const rewards: TripReward = useSelector(selectRewards);

  const trip: string[] = useSelector(selectTrip);
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const slider: number = useSelector(selectSlider);
  const total_trip_time: number = useSelector(selectTotalTripTime);
  const total_trips_finished: number = useSelector(selectTotalTripsFinished);
  const balance: number = useSelector(selectBalance);
  const dailyFocusTime: number = useSelector(selectDailyFocusTime);
  const focusStreakDays: number = useSelector(selectFocusStreakDays);
  const focusStreakDaysRecord: number = useSelector(
    selectFocusStreakDaysRecord
  );
  const lastFocusDate: Date = new Date(useSelector(selectLastFocusDate));

  const today: Date = getTodayDMY();

  useEffect(() => {
    console.log("Trip.tsx running");

    const todayDMY: Date = getTodayDMY();
    const isSameFocusDay: boolean = datesMatch(todayDMY, lastFocusDate);
    const newStreak: number = !isSameFocusDay
      ? isConsecutiveDay(lastFocusDate)
        ? focusStreakDays + 1
        : 1
      : focusStreakDays;

    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        balance: balance + rewards.total,
        slider: slider,
        total_trip_time: total_trip_time + slider,
        total_trips_finished: total_trips_finished + 1,
        last_used_station: trip[0],
        daily_focus_time: datesMatch(today, lastFocusDate)
          ? dailyFocusTime + slider
          : slider,
        last_focus_date: today,
        daily_reset_time: today,
        focus_streak_days: newStreak,
        focus_streak_days_record:
          newStreak > focusStreakDaysRecord ? newStreak : focusStreakDaysRecord,
      },
    };
    dispatch(updateUserData(updateRequest));
  }, []);

  const renderItem = ({ item }: { item: RewardContributor }) => (
    <View style={styles.item}>
      <View style={styles.leftContent}>
        <Text style={styles.text}>{item.id}.</Text>
        <Text style={styles.text}>{item.stationName}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
        <Text style={[styles.text, { marginLeft: 6 }]}>
          {item.contribution}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.text, { textAlign: "center" }]}>
        You skytrained past
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          {" "}
          {trip.length} stations{" "}
        </Text>
        as you focused for
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          {" "}
          {slider} minutes!{" "}
        </Text>
      </Text>
      <FlatList
        data={rewards.contributors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={[
          styles.rewardList,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      />
      <View
        style={[
          styles.totalitem,
          { borderTopColor: theme.colors.onBackground },
        ]}
      >
        <View style={styles.leftContent}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>Total</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <Icon icon="cash-multiple" size={18} /> */}
          <Text style={[styles.text, { fontWeight: "bold", marginLeft: 6 }]}>
            +
          </Text>
          <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
          <Text style={[styles.text, { fontWeight: "bold", marginLeft: 6 }]}>
            {rewards.total}
          </Text>
        </View>
      </View>
      <Button
        icon="chevron-back"
        // mode="outlined"
        // textColor="royalblue"
        onPress={() => {
          navigation.dispatch(StackActions.popToTop);
        }}
        style={styles.button}
        labelStyle={{ fontSize: 16 }} // icon size
        mode="contained"
      >
        Return
      </Button>
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "pink",
  },
  text: {
    fontSize: 16,
    margin: 4,
  },
  button: {
    marginTop: 80,
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "green",
  },
  totalitem: {
    padding: 10,
    // paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    borderTopWidth: 1,
  },
  rewardList: {
    maxHeight: "33%",
    width: "100%",
    marginTop: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
