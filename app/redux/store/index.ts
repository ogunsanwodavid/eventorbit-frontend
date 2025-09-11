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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //ignore these paths in state
        ignoredPaths: [
          "createEvent.event.duration.startDate",
          "createEvent.event.duration.endDate",
          "createEvent.event.schedules",
        ],
        //ignore these in actions
        ignoredActionPaths: ["payload.startDate", "payload.endDate", "payload"],
      },
    }),
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
