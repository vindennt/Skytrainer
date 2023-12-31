import {
  LINE_MAP,
  getLineInfo,
  getStation,
  getStationName,
  LINE_ICON,
} from "@src/utils/skytrain";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Title, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";
import * as reactRedux from "react-redux";
import { MAX_LEVEL } from "@src/utils/levels";
import { Session } from "@supabase/supabase-js";
import { LEVELUP_COSTS, REWARD_MULTIPLIERS } from "@src/utils/levels";
import { UserState } from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { AuthState } from "@src/features/auth/authSlice";
import {
  StationLevelUpdateRequest,
  levelUpStation,
} from "@features/stations/stationsSliceHelpers";
import {
  selectSelectedStation,
  selectStations,
} from "@src/features/stations/stationsSlice";
import { BlurView } from "expo-blur";
import {
  selectDarkTheme,
  selectLevelingUpMode,
  setLevelingUpMode,
} from "@src/navigation/navSlice";
import { useSelector } from "react-redux";

export const LevelUpBox: React.FC = () => {
  const theme = useTheme();
  const dispatch = reactRedux.useDispatch<any>();
  const levelData = reactRedux.useSelector(selectStations);
  const selectedStation = reactRedux.useSelector(selectSelectedStation);

  const level: number | undefined = levelData.get(selectedStation);
  const cost: number = level ? LEVELUP_COSTS[level] : -1;
  const currentMultiplier: number = level ? REWARD_MULTIPLIERS[level] : -1;
  const nextMultiplier: number = level ? REWARD_MULTIPLIERS[level + 1] : -1;
  const balance: number = reactRedux.useSelector(
    (state: { user: UserState }) => state.user.balance
  );
  const session: Session | null = reactRedux.useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const isDark: boolean = useSelector(selectDarkTheme);
  const levelUpMode = useSelector(selectLevelingUpMode);
  const canBuy: boolean =
    balance >= cost && level !== undefined && level < MAX_LEVEL;
  const [loading, setLoading] = useState<boolean>(false);

  const maxLevel: boolean = level === MAX_LEVEL;
  const buttonText: string = maxLevel ? "MAX LEVEL" : "LEVEL UP";
  const subText: string = maxLevel
    ? `Current level: Rewards \u00D7${currentMultiplier}`
    : `Next level: Rewards \u00D7${currentMultiplier} → \u00D7${nextMultiplier}`;

  const lineInfo = getLineInfo(selectedStation);

  const handleToggleLevelingMode = () => {
    dispatch(setLevelingUpMode(!levelUpMode));
  };

  const handleLevelUp = () => {
    if (level !== undefined && level < MAX_LEVEL) {
      setLoading(true);
      // const balanceUpdateRequest: UpdateNumericalBalanceRequest = {
      //   session: session,
      //   newBalance: balance - cost,
      // };
      const newBalance = balance - cost;
      if (newBalance < 0) {
        throw new Error(
          "LevelUpBox: " + balance + " cannot afford cost " + cost
        );
      }
      const balanceUpdateRequest: UpdateUserRequest = {
        session: session,
        update: { balance: newBalance },
      };
      dispatch(updateUserData(balanceUpdateRequest));
      const levelUpdateRequest: StationLevelUpdateRequest = {
        session: session,
        stationId: selectedStation,
        newLevel: level + 1,
      };
      dispatch(levelUpStation(levelUpdateRequest));
      setTimeout(() => {
        setLoading(false);
      }, 600);
    } else {
      throw new Error("Already max level");
    }
  };

  return (
    <View
      style={[
        styles.verticalContainer,
        {
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.10)"
            : "rgba(0, 0, 0, 0.10)",
          width: levelUpMode ? "100%" : "70%",
        },
      ]}
    >
      <BlurView
        intensity={50}
        tint={isDark ? "dark" : "light"}
        style={[styles.outerContainer, { borderRadius: 12 }]}
      >
        <View style={{ backgroundColor: theme.colors.primaryContainer }}>
          <View style={styles.container}>
            <View style={[styles.titleContainer]}>
              <Title style={styles.headerText}>
                {getStationName(selectedStation)}
              </Title>
              {/* <Title>Lv. {levelData.get(selectedStation)}</Title> */}
            </View>
            <View style={[styles.horizontalContainer, { right: 4 }]}>
              <Icon name={LINE_ICON} size={20} color={lineInfo.colour} />
              <Text style={styles.levelText}>{lineInfo.name}</Text>
            </View>
            <Text style={styles.levelText}>
              Lv. {levelData.get(selectedStation)}
            </Text>
            {levelUpMode && (
              <View style={styles.subtextContainer}>
                <Text
                  style={[
                    styles.subtextText,
                    { color: theme.colors.outlineVariant },
                  ]}
                >
                  {subText}
                </Text>
              </View>
            )}

            <View style={styles.levelUpTextContainer}>
              {levelUpMode && (
                <View style={styles.costContainer}>
                  <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
                  <Text style={styles.costText}>{cost}</Text>
                  <Button
                    style={styles.button}
                    onPress={() => handleLevelUp()}
                    mode="contained"
                    disabled={!canBuy || loading}
                    loading={loading}
                    labelStyle={[styles.buttonText]}
                  >
                    {buttonText}
                  </Button>
                </View>
              )}

              {!levelUpMode && (
                <Button
                  style={styles.button}
                  onPress={handleToggleLevelingMode}
                  mode="contained"
                  disabled={!canBuy || loading}
                  loading={loading}
                  labelStyle={[styles.buttonText]}
                >
                  {buttonText}
                </Button>
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalContainer: {
    flexDirection: "column",
    position: "absolute",
    // width: "100%",
    bottom: 0,
    borderRadius: 18,
    overflow: "hidden",

    borderWidth: 1,
    // flex: 1,
  },
  outerContainer: {
    // position: "absolute",
    width: "100%",
    // bottom: 85,
    borderRadius: 18,
    // flex: 1,
    // margin: -20,
    // paddingBottom: 85
  },
  container: {
    // backgroundColor: "#454045",
    // padding: 20,
    // flex: 1,
    paddingTop: 5,
    paddingHorizontal: 15,
    // paddingBottom: 15,
    // borderRadius: 12,
    // position: "absolute",
  },
  titleContainer: {
    // flex: 1,
    // paddingLeft: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtextContainer: {
    // marginBottom: 8,
  },
  headerText: { flex: 1, fontSize: 20, fontWeight: "600" },
  costText: {
    flex: 1,
    // fontWeight: "bold ",
    fontSize: 16,
    marginRight: 16,
    marginLeft: 6,
  },
  levelText: {
    fontSize: 16,
    marginBottom: 4,
  },
  levelUpTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    fontWeight: "bold",
    // justifyContent: "flex-end",
    // marginBottom: 16,
  },
  subtextText: {
    // flex: 1,
    fontSize: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    // borderRadius: 12,
    flex: 1,
    marginVertical: 15,
  },
  buttonText: {
    // fontSize: 16,
    fontWeight: "bold",
  },

  costContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    gap: 8,
  },
  glassLine: {
    height: 2,
    // backgroundColor: "transparent",
  },
});
