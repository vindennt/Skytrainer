import { getStationName } from "@src/features/skytrainTrip/SkytrainData";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";

import {
  LEVELUP_COSTS,
  REWARD_MULTIPLIERS,
} from "@features/reward/LevelHandler";

interface LevelUpBoxProps {
  selectedStation: string;
  levelData: Map<string, number>;
}

// TODO: fetch reward multipler for next level
// TODO: fetch the level up cost
// TODO: Implement leveling up
export const LevelUpBox: React.FC<LevelUpBoxProps> = ({
  selectedStation,
  levelData,
}) => {
  const level: number | undefined = levelData.get(selectedStation);
  const cost: number = level ? LEVELUP_COSTS[level] : -1;
  const currentMultiplier: number = level ? REWARD_MULTIPLIERS[level] : -1;
  const nextMultiplier: number = level ? REWARD_MULTIPLIERS[level + 1] : -1;

  return (
    <View>
      <View style={styles.titleContainer}>
        <Title style={styles.headerText}>
          {getStationName(selectedStation)}
        </Title>
        <Title>Lv. {levelData.get(selectedStation)}</Title>
      </View>
      <View style={styles.container}>
        <View style={styles.subtextContainer}>
          <Text style={styles.subtextText}>
            {"Next level: Rewards x" +
              currentMultiplier +
              " → x" +
              nextMultiplier}
          </Text>
        </View>
        <View style={styles.levelUpTextContainer}>
          <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
          <Text style={styles.costText}>{cost}</Text>
          <Button
            style={styles.button}
            onPress={() => {
              console.log("LEVEL PRESSED");
            }}
            mode="contained"
          >
            Level Up
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454045",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtextContainer: {
    // marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  costText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 16,
    marginLeft: 6,
  },
  levelUpTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
    // justifyContent: "flex-end",
    // marginBottom: 16,
  },
  subtextText: {
    // flex: 1,
    fontSize: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    flex: 1,
  },
});
