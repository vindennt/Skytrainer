import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Button, Title } from "react-native-paper";
import {
  StationsState,
  fetchAllStations,
  unlockStation,
} from "@features/stations/stationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";
import { StationUnlockRequest } from "@features/stations/stationsSliceHelpers";
import { UIActivityIndicator } from "react-native-indicators";
import { StationSelector } from "@src/components/StationSelectBox";
import { LevelUpBox } from "@src/components/LevelUpBox";
import { getStationName } from "@src/utils/skytrain";
{
  /* <UIActivityIndicator color="white" /> */
}

const Stations = () => {
  const dispatch = useDispatch<any>();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const stations: Map<string, number> = useSelector(
    (state: { stations: StationsState }) => state.stations.stations
  );
  const selectedStation: string = useSelector(
    (state: { stations: StationsState }) => state.stations.selectedStation
  );

  return (
    <View style={styles.container}>
      {/* <Button
        onPress={() => {
          console.log(stations);
        }}
      >
        Fetch stations
      </Button> */}
      <StationSelector data={stations} selectedStation={selectedStation} />

      <LevelUpBox selectedStation={selectedStation} levelData={stations} />
    </View>
  );
};
export default Stations;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 10,
    flex: 1,
  },
});
