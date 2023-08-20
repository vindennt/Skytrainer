import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Shop from "../app/screens/Shop";
import Gacha from "../app/screens/Gacha";
import Account from "../app/screens/Account";

const MusicRoute = () => <Text>Hey</Text>;

const ShopRoute = () => <Shop></Shop>;

const GachaRoute = () => <Gacha></Gacha>;

const AccountRouter = () => <Account></Account>;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "music",
      title: "Favorites",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
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

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
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

export default MyComponent;
