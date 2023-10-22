import {
  StationsState,
  selectStations,
} from "@src/features/stations/stationsSlice";
import { memo } from "react";
import { imageIconMap } from "@src/utils/imageMappings";
import { Buyable } from "@src/utils/shop";
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Title, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { selectDarkTheme } from "@src/navigation/navSlice";

interface ProductBoxProps {
  item: Buyable;
  onPress: () => void;
}

const ProductBox: React.FC<ProductBoxProps> = ({ item, onPress }) => {
  // console.log("rendering product box");
  const theme = useTheme();
  const isDark = useSelector(selectDarkTheme);
  const stations = useSelector(selectStations);

  const imageSource: ImageSourcePropType = imageIconMap[
    item.itemid
  ] as ImageSourcePropType;
  const isOwned = stations.has(item.itemid);
  const textColor = isOwned
    ? theme.colors.onSurfaceDisabled
    : theme.colors.onBackground;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={isOwned}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isOwned
              ? theme.colors.surfaceDisabled
              : isDark
              ? theme.colors.secondary
              : theme.colors.background,
          },
          !isDark && !isOwned && styles.lightItem,
        ]}
      >
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
        <Text style={[styles.productName, { color: textColor }]}>
          {item.name}
        </Text>
        {!isOwned ? (
          <View style={styles.price}>
            <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
            <Text style={[styles.priceText, { color: textColor }]}>
              {item.cost}
            </Text>
          </View>
        ) : (
          <View style={styles.price}>
            <Text style={[styles.text, { color: textColor }]}>Owned</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductBox);

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 137,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    position: "absolute",

    top: 167,
    left: 18,
  },
  price: {
    marginTop: 78,
    flexDirection: "row",
  },
  priceText: {
    marginLeft: 6,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  item: {
    flex: 1,
    margin: 10,
    maxWidth: "45%",
  },
  lightItem: {
    shadowOpacity: 0.15,
    shadowColor: "black",
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
  },
});
