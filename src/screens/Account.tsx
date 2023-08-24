import { useState } from "react";
import { supabase } from "@api/supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import { changeDisplayNameSchema } from "@src/features/user/changeDisplayNameForm";
import { AuthState } from "@src/features/auth/authSlice";
import { UserState, setDisplayName } from "@src/features/user/userSlice";
import { updateDisplayName } from "@features/user/userSlice";

const Account = () => {
  const dispatch = useDispatch<any>();
  const displayName = useSelector(
    (state: { user: UserState }) => state.user.display_name
  );
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const [editingDisplayName, setEditingDisplayName] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          label="Email"
          mode="outlined"
          value={session?.user?.email}
          disabled
        />
      </View>

      {!editingDisplayName ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Display name"
              mode="outlined"
              value={displayName}
              disabled
            />
          </View>
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
            dispatch(
              updateDisplayName({
                session: session,
                newDisplayName: values.displayName,
              })
            );
            setEditingDisplayName(false);
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
              {errors.displayName && <Text>{errors.displayName}</Text>}
              <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button onPress={() => handleSubmit()} disabled={!isValid}>
                  Update display name
                </Button>
              </View>
            </View>
          )}
        </Formik>
      )}

      <View style={styles.verticallySpaced}>
        <Button onPress={() => supabase.auth.signOut()} mode="outlined">
          Sign Out
        </Button>
      </View>
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
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
