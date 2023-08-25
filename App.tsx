import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { persistor, store } from "@features/store";
import {
  MD3DarkTheme as theme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import AppNavigator from "@src/navigation/AppNavigator";
import { StatusBar } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingIndicator } from "@components/LoadingIndicator";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingIndicator />} persistor={persistor}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
