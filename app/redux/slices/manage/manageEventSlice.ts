import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Event } from "@/app/models/events";

import { Question } from "@/app/models/checkout-questions";

import { Code } from "@/app/models/discount-codes";

export interface manageEventState {
  event: Event | null;
  openSidebar: boolean;
  checkoutQuestions: Question[] | null;
  discountCodes: Code[] | null;
}

//Initial state
export const initialState: manageEventState = {
  openSidebar: false,
  event: null,
  checkoutQuestions: null,
  discountCodes: null,
};

const manageEventSlice = createSlice({
  name: "manageEvent",
  initialState,
  reducers: {
    //Toggle open sidebar state
    toggleOpenSidebar(state) {
      state.openSidebar = !state.openSidebar;
    },

    setOpenSidebar(state, action: PayloadAction<boolean>) {
      state.openSidebar = action.payload;
    },

    //Set State
    setState(_, action: PayloadAction<manageEventState>) {
      return action.payload;
    },

    //Update event
    updateEvent(state, action: PayloadAction<Event>) {
      state.event = action.payload;
    },

    //Update checkout questions
    updateCheckoutQuestions(state, action: PayloadAction<Question[]>) {
      state.checkoutQuestions = action.payload;
    },

    //Update discount codes
    updateDiscountCodes(state, action: PayloadAction<Code[]>) {
      state.discountCodes = action.payload;
    },

    //Reset state
    resetState() {
      return initialState;
    },
  },
});

export const {
  toggleOpenSidebar,
  setOpenSidebar,
  setState,
  updateEvent,
  updateCheckoutQuestions,
  updateDiscountCodes,
  resetState,
} = manageEventSlice.actions;

export default manageEventSlice.reducer;
