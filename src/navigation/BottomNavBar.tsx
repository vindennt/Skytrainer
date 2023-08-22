import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Shop from "@src/screens/Shop";
import Stations from "@src/screens/Stations";
import Account from "@screens/Account";

const BottomNavBar = () => {
  const HomeRoute = () => <Text>Welcome Home</Text>;
  const StationsRoute = () => <Stations />;
  const ShopRoute = () => <Shop />;
  const AccountRoute = () => <Account />;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "stations",
      title: "Stations",
      focusedIcon: "transit-connection-variant",
    },
    {
      key: "shop",
      title: "Shop",
      focusedIcon: "shopping",
      unfocusedIcon: "shopping-outline",
    },
    {
      key: "account",
      title: "Account",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    stations: StationsRoute,
    shop: ShopRoute,
    account: AccountRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
    />
  );
};

export default BottomNavBar;
