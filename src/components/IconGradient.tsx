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

export const CommonCurrencyIcon: React.FC = () => {
  return (
    <GradientIcon
      name="credit-card-chip"
      size={20}
      colors={["#1691d9", "#1691d9"]}
    />
  );
};

export const PremiumCurrencyIcon: React.FC = () => {
  return (
    <GradientIcon
      name="credit-card-chip"
      size={20}
      colors={["#faa93e", "hotpink", "cyan", "blue"]}
      start={{ x: 0.5, y: 0.15 }}
      end={{ x: 0.9, y: 1 }}
      locations={[0, 0.35, 0.7, 1]}
    />
  );
};
