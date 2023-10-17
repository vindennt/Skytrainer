import { useNavigation } from "@react-navigation/native";
import DailyFocusBox from "@src/components/DailyFocusBox";
import {
  GradientIcon,
  PremiumCurrencyIcon,
} from "@src/components/IconGradient";
import { Popup } from "@src/components/Popup";
import QuickStartCard from "@src/components/QuickStartCard";
import { AuthState } from "@src/features/auth/authSlice";
import {
  UserState,
  selectDailyResetTime,
  selectLastFocusDate,
  selectFocusStreakDays,
  selectFocusStreakDaysRecord,
  selectTotalTripTime,
  selectTotalTripsFinished,
  selectFocusStreakDaysClaimed,
  selectTotalTripTimeClaimed,
  selectTotalTripsFinishedClaimed,
  selectTickets,
  selectLastUsedStation,
} from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { setMissionBadgeVisibility } from "@src/navigation/navSlice";
import { datesMatch, getTodayDMY, isConsecutiveDay } from "@src/utils/dates";
import {
  Mission,
  MissionType,
  MissionsList,
  RewardProgress,
} from "@src/utils/missionRewards";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import session from "redux-persist/es/storage/session";
import { Badge } from "@components/Badge";
import { ScrollView } from "react-native-gesture-handler";
import { Tooltip } from "@src/components/Tooltip";
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

const Missions = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const navigation = useNavigation();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const dailyResetTime: Date = useSelector(selectDailyResetTime);
  const lastFocusDate: Date | null = useSelector(selectLastFocusDate);
  const focusStreakDays: number = useSelector(selectFocusStreakDays);
  const focusStreakDaysRecord: number = useSelector(
    selectFocusStreakDaysRecord
  );
  const totalTripTime: number = useSelector(selectTotalTripTime);
  const totalTripsFinished: number = useSelector(selectTotalTripsFinished);
  const focusStreakDaysClaimed: number = useSelector(
    selectFocusStreakDaysClaimed
  );
  const totalTripTimeClaimed: number = useSelector(selectTotalTripTimeClaimed);
  const totalTripsFinishedClaimed: number = useSelector(
    selectTotalTripsFinishedClaimed
  );
  const tickets: number = useSelector(selectTickets);

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [displayedReward, setDisplayedReward] = useState<number>(0);

  const lastUsedStation: string = useSelector(selectLastUsedStation);

  const currentQuickstartId: string | null = useSelector(
    selectCurrentQuickstartId
  );

  const loginStreakProgress = (milestone: number): number => {
    if (focusStreakDaysRecord >= milestone) {
      return focusStreakDaysRecord;
    } else return focusStreakDays;
  };

  const getButtonColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? "transparent"
      : finished
      ? theme.colors.tertiaryContainer
      : theme.colors.onSurfaceVariant;
  };

  const getIconColour = (claimed: boolean, finished: boolean): string => {
    return claimed
      ? theme.colors.onBackground
      : finished
      ? theme.colors.onTertiaryContainer
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

  const DailyFocusMissonElement: React.FC<Mission> = ({
    description,
    milestone,
    type,
    reward,
  }) => {
    const isLast: boolean =
      MissionsList[MissionsList.length - 1].milestone === milestone;

    function getProgress(type: MissionType): RewardProgress {
      let progress: number;
      let claimed: number;
      let databaseType: string;
      switch (type) {
        case MissionType.CONSECUTIVE_DAYS:
          progress = focusStreakDaysRecord;
          claimed = focusStreakDaysClaimed;
          databaseType = "focus_streak_days_claimed";
          break;
        case MissionType.TOTAL_MINS:
          progress = totalTripTime;
          claimed = totalTripTimeClaimed;
          databaseType = "total_trip_time_claimed";
          break;
        case MissionType.TOTAL_TRIPS:
          progress = totalTripsFinished;
          claimed = totalTripsFinishedClaimed;
          databaseType = "total_trips_finished_claimed";
          break;
        default:
          progress = 0;
          claimed = 0;
          databaseType = "";
      }
      return {
        progress: progress,
        claimed: claimed,
        databaseType: databaseType,
      };
    }
    const progress: RewardProgress = getProgress(type);
    const isComplete: boolean = progress.progress >= milestone;
    const isClaimed: boolean = progress.claimed >= milestone;

    // Exception case: focusStreakDaysRecord does not change, so it is good for
    // marking historically completed missions. However, for current missions, the
    // focusStreakDays is the variable that can incremenet, so if the mission is
    // not done, then this value is what serves as progress indicator
    // rather than the static focusStreakDaysRecord
    if (type === MissionType.CONSECUTIVE_DAYS && !isComplete) {
      progress.progress = focusStreakDays;
    }

    const calculateReward = (
      milestoneClaimed: number,
      type: MissionType
    ): number => {
      const totalReward = MissionsList.reduce((totalReward, mission) => {
        if (
          mission.type === type &&
          milestoneClaimed >= mission.milestone &&
          progress.claimed < mission.milestone
        ) {
          return totalReward + mission.reward;
        }
        return totalReward;
      }, 0);
      return totalReward;
      // return 0;
    };

    const handleRewardClick = () => {
      console.log(
        "Now getting rewards for milestone: " + milestone + " and type " + type
      );
      const reward = calculateReward(milestone, type);
      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          tickets: tickets + reward,
          [progress.databaseType]: milestone,
        },
      };
      dispatch(updateUserData(updateRequest));
      showPopup(reward);
    };

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
          borderBottomWidth: 0.2,
          borderBottomColor: isLast ? "transparent" : theme.colors.outline,
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
                  { borderWidth: 1, borderColor: theme.colors.outline },
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
                onPress={handleRewardClick}
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
  return lastUsedStation === "000" ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
    <View style={styles.container}>
      <Text style={styles.header}>Skytrain</Text>
      <View style={styles.secondaryContainer}>
        <DailyFocusBox popupCallback={(reward) => showPopup(reward)} />
        <View style={{ flex: 1 }}>
          <QuickStartCard />
        </View>
        <Button mode="contained" onPress={handleManualTrip}>
          Start Manual Focus Trip
        </Button>
        {/* {MissionsList.map((mission: Mission) => {
          return (
            <DailyFocusMissonElement
              key={mission.description}
              description={mission.description}
              milestone={mission.milestone}
              type={mission.type}
              reward={mission.reward}
            />
          );
        })} */}

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
    </View>
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
    width: 70,
    // flex: 1,
    // flexWrap: "wrap",
  },
});
