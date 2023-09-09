import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { QuickStart } from "./quickStartHandler";

export interface NewQuickStartRequest {
  session: Session;
  quickstart: QuickStart;
}

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

export const addQuickStart = createAsyncThunk(
  "quickStart/addQuickStart",
  async ({ session, quickstart }: NewQuickStartRequest) => {
    console.log("Thunk start: addQuickStart");
    try {
      if (!session || !session?.user)
        throw new Error("No user on the session!");

      const newData = {
        duration: quickstart.duration,
        name: quickstart.name,
        start_id: quickstart.startId,
      };

      let { data, error } = await supabase.from("quickstarts").insert(newData);

      if (error) {
        throw error;
      } else {
        return quickstart;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: addQuickStart");
    }
  }
);
