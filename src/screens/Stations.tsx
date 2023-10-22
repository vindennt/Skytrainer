import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { StationSelector } from "@src/components/StationSelectBox";
import { LevelUpBox } from "@src/components/LevelUpBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStation } from "@src/features/stations/stationsSlice";
import { useCallback, useState } from "react";
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

  const handleToggleViewingMode = () => {
    setIsViewingMode(!isViewingMode);
  };

  const handleExitLevelMode = () => {
    dispatch(setLevelingUpMode(false));
  };

  const handleOverlayPress = () => {
    if (isViewingMode) {
      console.log("Overlay pressed");
      setIsViewingMode(false);
    }
  };

  const memoizedCallback = useCallback((stationId: string) => {
    console.log("Stations level callback");
    dispatch(setSelectedStation(stationId));
  }, []);

  return (
    <Layout position="relative">
      <TouchableWithoutFeedback
        style={styles.overlay}
        onPress={handleOverlayPress}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {!isViewingMode && (
              <View style={styles.headerContainer}>
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
                        name={isViewingMode ? "eye-outline" : "eye-off-outline"}
                        color={theme.colors.onPrimary}
                        size={24}
                      />
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
            <View style={styles.selectorContainer}>
              <StationSelector
                onValueChange={memoizedCallback}
                selectorVisible={!isViewingMode && !levelUpMode}
              />
            </View>
            {!isViewingMode && <LevelUpBox />}
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
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  buttonText: {
    fontSize: 16,
  },
});
