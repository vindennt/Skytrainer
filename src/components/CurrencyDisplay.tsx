import { View, StyleSheet } from "react-native";
import { useTheme, Button, IconButton, Text } from "react-native-paper";
import {
  CommonCurrencyIcon,
  GradientIcon,
  PremiumCurrencyIcon,
} from "@components/IconGradient";
import { useNavigation } from "@react-navigation/native";

interface CurrencyDisplayProps {
  balance: number;
  tickets: number;
  showBalance?: boolean;
  showTickets?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  balance,
  tickets,
  showBalance,
  showTickets,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const goToAccount = () => {
    navigation.navigate("Account" as never);
  };

  if (showBalance === undefined) {
    showBalance = true;
  }
  if (showTickets === undefined) {
    showTickets = true;
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="person-circle-outline"
        size={28}
        onPress={goToAccount}
        style={{ right: 15 }}
        iconColor={theme.colors.onPrimary}
      />
      <View
        style={[
          styles.rowContainer,
          // { borderBottomWidth: 1, borderColor: theme.colors.outline },
        ]}
      >
        {showBalance && (
          <View style={[styles.currencyContainer, { marginRight: "20%" }]}>
            <CommonCurrencyIcon />
            <Text style={styles.text}>{balance.toString()}</Text>
          </View>
        )}
        {showTickets && (
          <View style={[styles.currencyContainer]}>
            <PremiumCurrencyIcon />
            <Text style={styles.text}>{tickets.toString()}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
    // backgroundColor: "pink",
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
