import { StationsState } from "@src/features/stations/stationsSlice";
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

interface ProductBoxProps {
  item: Buyable;
  onPress: () => void;
}

export const ProductBox: React.FC<ProductBoxProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const imageSource: ImageSourcePropType = imageIconMap[
    item.itemid
  ] as ImageSourcePropType;
  const isOwned = stations.has(item.itemid);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={isOwned}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isOwned
              ? theme.colors.onSurfaceDisabled
              : theme.colors.inverseOnSurface,
          },
        ]}
      >
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
        <Text style={styles.productName}>{item.name}</Text>
        {!isOwned ? (
          <View style={styles.price}>
            <Icon name="credit-card-chip" size={18} color={"#1691d9"} />
            <Text style={styles.priceText}>{item.cost}</Text>
          </View>
        ) : (
          <View style={styles.price}>
            <Text style={styles.text}>Owned</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingTop: 16,
    paddingHorizontal: 26,
    paddingBottom: 24,
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 137,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",

    top: 167,
    left: 26,
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
    maxWidth: "50%",
  },
});
