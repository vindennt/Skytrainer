import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface GradientIconProps {
  name: string;
  size: number;
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
}

export const GradientIcon: React.FC<GradientIconProps> = (props) => {
  return (
    <View style={{ width: props.size, height: props.size }}>
      <MaskedView maskElement={<Icon {...props} />}>
        <LinearGradient
          colors={props.colors}
          start={props.start}
          end={props.end}
          locations={props.locations}
        >
          <Icon
            {...props}
            style={{
              opacity: 0,
            }}
          />
        </LinearGradient>
      </MaskedView>
    </View>
  );
};
