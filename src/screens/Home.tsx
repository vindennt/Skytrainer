import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState, setSlider } from "@src/features/user/userSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { TripBox } from "@src/components/TripBox";

const Home = () => {
  const theme = useTheme();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  return (
    <View style={styles.container}>
      <View style={styles.timeHeader}>
        <Text style={styles.timeText}>{sliderValue} mins</Text>
        <Button
          icon="chevron-forward-outline"
          onPress={() => {
            console.log("pressed");
          }}
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
    padding: 20,
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
});
