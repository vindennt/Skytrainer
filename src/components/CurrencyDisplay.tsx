import { View } from "react-native";
import { Button } from "react-native-paper";
import { GradientIcon } from "@components/IconGradient";

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
        justifyContent: "space-evenly",
        marginTop: 5,
      }}
    >
      {showBalance && (
        <Button
          icon={({ size, color }) => (
            <GradientIcon
              name="credit-card-chip"
              size={20}
              colors={["#1691d9", "#1691d9"]}
            />
          )}
          mode="outlined"
          labelStyle={{ marginVertical: 5 }}
          // onPress={() => console.log("Pressed")}
        >
          {balance.toString()}
        </Button>
      )}
      {showTickets && (
        <Button
          icon={({ size, color }) => (
            <GradientIcon
              name="credit-card-chip"
              size={20}
              colors={["white", "gold", "hotpink", "cyan", "dodgerblue"]}
              start={{ x: 0.5, y: 0.15 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.2, 0.4, 0.7, 1]}
            />
          )}
          mode="outlined"
          labelStyle={{ marginVertical: 5 }}
          // onPress={() => console.log("Pressed")}
        >
          {tickets.toString()}
        </Button>
      )}
    </View>
  );
};
