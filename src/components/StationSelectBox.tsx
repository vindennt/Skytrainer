import React, { ChangeEvent, useState } from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { imageBustMap } from "@src/utils/imageMappings";
import StationSelectItem from "@components/StationSelectItem";

interface StationSelectBoxProps {
  stationId: string;
  level: number;
}

interface StationSelectorProps {
  data: Map<string, number>;
  selectedStation: string;
  onValueChange?: (e: string | ChangeEvent<any>) => void;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  data,
  selectedStation,
  onValueChange,
}) => {
  useState<string>(selectedStation);

  const renderSelectItem = ({ item }: { item: [string, number] }) => (
    <StationSelectItem
      stationId={item[0]}
      selectedStation={selectedStation}
      level={item[1]}
      onValueChange={onValueChange}
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
    // backgroundColor: "red",
    // borderRadius: 12,
  },
  iconImage: {
    // flex: 1,
    // width: "80%",
    // right: 30,
    // height: "80%",
    // position: "absolute",
    // backgroundColor: "red",
    // borderRadius: 12,
    // flex: 1,
    flexGrow: 1,
    width: "100%",
    height: 70,
    // height: 40,
    resizeMode: "contain",
    marginVertical: 10,
  },
  selectionList: {
    flex: 1,
    // marginLeft: 16,
    borderRadius: 12,
    // width: 30,
    // backgroundColor: "#454045",
    // padding: 10,
  },
  item: {
    flex: 1,
    // alignItems: "flex-start",
    // borderBottomWidth: 1,
    // borderBottomColor: "gray",
    // backgroundColor: "green",
  },
  stationText: {
    flex: 1,
    marginVertical: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  clickSelectorBoxSelected: {
    flex: 1,
  },
  clickSelectorBoxUnSelected: {
    flex: 1,
  },
  emptyImageOverlay: {
    width: "70%",
  },
});
