import { imageBustMap } from "@src/utils/imageMappings";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { useTheme, Text, Title, Button } from "react-native-paper";
import { shopData, Buyable } from "@src/utils/shop";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ShopCardProps {
  item: Buyable;
}

export const ShopCard: React.FC<ShopCardProps> = ({ item }) => {
  const theme = useTheme();

  const imageSource: ImageSourcePropType = imageBustMap[
    item.itemid
  ] as ImageSourcePropType;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.bottomText}>
        <View style={styles.price}>
          <Icon name="credit-card-chip" size={18} color={"#1691d9"} />
          <Text style={styles.priceText}>{item.cost}</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {
            console.log("Pressed");
          }}
        >
          BUY
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 30,
    // height: 300,
    height: "80%",
    // width: "90%",
    // width: 150,
    // flex: 1,
    // flexWrap: "wrap",
  },
  image: {
    // flex: 1,
    borderRadius: 18,
    width: 300,
    // height: 400,
    height: "80%",
    backgroundColor: "gray",
  },
  productName: {
    marginTop: 22,
    fontSize: 16,
    fontWeight: "600",
    // position: "absolute",

    // top: 167,
    // left: 26,
  },
  price: {
    // marginTop: 78,
    marginTop: 22,
    flexDirection: "row",
    // fontWeight: "bold",
  },
  priceText: {
    marginLeft: 6,
    fontSize: 16,
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
