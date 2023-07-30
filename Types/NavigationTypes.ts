import { User } from "firebase/auth";
import { Character } from "../utils/TripMenu";
import { Todo } from "../app/screens/Home";

// NavigationTypes.ts
export type RootStackParamList = {
  Home: undefined;
  Trip: { user: User; characterid: string; todo: Todo; navigation: any };
};
