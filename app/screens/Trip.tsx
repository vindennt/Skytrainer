import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Types/NavigationTypes";
import { Button } from "react-native-paper";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

interface StringToStringDictionary {
  [key: string]: string;
}
// TODO: implement firestore retrieval of character information
const CharacterTable: StringToStringDictionary = {
  "001": "stanley",
  "002": "eddie",
  "003": "nathan",
};

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { user, characterid, todo, navigation } = route.params;

  // Log occurence
  console.log(
    "Character " +
      CharacterTable[characterid] +
      " arridasdaved during task " +
      todo.title
  );
  todo.done = true;

  return (
    <View style={styles.container}>
      {/* <RenderTrip name={name}></RenderTrip> */}
      {/* <Text style={styles.text}>Name is {user?.displayName}</Text> */}
      <Text
        style={[
          styles.text,
          {
            backgroundColor: "lightgray",
            padding: 12,
            margin: 12,
          },
        ]}
      >
        Character {CharacterTable[characterid]} arrived during task {todo.title}
      </Text>
      <Text style={styles.text}>Waterfront to Richmond-Brighouse</Text>
      <Text style={styles.text}>Time elapsed: {todo.time} mins</Text>
      {/* TODO: inject  calculated  rewards */}
      <Text style={styles.text}>Rewards: 10000g</Text>
      <Button
        icon="chevron-left"
        mode="outlined"
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.button}
        labelStyle={{ fontSize: 25 }} // icon size
      >
        <Text style={styles.text}>Return</Text>
      </Button>
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    margin: 4,
  },
  button: {
    margin: 5,
  },
});
