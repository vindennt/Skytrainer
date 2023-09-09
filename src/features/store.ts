import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { enableMapSet } from "immer";
import thunk from "redux-thunk";
import authReducer from "@features/auth/authSlice";
import userReducer from "@features/user/userSlice";
import stationsReducer from "@features/stations/stationsSlice";
import skytrainReducer from "@features/skytrain/skytrainSlice";
import navReducer from "@navigation/navSlice";
import quickStartReducer from "@features/quickStart/quickStartSlice";

enableMapSet(); // Initiate map functions

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  stations: stationsReducer,
  skytrain: skytrainReducer,
  nav: navReducer,
  quickStart: quickStartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
