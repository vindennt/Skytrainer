import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const Trip = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Timer ticking");
    setTimeout(() => {
      navigation.navigate("Trip" as never);
    }, 2000);
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text>Get off your phone, get focusing.</Text>
      <Text style={styles.timerText}>00:00</Text>
      <Button
        mode="outlined"
        onPress={() => {
          navigation.goBack();
        }}
      >
        Cancel
      </Button>
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "pink",
  },
  text: {
    fontSize: 16,
  },
  timerText: {
    fontSize: 50,
    fontWeight: "200",
    margin: 30,
  },
});
