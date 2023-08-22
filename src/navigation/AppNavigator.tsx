import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "@api/supabase";
import Auth from "@src/screens/Auth";
import BottomNavBar from "@navigation/BottomNavBar";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";
import { setSession } from "@features/auth/authSlice";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // setSession(session);
      dispatch(setSession(session));
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      // setSession(session);
      dispatch(setSession(session));
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {session && session.user ? (
        <Stack.Screen name="BottomNavbar" component={BottomNavBar} />
      ) : (
        <Stack.Screen name="Login" component={Auth} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
