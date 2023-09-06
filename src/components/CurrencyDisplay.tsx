import { View } from "react-native";
import { useTheme, Button, IconButton } from "react-native-paper";
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
    <View
      style={{
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingRight: 5,
        // marginTop: 5,
      }}
    >
      <IconButton
        icon="person-circle-outline"
        size={30}
        onPress={goToAccount}
        style={{ right: 15 }}
      />
      {showBalance && (
        <Button
          icon={({ size, color }) => <CommonCurrencyIcon />}
          mode="outlined"
          labelStyle={{ marginVertical: 5, color: theme.colors.onBackground }}
          // onPress={() => console.log("Pressed")}
        >
          {balance.toString()}
        </Button>
      )}
      {showTickets && (
        <Button
          icon={({ size, color }) => <PremiumCurrencyIcon />}
          mode="outlined"
          labelStyle={{ marginVertical: 5, color: theme.colors.onBackground }}
          // onPress={() => console.log("Pressed")}
        >
          {tickets.toString()}
        </Button>
      )}
    </View>
  );
};
