export type EventType = "regular" | "timed-entry";

export type EventStatus = "live" | "drafted" | "expired";

export type EventVisibility = "public" | "unlisted";

export interface Time {
  hours: number;
  minutes: number;
  timeZone: string;
}

export type WeekDay = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type TimeSlot = {
  startTime: Time;
  duration: {
    value: number;
    unit: "hours" | "mins";
  };
};

export interface Duration {
  startDate: Date;
  endDate: Date;
  timeZone: string;
}

export interface Schedule {
  _id?: string;
  startDate: Date;
  endDate?: Date;
  timeSlots: TimeSlot[];
  repeatDays?: WeekDay[];
  sold: number;
}

export interface TicketType {
  _id?: string;
  type: "paid" | "free" | "donation";
  name: string;
  sold: number;
  quantity?: number;
  price?: number;
  minDonation?: number;
  fee?: number;
}

export interface Event {
  _id?: string;
  hostId: string;
  status: EventStatus;
  type: EventType;
  alias: string;
  basics: {
    name: string;
    description: string;
    category: string;
    visibility: EventVisibility;
    location: {
      isVirtual: boolean;
      address?: string;
      venueName?: string;
      organizerAddress?: string;
      connectionDetails?: string;
    };
  };
  duration?: Duration;
  schedules?: Schedule[];
  tickets: {
    types: TicketType[];
    urgency: {
      indicate: boolean;
      percentageSold?: number;
    };
    currencies: {
      buy: string;
      receive: string;
    };
    refundPolicy: string;
    hasSoldTickets?: boolean;
  };
  additionalDetails: {
    contact: string;
    orderMessage: string;
    socialMediaPhoto?: string;
    eventCoverPhoto?: string;
    additionalPhotos?: string[];
  };
}
