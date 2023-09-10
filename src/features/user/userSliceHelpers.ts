import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export interface UserUpdate {
  user_id?: string;
  display_name?: string;
  created_at?: string;
  last_login?: string;
  balance?: number;
  tickets?: number;
  permanent_pity?: number;
  limited_pity?: number;
  total_trip_time?: number;
  total_trips_finished?: number;
  slider?: number;
  last_used_station?: string;
  daily_reset_time?: Date;
  last_focus_date?: Date;
  daily_focus_time?: number;
  focus_streak_days?: number;
  daily_focus_claimed?: number;
  focus_streak_days_record?: number;
}

export interface UpdateUserRequest {
  session: Session | null;
  update: UserUpdate;
}

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ session, update }: UpdateUserRequest) => {
    console.log(
      "Thunk start: updateUserData for upate: " +
        JSON.stringify(update, null, 2)
    );
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      } else return update;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Done updateUserData");
    }
  }
);

export const fetchAllUserData = createAsyncThunk(
  "user/fetchAllUserData",
  async (session: Session) => {
    console.log("Thunk start: fetchAllUserData");
    try {
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("users")
        .select(`*`)
        .eq("user_id", session.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      } else if (data) {
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: fetchAllUserData");
    }
  }
);
