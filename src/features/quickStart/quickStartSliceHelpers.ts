import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { QuickStart } from "./quickStartHandler";

export const fetchAllQuickStarts = createAsyncThunk(
  "quickStart/fetchAllQuickStarts",
  async (session: Session | null) => {
    console.log("Thunk start: fetchAllQuickStarts");
    try {
      const fetchedQuickStarts: QuickStart[] = [];

      if (!session || !session?.user)
        throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("quickstarts")
        .select("*")
        .eq("user_id", session.user.id);
      if (error && status !== 406) {
        throw error;
      } else if (data) {
        console.log(JSON.stringify(data, null, 2));
        data.forEach((row: QuickStart) => {
          fetchedQuickStarts.push(row);
        });
        console.log(JSON.stringify(fetchedQuickStarts, null, 2));
      }
      return fetchedQuickStarts;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: fetchAllQuickStarts");
    }
  }
);
