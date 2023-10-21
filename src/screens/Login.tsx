import React, { useState } from "react";
import { supabase } from "@api/supabase";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { initialValues, signinSchema } from "@features/auth/signinForm";
import {
  // BUTTON_DARK_THEME,
  // BUTTON_LIGHT_THEME,
  TEXTBOX_DARK_THEME,
  TEXTBOX_LIGHT_THEME,
} from "../../assets/themes";
import { useSelector } from "react-redux";
import { selectDarkTheme } from "@src/navigation/navSlice";

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
  const isDark = useSelector(selectDarkTheme);
  const textBoxTheme = isDark ? TEXTBOX_DARK_THEME : TEXTBOX_LIGHT_THEME;

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
          <View style={styles.verticalContainer}>
            <TextInput
              label="Email"
              // placeholder="email@address.com"
              value={values.email}
              mode="outlined"
              onChangeText={handleChange("email")}
              onBlur={() => setFieldTouched("email")}
              autoCapitalize={"none"}
              theme={textBoxTheme}
            />

            {/* {touched.email && errors.email && <Text>{errors.email}</Text>} */}

            <TextInput
              label="Password"
              // placeholder="Password"
              value={values.password}
              mode="outlined"
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              autoCapitalize="none"
              secureTextEntry={true}
              theme={textBoxTheme}
            />

            {/* {touched.password && errors.password && (
              <Text>{errors.password}</Text>
            )} */}

            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                disabled={!isValid || loading}
                // mode="contained"
                loading={loading}
                onPress={() => handleSubmit()}
                theme={textBoxTheme}
              >
                Sign In
              </Button>
              <Button
                style={styles.button}
                disabled={loading}
                // mode="contained"
                onPress={() => goToSignup()}
                theme={textBoxTheme}
              >
                Register
              </Button>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  verticalContainer: {
    justifyContent: "center",
    flex: 1,
    gap: 4,
  },
  button: {
    borderRadius: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
