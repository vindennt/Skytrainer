import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";
import { useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";

export const TripBox: React.FC = () => {
  const theme = useTheme();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  return (
    <View>
      <View
        style={[
          styles.tripContainer,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Focus Trip</Text>
          <Button
            labelStyle={{ marginVertical: 5 }}
            mode="contained"
            disabled={sliderValue === 0}
            onPress={() => {
              console.log("pressed");
            }}
          >
            START
          </Button>
        </View>
        <TimeSlider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripContainer: {
    padding: 18,
    borderRadius: 10,
    // flex: 1,
  },
  accountButton: {
    position: "absolute",
    right: 20,
  },
  headerContainer: {
    flexDirection: "row",
    // backgroundColor: "pink",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerText: { fontWeight: "bold" },
});
