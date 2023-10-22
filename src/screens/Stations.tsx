import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { StationSelector } from "@src/components/StationSelectBox";
import { LevelUpBox } from "@src/components/LevelUpBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStation } from "@src/features/stations/stationsSlice";
import { useCallback, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Layout from "@src/components/Layout";
import {
  selectLevelingUpMode,
  setLevelingUpMode,
} from "@src/navigation/navSlice";

const Stations = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const [isViewingMode, setIsViewingMode] = useState<boolean>(false);
  const levelUpMode = useSelector(selectLevelingUpMode);

  const fadeAnim: Animated.Value = useRef(new Animated.Value(1)).current;
  const slideAnim: Animated.Value = useRef(new Animated.Value(0)).current;
  const handleToggleViewingMode = () => {
    if (!isViewingMode) {
      console.log("fading out");
      setIsViewingMode(true);
      slideOut();
      fadeOut();
    } else {
      console.log("fading in");
      setIsViewingMode(false);
      slideIn();
      fadeIn();
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleExitToggleViewingMode = () => {
    if (isViewingMode) handleToggleViewingMode();
  };

  const handleExitLevelMode = () => {
    dispatch(setLevelingUpMode(false));
  };

  const memoizedCallback = useCallback((stationId: string) => {
    console.log("Stations level callback");
    dispatch(setSelectedStation(stationId));
  }, []);

  return (
    <Layout position="relative">
      <TouchableWithoutFeedback
        style={styles.overlay}
        onPress={handleExitToggleViewingMode}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Animated.View
              style={[styles.headerContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.header}>Stations</Text>
              {levelUpMode ? (
                <TouchableOpacity onPress={handleExitLevelMode}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: theme.colors.onPrimary },
                    ]}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                !isViewingMode && (
                  <TouchableOpacity onPress={handleToggleViewingMode}>
                    <Icon
                      name="eye-off-outline"
                      color={theme.colors.onPrimary}
                      size={24}
                    />
                  </TouchableOpacity>
                )
              )}
            </Animated.View>

            <View style={styles.selectorContainer}>
              <StationSelector
                onValueChange={memoizedCallback}
                selectorVisible={!isViewingMode && !levelUpMode}
              />
            </View>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }}
            >
              <LevelUpBox />
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};
export default Stations;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    // paddingTop: 10,
    // paddingBottom: 85,
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    paddingHorizontal: 20,
    // paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    // paddingHorizontal: 10,
    // paddingTop: 10,
    flex: 1,
  },
  selectorContainer: {
    flex: 1,
    // paddingLeft: 50,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "700",
    // fontFamily: "Nothing",
  },
  overlay: {
    zIndex: 999,
    opacity: 1,
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",

    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 16,
  },
});
