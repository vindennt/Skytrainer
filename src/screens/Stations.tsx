import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { StationSelector } from "@src/components/StationSelectBox";
import { LevelUpBox } from "@src/components/LevelUpBox";
import { useDispatch } from "react-redux";
import { setSelectedStation } from "@src/features/stations/stationsSlice";
import { useCallback } from "react";
import Layout from "@src/components/Layout";

const Stations = () => {
  const dispatch = useDispatch<any>();

  const memoizedCallback = useCallback((stationId: string) => {
    console.log("Stations level callback");
    dispatch(setSelectedStation(stationId));
  }, []);

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.header}>Stations</Text>
        <View style={styles.contentContainer}>
          <StationSelector onValueChange={memoizedCallback} />
          <LevelUpBox />
        </View>
      </View>
    </Layout>
  );
};
export default Stations;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    // paddingTop: 10,

    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingHorizontal: 10,
    // paddingTop: 10,
    flex: 1,
  },
  header: {
    marginLeft: 10,
    marginTop: 15,
    fontSize: 30,
    fontWeight: "700",
  },
});
