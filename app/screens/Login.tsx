import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../api/FirebaseConfig";
import {
  User,
  AuthCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  updateCurrentUser,
} from "firebase/auth";
import { FIRESTORE_DB } from "../../api/FirebaseConfig";
import { addDoc, doc, setDoc, collection } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((result) => {
        // If current user is not null
        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: email,
          });
          const uid = auth.currentUser.uid;
          initiateUserDocs(uid, email);
        }
      });

      console.log(response);
      // alert("Check your email");
    } catch (error: any) {
      console.log(error);
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateUserDocs = async (uid: string, email: string) => {
    //
    await setDoc(doc(FIRESTORE_DB, "users", uid), {
      uid: uid,
      email: email,
      displayName: email,
    });
    // await addDoc(doc(FIRESTORE_DB, "todos", uid, "todos"));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)} // when typing, text  updated
        ></TextInput>
        <TextInput
          value={password}
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#000ff" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create Account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center", // center login contents
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
});
