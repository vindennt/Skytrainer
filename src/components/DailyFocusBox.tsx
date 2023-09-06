import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import {
  UserState,
  setDailyFocusClaimed,
  setDailyFocusTime,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";

const FIRST_MILESTONE: number = 5;
const FIRST_MILESTONE_REWARD: number = 5;
const SECOND_MILESTONE: number = 10;
const SECOND_MILESTONE_REWARD: number = 10;
const THIRD_MILESTONE: number = 15;
const THIRD_MILESTONE_REWARD: number = 15;

interface DailyProgressButtonProps {
  milestone: number;
  finished?: boolean; // determines styling if milestone met
  claimed?: boolean; // determines styling if milestone claimed\
}

export const DailyFocusBox: React.FC = ({}) => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dailyFocusTime: number = useSelector(
    (state: { user: UserState }) => state.user.daily_focus_time
  );
  const dailyFocusClaimed: number = useSelector(
    (state: { user: UserState }) => state.user.daily_focus_claimed
  );
  const dailyResetTIme: Date = useSelector(
    (state: { user: UserState }) => state.user.daily_reset_time
  );
  const dailyResetString: string = dailyResetTIme.toString();
  const lastFocusDate: Date | null = useSelector(
    (state: { user: UserState }) => state.user.last_focus_date
  );
  const lastFocusString: string =
    lastFocusDate === null ? "null" : lastFocusDate.toString();

  const calculateProgressReward = (): number => {
    let reward: number = 0;
    if (
      dailyFocusTime >= THIRD_MILESTONE &&
      dailyFocusClaimed < THIRD_MILESTONE
    ) {
      reward += THIRD_MILESTONE_REWARD;
    }

    return reward;
  };

  const handleProgressClick = (milestone: number) => {
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        daily_focus_claimed: milestone,
        // daily_focus_claimed: 0,
      },
    };
    // Use an optimistic update here to avoid slow ui
    // dispatch(setDailyFocusClaimed(milestone));
    dispatch(updateUserData(updateRequest));
  };

  const handleTestReset = () => {
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        // daily_focus_claimed: milestone,
        daily_focus_claimed: 0,
        // daily_focus_time: 0,
      },
    };
    // Use an optimistic update here to avoid slow ui
    dispatch(updateUserData(updateRequest));
  };

  const DailyProgressButton: React.FC<DailyProgressButtonProps> = ({
    milestone,
    finished = false,
    claimed = false,
  }) => {
    finished = dailyFocusTime >= milestone;
    claimed = dailyFocusClaimed >= milestone;

    return (
      <View style={styles.progressButtonStyleContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log(
              "Pressed daily progress reward for milestone " + milestone
            );
            handleProgressClick(milestone);
          }}
          disabled={!finished || claimed}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={[
              styles.progressButton,
              claimed
                ? { backgroundColor: theme.colors.outline }
                : finished
                ? { backgroundColor: theme.colors.tertiary }
                : { backgroundColor: theme.colors.onSurfaceVariant },
            ]}
          >
            <Text
              style={[
                { fontWeight: "bold", color: theme.colors.surfaceVariant },
                styles.text,
              ]}
            >
              {milestone}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.text, { marginTop: 5 }]}>{milestone} mins</Text>
      </View>
    );
  };

  const Progressbar: React.FC<DailyProgressButtonProps> = ({
    milestone,
    finished = false,
    claimed = false,
  }) => {
    finished = dailyFocusTime >= milestone;
    claimed = dailyFocusClaimed >= milestone;

    return (
      <View
        style={[
          styles.progressBar,
          claimed
            ? { backgroundColor: theme.colors.outline }
            : finished
            ? { backgroundColor: theme.colors.tertiary }
            : { backgroundColor: theme.colors.onSurfaceVariant },
        ]}
      ></View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Daily Focus</Text>
        </View>
        <View style={styles.quickstartContainer}>
          <Text>{dailyFocusTime}</Text>
          <Text>Claimed: {dailyFocusClaimed}</Text>
          <Text>Daily reset: {dailyResetString}</Text>
          <Text>Last focus: {lastFocusString}</Text>
        </View>
        <View style={styles.progressContainer}>
          <DailyProgressButton milestone={FIRST_MILESTONE} />
          <Progressbar milestone={SECOND_MILESTONE} />
          <DailyProgressButton milestone={SECOND_MILESTONE} />
          <Progressbar milestone={THIRD_MILESTONE} />
          <DailyProgressButton milestone={THIRD_MILESTONE} />
        </View>
        <Button onPress={handleTestReset}>Reset</Button>
      </View>
    </View>
  );
};

export default DailyFocusBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454045",
    // padding: 20,
    padding: 20,
    paddingBottom: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quickstartContainer: {
    flexDirection: "column",
    backgroundColor: "green",
    // alignItems: "flex-end",
    // flex: 1,
    // justifyContent: "space-between",
    // backgroundColor: "gray",
  },
  text: {
    fontSize: 16,
  },
  progressButton: {
    width: 60,
    height: 60,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  progressButtonStyleContainer: {
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: 20,
    // marginRight: 10,
  },
  progressContainer: {
    justifyContent: "space-between",
    // alignItems: "center",
    flexDirection: "row",
    backgroundColor: "purple",
  },
  progressBar: {
    height: 6,
    width: 60,
    top: 27,
  },
});
