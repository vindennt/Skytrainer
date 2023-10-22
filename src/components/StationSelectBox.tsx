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
import { selectLastUsedStation } from "@src/features/user/userSlice";

interface StationSelectorProps {
  onValueChange: (stationId: string) => void;
  selectorVisible?: boolean;
  value?: string;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  onValueChange,
  selectorVisible = true,
  value = useSelector(selectSelectedStation),
}) => {
  const selectedStation = value;
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
      {selectorVisible && (
        <FlatList
          style={styles.selectionList}
          data={[...data]}
          renderItem={renderSelectItem}
          keyExtractor={(item) => item[0]} // Assuming each key is unique
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    // right: 30,
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
