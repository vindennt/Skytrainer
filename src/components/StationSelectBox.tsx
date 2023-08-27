import { getStationName } from "@src/features/skytrainTrip/SkytrainData";
import React from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Button } from "react-native-paper";
import {
  StationsState,
  fetchAllStations,
  setSelectedStation,
  unlockStation,
} from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";

interface StationSelectBoxProps {
  stationId: string;
  level: number;
}

interface StationSelectorProps {
  data: Map<string, number>;
  selectedStation: string;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  data,
  selectedStation,
}) => {
  const dispatch = useDispatch<any>();

  const StationSelectBox: React.FC<StationSelectBoxProps> = ({
    stationId,
    level,
  }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSelectedStation(stationId));
          }}
          style={
            stationId === selectedStation
              ? styles.clickSelectorBoxSelected
              : styles.clickSelectorBoxUnSelected
          }
        >
          <Text style={styles.stationText}>{getStationName(stationId)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectItem = ({ item }: { item: [string, number] }) => (
    <StationSelectBox stationId={item[0]} level={item[1]} />
  );
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../public/images/Yvr.png")} // Change to your image's path
      />
      <FlatList
        style={styles.selectionBox}
        data={[...data]}
        renderItem={renderSelectItem}
        keyExtractor={(item) => item[0]} // Assuming each key is unique
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  image: {
    width: "60%",
    height: "100%",
    borderRadius: 12,
  },
  selectionBox: {
    marginLeft: 16,
    borderRadius: 12,
    backgroundColor: "#454045",
    padding: 10,
  },
  item: {
    flex: 1,
    // alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "green",
  },
  stationText: {
    marginVertical: 10,
  },
  clickSelectorBoxSelected: {
    backgroundColor: "royalblue",
    borderRadius: 8,
  },
  clickSelectorBoxUnSelected: {},
});
