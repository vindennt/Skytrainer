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
import { QuickStartState } from "@src/features/quickStart/quickStartSlice";
import {
  DeleteQuickStartRequest,
  NewQuickStartRequest,
  addQuickStart,
  deleteQuickStart,
} from "@src/features/quickStart/quickStartSliceHelpers";
import { StationsState } from "@src/features/stations/stationsSlice";
import { UserState } from "@src/features/user/userSlice";
import { getStationName } from "@src/utils/skytrain";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  IconButton,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

interface EditableQuickstartProps extends QuickStart {}

const QuickStartCreator = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const quickstarts: QuickStart[] = useSelector(
    (state: { quickStart: QuickStartState }) => state.quickStart.quickstarts
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const EditableQuickstart: React.FC<EditableQuickstartProps> = ({
    id = "",
    stationId = "000",
    name,
    duration = 0,
  }) => {
    const isLast: boolean = quickstarts[quickstarts.length - 1].id === id;
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isLast ? "transparent" : theme.colors.onBackground,
        }}
      >
        <View style={[styles.item]}>
          <Text style={styles.text}>
            {name} ({duration} mins)
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (session) {
                const deleteRequest: DeleteQuickStartRequest = {
                  session: session,
                  id: id,
                };
                dispatch(deleteQuickStart(deleteRequest));
              }
            }}
          >
            <Icon
              name={"trash-outline"}
              color={theme.colors.onBackground}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {quickstarts.map((quickstart) => {
        return (
          quickstart.id && (
            <EditableQuickstart
              key={quickstart.id}
              id={quickstart.id}
              stationId={quickstart.stationId}
              name={quickstart.name}
              duration={quickstart.duration}
            />
          )
        );
      })}
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
  },
});
