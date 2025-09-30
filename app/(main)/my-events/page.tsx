"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import useDebounce from "@/app/hooks/global/useDebounce";

import { Pagination as PaginationModel } from "@/app/models/global";

import { Event as EventModel, EventStatus } from "@/app/models/events";

import { getMyEvents } from "@/app/api/my-events/get-my-events";

import {
  getRecentlyUpdated,
  RecentlyUpdatedEvent,
} from "@/app/api/my-events/get-recently-updated";

import { format as formatDateFns } from "date-fns";

import { toZonedTime } from "date-fns-tz";

import Select from "@/app/components/my-events/Select";
import Event from "@/app/components/my-events/Event";

import Pagination from "@/app/components/ui/global/Pagination";

import Tadpole from "@/app/components/ui/spinners/TadPole";

import Search from "@/app/components/ui/icons/Search";

import noEventImg from "@/static/my-events/no-event.svg";

export default function MyEvents() {
  //States
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500); //Debounced search by 500ms
  const [status, setStatus] = useState<string>("live");
  const [page, setPage] = useState<number>(1);
  const [events, setEvents] = useState<EventModel[] | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationModel | null>(null);
  const [recentlyUpdatedEvents, setRecentlyUpdatedEvents] = useState<
    RecentlyUpdatedEvent[] | null
  >(null);

  //Input states
  const [isSearchInputFocused, setIsSearchInputFocused] =
    useState<boolean>(false);

  //Loading states
  const [isFetchingEvents, setIsFetchingEvents] = useState<boolean>(false);

  //Time zone
  const timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //Event status select options
  const statusSelectOptions = [
    { value: "live", label: "Live" },
    { value: "drafted", label: "Drafted" },
    { value: "expired", label: "Expired" },
    { value: "all", label: "Show all" },
  ];

  //Function to get user's events
  const getEvents = async () => {
    const response = await getMyEvents({
      page,
      status: status === "all" ? undefined : (status as EventStatus),
      search: debouncedSearch,
      limit: 7, //Allow only 7 events to be displayed per page
    });

    if (response.success === true) {
      setEvents(response.events || null);
      setPagination(response.pagination || null);
      setIsError(false);
    }

    if (response.success === false) {
      setEvents(null);
      setPagination(null);
      setIsError(true);
      return;
    }

    return response;
  };

  //Function to get 3 recently updated events
  const getRecentlyUpdatedEvents = async () => {
    const response = await getRecentlyUpdated(3);

    if (response.success === true) {
      setRecentlyUpdatedEvents(response.events || null);
    }

    if (response.success === false) {
      setRecentlyUpdatedEvents(null);
      return;
    }

    return response;
  };

  //Fetch events
  const fetchEvents = async () => {
    setIsFetchingEvents(true);

    try {
      await getEvents();

      await getRecentlyUpdatedEvents();
    } finally {
      setIsFetchingEvents(false);
    }
  };

  //Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [debouncedSearch, status, page]);

  //Format date to full representation and time zone
  const formatDateInZone = (date: Date | string, timeZone: string) => {
    const zonedDate = toZonedTime(date, timeZone);
    return `${formatDateFns(zonedDate, "MMM d, yyyy h:mma").toLowerCase()}`;
  };

  return (
    <div>
      <div className="inner-screen-max px-5 pt-8 pb-16 lg:px-10 lg:pt-12 lg:pb-24">
        {/** Heading */}
        <h2 className="text-black-2 text-[24px] font-semibold md:text-[32px]">
          My Events
        </h2>

        {/** Events Sorting */}
        <section className="mt-6 space-y-3 md:space-y-0 md:flex md:items-center md:gap-x-4">
          {/** Status picker
           * For desktop
           */}
          <div className="hidden h-[42px] lg:flex border-[1px] border-[#e2e5e7] rounded-[6px] text-gray text-[14.5px]">
            {statusSelectOptions.map((option, index) => {
              return (
                <div
                  key={index}
                  className={`h-full flex items-center justify-center px-6 py-2 cursor-pointer ${
                    index !== 0 && "border-l-[1px] border-[#e2e5e7]"
                  } ${
                    option.value === status &&
                    "bg-gray-100 text-teal font-medium"
                  }`}
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>

          {/** Search */}
          <div
            className={`h-[42px] rounded-[6px] border-[1px] flex items-center text-black-2 text-[15px] md:w-[300px] lg:w-[400px] lg:text-[14.5px] ${
              isSearchInputFocused ? "!border-teal" : "border-[#e2e5e7]"
            }`}
          >
            {/** Icon */}
            <div className="p-2 pr-3 text-gray">
              <Search size="19" />
            </div>

            {/** Input */}
            <input
              type="text"
              className="w-full h-full outline-0 bg-transparent"
              placeholder="Search all events by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchInputFocused(true)}
              onBlur={() => setIsSearchInputFocused(false)}
            />
          </div>

          {/** Status select
           * for mobile
           */}
          <Select
            value={status}
            setValue={setStatus}
            items={statusSelectOptions}
            triggerClassName="!h-[42px] md:!w-[450px] lg:hidden"
          />
        </section>

        {/** Main content */}
        <main className="max:grid max:grid-cols-[1fr_310px] max:gap-x-8">
          {/** Left section */}
          <section className="w-full max-w-[750px] max:max-w-none">
            {/** Loading spinner when fetching events */}
            {isFetchingEvents && (
              <div className="mt-8 w-full py-32 text-teal flex items-center justify-center">
                <Tadpole size="32" />
              </div>
            )}

            {/** Error display if no event */}
            {!isFetchingEvents && (!events || events.length === 0) && (
              <div className="mt-8 w-full bg-white px-6 py-16 shadow-[0_0_8px_0_rgba(0,0,0,.1)] space-y-6">
                {/** Image */}
                <Image
                  src={noEventImg}
                  className="h-20 w-20 mx-auto"
                  alt="sparkle no event"
                  height="80"
                  width="80"
                />

                <p className="text-gray text-[16px] text-center max-w-[430px] mx-auto">
                  {isError
                    ? "Network error. Failed to fetch your events"
                    : status === "live"
                    ? "You have no live events. Once an event is published, it will appear here."
                    : status === "drafted"
                    ? "You have no drafted events. Events that are saved but not published will be listed here."
                    : status === "expired"
                    ? "You have no expired events. Live events without upcoming tickets will be listed here."
                    : "You have not created any event. All events will be displayed here after creation."}
                </p>

                {/** Create event */}
                {isError ? (
                  <button
                    className="block w-max mx-auto py-2 px-12 bg-teal text-white text-[15px] rounded-[6px] hover:bg-teal-700"
                    onClick={fetchEvents}
                  >
                    Try again
                  </button>
                ) : (
                  <Link
                    href="/create"
                    className="block w-max mx-auto py-2 px-12 bg-teal text-white text-[15px] rounded-[6px] hover:bg-teal-700"
                  >
                    Create Event
                  </Link>
                )}
              </div>
            )}

            {/** List of events */}
            {!isFetchingEvents && events && events.length > 0 && (
              <div className="mt-8 space-y-6 lg:space-y-8">
                {events.map((event) => {
                  return (
                    <Event
                      key={event._id}
                      event={event}
                      fetchEvents={fetchEvents}
                      setStatus={setStatus}
                    />
                  );
                })}
              </div>
            )}

            {/** Pagination
             * Display if more than a page
             */}
            {pagination && pagination.pages > 1 && (
              <section className="mt-8 md:mt-12">
                <Pagination pagination={pagination} setPage={setPage} />
              </section>
            )}
          </section>

          {/** Right section */}
          <section>
            {/** Recently Updated events */}
            {recentlyUpdatedEvents && recentlyUpdatedEvents.length > 0 && (
              <div className="hidden w-full bg-white rounded-[6px] shadow-[0_0_8px_0_rgba(0,0,0,.1)] py-4 px-6 text-black-2 mt-8 max:block">
                {/** Heading */}
                <h6 className="text-[17px] font-semibold">Recently updated</h6>

                {/** List of events */}
                <div className="w-full mt-5 space-y-4">
                  {recentlyUpdatedEvents.map((event) => {
                    return (
                      <div
                        key={event._id}
                        className="flex gap-x-3 items-center"
                      >
                        {/** Avatar */}
                        <Image
                          className="h-[35px] w-[35px] rounded-full object-center"
                          src={event.additionalDetails.socialMediaPhoto!}
                          alt="photo"
                          height={35}
                          width={35}
                        />

                        {/** Info */}
                        <div className="w-[calc(100%-47px)]">
                          <p className="text-[16px] font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {event.basics.name}
                          </p>
                          <p className="text-[13px] text-gray font-medium capitalize overflow-hidden whitespace-nowrap overflow-ellipsis">
                            Last updated:{" "}
                            {formatDateInZone(event.updatedAt, timeZone)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
