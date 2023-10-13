import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { QuickStart } from "./quickStartHandler";
import uuid from "react-native-uuid";

export interface NewQuickStartRequest {
  session: Session;
  quickstart: QuickStart;
}

export interface DeleteQuickStartRequest {
  session: Session;
  id: string;
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
        data.forEach((row) => {
          const qsToAdd: QuickStart = {
            id: row.id,
            stationId: row.start_id,
            name: row.name,
            duration: row.duration,
            lastFinished: row.last_finished,
          };
          fetchedQuickStarts.push(qsToAdd);
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

      const newUUID: string | number[] = uuid.v4().toString();
      const newData = {
        id: newUUID,
        duration: quickstart.duration,
        name: quickstart.name,
        start_id: quickstart.stationId,
      };

      let { data, error } = await supabase.from("quickstarts").insert(newData);

      if (error) {
        throw error;
      } else {
        console.log(newData);
        return newData;
      }
    } finally {
      console.log("Thunk end: addQuickStart");
    }
  }
);

export const deleteQuickStart = createAsyncThunk(
  "quickStart/deleteQuickStart",
  async ({ session, id }: DeleteQuickStartRequest) => {
    console.log("Thunk start: addQuickStart");
    try {
      if (!session || !session?.user)
        throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("quickstarts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      } else {
        return id;
      }
    } finally {
      console.log("Thunk end: deleteQuickStart");
    }
  }
);
