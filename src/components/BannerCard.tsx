import { useTheme, Card, Text, Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GradientIcon } from "@components/IconGradient";

interface BannerCardProps {
  // TODO:  make this accept a banner data type, which it can breakdown into thinsl ike title bn shit
  title: string;
  description: string;
}

export const BannerCard: React.FC = (title, description) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.inverseOnSurface },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("@src/public/images/banner_001.png")}
          style={styles.image}
          //   resizeMode="contain"
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text variant="titleLarge" style={styles.titleText}>
          Card title
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.dateText, { color: theme.colors.outline }]}
        >
          8/20/2023 - 9/20/2023
        </Text>
        <Text variant="bodyMedium" style={styles.subText}>
          Card content
        </Text>
        <View style={styles.actionContainer}>
          <View style={styles.price}>
            <GradientIcon
              name="credit-card-chip"
              size={20}
              colors={["white", "#faa93e", "hotpink", "cyan", "blue"]}
              start={{ x: 0.5, y: 0.15 }}
              end={{ x: 0.9, y: 1 }}
              locations={[0, 0.15, 0.35, 0.7, 1]}
            />
            <Text style={styles.priceText}>160</Text>
          </View>
          <Button style={styles.button} mode="contained">
            Roll
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    // padding: 22,
    flex: 1,
    width: "100%",
    borderRadius: 12,
  },
  contentContainer: {
    // marginTop: 10,
    padding: 30,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 170,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // height: "10vh",
  },
  imageContainer: {
    // flex: 1,
    height: "40%",
  },
  titleText: {
    fontWeight: "500",
  },
  subText: {
    marginTop: 25,
    fontSize: 16,
  },
  dateText: {
    marginTop: 10,
    fontSize: 14,
  },
  actionContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    // borderRadius: 12
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
});
