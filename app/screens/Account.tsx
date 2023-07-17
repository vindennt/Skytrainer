import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = FIREBASE_AUTH;
  // const [displayName, displayName] = useState("string");
  const [displayName, setDisplayName] = useState<string | null>("default");
  const [uid, setUid] = useState<string>("default");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName);
        console.log(uid + displayName);
      }
    });
  }, [auth, displayName, uid]);

  return (
    <View>
      <Text>Welcome {displayName}</Text>
    </View>
  );
};

export default Account;
