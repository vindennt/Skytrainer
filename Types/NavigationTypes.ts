import { User } from "firebase/auth";
import { Character } from "../components/TripMenu";
import { Todo } from "../app/screens/Home";

// NavigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  Trip: {
    user: User;
    characterid: string;
    characterLevel: number;
    todo: Todo;
    navigation: any;
  };
};
