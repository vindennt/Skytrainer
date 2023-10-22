import { getStationName, getTier } from "@src/utils/skytrain";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Tier } from "@src/utils/gacha";
import { imageBustMap } from "@src/utils/imageMappings";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Alert,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useTheme, Text } from "react-native-paper";
import React, { useEffect, useRef } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { CommonCurrencyIcon, PremiumCurrencyIcon } from "./IconGradient";

interface GachaRewardDisplayProps {
  stationId: string;
  levelUpMessage: string;
  refundMessage: string;
}

export const GachaRewardDisplay: React.FC<GachaRewardDisplayProps> = ({
  levelUpMessage,
  stationId,
  refundMessage,
}) => {
  const title: string = getStationName(stationId);
  const tier: string = getTier(stationId);
  const imageSource: ImageSourcePropType = imageBustMap[
    stationId
  ] as ImageSourcePropType;

  const allFadeAnim: Animated.Value = useRef(new Animated.Value(0)).current;
  const overlayFadeAnim: Animated.Value = useRef(new Animated.Value(1)).current;
  const textFadeAnim: Animated.Value = useRef(new Animated.Value(0)).current;
  const imageSlideAnim: Animated.Value = useRef(new Animated.Value(0)).current;

  const popAnim: Animated.Value = useRef(new Animated.Value(0)).current;
  const popScale = popAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 3, 1],
  });

  const fadeIn = (value: Animated.Value, duration: number) => {
    Animated.timing(value, {
      toValue: 1,
      duration: duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const slideup = () => {
    Animated.timing(imageSlideAnim, {
      toValue: -25,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    popIn();
    fadeIn(allFadeAnim, 500);
    // fadeIn(overlayFadeAnim);
    setTimeout(() => {
      fadeOut(overlayFadeAnim);
      fadeIn(textFadeAnim, 100);
      slideup();
    }, 1000);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: allFadeAnim, transform: [{ scale: popScale }] },
      ]}
    >
      <Animated.View
        style={[
          styles.overlayView,
          {
            opacity: overlayFadeAnim,
            transform: [{ translateY: imageSlideAnim }],
          },
        ]}
      >
        <MaskedView
          maskElement={
            <Image
              source={imageSource}
              style={styles.imageMask}
              resizeMode="contain"
            />
          }
          style={styles.image}
        >
          <View style={styles.overlay} />
        </MaskedView>
      </Animated.View>
      <Animated.View
        style={[
          styles.overlayView,
          {
            opacity: textFadeAnim,
            transform: [{ translateY: imageSlideAnim }],
          },
        ]}
      >
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.secondaryTextContainer}>
          <Text style={styles.text}>{levelUpMessage}</Text>
          {refundMessage && (
            <View style={styles.priceContainer}>
              <Text style={styles.text}>+</Text>
              {tier === Tier.FOUR_STAR ? (
                <CommonCurrencyIcon />
              ) : (
                <PremiumCurrencyIcon />
              )}
              <Text style={styles.text}>{refundMessage}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 100,
    // marginBottom: "10%",
    // marginTop: "20%",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    // backgroundColor: "gray",
    flex: 1,
    flexDirection: "column",
  },
  priceContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 15,
  },
  imageMask: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 15,
  },
  overlay: {
    backgroundColor: "black",
    flex: 1,
    width: 1000,
    top: 15,
  },
  overlayView: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 999,
    top: 15,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: "10%",
    // backgroundColor: "black",
    paddingHorizontal: 20,
  },
  secondaryTextContainer: {
    paddingTop: 30,
  },
  titleText: {
    textAlign: "center",
    // marginVertical: "20%",
    fontSize: 30,
    fontWeight: "500",
    alignItems: "center",
    color: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    marginVertical: 5,
  },
});
