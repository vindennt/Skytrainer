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
    setShowPopup(true);
  };

  const renderShopItem = ({ item }: { item: Buyable }) => {
    return <ProductBox item={item} onPress={() => handleItemPress(item)} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured</Text>
      <View style={styles.bannerContainer}>
        <Text>Gacha baby</Text>
      </View>
      <Text style={styles.header}>Stations</Text>
      <FlatList
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
  },
  bannerContainer: {
    marginLeft: 10,
    backgroundColor: "gray",
  },
  flatListContent: {
    width: "100%",
  },
  popupContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  header: {
    marginLeft: 10,
    marginVertical: 15,
    fontSize: 30,
    fontWeight: "700",
  },
});
