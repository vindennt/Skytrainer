import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme, Text, Button, Title } from "react-native-paper";
import {
  StationsState,
  selectSelectedStation,
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
  const selectedStation: string = useSelector(selectSelectedStation);
  const [currentSelectedStation, setCurrentSelectedStation] =
    useState<string>(selectedStation);
  const title = getStationName(currentSelectedStation) + " Station";

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSelect = async () => {
    navigation.goBack();
    setTimeout(() => {
      dispatch(setSelectedStation(currentSelectedStation));
    }, 180);
  };

  const onValueChange = (stationId: string) => {
    dispatch(setSelectedStation(stationId));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.selectorContainer}>
        <StationSelector
          onValueChange={setCurrentSelectedStation}
          value={currentSelectedStation}
        />
      </View>
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: theme.colors.elevation.level2 },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleGoBack}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
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
