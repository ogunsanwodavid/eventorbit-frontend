import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/app/redux/slices/auth";

import { AuthState } from "@/app/models/auth";

export interface ReduxStoreState {
  auth: AuthState;
}

//Configure the store
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
