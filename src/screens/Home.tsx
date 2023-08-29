import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState, setSlider } from "@src/features/user/userSlice";

const Home = () => {
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  return (
    <View style={styles.container}>
      <TimeSlider />
      <Text>{sliderValue}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 15,
    padding: 20,
    paddingTop: 5,
    // justifyContent: "center",
  },
  header: {
    marginVertical: 10,
    fontSize: 30,
    fontWeight: "700",
  },
  accountButton: {
    position: "absolute",
    right: 20,
  },
});
