import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Event, EventStatus, EventType } from "@/app/models/events";

export type CreateEvent = Omit<Event, "_id" | "hostId">;

interface CreateEventState {
  event: CreateEvent;
  currentStep: number;
}

//Initial state
const initialState: CreateEventState = {
  currentStep: 1,
  event: {
    status: "drafted",
    type: "regular",
    alias: "",
    basics: {
      name: "",
      description: "",
      category: "",
      visibility: "public",
      location: {
        isVirtual: false,
      },
    },
    tickets: {
      types: [],
      urgency: {
        indicate: false,
        percentageSold: 60,
      },
      currencies: {
        buy: "USD",
        receive: "USD",
      },
      refundPolicy: "",
      hasSoldTickets: {
        type: false,
        default: false,
      },
    },
    additionalDetails: {
      contact: "",
      orderMessage: "",
    },
  },
};

const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {
    //Update current step
    updateCurrentStep(state, action: PayloadAction<Partial<number>>) {
      state.currentStep = action.payload;
    },

    //Generic update for nested keys
    updateEvent(state, action: PayloadAction<Partial<Event>>) {
      return { ...state, ...action.payload };
    },

    //Update event type
    updateEventType: (state, action: PayloadAction<EventType>) => {
      state.event.type = action.payload;
    },

    //Update event status
    updateEventStatus: (state, action: PayloadAction<EventStatus>) => {
      state.event.status = action.payload;
    },

    //Update nested basics
    updateBasics(state, action: PayloadAction<Partial<Event["basics"]>>) {
      state.event.basics = { ...state.event.basics, ...action.payload };
    },

    //Update location specifically
    updateLocation(
      state,
      action: PayloadAction<Partial<Event["basics"]["location"]>>
    ) {
      state.event.basics.location = {
        ...state.event.basics.location,
        ...action.payload,
      };
    },

    //Update tickets
    updateTickets(state, action: PayloadAction<Partial<Event["tickets"]>>) {
      state.event.tickets = { ...state.event.tickets, ...action.payload };
    },

    //Update additional details
    updateAdditionalDetails(
      state,
      action: PayloadAction<Partial<Event["additionalDetails"]>>
    ) {
      state.event.additionalDetails = {
        ...state.event.additionalDetails,
        ...action.payload,
      };
    },

    //Reset everything
    resetEvent() {
      return initialState;
    },
  },
});

export const {
  updateCurrentStep,
  updateEvent,
  updateEventType,
  updateEventStatus,
  updateBasics,
  updateLocation,
  updateTickets,
  updateAdditionalDetails,
  resetEvent,
} = createEventSlice.actions;

export default createEventSlice.reducer;
