import React, { useState } from "react";
import { supabase } from "@api/supabase";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  useTheme,
  TextInput,
  Button,
  HelperText,
} from "react-native-paper";
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
          <HelperText
            type="error"
            visible={
              touched.displayName !== undefined &&
              errors.displayName !== undefined
            }
          >
            {errors.displayName}
          </HelperText>
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
          <HelperText
            type="error"
            visible={touched.email !== undefined && errors.email !== undefined}
          >
            {errors.email}
          </HelperText>
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
          <HelperText
            type="error"
            visible={
              touched.password !== undefined && errors.password !== undefined
            }
          >
            {errors.password}
          </HelperText>
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
          <HelperText
            type="error"
            visible={
              touched.confirmPassword !== undefined &&
              errors.confirmPassword !== undefined
            }
          >
            {errors.confirmPassword}
          </HelperText>
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
