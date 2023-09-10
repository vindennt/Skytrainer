import { useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from "@src/components/LoadingIndicator";
import { StationSelector } from "@src/components/StationSelectBox";
import { TimeSlider } from "@src/components/TimeSlider";
import { AuthState } from "@src/features/auth/authSlice";
import {
  SignupDetails,
  quickstartSchema,
} from "@src/features/quickStart/creationForm";
import { QuickStart } from "@src/features/quickStart/quickStartHandler";
import {
  NewQuickStartRequest,
  addQuickStart,
} from "@src/features/quickStart/quickStartSliceHelpers";
import { StationsState } from "@src/features/stations/stationsSlice";
import { UserState } from "@src/features/user/userSlice";
import { getStationName } from "@src/utils/skytrain";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

const QuickStartCreator = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const initialValues: SignupDetails = {
    name: "",
    duration: sliderValue,
    station: stations.keys().next().value,
  };

  const handleQuickstartRequest = async (values: SignupDetails) => {
    try {
      setLoading(true);
      console.log(
        "Adding quickstart named: " +
          values.name +
          ", duration: " +
          values.duration +
          ", stationid: " +
          values.station
      );
      if (session) {
        const qs: QuickStart = {
          name: values.name,
          duration: values.duration,
          stationId: values.station,
        };
        const request: NewQuickStartRequest = {
          session: session,
          quickstart: qs,
        };
        await dispatch(addQuickStart(request));
        setSuccess(true);
        console.log(success);
        setTimeout(() => {
          setLoading(false);
          handleGoBack();
        }, 1000);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      handleGoBack();
    }
  };

  return !loading ? (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      //   style={[styles.container, { backgroundColor: "green" }]}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={quickstartSchema}
        validateOnMount={true}
        onSubmit={async (values) => {
          handleQuickstartRequest(values);
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
  ) : success ? (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        },
      ]}
    >
      <Icon
        name="checkmark-circle-outline"
        color={theme.colors.onBackground}
        size={30}
      />
      <Text style={styles.text}>Success!</Text>
    </View>
  ) : (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, justifyContent: "center" },
      ]}
    >
      <LoadingIndicator />
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
