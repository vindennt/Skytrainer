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
  selectFirstMilestone,
  selectSecondMilestone,
  selectThirdMilestone,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Tooltip } from "@components/Tooltip";
import { GradientIcon, PremiumCurrencyIcon } from "@components/IconGradient";
import { Badge } from "@components/Badge";
import { setMissionBadgeVisibility } from "@src/navigation/navSlice";
import { getTodayDMY } from "@src/utils/dates";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import { DailyFocusRewards } from "@src/utils/missionRewards";

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

  const FIRST_MILESTONE: number = useSelector(selectFirstMilestone);
  const SECOND_MILESTONE: number = useSelector(selectSecondMilestone);
  const THIRD_MILESTONE: number = useSelector(selectThirdMilestone);

  const getButtonColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? "transparent"
      : finished
      ? theme.colors.tertiaryContainer
      : theme.colors.surfaceDisabled;
  };

  const getIconColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.tertiaryContainer
      : finished
      ? theme.colors.onTertiaryContainer
      : theme.colors.onSurfaceDisabled;
  };

  const getProgressColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.tertiaryContainer
      : finished
      ? theme.colors.tertiaryContainer
      : theme.colors.surfaceDisabled;
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

  const handleRouteReset = () => {
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
              {
                borderWidth: 3,
                borderColor: claimed
                  ? getIconColour(claimed, finished)
                  : getButtonColour(claimed, finished),
              },
            ]}
          >
            <MaterialCommunityIcons
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
    const claimed: boolean = dailyFocusTime > 0;

    return (
      <View style={styles.progressButtonStyleContainer}>
        <TouchableOpacity style={styles.progressButtonTouchable} disabled>
          <View
            style={[
              styles.progressButton,
              {
                backgroundColor: "transparent",
                borderWidth: 3,
                borderColor: claimed
                  ? getIconColour(claimed, finished)
                  : getButtonColour(claimed, finished),
              },
              // { backgroundColor: getButtonColour(claimed, finished) },
            ]}
          >
            <MaterialCommunityIcons
              name={"fire"}
              // color={theme.colors.onSurfaceVariant}
              // color={getIconColour(claimed, finished)}
              color={getIconColour(claimed, finished)}
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
          { backgroundColor: getProgressColour(claimed, finished) },
        ]}
      ></View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Daily Progress</Text>
        </View>
        {/* <View style={styles.quickstartContainer}>
          <Text>{dailyFocusTime}</Text>
          <Text>Claimed: {dailyFocusClaimed}</Text>
          <Text>Daily reset: {dailyResetString}</Text>
          <Text>Last focus: {lastFocusString}</Text>
        </View> */}
        <View style={styles.progressContainer}>
          <ZerothDailyProgressButton />
          {/* <Progressbar milestone={FIRST_MILESTONE} /> */}
          <DailyProgressButton
            milestone={FIRST_MILESTONE}
            reward={DailyFocusRewards.FIRST_MILESTONE}
          />
          {/* <Progressbar milestone={SECOND_MILESTONE} /> */}
          <DailyProgressButton
            milestone={SECOND_MILESTONE}
            reward={DailyFocusRewards.SECOND_MILESTONE}
          />
          {/* <Progressbar milestone={THIRD_MILESTONE} /> */}
          <DailyProgressButton
            milestone={THIRD_MILESTONE}
            reward={DailyFocusRewards.THIRD_MILESTONE}
          />
          <View style={styles.progressBarContainer}>
            <Progressbar milestone={FIRST_MILESTONE} />
            <Progressbar milestone={SECOND_MILESTONE} />
            <Progressbar milestone={THIRD_MILESTONE} />
          </View>
        </View>

        {/* <Button onPress={handleTestReset}>Reset</Button> */}
        {/* <Button onPress={handleRouteReset}>Route Reset</Button> */}
      </View>
    </View>
  );
};

export default DailyFocusBox;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#454045",
    // padding: 20,
    paddingBottom: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  headerText: {
    fontSize: 18,
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
    height: 3,
    width: 54,
    top: 24,
    right: 0.5,
  },
  tooltip: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
