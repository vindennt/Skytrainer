import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export const fetchDisplayNameBySession = createAsyncThunk(
  "user/fetchDisplayNameBySession",
  async (session: Session) => {
    console.log("Getting displayname");
    try {
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("users")
        .select(`*`)
        .eq("user_id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //   console.log("Set display name to :" + data.display_name);
        return data.display_name;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Finished getting displayname");
    }
  }
);
