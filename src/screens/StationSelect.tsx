import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme, Text, Button, Title } from "react-native-paper";
import { StationsState } from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { StationSelector } from "@src/components/StationSelectBox";
import { getStationName } from "@src/utils/skytrain";

const Stations = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const title = getStationName(selectedStation) + " Station";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.selectorContainer}>
        <StationSelector data={stations} selectedStation={selectedStation} />
      </View>
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: theme.colors.elevation.level2 },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};
export default Stations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    flex: 1,
    height: "90%",
  },
  titleContainer: {
    // backgroundColor: "blue",
  },
  title: {
    paddingTop: 14,
    paddingBottom: 50,
    fontSize: 20,
    textAlign: "center",
  },
});
