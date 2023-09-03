import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import { UserState, setDailyFocusTime } from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";

export const DailyFocusBox: React.FC = ({}) => {
  const dispatch = useDispatch<any>();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dailyFocusTime: number = useSelector(
    (state: { user: UserState }) => state.user.daily_focus_time
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

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Daily Focus</Text>
        </View>
        <View style={styles.quickstartContainer}>
          <Text>{dailyFocusTime}</Text>
          <Text>Daily reset: {dailyResetString}</Text>
          <Text>Last focus: {lastFocusString}</Text>
        </View>
        <Button
          onPress={() => {
            console.log(new Date());
          }}
        >
          Get today
        </Button>
        <Button
          onPress={() => {
            const updateRequest: UpdateUserRequest = {
              session: session,
              update: {
                daily_focus_time: 10,
              },
            };
            dispatch(updateUserData(updateRequest));
          }}
        >
          Set daily focus to 10
        </Button>
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
    // alignItems: "flex-end",
    // flex: 1,
    // justifyContent: "space-between",
    // backgroundColor: "gray",
  },
  text: {
    fontSize: 16,
  },
});
