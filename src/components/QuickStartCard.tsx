import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageSourcePropType,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Text, Button, Title, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import { TripReward, getRewards } from "@src/features/reward/TripRewardHandler";
import { findRandomViableTripIds } from "@src/features/skytrain/TripFinder";
import {
  setTrip,
  setRewards,
  SkytrainState,
  setQuickStartId,
  selectCurrentQuickstartId,
} from "@src/features/skytrain/skytrainSlice";
import { getStationName } from "@src/utils/skytrain";
import { Tooltip } from "@components/Tooltip";
import {
  StationsState,
  setSelectedStation,
} from "@src/features/stations/stationsSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { setSlider } from "@src/features/user/userSlice";
import {
  QuickStart,
  getSortedQuickstarts,
} from "@src/features/quickStart/quickStartHandler";
import { QuickStartState } from "@src/features/quickStart/quickStartSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { MAX_QUICKSTARTS } from "@src/features/quickStart/quickStartHandler";
import { handleQuickStartAvailability } from "@src/utils/dates";
import { LinearGradient } from "expo-linear-gradient";
import { selectDarkTheme } from "@src/navigation/navSlice";
import { imageIconMap } from "@src/utils/imageMappings";

interface QuickStartButtonProps extends QuickStart {}

export const QuickStartCard: React.FC = ({}) => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const isDark = useSelector(selectDarkTheme);

  const skytrainGraph = useSelector(
    (state: { skytrain: SkytrainState }) => state.skytrain.skytrainGraph
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const quickstarts: QuickStart[] = useSelector(
    (state: { quickStart: QuickStartState }) => state.quickStart.quickstarts
  );
  const sortedQuickStarts: QuickStart[] = getSortedQuickstarts(quickstarts);

  const [isAtEnd, setIsAtEnd] = useState(false);

  const fadeAnim: Animated.Value = React.useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 160,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 160,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Calculate the position of the scroll

    const buffer = 10;
    const isAtEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - buffer;

    // setIsAtEnd(isAtEnd);
    if (isAtEnd) {
      console.log("fading out");
      fadeOut();
    } else {
      console.log("fading in");
      fadeIn();
    }
  };

  const [loading, setIsLoading] = useState<boolean>(false);

  const handleQuickPress = async (
    duration: number,
    stationId: string,
    quickstartId: string
  ) => {
    setIsLoading(true);
    console.log(
      getStationName(stationId) +
        ", id " +
        stationId +
        ", starting focus trip for " +
        duration
    );

    dispatch(setSlider(duration));
    const tripPath: string[] = findRandomViableTripIds(
      skytrainGraph,
      stationId,
      duration
    );
    const rewards: TripReward = getRewards(tripPath, stations);
    dispatch(setTrip(tripPath));
    dispatch(setQuickStartId(quickstartId));
    dispatch(setRewards(rewards));

    console.log("Mission: Navigating to Timer via QuickStart");
    navigation.navigate("Timer" as never);
    setIsLoading(false);
  };

  const QuickStartElement: React.FC<QuickStartButtonProps> = ({
    id = "",
    stationId = "000",
    name,
    duration = 0,
    lastFinished = null,
  }) => {
    const isAvailable: boolean = handleQuickStartAvailability(lastFinished);
    const textColor: string = isAvailable
      ? theme.colors.onBackground
      : theme.colors.outlineVariant;
    // console.log(
    //   name + " is available: " + isAvailable + " for date " + lastFinished
    // );
    const imageSource: ImageSourcePropType = imageIconMap[
      stationId
    ] as ImageSourcePropType;

    return (
      <View
        style={[
          styles.quickButtonStyleContainer,
          { borderColor: theme.colors.outline },
        ]}
      >
        <View style={styles.horizontalContainer}>
          <Image style={styles.iconImage} source={imageSource} />
          <View style={styles.quickButtonTextContainer}>
            <Text
              style={[
                styles.textTitle,
                {
                  marginTop: 5,
                  color: textColor,
                  // fontFamily: "Nothing",
                },
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                styles.text,
                { color: textColor, fontFamily: "Nothing" },
                // { fontWeight: "bold" },
              ]}
            >
              {duration + " mins"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (duration > 0 && stationId !== "000") {
              handleQuickPress(duration, stationId, id);
            }
          }}
          style={[{ alignItems: "center" }]}
          disabled={!isAvailable || loading}
        >
          <View
            style={[
              styles.quickButtonStyle,
              {
                backgroundColor: isAvailable
                  ? theme.colors.primary
                  : "transparent",
              },
            ]}
          >
            <Icon
              name={isAvailable ? "play" : "checkmark-sharp"}
              color={
                isAvailable
                  ? theme.colors.onPrimary
                  : theme.colors.outlineVariant
              }
              style={{ left: 1 }}
              size={24}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const tooltipContent: React.ReactNode = (
    <View style={styles.tooltip}>
      <Text style={[styles.text, { color: "white" }]}>Max: 5</Text>
    </View>
  );

  const tooltipButton: React.ReactNode = (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Create Quick Start" as never);
      }}
      disabled={quickstarts.length >= MAX_QUICKSTARTS}
    >
      <Icon
        name="add"
        color={
          quickstarts.length < MAX_QUICKSTARTS
            ? theme.colors.onPrimary
            : theme.colors.outline
        }
        size={28}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Daily tasks</Text>
        <View style={styles.quickActionContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Edit Quickstarts" as never);
            }}
            disabled={quickstarts.length === 0}
          >
            <Icon
              name="create-outline"
              color={
                quickstarts.length > 0
                  ? theme.colors.onPrimary
                  : theme.colors.outline
              }
              size={24}
            />
          </TouchableOpacity>
          {quickstarts.length < MAX_QUICKSTARTS && tooltipButton}
          {quickstarts.length >= MAX_QUICKSTARTS && (
            <Tooltip content={tooltipContent}>{tooltipButton}</Tooltip>
          )}
        </View>
      </View>

      <View
        style={[
          styles.quickstartContainer,
          quickstarts.length >= 3 && { justifyContent: "space-between" },
        ]}
      >
        {quickstarts.length === 0 && (
          <View style={styles.textContainer}>
            <Text style={{ color: theme.colors.outlineVariant }}>
              No quickstarts created. Let's make one!
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollContainer}
            scrollEventThrottle={160}
            onScroll={handleScroll}
          >
            {sortedQuickStarts.map((quickstart) => {
              return (
                quickstart.id && (
                  <QuickStartElement
                    key={quickstart.id}
                    id={quickstart.id}
                    stationId={quickstart.stationId}
                    name={quickstart.name}
                    duration={quickstart.duration}
                    lastFinished={quickstart.lastFinished}
                  />
                )
              );
            })}
          </ScrollView>

          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "5%",
              opacity: fadeAnim,
              pointerEvents: "box-only",
            }}
          >
            <LinearGradient
              style={{
                flex: 1,
                // backgroundColor: "red",
              }}
              // Note: something about React Native Paper theme makes these colors unusable with theme hook
              colors={[
                isDark ? "rgba(28, 28, 35, 0)" : "rgba(255, 255, 255, 0)",
                theme.colors.background,
              ]}
              locations={[0, 0.95]}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default QuickStartCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "purple",
    // padding: 20,
    // paddingBottom: 20,
    borderRadius: 12,
    // marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quickstartContainer: {
    flexDirection: "column",
    paddingTop: 16,
    // alignItems: "flex-start",
    flex: 1,
    // justifyContent: "space-between",
    justifyContent: "flex-start",
    // gap: 20,
    // backgroundColor: "black",
  },
  quickButtonStyle: {
    // flexWrap: "wrap",
    width: 50,
    height: 50,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 5,
  },
  quickButtonStyleContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    justifyContent: "space-between",
    borderTopWidth: 0.2,
    paddingTop: 12,
    // marginHorizontal: 20,
    // marginRight: 10,
    marginBottom: 10,
  },
  quickButtonTextContainer: {
    flexDirection: "column",
    // backgroundColor: "black",
    alignItems: "baseline",
    justifyContent: "flex-start",
    bottom: 5,
  },
  quickActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // backgroundColor: "green",
  },

  text: {
    fontSize: 18,
  },
  textTitle: {
    fontSize: 30,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
  },
  scrollContainer: {
    flex: 1,
    // backgroundColor: "green",
    // flexWrap: "wrap",
    // flexGrow: 1,
    // height: 200,
  },
  iconImage: {
    flexGrow: 1,
    width: 50,
    maxWidth: 50,
    height: 50,
    // resizeMode: "contain",
    // marginVertical: 10,
    marginRight: 20,
  },
});
