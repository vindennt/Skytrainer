import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import { TripReward, getRewards } from "@src/features/reward/TripRewardHandler";
import { findRandomViableTripIds } from "@src/features/skytrain/TripFinder";
import {
  setTrip,
  setRewards,
  SkytrainState,
} from "@src/features/skytrain/skytrainSlice";
import { getStationName } from "@src/utils/skytrain";
import { Tooltip } from "@components/Tooltip";
import { StationsState } from "@src/features/stations/stationsSlice";
import { useNavigation } from "@react-navigation/native";
import { setSlider } from "@src/features/user/userSlice";
import { QuickStart } from "@src/features/quickStart/quickStartHandler";
import { QuickStartState } from "@src/features/quickStart/quickStartSlice";
import Icon from "react-native-vector-icons/Ionicons";

interface QuickStartButtonProps extends QuickStart {
  isAdd?: boolean;
}

export const QuickStartCard: React.FC = ({}) => {
  const MAX_QUICKSTARTS: number = 5;

  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const skytrainGraph = useSelector(
    (state: { skytrain: SkytrainState }) => state.skytrain.skytrainGraph
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const quickstarts: QuickStart[] = useSelector(
    (state: { quickStart: QuickStartState }) => state.quickStart.quickstarts
  );

  const handleQuickPress = (duration: number, stationId: string) => {
    console.log(
      getStationName(stationId) + " starting focus trip for " + duration
    );
    dispatch(setSlider(duration));
    const tripPath: string[] = findRandomViableTripIds(
      skytrainGraph,
      stationId,
      duration
    );
    const rewards: TripReward = getRewards(tripPath, stations);
    dispatch(setTrip(tripPath));
    dispatch(setRewards(rewards));

    console.log("Mission: Navigating to Timer via QuickStart");
    navigation.navigate("Timer" as never);
  };

  const QuickStartButton: React.FC<QuickStartButtonProps> = ({
    id = "",
    stationId = "000",
    name,
    duration = 0,
  }) => {
    return (
      <View
        style={[
          styles.quickButtonStyleContainer,
          { borderColor: theme.colors.outline },
        ]}
      >
        <View style={styles.quickButtonTextContainer}>
          <Text style={[styles.textTitle, { marginTop: 5 }]}>{name}</Text>
          <Text
            style={[
              styles.text,
              // { fontWeight: "bold" },
            ]}
          >
            {duration + " mins"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (duration > 0 && stationId !== "000") {
              handleQuickPress(duration, stationId);
            }
          }}
          style={[{ alignItems: "center" }]}
        >
          <View style={[styles.quickButtonStyle]}>
            <Icon
              name="play"
              color={
                quickstarts.length === 0
                  ? theme.colors.outline
                  : theme.colors.onSurfaceVariant
              }
              style={{ left: 1 }}
              size={24}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const tooltipContent: React.ReactNode = (
    <View style={styles.tooltip}>
      <Text style={styles.text}>Max: 5</Text>
    </View>
  );

  const tooltipButton: React.ReactNode = (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Create Quick Start" as never);
      }}
      disabled={quickstarts.length >= MAX_QUICKSTARTS}
    >
      <Icon
        name="add"
        color={
          quickstarts.length < MAX_QUICKSTARTS
            ? theme.colors.onSurfaceVariant
            : theme.colors.outline
        }
        size={28}
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Quickstart</Text>
          <View style={styles.quickActionContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Edit Quickstarts" as never);
              }}
              disabled={quickstarts.length === 0}
            >
              <Icon
                name="create-outline"
                color={
                  quickstarts.length === 0
                    ? theme.colors.outline
                    : theme.colors.onSurfaceVariant
                }
                size={24}
              />
            </TouchableOpacity>
            {quickstarts.length < MAX_QUICKSTARTS && tooltipButton}
            {quickstarts.length >= MAX_QUICKSTARTS && (
              <Tooltip content={tooltipContent}>{tooltipButton}</Tooltip>
            )}
          </View>
        </View>
        <View
          style={[
            styles.quickstartContainer,
            quickstarts.length >= 3 && { justifyContent: "space-between" },
          ]}
        >
          {quickstarts.map((quickstart) => {
            return (
              quickstart.id && (
                <QuickStartButton
                  key={quickstart.id}
                  id={quickstart.id}
                  stationId={quickstart.stationId}
                  name={quickstart.name}
                  duration={quickstart.duration}
                />
              )
            );
          })}
          {quickstarts.length === 0 && (
            <View style={styles.textContainer}>
              <Text style={{ color: theme.colors.outline }}>
                No quickstarts created. Let's make one!
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default QuickStartCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454045",
    padding: 20,
    // paddingBottom: 20,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  quickstartContainer: {
    flexDirection: "column",
    paddingTop: 16,
    // alignItems: "flex-start",
    // flex: 1,
    // justifyContent: "space-between",
    justifyContent: "flex-start",
    // gap: 20,
    // backgroundColor: "gray",
  },
  quickButtonStyle: {
    // flexWrap: "wrap",
    width: 50,
    height: 50,
    backgroundColor: "royalblue",
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 5,
    // flex: 1,
  },
  quickButtonStyleContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    justifyContent: "space-between",
    borderTopWidth: 0.2,
    paddingTop: 12,
    // marginHorizontal: 20,
    // marginRight: 10,
  },
  quickButtonTextContainer: {
    flexDirection: "column",
    // backgroundColor: "black",
    alignItems: "baseline",
    justifyContent: "flex-start",
    bottom: 5,
  },
  quickActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // backgroundColor: "green",
  },

  text: {
    fontSize: 18,
  },
  textTitle: {
    fontSize: 30,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
  },
});
