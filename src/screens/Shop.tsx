import * as React from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ShopCard } from "@components/ShopCard";
import { ProductBox } from "@components/ProductBox";
import { Popup } from "@components/Popup";
import { shopData, Buyable, sortByMapPresence } from "@src/utils/shop";
import { useState } from "react";
import { useSelector } from "react-redux";
import { StationsState } from "@src/features/stations/stationsSlice";

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

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const sortedShopData = sortByMapPresence(shopData, stations);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleItemPress = (item: Buyable) => {
    console.log("Item ID:", item);
    setSelectedItem(item);
    // TODO: why doesnt the item change
    setShowPopup(true);
  };

  const renderShopItem = ({ item }: { item: Buyable }) => {
    const isOwned = stations.has(item.itemid);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={!isOwned ? () => handleItemPress(item) : undefined}
        disabled={isOwned}
      >
        <ProductBox
          productName={item.name}
          price={item.cost.toString()}
          id={item.itemid}
          owned={isOwned}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        // data={shopData}
        data={sortedShopData}
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
  overlay: {
    // ...StyleSheet.absoluteFillObject, // Position the overlay absolutely to cover the entire container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay color with some opacity
    // Other overlay styles
  },
});
