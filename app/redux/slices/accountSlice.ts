import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Account, AccountState } from "@/app/models/settings";

import { fetchAccount } from "@/app/actions/settings/account/fetchAccount";

const initialState: AccountState = {
  account: null,
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<Account | null>) {
      state.account = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload ?? null;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
