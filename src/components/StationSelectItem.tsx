import { imageIconMap } from "@src/utils/imageMappings";
import { memo, useCallback } from "react";
import {
  ImageSourcePropType,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";

interface StationSelectBoxProps {
  stationId: string;
  selectedStation: string;
  level: number;
  onValueChange: (stationId: string) => void;
}

const StationSelectItem: React.FC<StationSelectBoxProps> = ({
  stationId,
  selectedStation,
  level,
  onValueChange,
}) => {
  console.log("rendering station select box");

  const theme = useTheme();
  const imageSource: ImageSourcePropType = imageIconMap[
    stationId
  ] as ImageSourcePropType;

  const memoizedCallback = useCallback(() => {
    console.log("touched " + stationId);
    onValueChange(stationId);
  }, []);

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={memoizedCallback}
        style={[
          stationId === selectedStation
            ? styles.clickSelectorBoxSelected && {
                backgroundColor: theme.colors.secondary,
                borderRadius: 12,
              }
            : styles.clickSelectorBoxUnSelected,
        ]}
      >
        <Image style={styles.iconImage} source={imageSource} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(StationSelectItem);

const styles = StyleSheet.create({
  iconImage: {
    flexGrow: 1,
    width: "100%",
    height: 70,
    resizeMode: "contain",
    marginVertical: 10,
  },
  item: {
    flex: 1,
  },
  clickSelectorBoxSelected: {
    flex: 1,
  },
  clickSelectorBoxUnSelected: {
    flex: 1,
  },
});
