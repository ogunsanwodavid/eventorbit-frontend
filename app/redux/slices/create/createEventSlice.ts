import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Duration,
  Event,
  EventStatus,
  EventType,
  Schedule,
  TicketType,
} from "@/app/models/events";

export type CreateSchedule = Omit<Schedule, "_id" | "sold">;

export type CreateEvent = Omit<
  Event,
  "_id" | "hostId" | "schedules" | "tickets"
> & {
  schedules?: CreateSchedule[];
  tickets: Omit<Event["tickets"], "types"> & {
    types: Omit<TicketType, "_id" | "sold">[];
  };
};

interface CreateEventState {
  event: CreateEvent;
  currentStep: number;
  timeFormat: string;
}

//Initial state
const initialState: CreateEventState = {
  currentStep: 1,
  timeFormat: "full",
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
      },
      currencies: {
        buy: "USD",
        receive: "USD",
      },
      refundPolicy: "No refunds at any time",
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
    updateCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },

    //Update time format
    updateTimeFormat(state, action: PayloadAction<string>) {
      state.timeFormat = action.payload;
    },

    //Generic update for nested keys
    updateEvent(state, action: PayloadAction<Partial<CreateEvent>>) {
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
    updateBasics(state, action: PayloadAction<Partial<CreateEvent["basics"]>>) {
      state.event.basics = { ...state.event.basics, ...action.payload };
    },

    //Update duration
    updateDuration(state, action: PayloadAction<Duration>) {
      state.event.duration = { ...state.event.duration, ...action.payload };
    },

    //Update location specifically
    updateLocation(
      state,
      action: PayloadAction<Partial<CreateEvent["basics"]["location"]>>
    ) {
      state.event.basics.location = {
        ...state.event.basics.location,
        ...action.payload,
      };
    },

    //Update schedules
    updateSchedules(state, action: PayloadAction<CreateSchedule[]>) {
      state.event.schedules = action.payload;
    },

    //Update tickets
    updateTickets(
      state,
      action: PayloadAction<Partial<CreateEvent["tickets"]>>
    ) {
      state.event.tickets = { ...state.event.tickets, ...action.payload };
    },

    //Update additional details
    updateAdditionalDetails(
      state,
      action: PayloadAction<Partial<CreateEvent["additionalDetails"]>>
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
  updateTimeFormat,
  updateEvent,
  updateEventType,
  updateEventStatus,
  updateBasics,
  updateDuration,
  updateLocation,
  updateSchedules,
  updateTickets,
  updateAdditionalDetails,
  resetEvent,
} = createEventSlice.actions;

export default createEventSlice.reducer;
