import { createAsyncThunk } from "@reduxjs/toolkit";

import { getAccount } from "@/app/api/settings/account/get-account";

export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async (_, { rejectWithValue }) => {
    try {
      const account = await getAccount();

      return account;
    } catch {
      return rejectWithValue("Failed to fetch account");
    }
  }
);
