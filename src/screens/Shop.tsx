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
import ProductBox from "@components/ProductBox";
import { Popup } from "@components/Popup";
import {
  shopData,
  Buyable,
  sortByCategory,
  StationTabCategories,
} from "@src/utils/shop";
import { sortByMapPresence } from "@features/shop/Shop";
import { useState } from "react";
import { useSelector } from "react-redux";
import { StationsState } from "@src/features/stations/stationsSlice";
import { BannerCard } from "@src/components/BannerCard";
import {
  BannerInfo,
  PermanentBannerInfo,
  LimitedBannerInfo,
  FIVE_STAR_GRADIENT,
  FOUR_STAR_GRADIENT,
  Tier,
} from "@utils/gacha";
import { getTier } from "@src/utils/skytrain";
import { GachaRewardDisplay } from "@src/components/GachaRewardDisplay";
import { selectLimitedBanner } from "@src/features/shop/shopSlice";
import TabControl from "@src/components/TabControl";
import Layout from "@src/components/Layout";
import { BlurView } from "expo-blur";

const Shop = () => {
  const defaultBuyable: Buyable = {
    name: "Waterfront",
    cost: 10,
    itemid: "001",
    category: "00",
  };
  const limitedText: string = "Limited Banner";
  const permanentText: string = "Permanent Banner";

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Buyable>(defaultBuyable);
  const [gachaPopup, setGachaPopup] = useState<boolean>(false);

  const [rewardId, setRewardId] = useState<string>("001");

  let stations: Map<string, number> = new Map<string, number>();
  stations = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const sortedShopData = sortByMapPresence(shopData, stations);

  const limitedBanner: BannerInfo | null = useSelector(selectLimitedBanner);

  const bannerTabOptions: string[] = limitedBanner
    ? [limitedText, permanentText]
    : [permanentText];
  const [selectedBannerTab, setSelectedBannerTab] = useState<number>(0);
  const [selectedStationTab, setSelectedStationTab] = useState<number>(0);
  const stationsTabOptions: string[] = ["All", "EXP", "CND", "MLN", "EGN"];
  const filteredShopData = sortByCategory(
    sortedShopData,
    StationTabCategories[selectedStationTab].value
  );

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleItemPress = (item: Buyable) => {
    console.log("Item ID:", item);
    setSelectedItem(item);
    setGachaPopup(false);
    setShowPopup(true);
  };

  const renderShopItem = ({ item }: { item: Buyable }) => {
    return <ProductBox item={item} onPress={() => handleItemPress(item)} />;
  };

  const showRewardPopup = (rewardId: string) => {
    setShowPopup(true);
    setGachaPopup(true);
    setRewardId(rewardId);
  };

  return (
    <Layout position="absolute">
      <View style={styles.container}>
        <Text style={styles.header}>Shop</Text>

        <FlatList
          ListHeaderComponent={
            <View style={styles.container}>
              <TabControl
                index={selectedBannerTab}
                onChange={setSelectedBannerTab}
                options={bannerTabOptions}
              />

              {limitedBanner !== null &&
                bannerTabOptions[selectedBannerTab] === limitedText && (
                  <View>
                    {/* <Text style={styles.subheader}>Limited Time</Text> */}
                    <BannerCard
                      banner={limitedBanner}
                      popupCallback={showRewardPopup}
                      popupVisible={showPopup}
                    />
                  </View>
                )}
              {/* <Text style={styles.subheader}>Permanent</Text> */}
              {bannerTabOptions[selectedBannerTab] === permanentText && (
                <View>
                  <BannerCard
                    banner={PermanentBannerInfo}
                    popupCallback={showRewardPopup}
                    popupVisible={showPopup}
                  />
                </View>
              )}
              <Text style={styles.subheader}>Stations</Text>
              <View style={styles.tabContainer}>
                <TabControl
                  index={selectedStationTab}
                  onChange={setSelectedStationTab}
                  options={stationsTabOptions}
                />
              </View>
            </View>
          }
          data={filteredShopData}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.itemid}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />

        <Popup
          visible={showPopup}
          onClose={handleClosePopup}
          {...(gachaPopup
            ? {
                closeOnTapAnywhere: true,
                closeButtonVisible: false,
                backgroundColours:
                  getTier(rewardId) === Tier.FIVE_STAR
                    ? FIVE_STAR_GRADIENT
                    : FOUR_STAR_GRADIENT,
              }
            : { closeOnTapAnywhere: false, closeButtonVisible: true })}
        >
          {gachaPopup ? (
            <GachaRewardDisplay stationId={rewardId} />
          ) : (
            <ProductCard item={selectedItem} onPurchase={handleClosePopup} />
          )}
        </Popup>
      </View>
    </Layout>
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
  subheader: {
    // marginLeft: 10,
    // marginVertical: 15,
    fontSize: 24,
    fontWeight: "400",
  },
  tabContainer: {
    marginVertical: 10,
  },
});
