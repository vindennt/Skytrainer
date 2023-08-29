import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const slider = {
    min: 0,
    max: 300,
    proportion: 120,
    visualStep: 1,
    step: 5,
  };

  return <View style={styles.container}></View>;
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
