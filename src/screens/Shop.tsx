import * as React from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ShopCard } from "@components/ShopCard";
import { ProductBox } from "@components/ProductBox";
import { Popup } from "@components/Popup";
import { shopData, Buyable } from "@src/utils/shop";
import { useState } from "react";

const Shop = () => {
  // const navigation = useNavigation();
  // const goToGacha = () => {
  //   navigation.navigate("Gacha" as never);
  // };
  const defaultBuyable: Buyable = {
    name: "Waterfront",
    cost: 10,
    itemid: "001",
    category: "00",
  };
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Buyable>(defaultBuyable);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleItemPress = (item: Buyable) => {
    console.log("Item ID:", item);
    setSelectedItem(item);
    // TODO: why doesnt the item change
    setShowPopup(true);
  };

  const renderShopItem = ({ item }: { item: Buyable }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
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
      <Popup
        visible={showPopup}
        onClose={handleClosePopup}
        closeOnTapAnywhere={false}
        closeButtonVisible={true}
      >
        {/* <Text>boo</Text> */}
        <ShopCard item={selectedItem} onPurchase={handleClosePopup}></ShopCard>
      </Popup>
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
  popupContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
