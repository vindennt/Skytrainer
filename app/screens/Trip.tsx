import React from "react";
import { View, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../Types/NavigationTypes";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { user, characterid, todo } = route.params;
  return (
    <View>
      {/* <RenderTrip name={name}></RenderTrip> */}
      <Text>Name is {user?.displayName}</Text>
      <Text>Character is {characterid}</Text>
      <Text>Task is {todo.title}</Text>
      <Text>Time is {todo.time}</Text>
    </View>
  );
};

export default Trip;
