import { View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { GradientIcon } from "@components/IconGradient";
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
              colors={["white", "#faa93e", "hotpink", "cyan", "blue"]}
              start={{ x: 0.5, y: 0.15 }}
              end={{ x: 0.9, y: 1 }}
              locations={[0, 0.15, 0.35, 0.7, 1]}
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
