import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EmailPreferences, EmailPreferencesState } from "@/app/models/settings";

import { fetchEmailPreferences } from "@/app/actions/settings/email-preferences/fetchEmailPreferences";

const initialState: EmailPreferencesState = {
  emailPreferences: null,
  loading: false,
  error: null,
};

const emailPreferencesSlice = createSlice({
  name: "emailPreferences",
  initialState,
  reducers: {
    setEmailPreferences(state, action: PayloadAction<EmailPreferences | null>) {
      state.emailPreferences = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.emailPreferences = action.payload ?? null;
      })
      .addCase(fetchEmailPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmailPreferences } = emailPreferencesSlice.actions;
export default emailPreferencesSlice.reducer;
