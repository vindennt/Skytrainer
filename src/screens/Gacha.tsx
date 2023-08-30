import * as React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { BannerCard } from "@src/components/BannerCard";
import {
  BannerInfo,
  PermanentBannerInfo,
  LimitedBannerInfo,
  FIVE_STAR_GRADIENT,
  FOUR_STAR_GRADIENT,
  Tier,
} from "@utils/gacha";
import { Popup } from "@src/components/Popup";
import { useState } from "react";
import { GachaRewardDisplay } from "@src/components/GachaRewardDisplay";
import { getTier } from "@src/utils/skytrain";

const Gacha = () => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [rewardId, setRewardId] = useState<string>("001");

  const showRewardPopup = (rewardId: string) => {
    setPopupVisible(true);
    setRewardId(rewardId);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Featured</Text>
        <BannerCard
          banner={LimitedBannerInfo}
          popupCallback={showRewardPopup}
        />
        {/* TODO: implement limited banner  */}
        {/* <BannerCard></BannerCard> */}
        <Text style={styles.header}>Permanent</Text>
        <BannerCard
          banner={PermanentBannerInfo}
          popupCallback={showRewardPopup}
        />
      </ScrollView>
      <Popup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
        }}
        backgroundColours={
          getTier(rewardId) === Tier.FIVE_STAR
            ? FIVE_STAR_GRADIENT
            : FOUR_STAR_GRADIENT
        }
      >
        <GachaRewardDisplay stationId={rewardId} />
      </Popup>
    </View>
  );
};

export default Gacha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
    // justifyContent: "center",
  },
  header: {
    marginVertical: 10,
    fontSize: 30,
    fontWeight: "700",
  },
});
