import { useNavigation } from "@react-navigation/native";
import { StationSelector } from "@src/components/StationSelectBox";
import { TimeSlider } from "@src/components/TimeSlider";
import {
  SignupDetails,
  quickstartSchema,
} from "@src/features/quickStarts/creationForm";
import { StationsState } from "@src/features/stations/stationsSlice";
import { UserState } from "@src/features/user/userSlice";
import { getStationName } from "@src/utils/skytrain";
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

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );

  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const initialValues: SignupDetails = {
    name: "",
    duration: sliderValue,
    station: stations.keys().next().value,
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      //   style={[styles.container, { backgroundColor: "green" }]}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={quickstartSchema}
        validateOnMount={true}
        onSubmit={(values) => {
          console.log(
            "Name: " +
              values.name +
              ", duration: " +
              values.duration +
              ", stationid: " +
              values.station
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
              placeholder="e.g. Read, Workout, Study, Meditate"
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
            <View style={styles.centerContainer}>
              <Text style={styles.text}>
                Focus trip length: {values.duration} mins
              </Text>
            </View>
            <TimeSlider onValueChange={handleChange("duration")} />
            <HelperText type="error" visible={errors.duration !== undefined}>
              {errors.duration}
            </HelperText>
            <View style={styles.selectorContainer}>
              <View style={styles.centerContainer}>
                <Text style={styles.text}>
                  Start at: {getStationName(values.station)} Station
                </Text>
              </View>
              <StationSelector
                data={stations}
                selectedStation={values.station}
                onValueChange={handleChange("station")}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={handleGoBack}>
                Cancel
              </Button>
              <Button
                disabled={!isValid || loading}
                loading={loading}
                onPress={() => handleSubmit()}
                mode="contained"
                style={styles.button}
              >
                Create
              </Button>
            </View>
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
  },
  text: {
    fontSize: 16,
  },
  centerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  selectorContainer: {
    // paddingHorizontal: 20,
    // flex: 1,
    height: "64%",
    // backgroundColor: "pink",
  },
  button: {
    margin: 20,
  },
  buttonContainer: {
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // paddingBottom: 40,
  },
});
