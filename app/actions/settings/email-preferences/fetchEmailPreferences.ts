import { createAsyncThunk } from "@reduxjs/toolkit";

import { getEmailPreferences } from "@/app/api/settings/email-preferences/get-email-preferences";

export const fetchEmailPreferences = createAsyncThunk(
  "account/fetchEmailPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const emailPreferences = await getEmailPreferences();

      return emailPreferences;
    } catch {
      return rejectWithValue("Failed to fetch email preferences");
    }
  }
);
