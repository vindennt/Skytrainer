import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ProductCard } from "@src/components/ProductCard";
import { ProductBox } from "@components/ProductBox";
import { Popup } from "@components/Popup";
import { shopData, Buyable } from "@src/utils/shop";
import { sortByMapPresence } from "@features/shop/Shop";
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

  let stations: Map<string, number> = new Map<string, number>();
  stations = useSelector(
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
      <Text style={styles.header}>Shop</Text>
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
        <ProductCard
          item={selectedItem}
          onPurchase={handleClosePopup}
        ></ProductCard>
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
