import React from "react";
import { View, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../utils/NavigationTypes";

type TripRouteProp = RouteProp<RootStackParamList, "Trip">;

const Trip: React.FC = () => {
  const route = useRoute<TripRouteProp>();
  const { name } = route.params;
  return (
    <View>
      {/* <RenderTrip name={name}></RenderTrip> */}
      <Text>Name is {name}</Text>
    </View>
  );
};

export default Trip;
