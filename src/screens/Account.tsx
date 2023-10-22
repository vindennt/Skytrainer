import { useState } from "react";
import { supabase } from "@api/supabase";
import { Session } from "@supabase/supabase-js";
import { StyleSheet, View } from "react-native";
import {
  useTheme,
  Divider,
  Button,
  TextInput,
  Text,
  HelperText,
  Switch,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import { changeDisplayNameSchema } from "@features/user/changeDisplayNameForm";
import { AuthState } from "@features/auth/authSlice";
import {
  UserState,
  selectDisplayName,
  selectCreatedAt,
  selectTotalTripTime,
  selectTotalTripsFinished,
  selectFirstMilestone,
  selectSecondMilestone,
  selectThirdMilestone,
} from "@features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@features/user/userSliceHelpers";
import { getDate } from "@utils/dates";
import { useNavigation } from "@react-navigation/native";
import { Appearance } from "react-native";
import { selectDarkTheme, setIsDarkTheme } from "@src/navigation/navSlice";
import { TEXTBOX_DARK_THEME, TEXTBOX_LIGHT_THEME } from "../../assets/themes";

const Account = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const isDark = useSelector(selectDarkTheme);
  const navigation = useNavigation();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const displayName: string = useSelector(selectDisplayName);
  const joinedDate: string = useSelector(selectCreatedAt);
  const totalTripTime: number = useSelector(selectTotalTripTime);
  const totalTripsFinished: number = useSelector(selectTotalTripsFinished);

  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [loading, setLoading] = useState(false);

  const FIRST_MILESTONE: number = useSelector(selectFirstMilestone);
  const SECOND_MILESTONE: number = useSelector(selectSecondMilestone);
  const THIRD_MILESTONE: number = useSelector(selectThirdMilestone);
  const milestonesString: string = `${FIRST_MILESTONE.toString()} mins, ${SECOND_MILESTONE.toString()} mins, ${THIRD_MILESTONE.toString()} mins`;

  const isDdarkTheme: boolean = useSelector(selectDarkTheme);

  const StackedText: React.FC<{
    topText: string;
    bottomText: string | undefined;
  }> = ({ topText, bottomText }) => {
    const botText = bottomText === undefined ? "" : bottomText;

    return (
      <View style={styles.textBox}>
        <Text
          variant="labelMedium"
          style={{ color: theme.colors.outlineVariant }}
        >
          {topText}
        </Text>
        <Text variant="titleMedium">{botText}</Text>
      </View>
    );
  };

  const handleEditDailyFocus = () => {
    navigation.navigate("Edit Milestones" as never);
  };

  const handleDarkModeSwitch = () => {
    dispatch(setIsDarkTheme(!isDdarkTheme));
  };

  return session && session.user ? (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Button
        onPress={() => navigation.navigate("Achievements" as never)}
        labelStyle={styles.text}
        // icon="trophy"
        style={styles.button}
        mode="contained"
      >
        Achievements
      </Button>
      <StackedText topText="Email" bottomText={session.user.email} />
      {!editingDisplayName ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StackedText topText="Display name" bottomText={displayName} />
          <View>
            <Button
              onPress={() => setEditingDisplayName(true)}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Edit
            </Button>
          </View>
        </View>
      ) : (
        <Formik
          initialValues={{ displayName: "" }}
          validationSchema={changeDisplayNameSchema}
          validateOnMount={true}
          onSubmit={(values) => {
            console.log(values.displayName);
            setLoading(true);
            const updateRequest: UpdateUserRequest = {
              session: session,
              update: {
                display_name: values.displayName,
              },
            };
            dispatch(updateUserData(updateRequest));
            setEditingDisplayName(false);
            setLoading(false);
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
            <View style={styles.verticallySpaced}>
              <TextInput
                label="Enter new display name"
                value={values.displayName}
                mode="outlined"
                // placeholder={displayName}
                onChangeText={handleChange("displayName")}
                onBlur={() => setFieldTouched("displayName")}
                autoCapitalize={"none"}
                theme={isDark ? TEXTBOX_DARK_THEME : TEXTBOX_LIGHT_THEME}
                // textColor={theme.colors.onSurface}
              />
              <HelperText
                type="info"
                visible={errors.displayName !== undefined}
                style={{ color: theme.colors.error }}
              >
                {errors.displayName}
              </HelperText>
              <View
                style={[
                  styles.verticallySpaced,
                  { width: "100%", alignItems: "center" },
                ]}
              >
                <Button
                  onPress={() => handleSubmit()}
                  mode="contained"
                  disabled={!isValid || loading}
                  loading={loading}
                >
                  Update display name
                </Button>
              </View>
            </View>
          )}
        </Formik>
      )}
      <View style={styles.verticallySpaced}>
        <View style={styles.horizontallySpaced}>
          <StackedText
            topText="Daily Focus Milestones"
            bottomText={milestonesString}
          />
          <Button
            onPress={handleEditDailyFocus}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            Edit
          </Button>
        </View>
        <View style={styles.horizontallySpaced}>
          <StackedText topText="Theme" bottomText={"Dark Mode"} />
          <Switch
            value={isDdarkTheme}
            onValueChange={handleDarkModeSwitch}
            color={theme.colors.onPrimary}
          />
        </View>
        <StackedText topText="Joined" bottomText={getDate(joinedDate)} />

        <StackedText
          topText="Total Time Skytraining"
          bottomText={totalTripTime.toString()}
        />
        <StackedText
          topText="Trips Finished"
          bottomText={totalTripsFinished.toString()}
        />
      </View>

      <View
        style={[
          styles.verticallySpaced,
          { width: "100%", alignItems: "center" },
        ]}
      >
        <Button
          onPress={() => supabase.auth.signOut()}
          // icon="exit-outline"
          labelStyle={[styles.text, { color: theme.colors.error }]}
          style={styles.button}
          mode="contained"
        >
          Sign Out
        </Button>
      </View>
    </View>
  ) : (
    <View>
      <Text>No User!</Text>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  horizontallySpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontWeight: "400",
  },
  textBox: {
    alignItems: "flex-start",
    flexDirection: "column",
    margin: 10,
  },
  divider: {
    borderBottomWidth: 1,
  },
  button: {
    width: "100%",
    marginVertical: 5,
    borderRadius: 12,
  },
});
