import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useSelector, useDispatch } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { StationsState } from "@src/features/stations/stationsSlice";
import { getStationName } from "@src/utils/skytrain";
import { SkytrainState } from "@src/features/skytrainTrip/skytrainSlice";
import { findRandomViableTrips } from "@src/features/skytrainTrip/TripFinder";
import { Station } from "@src/features/skytrainTrip/Graph";

export const TripBox: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const skytrainGraph = useSelector(
    (state: { skytrain: SkytrainState }) => state.skytrain.skytrainGraph
  );

  const handleTripStart = () => {
    // TODO: implement timer function, such that the rewards are only given if timer ends without cancel
    console.log(
      getStationName(selectedStation) +
        " starting focus trip for " +
        sliderValue
    );
    const tripPath: Station[] = findRandomViableTrips(
      skytrainGraph,
      selectedStation,
      sliderValue
    );
    console.log(tripPath);
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
            disabled={sliderValue === 0}
            onPress={handleTripStart}
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
