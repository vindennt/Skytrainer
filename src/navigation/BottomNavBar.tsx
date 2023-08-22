import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Account from "@screens/Account";
import store from "@src/store";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";

const HomeRoute = () => <Text>Welcome Home</Text>;

const BottomNavBar = () => {
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const ShopRoute = () =>
    session ? <Account session={session}></Account> : <Text>No session!</Text>;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "shop",
      title: "Shop",
      focusedIcon: "store",
      unfocusedIcon: "store-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    shop: ShopRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomNavBar;
