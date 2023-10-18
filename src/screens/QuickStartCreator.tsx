import { useNavigation } from "@react-navigation/native";
import DailyFocusThresholdPicker, {
  OPTIONS_FIVE_ONE_TWENTY,
} from "@src/components/DailyFocusThresholdPicker";
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
import {
  StationsState,
  selectSelectedStation,
  setSelectedStation,
} from "@src/features/stations/stationsSlice";
import {
  UserState,
  selectLastUsedStation,
  selectSlider,
} from "@src/features/user/userSlice";
import { imageBustMap } from "@src/utils/imageMappings";
import { getStationName } from "@src/utils/skytrain";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
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

  const sliderValue = useSelector(selectSlider);

  const selectedStation: string = useSelector(selectSelectedStation);
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
    station: selectedStation,
  };

  const lastUsedStation = useSelector(selectLastUsedStation);
  const imageSource: ImageSourcePropType = imageBustMap[
    selectedStation
  ] as ImageSourcePropType;
  const goToStationSelect = () => {
    dispatch(setSelectedStation(selectedStation));
    navigation.navigate("Select Station" as never);
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
          selectedStation
      );
      if (session) {
        const qs: QuickStart = {
          name: values.name,
          duration: values.duration,
          stationId: selectedStation,
          lastFinished: null,
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
          <View style={{ flex: 1 }}>
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

            <View style={styles.horizontalContainer}>
              <Text style={styles.headerText}>Set focus trip for</Text>
              <DailyFocusThresholdPicker
                value={values.duration.toString()}
                onChange={handleChange("duration")}
                items={OPTIONS_FIVE_ONE_TWENTY}
              />
              <Text style={styles.headerText}>mins</Text>
            </View>

            <HelperText type="error" visible={errors.duration !== undefined}>
              {errors.duration}
            </HelperText>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={goToStationSelect}
            >
              <Image
                style={styles.image}
                source={imageSource}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.verticalContainer}>
              <Text style={styles.headerText}>
                Start at: {getStationName(selectedStation)} Station
              </Text>
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
    padding: 20,
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  centerContainer: {
    alignItems: "center",
    marginBottom: 10,
    // flex: 1,
  },
  selectorContainer: {
    flex: 1,
    // paddingHorizontal: 20,
    // flex: 1,
    height: "50%",
    // backgroundColor: "pink",
  },
  button: {
    margin: 20,
  },
  buttonContainer: {
    // flex: 1,
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // paddingBottom: 40,
    width: "100%",
  },
  headerText: { fontWeight: "bold" },
  timeText: {
    fontSize: 24,
    // fontWeight: "500",
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  verticalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    flex: 1,
    width: "180%",
    // right: 30,
    height: "140%",
    position: "absolute",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
