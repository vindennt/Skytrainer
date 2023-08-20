import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Shop from "../app/screens/Shop";
import Gacha from "../app/screens/Gacha";
import Account from "../app/screens/Account";
import Home from "../app/screens/Home";
import { NavigationProp } from "@react-navigation/native";

export interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const AccountRouter = () => <Account></Account>;

const Navbar = ({ navigation }: RouterProps) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "shop", title: "Shop", focusedIcon: "store" },
    { key: "gacha", title: "Gacha", focusedIcon: "credit-card" },
    {
      key: "account",
      title: "Account",
      focusedIcon: "account",
      unfocusedIcon: "account",
    },
  ]);

  //   const HomeRoute = () => <Home navigation={navigation}></Home>;
  const HomeRoute = () => <Home navigation={navigation}></Home>;
  const ShopRoute = () => <Shop></Shop>;
  const GachaRoute = () => <Gacha></Gacha>;

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    shop: ShopRoute,
    gacha: GachaRoute,
    account: AccountRouter,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Navbar;
