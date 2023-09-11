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
} from "@features/user/userSlice";
import {
  UpdateUserRequest,
  updateUserData,
} from "@features/user/userSliceHelpers";
import { getDate } from "@utils/dates";

const Account = () => {
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const displayName: string = useSelector(selectDisplayName);
  const joinedDate: string = useSelector(selectCreatedAt);
  const totalTripTime: number = useSelector(selectTotalTripTime);
  const totalTripsFinished: number = useSelector(selectTotalTripsFinished);

  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [loading, setLoading] = useState(false);

  const StackedText: React.FC<{
    topText: string;
    bottomText: string | undefined;
  }> = ({ topText, bottomText }) => {
    const botText = bottomText === undefined ? "" : bottomText;

    return (
      <View style={styles.textBox}>
        <Text variant="labelMedium">{topText}</Text>
        <Text variant="titleMedium">{botText}</Text>
      </View>
    );
  };

  return session && session.user ? (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
            <Button onPress={() => setEditingDisplayName(true)}>Change</Button>
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
                label="Change display name"
                value={values.displayName}
                placeholder={displayName}
                onChangeText={handleChange("displayName")}
                onBlur={() => setFieldTouched("displayName")}
                autoCapitalize={"none"}
              />
              <HelperText
                type="info"
                visible={errors.displayName !== undefined}
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
        <StackedText topText="Email" bottomText={session.user.email} />
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
          icon="exit-outline"
          // mode="outlined"
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

  textBox: {
    alignItems: "flex-start",
    flexDirection: "column",
    margin: 10,
  },
  divider: {
    borderBottomWidth: 1,
  },
});
