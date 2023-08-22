import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "@api/supabase";
import Login from "@src/screens/Login";
import Home from "@src/screens/Home";
import Trip from "@src/screens/Trip";
import Shop from "@src/screens/Shop";
import Gacha from "@src/screens/Gacha";
import Stations from "@src/screens/Stations";
import BottomNavBar from "@navigation/BottomNavBar";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";
import { setSession, setUser } from "@features/auth/authSlice";

const Stack = createStackNavigator();

function InsideLayout() {
  return (
    <Stack.Navigator
      initialRouteName="Bottom Nav"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Bottom Nav" component={BottomNavBar} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Trip" component={Trip} />
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="Gacha" component={Gacha} />
      <Stack.Screen name="Stations" component={Stations} />
    </Stack.Navigator>
  );
}

const AppNavigator = () => {
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user));
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user));
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {session && session.user ? (
        <Stack.Screen name="BottomNavbar" component={InsideLayout} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
