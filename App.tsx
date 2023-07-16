import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "./FirebaseConfig";

const Stack = createNativeStackNavigator(); // create nav stack
const InsideStack = createNativeStackNavigator();

// Screens after login
function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="List" component={List} />
      <InsideStack.Screen name="Details" component={Details} />
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
        {user && user.uid ? (
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
  );
}
