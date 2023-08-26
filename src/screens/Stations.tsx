import * as React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import {
  fetchAllStations,
  unlockStation,
} from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import { StationUnlockRequest } from "@features/stations/stationsSliceHelpers";

const Stations = () => {
  const dispatch = useDispatch<any>();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const unlockWaterfrontRequest: StationUnlockRequest = {
    session: session,
    stationId: "001",
  };

  return (
    <View>
      <Text>Stations</Text>
      <Button
        onPress={() => {
          console.log("Pressed fetchAllStations");
          dispatch(fetchAllStations(session));
        }}
      >
        Fetch stations
      </Button>

      <Button
        onPress={() => {
          console.log("Pressed unlockWaterfront");
          dispatch(unlockStation(unlockWaterfrontRequest));
        }}
      >
        Unlock Waterfront
      </Button>
    </View>
  );
};
export default Stations;
