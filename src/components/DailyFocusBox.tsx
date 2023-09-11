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
  selectTickets,
  selectDailyFocusTime,
  selectDailyFocusClaimed,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  DailyFocusRewards,
  FocusMilestoneTimes,
} from "@src/utils/missionRewards";
import { Tooltip } from "@components/Tooltip";
import { GradientIcon, PremiumCurrencyIcon } from "@components/IconGradient";
import { Badge } from "@components/Badge";
import { setMissionBadgeVisibility } from "@src/navigation/navSlice";
import { getTodayDMY } from "@src/utils/dates";

interface DailyFocusBoxProps {
  popupCallback: (reward: number) => void;
}

interface DailyProgressButtonProps {
  milestone: number;
  reward?: number;
  finished?: boolean; // determines styling if milestone met
  claimed?: boolean; // determines styling if milestone claimed\
}

export const DailyFocusBox: React.FC<DailyFocusBoxProps> = ({
  popupCallback,
}) => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const tickets: number = useSelector(selectTickets);
  const dailyFocusTime: number = useSelector(selectDailyFocusTime);
  const dailyFocusClaimed: number = useSelector(selectDailyFocusClaimed);

  const todayDMY: Date = getTodayDMY();
  const resetDate: Date = new Date(todayDMY);
  resetDate.setDate(todayDMY.getDate() - 2);

  const FIRST_MILESTONE: number = FocusMilestoneTimes.FIRST_MILESTONE;
  const SECOND_MILESTONE: number = FocusMilestoneTimes.SECOND_MILESTONE;
  const THIRD_MILESTONE: number = FocusMilestoneTimes.THIRD_MILESTONE;

  const getButtonColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.outline
      : finished
      ? theme.colors.tertiary
      : theme.colors.onSurfaceVariant;
  };

  const getIconColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.surfaceVariant
      : finished
      ? theme.colors.onTertiary
      : theme.colors.outline;
  };

  // Calcualte cumulative reward to give user. Excludes any already claimed reward milestones
  const calculateProgressReward = (milestoneClaimed: number): number => {
    let reward: number = 0;
    // First Milestone rewards
    if (
      milestoneClaimed >= FIRST_MILESTONE &&
      dailyFocusClaimed < FIRST_MILESTONE
    ) {
      reward += DailyFocusRewards.FIRST_MILESTONE;
    }
    // Second Milestone rewards
    if (
      milestoneClaimed >= SECOND_MILESTONE &&
      dailyFocusClaimed < SECOND_MILESTONE
    ) {
      reward += DailyFocusRewards.SECOND_MILESTONE;
    }
    // Third Milestone rewards
    if (
      milestoneClaimed >= THIRD_MILESTONE &&
      dailyFocusClaimed < THIRD_MILESTONE
    ) {
      reward += DailyFocusRewards.THIRD_MILESTONE;
    }
    return reward;
  };

  const handleProgressClick = async (milestoneClaimed: number) => {
    const reward = calculateProgressReward(milestoneClaimed);
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        tickets: tickets + reward,
        daily_focus_claimed: milestoneClaimed,
      },
    };
    // Below line is an optimistic update here to avoid slow ui
    // await dispatch(setDailyFocusClaimed(milestoneClaimed));
    popupCallback(reward);
    await dispatch(updateUserData(updateRequest));
  };

  const handleTestReset = () => {
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        daily_focus_claimed: 0,
        // daily_focus_time: 0,
        daily_reset_time: resetDate,
        last_focus_date: resetDate,
      },
    };
    // Use an optimistic update here to avoid slow ui
    dispatch(updateUserData(updateRequest));
    dispatch(setMissionBadgeVisibility(false));
  };

  const DailyProgressButton: React.FC<DailyProgressButtonProps> = ({
    milestone,
    reward = 0,
    finished = false,
    claimed = false,
  }) => {
    finished = dailyFocusTime >= milestone;
    claimed = dailyFocusClaimed >= milestone;

    const content = (
      <View style={styles.progressButtonStyleContainer}>
        {finished && !claimed && <Badge />}
        <TouchableOpacity
          onPress={() => {
            console.log(
              "Pressed daily progress reward for milestone " + milestone
            );
            handleProgressClick(milestone);
          }}
          disabled={!finished || claimed}
          style={styles.progressButtonTouchable}
        >
          <View
            style={[
              styles.progressButton,
              { backgroundColor: getButtonColour(claimed, finished) },
            ]}
          >
            <Icon
              name={claimed ? "check" : "gift"}
              color={getIconColour(claimed, finished)}
              size={24}
            />
          </View>
        </TouchableOpacity>
        <Text style={[styles.text, { marginTop: 5 }]}>
          {/* {milestone === FIRST_MILESTONE ? " " : ""} */}
          {milestone} mins
        </Text>
      </View>
    );

    const tooltipContent: React.ReactNode = (
      <View style={styles.tooltip}>
        <PremiumCurrencyIcon />
        <Text style={[styles.text, { marginLeft: 6 }]}>{reward}</Text>
      </View>
      // <Text>Hey</Text>
    );

    return !finished ? (
      <Tooltip content={tooltipContent}>{content}</Tooltip>
    ) : (
      content
    );
  };

  const ZerothDailyProgressButton: React.FC = ({}) => {
    const finished: boolean = dailyFocusTime >= FIRST_MILESTONE;
    const claimed: boolean = dailyFocusClaimed >= THIRD_MILESTONE;

    return (
      <View style={styles.progressButtonStyleContainer}>
        <TouchableOpacity style={styles.progressButtonTouchable} disabled>
          <View
            style={[
              styles.progressButton,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: getButtonColour(claimed, finished),
              },
              // { backgroundColor: getButtonColour(claimed, finished) },
            ]}
          >
            <Icon
              name={"fire"}
              // color={theme.colors.onSurfaceVariant}
              // color={getIconColour(claimed, finished)}
              color={getButtonColour(claimed, finished)}
              size={24}
            />
          </View>
        </TouchableOpacity>
        <Text style={[styles.text, { marginTop: 5 }]}>0 mins</Text>
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
          { backgroundColor: getButtonColour(claimed, finished) },
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
        {/* <View style={styles.quickstartContainer}>
          <Text>{dailyFocusTime}</Text>
          <Text>Claimed: {dailyFocusClaimed}</Text>
          <Text>Daily reset: {dailyResetString}</Text>
          <Text>Last focus: {lastFocusString}</Text>
        </View> */}
        <View style={styles.progressContainer}>
          <ZerothDailyProgressButton />
          <Progressbar milestone={FIRST_MILESTONE} />
          <DailyProgressButton
            milestone={FIRST_MILESTONE}
            reward={DailyFocusRewards.FIRST_MILESTONE}
          />
          <Progressbar milestone={SECOND_MILESTONE} />
          <DailyProgressButton
            milestone={SECOND_MILESTONE}
            reward={DailyFocusRewards.SECOND_MILESTONE}
          />
          <Progressbar milestone={THIRD_MILESTONE} />
          <DailyProgressButton
            milestone={THIRD_MILESTONE}
            reward={DailyFocusRewards.THIRD_MILESTONE}
          />
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
  text: {
    fontSize: 14,
  },
  progressButton: {
    width: 50,
    height: 50,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  progressButtonTouchable: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
    marginTop: 20,
    // alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "purple",
  },
  progressBar: {
    height: 4,
    width: 38,
    top: 23,
  },
  tooltip: {
    flexDirection: "row",
    alignItems: "center",
  },
});
