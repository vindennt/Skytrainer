import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const Missions = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Missions.</Text>
    </View>
  );
};

export default Missions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 8,
    // alignItems: "center",
    // justifyContent: "center",
    padding: 20,
    // backgroundColor: "pink",
  },
  text: {
    fontSize: 16,
  },
});
