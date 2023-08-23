import { useState, useEffect } from "react";
import { supabase } from "@api/supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import { changeDisplayNameSchema } from "@features/auth/changeDisplayNameForm";
import { AuthState } from "@src/features/auth/authSlice";

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [editDisplayMode, setEditDisplayMode] = useState(false);
  const [username, setUsername] = useState("");
  const session = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }: { username: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
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

      {!editDisplayMode && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            {/* TODO: add user's actual actual displaynmame */}
            <TextInput
              label="Display name"
              mode="outlined"
              value={"vindennt"}
              disabled
            />
          </View>
          <View>
            <Button onPress={() => setEditDisplayMode(true)}>Change</Button>
          </View>
        </View>
      )}

      {/* TODO: actually change the username */}
      {editDisplayMode && (
        <Formik
          initialValues={{ displayName: "" }}
          validationSchema={changeDisplayNameSchema}
          validateOnMount={true}
          onSubmit={(values) => {
            console.log(values.displayName);
            updateProfile({ username });
            values.displayName = "";
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
              <View>
                <TextInput
                  label="Display name"
                  mode="outlined"
                  value={"vindennt"}
                  disabled
                />
              </View>
              <TextInput
                label="Change display name"
                value={values.displayName}
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
