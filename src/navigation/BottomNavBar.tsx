import * as React from "react";
import { BottomNavigation, useTheme, Text } from "react-native-paper";
import { Home, Stations, Shop, Gacha } from "@screens/index";

const BottomNavBar = () => {
  const theme = useTheme();

  const HomeRoute = () => <Home />;
  const StationsRoute = () => <Stations />;
  const ShopRoute = () => <Shop />;
  const GachaRoute = () => <Gacha />;
  // const AccountRoute = () => <Account />;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Skytrain",
      focusedIcon: "subway",
    },
    {
      key: "stations",
      title: "Stations",
      focusedIcon: "map",
    },
    {
      key: "shop",
      title: "Shop",
      focusedIcon: "pricetags",
    },
    {
      key: "gacha",
      title: "Banners",
      focusedIcon: "gift-sharp",
      // focusedIcon: "person-circle-sharp",
      // focusedIcon: "person",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    stations: StationsRoute,
    shop: ShopRoute,
    gacha: GachaRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // labeled={false}
      theme={{
        colors: {
          secondaryContainer: "transparent", // select wrapper colour
          onSecondaryContainer: "white", // active icon colour
          onSurfaceVariant: theme.colors.outline, // inactive icon colour
        },
        fonts: {
          labelMedium: {
            fontSize: 10,
            letterSpacing: 0.1,
            lineHeight: 10,
          },
        },
      }}
      compact={true}
      // TODO: Cause bar to move downards, and content to render beneath it. Might be useful for blue
      // barStyle={{ bottom: -30, position: "absolute" }}
      // barStyle={{
      //   backgroundColor: "rgba(10,10,10,0.5)",
      //   // bottom: -10,
      //   position: "absolute",
      // }}
      safeAreaInsets={{ bottom: 10 }}
    />
  );
};

export default BottomNavBar;
