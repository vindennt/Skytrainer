import { useTheme, Card, Text, Button } from "react-native-paper";
import { View, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GradientIcon } from "@components/IconGradient";
import { BannerInfo, LIMITED_PRICE, PERMANENT_PRICE } from "@utils/gacha";
import { useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";

interface BannerCardProps {
  banner: BannerInfo;
}

const calculateTimeDiff = (startDate: Date, endDate: Date): string => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  return `Time remaining: ${remainingDays} days and ${remainingHours} hours`;
};

export const BannerCard: React.FC<BannerCardProps> = ({ banner }) => {
  const theme = useTheme();
  const permanent: boolean = banner.type === "permanent";
  const price: number = permanent ? PERMANENT_PRICE : LIMITED_PRICE;
  const balance: number = permanent
    ? useSelector((state: { user: UserState }) => state.user.balance)
    : useSelector((state: { user: UserState }) => state.user.tickets);
  const canBuy: boolean = balance >= price;
  const dateInfo =
    !permanent && banner.startDate !== undefined && banner.endDate !== undefined
      ? calculateTimeDiff(banner.startDate, banner.endDate)
      : "Permanent";

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
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text variant="titleLarge" style={styles.titleText}>
          {banner.title}
        </Text>
        <Text style={[styles.dateText, { color: theme.colors.outline }]}>
          {dateInfo}
        </Text>
        <Text style={styles.subText}>{banner.description}</Text>
        <View style={styles.actionContainer}>
          <View style={styles.price}>
            {permanent ? (
              <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
            ) : (
              <GradientIcon
                name="credit-card-chip"
                size={20}
                colors={["white", "#faa93e", "hotpink", "cyan", "blue"]}
                start={{ x: 0.5, y: 0.15 }}
                end={{ x: 0.9, y: 1 }}
                locations={[0, 0.15, 0.35, 0.7, 1]}
              />
            )}
            <Text style={styles.priceText}>{price.toString()}</Text>
          </View>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => {
              console.log("Roll pressed");
            }}
            disabled={!canBuy}
          >
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
    // height: "40%",
  },
  titleText: {
    fontWeight: "600",
  },
  subText: {
    marginTop: 20,
    fontSize: 17,
  },
  dateText: {
    marginTop: 5,
    fontSize: 15,
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
