import React, { useState } from "react";
import { supabase } from "@api/supabase";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) Alert.alert(error.message);
}

const Login = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const goToSignup = () => {
    navigation.navigate("Register" as never);
  };

  async function signIn() {
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View>
        <View>
          <TextInput
            label="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
        </View>
        <View>
          <TextInput
            label="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>
        <View>
          <Button disabled={loading} loading={loading} onPress={() => signIn()}>
            Sign In
          </Button>
        </View>
      </View>
      <View>
        <Button disabled={loading} onPress={() => goToSignup()}>
          Register
        </Button>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
});
