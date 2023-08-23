import { useState, useEffect } from "react";
import { supabase } from "@api/supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { changeDisplayNameSchema } from "@src/features/user/changeDisplayNameForm";
import { AuthState } from "@src/features/auth/authSlice";

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  useEffect(() => {
    session ? getProfile() : console.log("No session");
  }, [session]);

  async function getProfile() {
    console.log("Getting profile");
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("users")
        .select(`display_name`)
        .eq("user_id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setDisplayName(data.display_name);
        console.log("Set display name to :" + data.display_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Finished getting profile");
      setLoading(false);
    }
  }

  async function updateProfile({ displayName }: { displayName: string }) {
    try {
      console.log("Updating profile");
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        user_id: session?.user.id,
        display_name: displayName,
        last_login: new Date(),
      };

      let { error } = await supabase.from("users").upsert(updates);

      if (error) {
        throw error;
      } else {
        setDisplayName(displayName);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Done updating profile");
      setLoading(false);
    }
  }

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
            updateProfile({
              displayName: values.displayName,
            });
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
                <Button
                  onPress={() => handleSubmit()}
                  loading={loading}
                  disabled={!isValid || loading}
                >
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
