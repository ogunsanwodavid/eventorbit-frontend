import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavHeightState {
  height: number;
}

const initialState: NavHeightState = {
  height: 0,
};

const navHeightSlice = createSlice({
  name: "navHeight",
  initialState,
  reducers: {
    setNavHeight(state, action: PayloadAction<number>) {
      state.height = action.payload;
    },
  },
});

export const { setNavHeight } = navHeightSlice.actions;
export default navHeightSlice.reducer;
