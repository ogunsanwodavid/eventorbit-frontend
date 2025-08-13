import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Profile } from "@/app/models/auth";

interface AuthState {
  isAuthenticated: boolean;
  profile: Profile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.profile = action.payload.profile;
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
