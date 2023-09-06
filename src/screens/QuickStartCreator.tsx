import { useNavigation } from "@react-navigation/native";
import { TimeSlider } from "@src/components/TimeSlider";
import {
  SignupDetails,
  quickstartSchema,
} from "@src/features/quickStarts/creationForm";
import { UserState } from "@src/features/user/userSlice";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";

const QuickStartCreator = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  const [loading, setLoading] = useState(false);

  const initialValues: SignupDetails = {
    name: "",
    duration: sliderValue,
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={quickstartSchema}
        validateOnMount={true}
        onSubmit={(values) => {
          console.log(
            "Name: " + values.name + ", duration: " + values.duration
          );
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
          <View>
            <TextInput
              label="Title*"
              value={values.name}
              onChangeText={handleChange("name")}
              onChange={() => setFieldTouched("name")}
            />
            <HelperText
              type="error"
              visible={touched.name !== undefined && errors.name !== undefined}
            >
              {errors.name}
            </HelperText>
            <TimeSlider onValueChange={handleChange("duration")} />
            <HelperText type="error" visible={errors.duration !== undefined}>
              {errors.duration}
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
    </View>
  );
};

export default QuickStartCreator;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
});
