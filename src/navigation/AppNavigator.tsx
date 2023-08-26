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
} from "@screens/index";
import BottomNavBar from "@navigation/BottomNavBar";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";
import { setSession, setUser } from "@features/auth/authSlice";
import { useTheme } from "react-native-paper";
import { Session } from "@supabase/supabase-js";
import { UserState, fetchAllUserData } from "@features/user/userSlice";
import { CurrencyDisplay } from "@components/CurrencyDisplay";

const AppNavigator = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  // TODO: implement loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  const setSessionUser = (session: Session) => {
    dispatch(setUser(session.user));
    dispatch(fetchAllUserData(session));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      setLoading(true);
      dispatch(setSession(newSession));
      if (newSession !== null) setSessionUser(newSession);
      setLoading(false);
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
        <Stack.Screen name="Trip" component={Trip} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="Gacha" component={Gacha} />
        <Stack.Screen name="Stations" component={Stations} />
        <Stack.Screen name="Account" component={Account} />
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
