import React, { useState } from "react";
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

interface QuickStartButtonProps {
  id?: string;
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
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );

  const handleQuickPress = (duration: number) => {
    console.log(
      getStationName(selectedStation) + " starting focus trip for " + duration
    );
    dispatch(setSlider(duration));
    const tripPath: string[] = findRandomViableTripIds(
      skytrainGraph,
      selectedStation,
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
    name,
    duration = 0,
    isAdd = false,
  }) => {
    return (
      <View style={styles.quickButtonStyleContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log("Pressed quicxkstart");
            if (isAdd) {
              navigation.navigate("Create Quick Start" as never);
            } else {
              if (duration > 0) handleQuickPress(duration);
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
          <Button
            icon="chevron-forward-outline"
            onPress={() => {}}
            contentStyle={{ flexDirection: "row-reverse" }}
            labelStyle={{ marginVertical: 2 }}
          >
            Edit
          </Button>
        </View>
        <View style={styles.quickstartContainer}>
          <QuickStartButton isAdd={true} name="Add" />
          <QuickStartButton id="d" name="Study" duration={20} />
          {/* TODO: Onl render this if theres <4 quickstarts  */}
        </View>
      </View>
    </View>
  );
};

export default QuickStartCard;

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
    flexDirection: "row",
    // alignItems: "flex-end",
    // flex: 1,
    // justifyContent: "space-between",
    backgroundColor: "gray",
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
