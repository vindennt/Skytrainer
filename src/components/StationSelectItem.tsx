import { setSelectedStation } from "@src/features/stations/stationsSlice";
import { imageIconMap } from "@src/utils/imageMappings";
import { ChangeEvent, memo, useCallback } from "react";
import {
  ImageSourcePropType,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

interface StationSelectBoxProps {
  stationId: string;
  selectedStation: string;
  level: number;
  onValueChange?: (e: string | ChangeEvent<any>) => void;
}

const StationSelectItem: React.FC<StationSelectBoxProps> = ({
  stationId,
  selectedStation,
  level,
  onValueChange,
}) => {
  console.log("rendering station select box");

  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const imageSource: ImageSourcePropType = imageIconMap[
    stationId
  ] as ImageSourcePropType;

  //   const handlePress = () => {
  //     console.log("touched " + stationId);
  //     onValueChange !== undefined
  //       ? onValueChange(stationId)
  //       : dispatch(setSelectedStation(stationId));
  //   };

  const memoizedCallback = useCallback(() => {
    console.log("touched " + stationId);
    onValueChange !== undefined
      ? onValueChange(stationId)
      : dispatch(setSelectedStation(stationId));
    // dispatch(setSelectedStation(stationId));
  }, []);

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={memoizedCallback}
        style={[
          stationId === selectedStation
            ? styles.clickSelectorBoxSelected && {
                backgroundColor: theme.colors.secondary,
                borderRadius: 12,
              }
            : styles.clickSelectorBoxUnSelected,
        ]}
      >
        <Image style={styles.iconImage} source={imageSource} />
        {/* <Text style={styles.stationText}>{getStationName(stationId)}</Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default memo(StationSelectItem);

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
