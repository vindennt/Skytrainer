import * as React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { BannerCard } from "@src/components/BannerCard";

const Gacha = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Featured</Text>
        <BannerCard></BannerCard>
        <Text style={styles.header}>Permanent</Text>
        <BannerCard></BannerCard>
      </ScrollView>
    </View>
  );
};

export default Gacha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 15,
    paddingHorizontal: 20,
    // justifyContent: "center",
  },
  header: {
    marginVertical: 10,
    fontSize: 30,
    fontWeight: "700",
  },
});
