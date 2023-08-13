import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../api/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button as PaperButton } from "react-native-paper";
import moment from "moment";

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [displayDate, setDisplayDate] = useState<string | null>("default");
  const [email, setEmail] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log("Account: fetching user data");
        setUid(user.uid);
        setDisplayName(user.displayName);
        const userRef = doc(FIRESTORE_DB, `users/${user.uid}`);
        const fetchJoinDate = async () => {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const joined = docSnap.data().joined;
            setDisplayDate(moment(joined).format("Do MMMM, YYYY"));
            setEmail(docSnap.data().email);
            // setRender(true);
          } else {
            console.log("Account: User fetch docsnap doesnt exist!");
          }
        };
        fetchJoinDate();
      }
    });
  }, [auth]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {displayName}</Text>
      <Text style={styles.text}>Current email: {email}</Text>
      <Text style={styles.text}>Date joined: {displayDate}</Text>

      <PaperButton
        icon="logout"
        mode="contained"
        labelStyle={{ fontSize: 20 }} // icon size
        style={styles.button}
        buttonColor="royalblue"
        onPressOut={() => FIREBASE_AUTH.signOut()}
      >
        <Text style={styles.text}>Logout</Text>
      </PaperButton>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "gray",
  },
  text: {
    fontSize: 16,
    margin: 5,
  },
  button: {
    margin: 15,
  },
});
