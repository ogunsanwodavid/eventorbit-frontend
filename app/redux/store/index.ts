import { configureStore } from "@reduxjs/toolkit";

import navHeightReducer from "../slices/nav/navHeightSlice";

import accountReducer from "../slices/settings/accountSlice";

import emailPreferencesReducer from "../slices/settings/emailPreferencesSlice";

import createEventReducer from "../slices/create/createEventSlice";

import manageEventReducer from "../slices/manage/manageEventSlice";

//Configure the store
const store = configureStore({
  reducer: {
    navHeight: navHeightReducer,
    account: accountReducer,
    emailPreferences: emailPreferencesReducer,
    createEvent: createEventReducer,
    manageEvent: manageEventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //Ignore these paths in state
        ignoredPaths: [
          "createEvent.event.duration",
          "createEvent.event.schedules",
          "manageEvent.event.duration",
          "manageEvent.event.schedules",
        ],
        //Ignore these in actions
        ignoredActionPaths: ["payload.startDate", "payload.endDate", "payload"],
      },
    }),
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
