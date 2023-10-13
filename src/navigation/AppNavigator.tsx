import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "@api/supabase";
import {
  Login,
  Home,
  Stations,
  Shop,
  Account,
  Gacha,
  Trip,
  Signup,
  Timer,
  StationSelect,
  QuickStartCreator,
  EditQuickStarts,
} from "@screens/index";
import BottomNavBar from "@navigation/BottomNavBar";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";
import { setSession, setUser } from "@features/auth/authSlice";
import { useTheme } from "react-native-paper";
import { Session } from "@supabase/supabase-js";
import {
  UserState,
  fetchAllUserData,
  selectLastUsedStation,
} from "@features/user/userSlice";
import {
  fetchAllStations,
  setSelectedStation,
} from "@features/stations/stationsSlice";
import { CurrencyDisplay } from "@components/CurrencyDisplay";
import { Animated } from "react-native";
import { setGraph } from "@src/features/skytrain/skytrainSlice";

import { fetchAllQuickStarts } from "@src/features/quickStart/quickStartSliceHelpers";
import { fetchLimitedBanner } from "@src/features/shop/shopSliceHelpers";
import DailyFocusThresholdPicker from "@src/components/DailyFocusThresholdPicker";

const AppNavigator = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const lastUsedStation: string = useSelector(selectLastUsedStation);

  const initUserData = async (session: Session) => {
    dispatch(setUser(session.user));
    dispatch(fetchAllUserData(session));
    dispatch(fetchAllStations(session));
    dispatch(fetchAllQuickStarts(session));
    dispatch(fetchLimitedBanner(session));
    while (lastUsedStation === "000") {}
    dispatch(setSelectedStation(lastUsedStation));
  };

  useEffect(() => {
    // To prevent warning that onAnimatedValueUpdate is set without listeners
    // Maybe remove if affects performance
    const av = new Animated.Value(0);
    av.addListener(() => {
      return;
    });
    dispatch(setGraph(1)); // Build graph with timescale of 1

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      dispatch(setSession(newSession));
      if (newSession !== null) initUserData(newSession);
    });
  }, []);

  const Stack = createStackNavigator();

  const InsideStack = () => {
    const balance: number = useSelector(
      (state: { user: UserState }) => state.user.balance
    );
    const tickets: number = useSelector(
      (state: { user: UserState }) => state.user.tickets
    );

    return (
      <Stack.Navigator
        initialRouteName="Bottom Nav"
        screenOptions={{
          // headerShown: false,
          headerTintColor: theme.colors.inverseSurface,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          // TODO: can make header translucent for glassmorphism?
          // headerTransparent: true,
        }}
      >
        <Stack.Screen
          name="Bottom Nav"
          component={BottomNavBar}
          options={{
            headerTitle: (props) => (
              <CurrencyDisplay balance={balance} tickets={tickets} />
            ),
          }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Trip" component={Trip} />
          <Stack.Screen name="Timer" component={Timer} />
        </Stack.Group>
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="Gacha" component={Gacha} />
        <Stack.Screen name="Stations" component={Stations} />
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Select Station" component={StationSelect} />
          <Stack.Screen
            name="Edit Thresholds"
            component={DailyFocusThresholdPicker}
          />
          <Stack.Screen
            name="Create Quick Start"
            component={QuickStartCreator}
          />
          <Stack.Screen name="Edit Quickstarts" component={EditQuickStarts} />
        </Stack.Group>
      </Stack.Navigator>
    );
  };

  const OutsideStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          // headerShown: false,
          headerTintColor: theme.colors.inverseSurface,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Signup} />
      </Stack.Navigator>
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {session && session.user ? (
        <Stack.Screen name="Inside" component={InsideStack} />
      ) : (
        <Stack.Screen name="Outside" component={OutsideStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
