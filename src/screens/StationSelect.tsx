import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme, Text, Button, Title } from "react-native-paper";
import {
  StationsState,
  setSelectedStation,
} from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { StationSelector } from "@src/components/StationSelectBox";
import { getStationName } from "@src/utils/skytrain";
import { useNavigation } from "@react-navigation/native";
import { UserState, setLastUsedStation } from "@src/features/user/userSlice";
import { useState } from "react";

const Stations = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const theme = useTheme();

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );

  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );

  const title = getStationName(selectedStation) + " Station";

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSelect = () => {
    dispatch(setLastUsedStation(selectedStation));
    navigation.goBack();
  };

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
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleGoBack}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSelect}>
            Select
          </Button>
        </View>
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
    padding: 20,
    fontSize: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 40,
  },
});
