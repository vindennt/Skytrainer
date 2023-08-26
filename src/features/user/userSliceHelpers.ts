import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export interface UpdateDisplayNameRequest {
  session: Session | null;
  newDisplayName: string;
}

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

export const updateDisplayName = createAsyncThunk(
  "user/updateDisplayName",
  async ({ session, newDisplayName }: UpdateDisplayNameRequest) => {
    console.log("Thunk start: updateDisplayName");
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const update = {
        display_name: newDisplayName,
      };

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      } else if (newDisplayName) return newDisplayName;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Done updating profile");
    }
  }
);
