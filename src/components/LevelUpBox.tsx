import { getStationName } from "@src/features/skytrainTrip/SkytrainData";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";
import { useDispatch, useSelector } from "react-redux";
import { MAX_LEVEL } from "@features/reward/LevelHandler";
import { Session } from "@supabase/supabase-js";
import {
  LEVELUP_COSTS,
  REWARD_MULTIPLIERS,
} from "@features/reward/LevelHandler";
import { UserState } from "@src/features/user/userSlice";
import {
  UpdateNumericalBalanceRequest,
  updateBalance,
} from "@src/features/user/userSliceHelpers";
import { AuthState } from "@src/features/auth/authSlice";
import {
  StationLevelUpdateRequest,
  levelUpStation,
} from "@features/stations/stationsSliceHelpers";

interface LevelUpBoxProps {
  selectedStation: string;
  levelData: Map<string, number>;
}

export const LevelUpBox: React.FC<LevelUpBoxProps> = ({
  selectedStation,
  levelData,
}) => {
  const dispatch = useDispatch<any>();
  const level: number | undefined = levelData.get(selectedStation);
  const cost: number = level ? LEVELUP_COSTS[level] : -1;
  const currentMultiplier: number = level ? REWARD_MULTIPLIERS[level] : -1;
  const nextMultiplier: number = level ? REWARD_MULTIPLIERS[level + 1] : -1;
  const balance: number = useSelector(
    (state: { user: UserState }) => state.user.balance
  );
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const canBuy: boolean =
    balance >= cost && level !== undefined && level <= MAX_LEVEL;

  const handleLevelUp = () => {
    if (level) {
      const balanceUpdateRequest: UpdateNumericalBalanceRequest = {
        session: session,
        newBalance: balance - cost,
      };
      const levelUpdateRequest: StationLevelUpdateRequest = {
        session: session,
        stationId: selectedStation,
        newLevel: level + 1,
      };
      dispatch(updateBalance(balanceUpdateRequest));
      dispatch(levelUpStation(levelUpdateRequest));
    }
  };

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
            {"Next level: Rewards \u00D7" +
              currentMultiplier +
              " → \u00D7" +
              nextMultiplier}
          </Text>
        </View>
        <View style={styles.levelUpTextContainer}>
          <Icon name="credit-card-chip" size={18} color={"#1691d9"} />
          <Text style={styles.costText}>{cost}</Text>
          <Button
            style={styles.button}
            onPress={() => handleLevelUp()}
            mode="contained"
            disabled={!canBuy}
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
