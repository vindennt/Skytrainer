import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title, IconButton } from "react-native-paper";
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
import { StationsState } from "@src/features/stations/stationsSlice";
import { useNavigation } from "@react-navigation/native";
import { setSlider } from "@src/features/user/userSlice";
import { QuickStart } from "@src/features/quickStart/quickStartHandler";
import { QuickStartState } from "@src/features/quickStart/quickStartSlice";

interface QuickStartButtonProps {
  id: string;
  stationId?: string;
  name: string;
  duration?: number;
  isAdd?: boolean;
}

export const QuickStartCard: React.FC = ({}) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
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
    isAdd = false,
  }) => {
    return (
      <View style={styles.quickButtonStyleContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isAdd) {
              navigation.navigate("Create Quick Start" as never);
            } else {
              if (duration > 0 && stationId !== "000") {
                handleQuickPress(duration, stationId);
              }
            }
          }}
          style={{ alignItems: "center" }}
        >
          <View style={styles.quickButtonStyle}>
            <Text
              style={[
                isAdd ? { fontSize: 20 } : styles.text,
                { fontWeight: "bold" },
              ]}
            >
              {isAdd ? "+" : duration}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.text, { marginTop: 5 }]}>{name}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Quickstart</Text>
          {quickstarts.length > 0 && (
            <Button
              icon="chevron-forward-outline"
              onPress={() => {
                navigation.navigate("Edit Quickstarts" as never);
              }}
              contentStyle={{ flexDirection: "row-reverse" }}
              labelStyle={{ marginVertical: 2 }}
            >
              Edit
            </Button>
          )}
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
          {quickstarts.length < 4 && (
            <QuickStartButton key="ADD" id="add" isAdd={true} name="Add" />
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
    flexDirection: "row",
    paddingTop: 20,
    // alignItems: "flex-end",
    // flex: 1,
    // justifyContent: "space-between",
    justifyContent: "flex-start",
    gap: 20,
    // backgroundColor: "gray",
  },
  quickButtonStyle: {
    width: 60,
    height: 60,
    backgroundColor: "royalblue",
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  quickButtonStyleContainer: {
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: 20,
    // marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});
