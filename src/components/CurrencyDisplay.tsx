import { View } from "react-native";
import { Button } from "react-native-paper";

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
          // icon="logo-usd"
          icon="server"
          mode="outlined"
          labelStyle={{ marginVertical: 5 }}
          // onPress={() => console.log("Pressed")}
        >
          {balance.toString()}
        </Button>
      )}
      {showTickets && (
        <Button
          // icon="card"
          icon="card"
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
