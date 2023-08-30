import { getStationName } from "@src/utils/skytrain";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";
import { useDispatch, useSelector } from "react-redux";
import { MAX_LEVEL } from "@src/utils/levels";
import { Session } from "@supabase/supabase-js";
import { LEVELUP_COSTS, REWARD_MULTIPLIERS } from "@src/utils/levels";
import { UserState } from "@src/features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
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
    balance >= cost && level !== undefined && level < MAX_LEVEL;
  const [loading, setLoading] = useState<boolean>(false);

  const maxLevel: boolean = level === MAX_LEVEL;
  const buttonText: string = maxLevel ? "MAX LEVEL" : "LEVEL UP";
  const subText: string = maxLevel
    ? `Current level: Rewards \u00D7${currentMultiplier}`
    : `Next level: Rewards \u00D7${currentMultiplier} → \u00D7${nextMultiplier}`;

  const handleLevelUp = () => {
    if (level !== undefined && level < 50) {
      setLoading(true);
      // const balanceUpdateRequest: UpdateNumericalBalanceRequest = {
      //   session: session,
      //   newBalance: balance - cost,
      // };
      const newBalance = balance - cost;
      if (newBalance < 0) {
        throw new Error(
          "LevelUpBox: " + balance + " cannot afford cost " + cost
        );
      }
      const balanceUpdateRequest: UpdateUserRequest = {
        session: session,
        update: { balance: newBalance },
      };
      dispatch(updateUserData(balanceUpdateRequest));
      const levelUpdateRequest: StationLevelUpdateRequest = {
        session: session,
        stationId: selectedStation,
        newLevel: level + 1,
      };
      dispatch(levelUpStation(levelUpdateRequest));
      setTimeout(() => {
        setLoading(false);
      }, 600);
    } else {
      throw new Error("Already max level");
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
          <Text style={styles.subtextText}>{subText}</Text>
        </View>

        <View style={styles.levelUpTextContainer}>
          {!maxLevel && (
            <View style={styles.costContainer}>
              <Icon name="credit-card-chip" size={20} color={"#1691d9"} />
              <Text style={styles.costText}>{cost}</Text>
            </View>
          )}
          <Button
            style={styles.button}
            onPress={() => handleLevelUp()}
            mode="contained"
            disabled={!canBuy || loading}
            loading={loading}
          >
            {buttonText}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454045",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
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
    // fontWeight: "bold",
    fontSize: 16,
    marginRight: 16,
    marginLeft: 6,
  },
  levelUpTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
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
    // borderRadius: 12,
    flex: 1,
  },
  costContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
