import * as React from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ProductBox } from "@src/components/ProductBox";
import { shopData, Buyable } from "@src/utils/shop";

const Shop = () => {
  // const navigation = useNavigation();
  // const goToGacha = () => {
  //   navigation.navigate("Gacha" as never);
  // };

  const handleItemPress = (itemId: string) => {
    console.log("Item ID:", itemId);
  };

  const renderShopItem = ({ item }: { item: Buyable }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item.itemid)}
    >
      <ProductBox
        productName={item.name}
        price={item.cost.toString()}
        id={item.itemid}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shopData}
        renderItem={renderShopItem}
        keyExtractor={(item) => item.itemid}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    // justifyContent: "center",
  },
  flatListContent: {
    width: "100%",
    // backgroundColor: "gray",
  },
  item: {
    flex: 1,
    margin: 10,
    maxWidth: "45%",
    // height: "30%",
    // backgroundColor: "pink",
  },
});
