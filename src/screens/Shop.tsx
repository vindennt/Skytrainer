import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Shop = () => {
  const navigation = useNavigation();

  const goToGacha = () => {
    navigation.navigate("Gacha" as never);
  };

  return (
    <View style={styles.container}>
      <Text>Shop</Text>
      <Button onPress={goToGacha}>Gacha</Button>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
