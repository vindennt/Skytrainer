import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Home from "./app/screens/Home";
import Account from "./app/screens/Account";
import Gacha from "./app/screens/Gacha";
import Shop from "./app/screens/Shop";
import Team from "./app/screens/Team";
import Trip from "./app/screens/Trip";
import { SafeAreaView } from "react-native";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "./api/FirebaseConfig";
import "react-native-gesture-handler";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { default as theme } from "./theme.json";

export type RootStackParamList = {
  Home: undefined;
  Trip: { name: string }; // Specify the type of the 'name' prop for NewScreen
};

const Stack = createNativeStackNavigator(); // create nav stack
const InsideStack = createNativeStackNavigator();

// Screens after login
function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="Home"
        component={Home}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <InsideStack.Screen
        name="Account"
        component={Account}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <InsideStack.Screen
        name="Gacha"
        component={Gacha}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <InsideStack.Screen
        name="Shop"
        component={Shop}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <InsideStack.Screen
        name="Team"
        component={Team}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <InsideStack.Screen
        name="Trip"
        component={Trip}
        options={{
          headerStyle: {
            backgroundColor: "#085cac",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackVisible: false,
        }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  // set the User logging in immediately
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        {/* Enable these lines to skip login screen */}
        {/* <Stack.Navigator initialRouteName="List">
        <Stack.Screen
          name="Inside"
          component={InsideLayout}
          options={{ headerShown: false }}
        /> */}
        <Stack.Navigator initialRouteName="Login">
          {/* Enable these lines to add login screen */}
          {user ? (
            // If logged in (user not null), bring inside
            <Stack.Screen
              name="Inside"
              component={InsideLayout}
              options={{ headerShown: false }}
            />
          ) : (
            // Show login screen if not logged in
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
