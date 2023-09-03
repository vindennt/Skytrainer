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
  setDailyFocusTime,
  setLastUsedStation,
  setlastFocusDate,
} from "@features/user/userSlice";
import {
  StationsState,
  fetchAllStations,
  setSelectedStation,
} from "@features/stations/stationsSlice";
import { CurrencyDisplay } from "@components/CurrencyDisplay";
import StationSelect from "@src/screens/StationSelect";
import { Animated } from "react-native";
import { setGraph } from "@src/features/skytrain/skytrainSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { datesMatch } from "@src/utils/dates";

const AppNavigator = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const lastUsedStation = useSelector(
    (state: { user: UserState }) => state.user.last_used_station
  );

  const dailyResetTime: Date = useSelector(
    (state: { user: UserState }) => state.user.daily_reset_time
  );
  const lastFocusDate: Date | null = useSelector(
    (state: { user: UserState }) => state.user.last_focus_date
  );

  const initUserData = async (session: Session) => {
    dispatch(setUser(session.user));
    dispatch(fetchAllUserData(session));
    dispatch(fetchAllStations(session));
    while (lastUsedStation === "000") {}
    dispatch(setSelectedStation(lastUsedStation));
  };

  // At auth: checks if current date is diff than the last focused events. If yes, reset
  // the daily total focus time
  const handleDailyFocus = () => {
    const now: Date = new Date();
    if (!datesMatch(new Date(lastFocusDate), now)) {
      console.log("XXXXX NEW DAY: Restting daily missions");
      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          daily_focus_time: 0,
          daily_reset_time: now,
          // last_focus_date: now,
        },
      };
      dispatch(updateUserData(updateRequest));
    }
  };

  useEffect(() => {
    // To prevent warning that onAnimatedValueUpdate is set without listeners
    // Maybe remove if affects performance
    const av = new Animated.Value(0);
    av.addListener(() => {
      return;
    });
    dispatch(setGraph(1)); // Build graph with timescale of 1

    // TODO: FOR TESTING PURPSOES OF MISSION DATES
    // const testLastLoginDate = new Date(2023, 7, 1);
    // const testLastLoginDate = new Date();
    // const updateRequest: UpdateUserRequest = {
    //   session: session,
    //   update: {
    //     daily_reset_time: testLastLoginDate,
    //     last_focus_date: testLastLoginDate,
    //   },
    // };
    // dispatch(updateUserData(updateRequest));
    handleDailyFocus();
    // TODO: REMOVE ABOVE AFTER TESTING

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
