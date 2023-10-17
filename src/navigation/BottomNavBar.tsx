import * as React from "react";
import { BottomNavigation, useTheme, Text } from "react-native-paper";
import { Home, Stations, Shop, Gacha } from "@screens/index";
import Missions from "@src/screens/Missions";
import { useSelector } from "react-redux";
import { UserState } from "@src/features/user/userSlice";
// import { FocusMilestoneTimes } from "@src/utils/missionRewards";
import { NavSliceState } from "@navigation/navSlice";

const BottomNavBar = () => {
  const theme = useTheme();

  const HomeRoute = () => <Home />;
  const StationsRoute = () => <Stations />;
  const ShopRoute = () => <Shop />;
  // const GachaRoute = () => <Gacha />;
  const MissionsRoute = () => <Missions />;
  // const AccountRoute = () => <Account />;

  const routes = useSelector(
    (state: { nav: NavSliceState }) => state.nav.routes
  );

  const dailyFocusTime: number = useSelector(
    (state: { user: UserState }) => state.user.daily_focus_time
  );
  const dailyFocusClaimed: number = useSelector(
    (state: { user: UserState }) => state.user.daily_focus_claimed
  );

  // const FIRST_MILESTONE: number = FocusMilestoneTimes.FIRST_MILESTONE;
  // const SECOND_MILESTONE: number = FocusMilestoneTimes.SECOND_MILESTONE;
  // const THIRD_MILESTONE: number = FocusMilestoneTimes.THIRD_MILESTONE;

  // const unclaimedDailyReward: boolean =
  //   (dailyFocusTime >= THIRD_MILESTONE &&
  //     dailyFocusClaimed < THIRD_MILESTONE) ||
  //   (dailyFocusTime >= SECOND_MILESTONE &&
  //     dailyFocusClaimed < SECOND_MILESTONE) ||
  //   (dailyFocusTime >= FIRST_MILESTONE && dailyFocusClaimed < FIRST_MILESTONE);

  const [index, setIndex] = React.useState(0);
  const renderScene = BottomNavigation.SceneMap({
    home: MissionsRoute,
    stations: StationsRoute,
    shop: ShopRoute,
    // gacha: GachaRoute,
    missions: MissionsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // labeled={false}
      activeColor={theme.colors.onPrimary}
      theme={{
        colors: {
          secondaryContainer: "transparent", // select wrapper colour
          onSecondaryContainer: theme.colors.onPrimary, // active icon colour
          onSurfaceVariant: theme.colors.backdrop, // inactive icon colour
        },
        fonts: {
          labelMedium: {
            fontSize: 11,
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
      barStyle={{
        backgroundColor: theme.colors.surface,
      }}
      safeAreaInsets={{ bottom: 10 }}
    />
  );
};

export default BottomNavBar;
