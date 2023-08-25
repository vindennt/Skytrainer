import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { UserState, setBalance } from "@src/features/user/userSlice";

const Shop = () => {
  const dispatch = useDispatch<any>();
  const balance = useSelector(
    (state: { user: UserState }) => state.user.balance
  );

  const navigation = useNavigation();

  const goToGacha = () => {
    navigation.navigate("Gacha" as never);
  };

  return (
    <View style={styles.container}>
      <Text>Shop</Text>
      <Button onPress={goToGacha}>Gacha</Button>
      <Button
        onPress={() => {
          console.log(balance);
          dispatch(setBalance(balance + 100));
        }}
      >
        Gain 100 coins
      </Button>
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
