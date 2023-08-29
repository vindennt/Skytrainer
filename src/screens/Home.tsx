import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useState } from "react";

const Home = () => {
  const [sliderValue, setSliderValue] = useState<number>(25);

  return (
    <View style={styles.container}>
      <TimeSlider onValueChange={(value) => setSliderValue(value)} />
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
  slider: {
    width: "90%",
    height: 40,
    paddingHorizontal: 10,
  },
});
