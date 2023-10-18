import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useSelector, useDispatch } from "react-redux";
import {
  UserState,
  selectLastUsedStation,
  setSlider,
} from "@src/features/user/userSlice";
import { StationsState } from "@src/features/stations/stationsSlice";
import { getStationName } from "@src/utils/skytrain";
import {
  SkytrainState,
  setRewards,
  setTrip,
} from "@src/features/skytrain/skytrainSlice";
import { findRandomViableTripIds } from "@src/features/skytrain/TripFinder";
import { TripReward, getRewards } from "@src/features/reward/TripRewardHandler";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import DailyFocusThresholdPicker, {
  OPTIONS_FIVE_ONE_TWENTY,
} from "./DailyFocusThresholdPicker";
import { SafeAreaView } from "react-native-safe-area-context";

export const TripBox: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();

  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const lastUsedStation = useSelector(selectLastUsedStation);

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const skytrainGraph = useSelector(
    (state: { skytrain: SkytrainState }) => state.skytrain.skytrainGraph
  );
  const [loading, setIsLoading] = useState<boolean>(false);

  const [pickerValue, setPickerValue] = useState<string>(
    sliderValue.toString()
  );

  const handleTripStart = () => {
    const pickerValueNumber: number = parseInt(pickerValue);

    // TODO: implement timer function, such that the rewards are only given if timer ends without cancel
    setIsLoading(true);
    console.log(
      getStationName(selectedStation) +
        " starting focus trip for " +
        pickerValueNumber
    );
    const tripPath: string[] = findRandomViableTripIds(
      skytrainGraph,
      selectedStation,
      pickerValueNumber
    );
    const rewards: TripReward = getRewards(tripPath, stations);
    dispatch(setTrip(tripPath));
    dispatch(setRewards(rewards));

    // TODO: After fix infinite loop, revert this to navigate to Timer
    console.log("TripBox: Navigating to Timer");
    navigation.navigate("Timer" as never);
    setTimeout(() => {
      console.log("TripBox: Set is loading to false");
      setIsLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView>
      <View style={[styles.tripContainer, { backgroundColor: "transparent" }]}>
        <View style={styles.timeHeader}>
          <Text style={styles.timeText}>
            Start at {getStationName(selectedStation)} Station
          </Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Start focus trip for</Text>
          <DailyFocusThresholdPicker
            value={pickerValue}
            onChange={setPickerValue}
            items={OPTIONS_FIVE_ONE_TWENTY}
          />
          <Text style={styles.headerText}>mins</Text>
        </View>
      </View>
      <Button
        labelStyle={{ marginVertical: 5 }}
        mode="contained"
        disabled={sliderValue === 0 || loading}
        onPress={handleTripStart}
        loading={loading}
      >
        START
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tripContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalContainer: {
    // flex: 1,
    flexDirection: "row",
  },
  headerContainer: {
    // flex: 1,
    flexDirection: "row",
    // backgroundColor: "pink",
    // justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 18,
  },
  headerText: { fontWeight: "bold" },
  timeText: {
    fontSize: 24,
    // fontWeight: "500",
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    // justifyContent: "space-between",
    // marginBottom: 8,
  },
});
