import React, { useState } from "react";
import { supabase } from "@api/supabase";
import { useNavigation } from "@react-navigation/native";
import { Text, useTheme, TextInput, Button } from "react-native-paper";
import { View, StyleSheet, Alert } from "react-native";
import { Formik } from "formik";
import { initialValues, signupSchema } from "@features/auth/signupForm";

const Signup = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  async function signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          initial_display_name: displayName,
        },
      },
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert(
        "Registration succeeded! You've been sent a confirmation email."
      );
      navigation.goBack();
    }
    setLoading(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signupSchema}
      validateOnMount={true}
      onSubmit={(values) => {
        signUpWithEmail(values.email, values.password, values.displayName);
      }}
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
            <TextInput
              label="Display name*"
              //   placeholder="Display name"
              value={values.displayName}
              onChangeText={handleChange("displayName")}
              onBlur={() => setFieldTouched("displayName")}
            />
          </View>
          {touched.displayName && errors.displayName && (
            <Text>{errors.displayName}</Text>
          )}
          <View>
            <TextInput
              label="Email*"
              //   placeholder="email@address.com"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={() => setFieldTouched("email")}
              autoCapitalize="none"
            />
          </View>
          {touched.email && errors.email && <Text>{errors.email}</Text>}
          <View>
            <TextInput
              label="Password*"
              //   placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          </View>
          {touched.password && errors.password && (
            <Text>{errors.password}</Text>
          )}
          <View>
            <TextInput
              label="Confirm Password*"
              //   placeholder="Confirm Password"
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={() => setFieldTouched("confirmPassword")}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text>{errors.confirmPassword}</Text>
          )}
          <Button
            disabled={!isValid || loading}
            loading={loading}
            onPress={() => handleSubmit()}
          >
            Submit
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
});
