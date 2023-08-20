import { User } from "firebase/auth";
import { Character } from "../components/TripMenu";
import { Todo } from "../app/screens/Home";
import { NavigationProp } from "@react-navigation/native";

// NavigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  Trip: {
    user: User;
    characterid: string;
    // characterLevel: number;
    levelList: Map<string, number>;
    todo: Todo;
    navigation: NavigationProp<any, any>;
  };
};
