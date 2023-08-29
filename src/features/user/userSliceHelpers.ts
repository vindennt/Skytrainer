import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export interface UpdateDisplayNameRequest {
  session: Session | null;
  newDisplayName: string;
}

export interface UpdateNumericalBalanceRequest {
  session: Session | null;
  newBalance: number;
}

export interface UpdatePityRequest {
  session: Session | null;
  newPity: number;
  isPermanent: boolean;
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

export const updateBalance = createAsyncThunk(
  "user/updateBalance",
  async ({ session, newBalance }: UpdateNumericalBalanceRequest) => {
    console.log("Thunk start: updateBalance to " + newBalance);
    try {
      if (!session?.user) throw new Error("No user on the session!");
      if (newBalance < 0) throw new Error("newBalance cannot be < 0");

      const update = {
        balance: newBalance,
      };

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      } else return newBalance;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Done updating balance to " + newBalance);
    }
  }
);

export const updateTickets = createAsyncThunk(
  "user/updateTickets",
  async ({ session, newBalance }: UpdateNumericalBalanceRequest) => {
    console.log("Thunk start: updateTickets to " + newBalance);
    try {
      if (!session?.user) throw new Error("No user on the session!");
      if (newBalance < 0) throw new Error("newBalance cannot be < 0");

      const update = {
        tickets: newBalance,
      };

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      } else return newBalance;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      console.log("Done updating tickets to " + newBalance);
    }
  }
);

export const updatePity = createAsyncThunk(
  "user/updatePity",
  async ({ session, newPity, isPermanent }: UpdatePityRequest) => {
    console.log("Thunk start: updatePity to " + newPity);
    try {
      if (!session?.user) throw new Error("No user on the session!");
      if (newPity < 0) throw new Error("newPity cannot be < 0");

      const update = isPermanent
        ? {
            permanent_pity: newPity,
          }
        : {
            limited_pity: newPity,
          };

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
      console.log("Done updating pity");
    }
  }
);
