import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
import { TripBox } from "@src/components/TripBox";
import { imageBustMap } from "@src/utils/imageMappings";
import { StationsState } from "@src/features/stations/stationsSlice";
import { useNavigation } from "@react-navigation/native";
import { getStationName } from "@src/utils/skytrain";

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );
  const selectedStation = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );
  const goToStationSelect = () => {
    navigation.navigate("Select Station" as never);
  };
  const title = getStationName(selectedStation) + " Station";
  const imageSource: ImageSourcePropType = imageBustMap[
    selectedStation
  ] as ImageSourcePropType;

  return (
    <View style={styles.container}>
      <Text style={styles.stationTitleText}>{title}</Text>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={goToStationSelect}
      >
        <Image style={styles.image} source={imageSource} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.timeHeader}>
        <Text style={styles.timeText}>{sliderValue} mins</Text>
        <Button
          icon="chevron-forward-outline"
          onPress={goToStationSelect}
          contentStyle={{ flexDirection: "row-reverse" }}
          labelStyle={{ marginVertical: 2 }}
        >
          Change Station
        </Button>
      </View>
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
    fontSize: 40,
    fontWeight: "500",
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 8,
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
