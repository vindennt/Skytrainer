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
import { fetchAllUserData } from "@features/user/userSlice";

const AppNavigator = () => {
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  // TODO: implement loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  const setAuthAndUser = (session: Session | null) => {
    setLoading(true);
    dispatch(setSession(session));
    if (session !== null) {
      dispatch(setUser(session.user));
      dispatch(fetchAllUserData(session));
    }
    setLoading(false);
  };

  // TODO
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthAndUser(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthAndUser(session);
    });
  }, []);

  const Stack = createStackNavigator();

  const InsideStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="Bottom Nav"
        screenOptions={{
          headerShown: false,
          //   headerTintColor: theme.colors.inverseSurface,
          //   headerStyle: {
          //     backgroundColor: theme.colors.secondaryContainer,
          //   },
        }}
      >
        <Stack.Screen name=" " component={BottomNavBar} />
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
          //   headerShown: false,
          headerTintColor: theme.colors.inverseSurface,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
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
        <Stack.Screen name="Welcome" component={OutsideStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
