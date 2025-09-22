"use client";

import { Dispatch, SetStateAction, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Event as EventModel } from "@/app/models/events";

import { publishEvent } from "@/app/api/my-events/publish-event";
import { draftEvent } from "@/app/api/my-events/draft-event";
import { deleteEvent } from "@/app/api/my-events/delete-event";

import { format as formatDateFns, isSameDay } from "date-fns";

import moment from "moment-timezone";

import { toast } from "sonner";

import { CalendarIcon, InfoIcon } from "lucide-react";

import Tadpole from "../ui/spinners/TadPole";

import Location from "../ui/icons/Location";
import CaretDownOutline from "../ui/icons/CaretDownOutline";

interface EventProps {
  event: EventModel;
  fetchEvents: () => Promise<void>;
  setStatus: Dispatch<SetStateAction<string>>;
}

export default function Event({ event, fetchEvents, setStatus }: EventProps) {
  //States
  const [showMoreModal, setShowMoreModal] = useState<boolean>(false);

  //Loading states
  const [isPublishingEvent, setIsPublishingEvent] = useState<boolean>(false);
  const [isDraftingEvent, setIsDraftingEvent] = useState<boolean>(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState<boolean>(false);

  //Format time zone abbreviation (e.g. America/New_York -> EST/EDT)
  function formatTimeZone(timeZone: string): string {
    const now = moment().tz(timeZone);
    return now.format("z");
  }

  //Format date range for two dates
  function formatDateRange(start?: Date, end?: Date, full: boolean = false) {
    if (!start || !end) return;

    const monthFormat = full ? "MMMM" : "MMM"; // <-- switch month format

    //If both dates fall on the same calendar day
    if (isSameDay(start, end)) {
      return `${formatDateFns(
        start,
        `${monthFormat} do, yyyy h:mma`
      )} - ${formatDateFns(end, "h:mma")} ${formatTimeZone(
        event?.duration?.timeZone || "UTC"
      )}`;
    }

    //If on different days
    return `${formatDateFns(
      start,
      `${monthFormat} do, yyyy h:mma`
    )} - ${formatDateFns(
      end,
      `${monthFormat} do, yyyy h:mma`
    )} ${formatTimeZone(event?.duration?.timeZone || "UTC")}`;
  }

  //Function to publish a drafted event
  const handlePublishEvent = async () => {
    //Return if active
    if (isPublishingEvent) return;

    setIsPublishingEvent(true);

    try {
      const response = await publishEvent(event._id);

      if (response.success === true) {
        toast.success(response.message);

        //Set status to "live"
        setStatus("live");

        //Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        //Re-fetch all events
        await fetchEvents();
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsPublishingEvent(false);
      setShowMoreModal(false);
    }
  };

  //Function to draft a published event
  const handleDraftEvent = async () => {
    //Return if active
    if (isDraftingEvent) return;

    setIsDraftingEvent(true);

    try {
      const response = await draftEvent(event._id);

      if (response.success === true) {
        toast.success(response.message);

        //Set status to "drafted"
        setStatus("drafted");

        //Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        //Re-fetch all events
        await fetchEvents();
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsDraftingEvent(false);
      setShowMoreModal(false);
    }
  };

  //Function to delete an event
  const handleDeleteEvent = async () => {
    //Return if active
    if (isDeletingEvent) return;

    setIsDeletingEvent(true);

    try {
      const response = await deleteEvent(event._id);

      if (response.success === true) {
        toast.success(response.message);

        //Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        //Re-fetch all events
        await fetchEvents();
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsDeletingEvent(false);
      setShowMoreModal(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[6px] shadow-[0_0_8px_0_rgba(0,0,0,.1)] px-6 py-4 md:flex md:justify-between">
      {/** First section */}
      <section className="flex gap-x-4 md:gap-x-6">
        {/** Avatar */}
        <Image
          src={event.additionalDetails.socialMediaPhoto!}
          className="w-16 h-16 rounded-full object-center"
          alt="avatar"
          height="64"
          width={64}
        />

        {/** Info */}
        <div className="space-y-3">
          {/** Name */}
          <p className="text-black-2 text-[18px] font-semibold lg:text-[21px]">
            {event.basics.name}
          </p>

          {/** Date */}
          <p className="flex items-center gap-x-2 text-gray">
            <CalendarIcon className="h-4 w-4" />

            <span className="text-[15px] font-medium">
              {event.type === "timed-entry"
                ? "Multiple dates/times"
                : formatDateRange(
                    event.duration?.startDate,
                    event.duration?.endDate
                  )}
            </span>
          </p>

          {/** Location */}
          {event.basics.location.isVirtual === false && (
            <p className="flex items-center gap-x-2 font-medium text-gray">
              <Location size="16" />

              <span className="text-[15px]">
                {event.basics.location.venueName}
              </span>
            </p>
          )}

          {/** Connection details */}
          {event.basics.location.isVirtual && (
            <p className="flex items-center gap-x-2 font-medium text-gray">
              <InfoIcon className="h-4 w-4" />

              <span className="text-[15px]">
                {event.basics.location.connectionDetails}
              </span>
            </p>
          )}

          {/** Status */}
          <div
            className={`flex items-center gap-x-2 text-[14px] font-medium capitalize ${
              event.status === "live"
                ? "text-success-green"
                : event.status === "drafted"
                ? "text-[#fdc04c]"
                : "text-[#A9B0B7]"
            }`}
          >
            {/** Dot */}
            <div
              className={`h-[10px] w-[10px] rounded-full ${
                event.status === "live"
                  ? "bg-success-green"
                  : event.status === "drafted"
                  ? "bg-[#fdc04c]"
                  : "bg-[#A9B0B7]"
              }`}
            ></div>

            <p className="leading-[12px]">{event.status}</p>
          </div>
        </div>
      </section>

      {/** Second section */}
      <section className="mt-7 md:mt-0">
        {/** Buttons */}
        <div className="space-y-2 md:space-y-0 md:flex md:gap-x-3">
          {/** Manage */}
          <Link
            href={`/events/manage/${event.alias}`}
            className="w-full flex items-center justify-center py-2 px-4 border-[1px] border-teal text-teal text-[15px] font-medium rounded-[6px] hover:text-white hover:bg-teal"
          >
            Manage
          </Link>

          {/** More */}
          {event.status !== "expired" && (
            <div className="relative">
              {/** Buttom */}
              <button
                className="w-full flex items-center justify-center gap-x-0.5 py-2 px-4 bg-white border-[1px] border-gray-300 text-black-2 text-[15px] font-medium rounded-[6px] hover:bg-gray-100"
                onClick={() => setShowMoreModal((prev) => !prev)}
              >
                <span>More</span>

                <span
                  className={`inline-block ${showMoreModal && "rotate-180"}`}
                >
                  <CaretDownOutline size="15" />
                </span>
              </button>

              {/** Modal
               * Not to be displayed for expired events
               */}
              {showMoreModal && (
                <div className="absolute top-full left-0 min-w-full w-max mt-3 bg-white shadow-[0_0_8px_0_rgba(0,0,0,.1)] p-2 text-black-2 text-[14.5px] cursor-pointer">
                  {/** Event page */}
                  <Link
                    href={`events/${event.alias}`}
                    className="block w-full p-2 text-nowrap rounded-[6px] hover:bg-gray-100"
                  >
                    Go to event page
                  </Link>

                  {/** Publish event
                   * IF DRAFTED
                   */}
                  {event.status === "drafted" && (
                    <div
                      className="w-full p-2 text-nowrap rounded-[6px] hover:bg-gray-100"
                      onClick={handlePublishEvent}
                    >
                      {isPublishingEvent ? (
                        <Tadpole size="15" />
                      ) : (
                        "Publish event"
                      )}
                    </div>
                  )}

                  {/** Draft event
                   * IF LIVE
                   * AND HAS NOT SOLD TICKETS
                   */}
                  {event.status === "live" && !event.tickets.hasSoldTickets && (
                    <div
                      className="w-full p-2 text-nowrap rounded-[6px] hover:bg-gray-100"
                      onClick={handleDraftEvent}
                    >
                      {isDraftingEvent ? <Tadpole size="15" /> : "Draft event"}
                    </div>
                  )}

                  {/** Delete event
                   * AND HAS NOT SOLD TICKETS
                   */}
                  {!event.tickets.hasSoldTickets && (
                    <div
                      className="w-full p-2 text-nowrap rounded-[6px] hover:bg-gray-100"
                      onClick={handleDeleteEvent}
                    >
                      {isDeletingEvent ? <Tadpole size="15" /> : "Delete event"}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
