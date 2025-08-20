import { configureStore } from "@reduxjs/toolkit";

// dummy reducer does nothing
const dummyReducer = (state = {}) => state;

//Configure the store
const store = configureStore({
  reducer: {
    _dummy: dummyReducer,
  },
});

export default store;

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
