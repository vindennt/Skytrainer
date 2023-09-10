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
import { datesMatch, getTodayDMY, isConsecutiveDay } from "@src/utils/dates";
import {
  Mission,
  MissionData,
  MissionsList,
  RewardProgress,
} from "@src/utils/missionRewards";
import * as React from "react";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import session from "redux-persist/es/storage/session";
import { Badge } from "@components/Badge";
import { ScrollView } from "react-native-gesture-handler";
import { Tooltip } from "@src/components/Tooltip";

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
  const focusStreakDays: number = useSelector(
    (state: { user: UserState }) => state.user.focus_streak_days
  );

  const focusStreakDaysRecord: number = useSelector(
    (state: { user: UserState }) => state.user.focus_streak_days_record
  );

  const totalTripTime: number = useSelector(
    (state: { user: UserState }) => state.user.total_trip_time
  );
  const totalTripsFinished: number = useSelector(
    (state: { user: UserState }) => state.user.total_trips_finished
  );

  const focusStreakDaysClaimed: number = useSelector(
    (state: { user: UserState }) => state.user.focus_streak_days_claimed
  );

  const totalTripTimeClaimed: number = useSelector(
    (state: { user: UserState }) => state.user.total_trip_time_claimed
  );

  const totalTripsFinishedClaimed: number = useSelector(
    (state: { user: UserState }) => state.user.total_trips_finished_claimed
  );

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [displayedReward, setDisplayedReward] = useState<number>(0);

  const loginStreakProgress = (milestone: number): number => {
    if (focusStreakDaysRecord >= milestone) {
      return focusStreakDaysRecord;
    } else return focusStreakDays;
  };

  const getButtonColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? "transparent"
      : finished
      ? theme.colors.tertiary
      : theme.colors.onSurfaceVariant;
  };

  const getIconColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.onBackground
      : finished
      ? theme.colors.onTertiary
      : theme.colors.outline;
  };

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

  useEffect(() => {
    console.log("Mission useEffect");
    handleDailyFocus();
  }, []);

  const DailyFocusMissonElement: React.FC<Mission> = ({
    description,
    milestone,
    type,
    reward,
  }) => {
    const isLast: boolean =
      MissionsList[MissionsList.length - 1].milestone === milestone;

    function getProgress(type: MissionData): RewardProgress {
      let progress: number;
      let claimed: number;
      switch (type) {
        case MissionData.CONSECUTIVE_DAYS:
          progress = focusStreakDaysRecord;
          claimed = focusStreakDaysClaimed;
          break;
        case MissionData.TOTAL_MINS:
          progress = totalTripTime;
          claimed = totalTripTimeClaimed;
          break;
        case MissionData.TOTAL_TRIPS:
          progress = totalTripsFinished;
          claimed = totalTripsFinishedClaimed;
          break;
        default:
          progress = 0;
          claimed = 0;
      }
      return { progress: progress, claimed: claimed };
    }
    const progress: RewardProgress = getProgress(type);
    const isComplete: boolean = progress.progress >= milestone;
    const isClaimed: boolean = progress.claimed >= milestone;

    const tooltipContent: React.ReactNode = (
      <View style={styles.tooltip}>
        <PremiumCurrencyIcon />
        <Text style={[styles.text, { marginLeft: 6 }]}>{reward}</Text>
      </View>
    );

    return (
      <View
        style={{
          // flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: isLast ? "transparent" : theme.colors.onBackground,
        }}
      >
        <View style={[styles.item]}>
          <View style={[styles.missionDescription]}>
            <Text style={styles.text}>{description}</Text>
          </View>
          {!isComplete && (
            <Tooltip content={tooltipContent}>
              <TouchableOpacity
                disabled
                style={[
                  styles.giftButton,
                  { borderWidth: 1, borderColor: theme.colors.onBackground },
                ]}
              >
                <Text style={styles.miniText}>
                  {progress.progress} / {milestone}
                </Text>
              </TouchableOpacity>
            </Tooltip>
          )}

          {isComplete && (
            <View>
              {!isClaimed && <Badge />}
              <TouchableOpacity
                disabled={isClaimed}
                onPress={() => {}}
                style={[
                  styles.giftButton,
                  { backgroundColor: getButtonColour(isClaimed, isComplete) },
                ]}
              >
                <Icon
                  name={isClaimed ? "check" : "gift"}
                  color={getIconColour(isClaimed, isComplete)}
                  // color={theme.colors.onBackground}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Missions</Text>
      <View style={styles.secondaryContainer}>
        <DailyFocusBox popupCallback={(reward) => showPopup(reward)} />
        <QuickStartCard />
        {MissionsList.map((mission: Mission) => {
          return (
            <DailyFocusMissonElement
              key={mission.description}
              description={mission.description}
              milestone={mission.milestone}
              type={mission.type}
              reward={mission.reward}
            />
          );
        })}
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
    </ScrollView>
  );
};

export default Missions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 8,
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 20,
    paddingHorizontal: 10,
    // backgroundColor: "pink",
  },
  secondaryContainer: {
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
    flexDirection: "row",
  },
  rewardContainer: {
    // backgroundColor: "purple",
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
  },
});
