import React, { useState } from "react";
import { supabase } from "@api/supabase";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { initialValues, signinSchema } from "@features/auth/signinForm";

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

  const [loading, setLoading] = useState(false);

  const goToSignup = () => {
    navigation.navigate("Register" as never);
  };

  async function signIn(email: string, password: string) {
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signinSchema}
      validateOnMount={true}
      onSubmit={(values) => signIn(values.email, values.password)}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldTouched,
        handleSubmit,
        isValid,
      }) => (
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View>
            <View>
              <TextInput
                label="Email"
                // placeholder="email@address.com"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                autoCapitalize={"none"}
              />
            </View>
            {/* {touched.email && errors.email && <Text>{errors.email}</Text>} */}
            <View>
              <TextInput
                label="Password"
                // placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </View>
            {/* {touched.password && errors.password && (
              <Text>{errors.password}</Text>
            )} */}
            <View>
              <Button
                disabled={!isValid || loading}
                loading={loading}
                onPress={() => handleSubmit()}
              >
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
      )}
    </Formik>
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
