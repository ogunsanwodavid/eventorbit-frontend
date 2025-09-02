import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "../slices/settings/accountSlice";

import emailPreferencesReducer from "../slices/settings/emailPreferencesSlice";

import createEventReducer from "../slices/create/createEventSlice";

//Configure the store
const store = configureStore({
  reducer: {
    account: accountReducer,
    emailPreferences: emailPreferencesReducer,
    createEvent: createEventReducer,
  },
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
