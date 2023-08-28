import { imageIconMap } from "@src/utils/imageMappings";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { useTheme, Text, Title, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ProductBoxProps {
  productName: string;
  id: string;
  price: string;
  owned: boolean;
}

export const ProductBox: React.FC<ProductBoxProps> = ({
  productName,
  id,
  price,
  owned,
}) => {
  const theme = useTheme();

  const imageSource: ImageSourcePropType = imageIconMap[
    id
  ] as ImageSourcePropType;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: owned
            ? theme.colors.onSurfaceDisabled
            : theme.colors.inverseOnSurface,
        },
      ]}
    >
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.productName}>{productName}</Text>
      {!owned ? (
        <View style={styles.price}>
          <Icon name="credit-card-chip" size={18} color={"#1691d9"} />
          <Text style={styles.priceText}>{price}</Text>
        </View>
      ) : (
        <View style={styles.price}>
          <Text style={styles.text}>Owned</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingTop: 16,
    paddingHorizontal: 26,
    paddingBottom: 24,
    // paddingVertical: 20,
    flex: 1,
    // width: "50%",
    // width: 150,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 137,
    // backgroundColor: "red",
  },
  productName: {
    // marginTop: 22,
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",

    top: 167,
    left: 26,
  },
  price: {
    marginTop: 78,
    // marginTop: 20,
    flexDirection: "row",
    // fontWeight: "bold",
  },
  priceText: {
    marginLeft: 6,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});
