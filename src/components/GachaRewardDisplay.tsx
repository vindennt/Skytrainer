import {
  getStationName,
  getTier,
} from "@src/features/skytrainTrip/SkytrainData";
import { Tier } from "@src/utils/gacha";
import { imageBustMap } from "@src/utils/imageMappings";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Alert,
  Image,
} from "react-native";
import { useTheme, Text } from "react-native-paper";

interface GachaRewardDisplayProps {
  stationId: string;
}

export const GachaRewardDisplay: React.FC<GachaRewardDisplayProps> = ({
  stationId,
}) => {
  const theme = useTheme();
  const title: string = getStationName(stationId);
  const tier: string = getTier(stationId);

  const imageSource: ImageSourcePropType = imageBustMap[
    stationId
  ] as ImageSourcePropType;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 30,
    height: "80%",
  },
  image: {
    // flex: 1,
    borderRadius: 18,
    width: 300,
    // height: 400,
    height: "80%",
  },
  titleContainer: {
    // backgroundColor: "gray",
    alignItems: "center",
  },
  title: {
    margin: 30,
    fontSize: 30,
    fontWeight: "500",
  },
});
