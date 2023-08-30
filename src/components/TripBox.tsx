import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useSelector, useDispatch } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { StationsState } from "@src/features/stations/stationsSlice";
import { getStationName } from "@src/utils/skytrain";
import {
  SkytrainState,
  setRewards,
  setTrip,
} from "@src/features/skytrain/skytrainSlice";
import { findRandomViableTripIds } from "@src/features/skytrain/TripFinder";
import { Station } from "@src/features/skytrain/Graph";
import { TripReward, getRewards } from "@src/features/reward/TripRewardHandler";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const TripBox: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );
  const balance = useSelector(
    (state: { user: UserState }) => state.user.balance
  );
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const skytrainGraph = useSelector(
    (state: { skytrain: SkytrainState }) => state.skytrain.skytrainGraph
  );
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleTripStart = () => {
    // TODO: implement timer function, such that the rewards are only given if timer ends without cancel
    setIsLoading(true);
    const frozenSliderValue: number = sliderValue;
    const frozenSelectedStationId: string = selectedStation;
    console.log(
      getStationName(selectedStation) +
        " starting focus trip for " +
        frozenSliderValue
    );
    const tripPath: string[] = findRandomViableTripIds(
      skytrainGraph,
      selectedStation,
      frozenSliderValue
    );
    dispatch(setTrip(tripPath));
    const rewards: TripReward = getRewards(tripPath, stations);
    dispatch(setRewards(rewards));

    // TODO: Rewards should only be given if the trip was actually finished
    const updateRequest: UpdateUserRequest = {
      session: session,
      update: {
        balance: balance + rewards.total,
        slider: frozenSliderValue,
        last_used_station: frozenSelectedStationId,
      },
    };
    dispatch(updateUserData(updateRequest));

    navigation.navigate("Trip" as never);
    setTimeout(() => {
      setIsLoading(false);
      // NOTE: Trip is the finish screen. The timer screen will be another one
    }, 500);
  };

  return (
    <View>
      <View
        style={[
          styles.tripContainer,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Focus Trip</Text>
          <Button
            labelStyle={{ marginVertical: 5 }}
            mode="contained"
            disabled={sliderValue === 0 || loading}
            onPress={handleTripStart}
            loading={loading}
          >
            START
          </Button>
        </View>
        <TimeSlider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripContainer: {
    padding: 18,
    borderRadius: 10,
    // flex: 1,
  },
  accountButton: {
    position: "absolute",
    right: 20,
  },
  headerContainer: {
    flexDirection: "row",
    // backgroundColor: "pink",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerText: { fontWeight: "bold" },
});
