import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "../slices/accountSlice";

//Configure the store
const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
