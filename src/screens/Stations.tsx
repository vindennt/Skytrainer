import * as React from "react";
import { View, StyleSheet } from "react-native";
import { StationsState } from "@features/stations/stationsSlice";
import { useSelector } from "react-redux";
import { StationSelector } from "@src/components/StationSelectBox";
import { LevelUpBox } from "@src/components/LevelUpBox";

const Stations = () => {
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );

  return (
    <View style={styles.container}>
      <StationSelector data={stations} selectedStation={selectedStation} />
      <LevelUpBox selectedStation={selectedStation} levelData={stations} />
    </View>
  );
};
export default Stations;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },
});
