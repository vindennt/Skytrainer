import { createSlice } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  session: Session | null;
  user: User | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
};

// Supabase authentication manager
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, setSession } = authSlice.actions;
export default authSlice.reducer;
