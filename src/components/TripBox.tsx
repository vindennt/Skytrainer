import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { TimeSlider } from "@src/components/TimeSlider";

export const TripBox: React.FC = () => {
  const theme = useTheme();

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
          <Button labelStyle={{ marginVertical: 5 }} mode="contained">
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
    padding: 16,
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
    marginBottom: 4,
  },
  headerText: { fontWeight: "bold" },
});
