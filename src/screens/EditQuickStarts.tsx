import { AuthState } from "@src/features/auth/authSlice";
import { QuickStart } from "@src/features/quickStart/quickStartHandler";
import { QuickStartState } from "@src/features/quickStart/quickStartSlice";
import {
  DeleteQuickStartRequest,
  deleteQuickStart,
} from "@src/features/quickStart/quickStartSliceHelpers";
import { StationsState } from "@src/features/stations/stationsSlice";
import * as React from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

interface EditableQuickstartProps extends QuickStart {}

const EditQuickStart = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();

  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const quickstarts: QuickStart[] = useSelector(
    (state: { quickStart: QuickStartState }) => state.quickStart.quickstarts
  );

  const EditableQuickstart: React.FC<EditableQuickstartProps> = ({
    id = "",
    stationId = "000",
    name,
    duration = 0,
  }) => {
    const isLast: boolean = quickstarts[quickstarts.length - 1].id === id;

    const handleDelete = () => {
      if (session) {
        const deleteRequest: DeleteQuickStartRequest = {
          session: session,
          id: id,
        };
        dispatch(deleteQuickStart(deleteRequest));
      }
    };

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
          <TouchableOpacity onPress={() => handleDelete}>
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

export default EditQuickStart;

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
