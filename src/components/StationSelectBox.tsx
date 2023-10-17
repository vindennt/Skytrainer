import React, { useCallback } from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { imageBustMap } from "@src/utils/imageMappings";
import StationSelectItem from "@components/StationSelectItem";
import {
  selectSelectedStation,
  selectStations,
} from "@src/features/stations/stationsSlice";
import { useSelector } from "react-redux";

interface StationSelectorProps {
  onValueChange: (stationId: string) => void;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  onValueChange,
}) => {
  const selectedStation = useSelector(selectSelectedStation);
  const data = useSelector(selectStations);

  const memoizedCallback = useCallback((stationId: string) => {
    onValueChange(stationId);
  }, []);

  const renderSelectItem = ({ item }: { item: [string, number] }) => (
    <StationSelectItem
      stationId={item[0]}
      selectedStation={selectedStation}
      level={item[1]}
      onValueChange={memoizedCallback}
    />
  );

  // Cast to ImageSourcePropType or else compiler complains that the type cannot be inferred
  const imageSource: ImageSourcePropType = imageBustMap[
    selectedStation
  ] as ImageSourcePropType;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      <View style={styles.emptyImageOverlay}></View>
      <FlatList
        style={styles.selectionList}
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
    flex: 1,
    width: "100%",
    right: 30,
    height: "110%",
    position: "absolute",
  },
  selectionList: {
    flex: 1,
    borderRadius: 12,
  },
  stationText: {
    flex: 1,
    marginVertical: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  emptyImageOverlay: {
    width: "70%",
  },
});
