import { getStationName } from "@src/features/skytrainTrip/SkytrainData";
import React from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Text, Button } from "react-native-paper";
import {
  StationsState,
  fetchAllStations,
  setSelectedStation,
  unlockStation,
} from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { imageBustMap, imageIconMap } from "@src/utils/imageMappings";

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

  // Cast to ImageSourcePropType or else compiler complains that the type cannot be inferred
  const imageSource: ImageSourcePropType = imageBustMap[
    selectedStation
  ] as ImageSourcePropType;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      <View style={styles.emptyImageOverlay}></View>
      {/* <View style={styles.image}>
        <StationImage stationId={selectedStation} type={ImageType.BUST} />
      </View> */}
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
    width: "100%",
    right: 30,
    height: "100%",
    position: "absolute",
    // borderRadius: 12,
  },
  selectionBox: {
    marginLeft: 16,
    borderRadius: 12,
    width: 30,
    // backgroundColor: "#454045",
    // padding: 10,
  },
  item: {
    flex: 1,
    // alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // backgroundColor: "green",
  },
  stationText: {
    marginVertical: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  clickSelectorBoxSelected: {
    backgroundColor: "royalblue",
    borderRadius: 8,
  },
  clickSelectorBoxUnSelected: {},
  emptyImageOverlay: {
    width: "60%",
  },
});
