import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Shop from "../app/screens/Shop";
import Gacha from "../app/screens/Gacha";
import Account from "../app/screens/Account";
import Home from "../app/screens/Home";
import { NavigationProp } from "@react-navigation/native";
import { View } from "react-native";
import Team from "../app/screens/Team";

export interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const AccountRouter = () => <Account></Account>;
const AddRoute = () => <Text>Add</Text>;

const Navbar = ({ navigation }: RouterProps) => {
  const [index, setIndex] = React.useState(0);
  let homebadge = true;
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
      badge: homebadge,
    },
    {
      key: "team",
      title: "Team",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "shop",
      title: "Shop",
      focusedIcon: "store",
      unfocusedIcon: "store-outline",
    },
    // { key: "add", title: "Start", focusedIcon: "train" },
    // {
    //   key: "gacha",
    //   title: "Gacha",
    //   focusedIcon: "credit-card",
    //   unfocusedIcon: "credit-card-outline",
    // },
    {
      key: "account",
      title: "Account",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  //   const HomeRoute = () => <Home navigation={navigation}></Home>;
  const HomeRoute = () => <Home navigation={navigation}></Home>;
  const ShopRoute = () => <Shop></Shop>;
  const GachaRoute = () => <Gacha></Gacha>;
  const TeamRoute = () => <Team></Team>;

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    team: TeamRoute,
    shop: ShopRoute,
    add: AddRoute,
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
