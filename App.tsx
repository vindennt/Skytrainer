import "react-native-url-polyfill/auto";
import React from "react";
import { persistor, store } from "@features/store";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import AppNavigator from "@src/navigation/AppNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingIndicator } from "@components/LoadingIndicator";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingIndicator />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </ReduxProvider>
  );
}
<AppNavigator />;
