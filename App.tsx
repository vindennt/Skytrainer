import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { supabase } from "@api/supabase";
import Auth from "@screens/Auth";
import Account from "@screens/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import store from "@src/store/index";
import {
  MD3DarkTheme as theme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  Provider as ReduxProvider,
  useSelector,
  useDispatch,
} from "react-redux";
import { AuthState } from "@src/features/auth/authSlice";
import authSlice from "@features/auth/authSlice";
import AppNavigator from "@src/navigation/AppNavigator";

export default function App() {
  // const [session, setSession] = useState<Session | null>(null);

  // const session = useSelector(
  //   (state: { auth: AuthState }) => state.auth.session
  // );
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     // setSession(session);
  //     dispatch(authSlice.actions.setSession(session));
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     // setSession(session);
  //     dispatch(authSlice.actions.setSession(session));
  //   });
  // }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {/* <View>
            {session && session.user ? (
              <Account key={session.user.id} session={session} />
            ) : (
              <Auth />
            )}
          </View> */}
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
