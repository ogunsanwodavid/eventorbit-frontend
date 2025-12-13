"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useParams } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import { useAppSelector } from "@/app/hooks/global/redux";

import { Profile } from "@/app/models/auth";

import { Event, TicketType } from "@/app/models/events";

import { getEventByAlias } from "@/app/api/events/get-event-by-alias";

import { isSameDay, format as formatDateFns } from "date-fns";

import moment from "moment-timezone";

import getSymbolFromCurrency from "currency-symbol-map";

import { toast } from "sonner";

import SchedulesCalendar from "../create/schedules/SchedulesCalendar";

import ShareEventModal from "./ShareEventModal";

import { CalendarIcon, InfoIcon } from "lucide-react";

import BlocksShuffle3 from "../ui/spinners/BlocksShuffle3";

import EditSolid from "../ui/icons/EditSolid";
import Location from "../ui/icons/Location";
import Share from "../ui/icons/Share";
import Tag from "../ui/icons/Tag";
import AlarmClock from "../ui/icons/AlarmClock";

import eventNotFoundImg from "@/static/events/event-not-found.svg";

export default function EventPage() {
  //Params
  const { alias } = useParams<{ alias: string }>();

  //Auth tools
  const { isAuthenticated, profile } = useAuth();

  //Nav footer visibility variables
  const { setShowFooter } = useNavFooterVisibility();

  //Nav height
  const navHeight = useAppSelector((state) => state.navHeight.height);

  //Site url
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL_2;

  //States
  const [event, setEvent] = useState<Event | null>(null);
  const [host, setHost] = useState<Profile | null>(null);
  const [showShareEventModal, setShowShareEventModal] =
    useState<boolean>(false);

  //Check if authenticated user created the event i.e host
  const isUserHost = isAuthenticated && profile?.userId === event?.hostId;

  //Loading states
  const [isFetchingEvent, setIsFetchingEvent] = useState<boolean>(false);

  //Refs
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const dateAndTimeRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);
  const connectionDetailsRef = useRef<HTMLDivElement | null>(null);
  const aboutTheHostRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  //Function to get event by alias
  const getEvent = async () => {
    const response = await getEventByAlias(alias);

    setEvent(response.event || null);
    setHost(response.host || null);

    return response;
  };

  //Fetch event
  const fetchEvent = async () => {
    setShowFooter(false); // hide footer while fetching
    setIsFetchingEvent(true);

    try {
      const res = await getEvent();

      // Don't show footer if:
      // - No response OR
      // - A viewer (not host) is viewing a drafted event
      if (!res || (res.event?.status === "drafted" && !isUserHost)) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
    } catch {
      setShowFooter(false); //hide footer on error
    } finally {
      setIsFetchingEvent(false);
    }
  };

  //Fetch event on mount
  useEffect(() => {
    fetchEvent();
  }, []);

  //Toast info about the event being drafted or expired if user is the host
  useEffect(() => {
    if (
      isUserHost &&
      (event?.status === "drafted" || event?.status === "expired")
    ) {
      setShowFooter(true);

      toast.dismiss();

      toast.info(
        `Your event ${event.status === "drafted" ? "is currently" : "has"} ${
          event.status
        } ${
          event.status === "drafted" && "and unpublished"
        }. Only you can see the information on this page.`,
        {
          duration: Infinity,
          position: "top-right",
          dismissible: true,
        }
      );
    }

    //Dismiss all toasts on unmount
    return () => {
      toast.dismiss();
    };
  }, [isUserHost, event, setShowFooter]);

  //Function to scroll a div identified by its ref into view
  function scrollToRef(
    ref: RefObject<HTMLDivElement | null>,
    offset: number = 100
  ) {
    if (!ref) return;

    if (ref.current) {
      const top =
        ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
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

  //Formate ticket prices to get the accurate price range
  function formatTicketPriceRange(
    tickets: TicketType[],
    currencyCode: string = "USD"
  ): string {
    if (!tickets || tickets.length === 0) return "";

    const symbol = getSymbolFromCurrency(currencyCode) || currencyCode;

    //Extract effective prices
    const prices = tickets.map((ticket) => {
      if (ticket.type === "donation") {
        return ticket.minDonation ?? 0;
      }
      return ticket.price ?? 0;
    });

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    //Case: all free
    if (min === 0 && max === 0) {
      return "Free";
    }

    //Case: free to paid
    if (min === 0 && max > 0) {
      return `Free - ${symbol}${max}`;
    }

    //Case: same value
    if (min === max) {
      return min === 0 ? "Free" : `${symbol}${min}`;
    }

    //Normal range
    return `${symbol}${min} - ${symbol}${max}`;
  }

  //Format time zone abbreviation (e.g. America/New_York -> EST/EDT)
  function formatTimeZone(timeZone: string): string {
    const now = moment().tz(timeZone);
    return now.format("z");
  }

  //Return Block shuffle spinner while fetching page
  if (isFetchingEvent)
    return (
      <div className="flex-1 flex items-center justify-center text-teal">
        <span className="inline-block mt-0">
          <BlocksShuffle3 size="45" />
        </span>
      </div>
    );

  //Error UI when event not fetched
  if (!isFetchingEvent && !event)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        {/** SVG */}
        <Image
          src={eventNotFoundImg}
          className="w-full max-w-[200px]"
          alt="event not found"
        />

        <p className="text-center text-base text-gray font-medium">
          Event not found
        </p>

        {/** Button to refetch event page*/}
        <button
          className="mt-2 py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white cursor-pointer"
          onClick={fetchEvent}
        >
          Try again
        </button>
      </div>
    );

  //Error UI when event is drafted or expired and viewer is not the host
  if (
    !isFetchingEvent &&
    event &&
    (event.status === "drafted" || event.status === "expired") &&
    !isUserHost
  )
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        {/** SVG */}
        <Image
          src={eventNotFoundImg}
          className="w-full max-w-[200px]"
          alt="event not found"
        />

        <p className="text-base text-gray font-medium max-w-[300px] text-center">
          You do not have permission to view this event. It is not live; kindly
          contact the organizers.
        </p>

        {/** Button to refetch event page*/}
        <button
          className="mt-2 py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white cursor-pointer"
          onClick={fetchEvent}
        >
          Try again
        </button>
      </div>
    );

  return (
    <>
      <div>
        {/** Header */}
        <header
          className="relative w-full h-[290px] bg-cover bg-center md:h-[360px] lg:h-[425px] xl:h-[540px]"
          style={{
            marginTop: `-${navHeight}px`,
            paddingTop: `${navHeight}px`,
            backgroundImage: `url("${event?.additionalDetails.eventCoverPhoto}")`,
          }}
        >
          <main
            className="z-2 relative w-full mx-auto h-full bg-cover bg-center shadow-[0_1px_8px_0_rgba(28,35,43,.15)] rounded-t-[6px]  md:max-w-[730px]  lg:max-w-[900px] xl:max-w-[1180px]"
            style={{
              backgroundImage: `url("${event?.additionalDetails.eventCoverPhoto}")`,
            }}
          >
            <div className="w-full h-full px-5 pb-5 bg-[rgba(0,0,0,0.2)] flex flex-col md:justify-between lg:px-8 lg:pb-8">
              {/** Event manager */}
              {isUserHost && (
                <Link
                  href={`/events/manage/${event?.alias}`}
                  className="mt-auto w-max p-3 text-[#ddd] text-[15px] bg-black rounded-[6px] flex items-center gap-x-2 cursor-pointer hover:text-white md:mt-0"
                >
                  <EditSolid size="14" />

                  <span>Event Manager</span>
                </Link>
              )}

              {/** Event info
               * FOR DESKTOP ONLY
               */}
              <div className="hidden space-y-2 text-white mt-auto md:block">
                {/** Host name */}
                <p className="uppercase font-semibold text-[18px]">
                  {host?.info.userType === "individual"
                    ? `${host.info.firstName} ${host.info.lastName}`
                    : `${host?.info.organizationName}`}
                </p>

                {/** Event name */}
                <p className="font-bold text-[30px]">{event?.basics.name}</p>

                {/** Time */}
                <p className="flex items-center gap-x-2 text-[17px] font-semibold">
                  <CalendarIcon className="h-[18px] w-[18px] text-white" />

                  <span>
                    {event?.type === "timed-entry"
                      ? "Multiple dates/times"
                      : `${formatDateRange(
                          event?.duration?.startDate,
                          event?.duration?.endDate
                        )}`}
                  </span>
                </p>

                {/** Time zone
                 * For timed-entry events
                 */}
                {event?.type === "timed-entry" && (
                  <p className="flex items-center gap-x-2 text-[17px] font-semibold">
                    <AlarmClock size="18" />

                    <span>
                      {formatTimeZone(
                        event.schedules?.at(0)?.timeSlots.at(0)?.startTime
                          .timeZone || "UTC"
                      )}
                    </span>
                  </p>
                )}

                {/** Location */}
                {event?.basics.location.isVirtual === false && (
                  <p className="flex items-center gap-x-2 text-[17px] font-semibold">
                    <Location size="18" />

                    <span>{`${event.basics.location.venueName}`}</span>
                  </p>
                )}

                {/** Connection details */}
                {event?.basics.location.isVirtual && (
                  <p className="flex items-center gap-x-2 text-[17px] font-semibold">
                    <InfoIcon className="h-[18px] w-[18px] text-white" />

                    <span>{`${event.basics.location.connectionDetails}`}</span>
                  </p>
                )}

                {/** Category */}
                <p className="flex items-center gap-x-2 text-[17px] font-semibold">
                  <Tag size="18" />

                  <span className="capitalize">{`${event?.basics.category}`}</span>
                </p>
              </div>
            </div>
          </main>

          {/** Transparent black overlay */}
          <div className="z-1 absolute top-0 left-0 w-full bg-[#1c232b88] h-full"></div>
        </header>

        {/** Event info
         * FOR MOBILE
         */}
        <div className="block space-y-2 px-5 py-6 text-gray md:hidden">
          {/** Host name */}
          <p className="uppercase font-medium text-[17px]">
            {host?.info.userType === "individual"
              ? `${host.info.firstName} ${host.info.lastName}`
              : `${host?.info.organizationName}`}
          </p>

          {/** Event name */}
          <p className="font-semibold text-[27px] text-black-2">
            {event?.basics.name}
          </p>

          {/** Time */}
          <p className="flex items-center gap-x-2 text-[16px] font-medium">
            <CalendarIcon className="h-[17px] w-[17px] text-gray" />

            <span>
              {event?.type === "timed-entry"
                ? "Multiple dates/times"
                : `${formatDateRange(
                    event?.duration?.startDate,
                    event?.duration?.endDate
                  )}`}
            </span>
          </p>

          {/** Time zone
           * For timed-entry events
           */}
          {event?.type === "timed-entry" && (
            <p className="flex items-center gap-x-2 text-[16px] medium">
              <AlarmClock size="17" />

              <span>
                {formatTimeZone(
                  event.schedules?.at(0)?.timeSlots.at(0)?.startTime.timeZone ||
                    "UTC"
                )}
              </span>
            </p>
          )}

          {/** Location */}
          {event?.basics.location.isVirtual === false && (
            <p className="flex items-center gap-x-2 text-[16px] font-medium">
              <Location size="17" />

              <span>{`${event.basics.location.venueName}`}</span>
            </p>
          )}

          {/** Connection details */}
          {event?.basics.location.isVirtual && (
            <p className="flex items-center gap-x-2 text-[16px] font-medium">
              <InfoIcon className="h-[17px] w-[17px] text-gray" />

              <span>{`${event.basics.location.connectionDetails}`}</span>
            </p>
          )}

          {/** Category */}
          <p className="flex items-center gap-x-2 text-[17px] font-medium">
            <Tag size="18" />

            <span className="capitalize">{`${event?.basics.category}`}</span>
          </p>

          {/** Share event button
           * ALLOW ONLY IF EVENT IS NOT DRAFTED
           */}
          {event?.status !== "drafted" && (
            <button
              className="w-full border-[1px] border-[#e2e5e7] flex items-center justify-center gap-x-3 p-2 text-black-2 text-[15px] rounded-[6px] mt-3"
              onClick={() => setShowShareEventModal(true)}
            >
              {/** Icon */}
              <Share size="14" />

              <span>Share event</span>
            </button>
          )}
        </div>

        {/** Main content on the page */}
        <main>
          {/** Header */}
          <header className="hidden w-full bg-[#fafafa] pt-6 border-b-[1px] border-[#e2e5e7] md:border-b-0 lg:border-b-[1px] xl:block xl:sticky xl:top-0 xl:left-0 xl:z-60">
            {/** Menu */}
            <main className="mx-auto flex gap-x-10 md:max-w-[730px] lg:max-w-[900px] xl:max-w-[1180px]">
              <div
                className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                onClick={() => scrollToRef(descriptionRef)}
              >
                Description
              </div>

              <div
                className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                onClick={() => scrollToRef(dateAndTimeRef)}
              >
                Date and time
              </div>

              {event?.basics.location.isVirtual === false ? (
                <div
                  className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                  onClick={() => scrollToRef(locationRef)}
                >
                  Location
                </div>
              ) : (
                <div
                  className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                  onClick={() => scrollToRef(connectionDetailsRef)}
                >
                  Connection details
                </div>
              )}

              <div
                className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                onClick={() => scrollToRef(aboutTheHostRef)}
              >
                About the host
              </div>

              <div
                className="w-max text-gray text-[15px] px-1 pb-6 border-b-[2px] border-transparent cursor-pointer hover:text-teal hover:font-medium hover:border-teal"
                onClick={() => scrollToRef(galleryRef)}
              >
                Gallery
              </div>
            </main>
          </header>

          <section className="w-full ">
            <div className="w-full mx-auto px-5 pt-6 pb-32 md:max-w-[730px] lg:max-w-[900px] lg:px-0 xl:pt-12 xl:60 xl:max-w-[1180px] xl:grid xl:grid-cols-[1fr_400px] gap-8">
              {/** Event info */}
              <div className="space-y-5 lg:space-y-7">
                {/** Description */}
                <div ref={descriptionRef}>
                  <h5 className="text-black-2 text-[21px] font-semibold">
                    Description
                  </h5>

                  <p className="mt-4 text-black-2 text-[15px]">
                    {event?.basics.description}
                  </p>
                </div>

                {/** Date and Time */}
                <div ref={dateAndTimeRef}>
                  <h5 className="text-black-2 text-[21px] font-semibold">
                    Date and time
                  </h5>

                  {event?.type === "regular" && (
                    <p className="mt-4 text-black-2 text-[15px]">
                      {formatDateRange(
                        event?.duration?.startDate,
                        event?.duration?.endDate,
                        true
                      )}
                    </p>
                  )}

                  {event?.type === "timed-entry" && event.schedules && (
                    <SchedulesCalendar
                      schedules={event.schedules}
                      className="!mt-4 !max-w-[350px]"
                    />
                  )}
                </div>

                {/** Location */}
                {event?.basics.location.isVirtual === false && (
                  <div ref={locationRef}>
                    <h5 className="text-black-2 text-[21px] font-semibold">
                      Location
                    </h5>

                    <p className="mt-2 text-black-2 text-[16px] font-semibold">
                      {event.basics.location.venueName}
                    </p>

                    <p className="mt-2 text-gray text-[15px] font-medium">
                      {event.basics.location.address}
                    </p>

                    <Link
                      href={`https://www.google.com/maps/place/${event.basics.location.venueName}`}
                      target="_blank"
                      className="block mt-2 text-teal text-[15px] font-medium"
                    >
                      Get directions
                    </Link>
                  </div>
                )}

                {/** Connection details */}
                {event?.basics.location.isVirtual && (
                  <div ref={connectionDetailsRef}>
                    <h5 className="text-black-2 text-[21px] font-semibold">
                      Connection details
                    </h5>

                    <p className="mt-2 text-black-2 text-[16px] font-semibold">
                      {event.basics.location.connectionDetails}
                    </p>
                  </div>
                )}

                {/** About the host */}
                <div ref={aboutTheHostRef}>
                  <h5 className="text-black-2 text-[21px] font-semibold">
                    About the host
                  </h5>

                  <main className="mt-2 flex gap-x-4">
                    {/** Display pic
                     * or initials if no profile picture set
                     */}
                    {host?.images?.profilePicture ? (
                      <Image
                        src={host?.images.profilePicture}
                        className="w-12 h-12 rounded-full"
                        alt={`${host.info.firstName}'s picture`}
                        width={36}
                        height={36}
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full bg-emerald-600 text-white text-[20px] font-medium uppercase flex items-center justify-center`}
                      >
                        {/** Provisional profile pic
                         * using intials of name
                         */}
                        {host?.info.userType === "individual" &&
                          `${host?.info.firstName?.charAt(0)}`}

                        {host?.info.userType === "organization" &&
                          `${host?.info.organizationName?.charAt(0)}`}
                      </div>
                    )}

                    <div className="space-y-1">
                      <p className="text-black-2 text-[18px] font-semibold">
                        {host?.info.userType === "individual"
                          ? `${host?.info.firstName} ${host.info.lastName}`
                          : `${host?.info.organizationName}`}
                      </p>
                      <p className="text-gray text-[15px]">
                        {host?.info.location}
                      </p>
                    </div>
                  </main>
                </div>

                {/** Gallery */}
                {(event?.additionalDetails.socialMediaPhoto ||
                  (event?.additionalDetails.additionalPhotos &&
                    event?.additionalDetails.additionalPhotos.length > 0)) && (
                  <div ref={galleryRef}>
                    <h5 className="text-black-2 text-[21px] font-semibold">
                      Gallery
                    </h5>

                    <main className="mt-2 md:grid md:grid-cols-[300px_300px] md:gap-5">
                      {/** Social media photo */}
                      {event.additionalDetails.socialMediaPhoto && (
                        <Image
                          className="h-full max-w-[300px] object-center rounded-[6px]"
                          src={event.additionalDetails.socialMediaPhoto}
                          alt={`social media photo for ${event.basics.name}`}
                          width="400"
                          height="400"
                        />
                      )}

                      {/** Additional photos */}
                      {event.additionalDetails.additionalPhotos &&
                        event.additionalDetails.additionalPhotos.length > 0 &&
                        event.additionalDetails.additionalPhotos.map(
                          (photo, index) => {
                            return (
                              <Image
                                key={index}
                                className="h-full max-w-[300px] object-center rounded-[6px]"
                                src={photo}
                                alt={`Photo for ${event.basics.name}`}
                                width="400"
                                height="400"
                              />
                            );
                          }
                        )}
                    </main>
                  </div>
                )}
              </div>

              {/** Price and tickets */}
              <div className="h-max fixed bottom-0 left-0 z-5 w-full px-5 py-4 flex items-center justify-between bg-white shadow-[0_0_8px_#e2e5e7] rounded-b-[6px] lg:px-10 lg:py-6 lg:-mt-[120.5px] xl:!p-0 xl:block xl:sticky xl:top-0 xl:z-70">
                {/** Price */}
                <div className="flex items-center justify-between xl:h-[72.5px] xl:px-6 xl:border-b-[1px] xl:border-[#e2e5e7]">
                  <p className="hidden text-[16px] text-black-2 font-medium xl:block xl:text-[18px]">
                    Price
                  </p>
                  {event?.tickets && (
                    <p className="text-[20px] text-teal font-semibold">
                      {formatTicketPriceRange(
                        event.tickets.types,
                        event?.tickets.currencies.buy
                      )}
                    </p>
                  )}
                </div>

                <div className="xl:p-6">
                  {/** Tickets */}
                  <button className="w-max bg-teal px-5 py-2 text-white text-[16px] font-semibold uppercase rounded-[6px] hover:bg-teal-700 xl:w-full xl:text-[17px]">
                    Get Tickets
                  </button>

                  {/** Share */}
                  {event?.status !== "drafted" && (
                    <button
                      className="hidden w-full border-[1px] border-[#e2e5e7] items-center justify-center gap-x-3 p-2 text-black-2 text-[15px] rounded-[6px] mt-3 hover:bg-gray-100 xl:flex"
                      onClick={() => setShowShareEventModal(true)}
                    >
                      {/** Icon */}
                      <Share size="14" />

                      <span>Share event</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/** Show share event modal */}
      {showShareEventModal && (
        <ShareEventModal
          eventName={event?.basics.name || ""}
          eventDescription={event?.basics.description || ""}
          url={`${siteUrl}/events/${event?.alias}`}
          setShowShareEventModal={setShowShareEventModal}
        />
      )}
    </>
  );
}
