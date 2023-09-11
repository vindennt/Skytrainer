import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export const fetchLimitedBanner = createAsyncThunk(
  "shop/fetchLimitedBanner",
  async (session: Session) => {
    console.log("Thunk start: fetchLimitedBanner");
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const today: Date = new Date();

      let { data, error, status } = await supabase
        .from("banners")
        .select(`*`)
        .gte("end_date", today) // Check if end_date is greater than or equal to the current date
        .lte("start_date", today) // Check if start_date is less than or equal to the current date
        .single();
      if (error && status !== 406) {
        throw error;
      } else if (data) {
        console.log(data);
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Thunk end: fetchLimitedBanner");
    }
  }
);
