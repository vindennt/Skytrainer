import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  UserState,
  selectSlider,
  selectLastUsedStation,
} from "@src/features/user/userSlice";
import { TripBox } from "@src/components/TripBox";
import { imageBustMap } from "@src/utils/imageMappings";
import {
  StationsState,
  selectSelectedStation,
  setSelectedStation,
} from "@src/features/stations/stationsSlice";
import { useNavigation } from "@react-navigation/native";
import { getStationName } from "@src/utils/skytrain";
import { useEffect, useMemo } from "react";
import { setMissionBadgeVisibility } from "@src/navigation/navSlice";

const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const sliderValue = useSelector(selectSlider);
  const lastUsedStation = useSelector(selectLastUsedStation);
  const selectedStation = useSelector(selectSelectedStation);

  const title = getStationName(lastUsedStation) + " Station";
  const imageSource: ImageSourcePropType = imageBustMap[
    selectedStation
  ] as ImageSourcePropType;

  const goToStationSelect = () => {
    dispatch(setSelectedStation(selectedStation));
    navigation.navigate("Select Station" as never);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={goToStationSelect}
      >
        <Image style={styles.image} source={imageSource} resizeMode="contain" />
      </TouchableOpacity>
      <TripBox />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timeText: {
    fontSize: 24,
    // fontWeight: "500",
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "red",
    // justifyContent: "space-between",
    // marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    // borderRadius: 12,
  },
  imageContainer: {
    flex: 1,
    // backgroundColor: "gray",
    // position: "absolute",
    // width: 300,
    // maxHeight: "60%",
  },
  stationTitleText: {
    fontSize: 16,
    textAlign: "center",
  },
});
