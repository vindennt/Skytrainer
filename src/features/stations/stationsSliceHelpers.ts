import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

interface LevelInfo {
  //   user_id: string;
  station_id: string;
  level: number;
}
export interface StationLevelUpdateRequest {
  session: Session | null;
  stationId: string;
  newLevel: number;
}

export interface StationUnlockRequest {
  session: Session | null;
  stationId: string;
}

export const fetchAllStations = createAsyncThunk(
  "stations/fetchAllStations",
  async (session: Session | null) => {
    console.log("Thunk start: fetchAllStations");
    try {
      const fetchedStations = new Map<string, number>();

      if (!session || !session?.user)
        throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("collections")
        .select("station_id, level")
        .eq("user_id", session.user.id);
      if (error && status !== 406) {
        throw error;
      } else if (data) {
        // console.log(JSON.stringify(data, null, 2));
        data.forEach((row: LevelInfo) => {
          fetchedStations.set(row.station_id, row.level);
        });
      }
      return fetchedStations;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: fetchAllStations");
    }
  }
);

export const unlockStation = createAsyncThunk(
  "stations/unlockStation",
  async ({ session, stationId }: StationUnlockRequest) => {
    console.log("Thunk start: unlockStation for station: " + stationId);
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const newData = {
        station_id: stationId,
        level: 0,
        user_id: session.user.id,
      };

      const { data, error } = await supabase
        .from("collections")
        .insert(newData);

      if (error) {
        throw error;
      } else if (data) {
        return stationId;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: unlockStation");
    }
  }
);

export const levelUpStation = createAsyncThunk(
  "stations/unlockWaterfront",
  async ({ session, stationId, newLevel }: StationLevelUpdateRequest) => {
    console.log(
      "Thunk start: levelUpStation for station: " +
        stationId +
        " to level " +
        newLevel
    );
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const newData = {
        station_id: stationId,
        level: newLevel,
        user_id: session.user.id,
      };

      const { error } = await supabase
        .from("collections")
        .update(newData)
        .eq("station_id", newData.station_id);

      if (error) {
        throw error;
      } else {
        return { stationId, newLevel };
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: levelUpStation");
    }
  }
);
