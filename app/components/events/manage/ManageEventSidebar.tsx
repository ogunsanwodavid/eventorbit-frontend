"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import { setOpenSidebar } from "@/app/redux/slices/manage/manageEventSlice";

import { publishEvent } from "@/app/api/my-events/publish-event";

import { draftEvent } from "@/app/api/my-events/draft-event";

import { deleteEvent } from "@/app/api/my-events/delete-event";

import { toast } from "sonner";

import { FetchManageEventInfoOptions } from "@/app/(main)/events/manage/[alias]/layout";

import Tadpole from "../../ui/spinners/TadPole";

import X from "../../ui/icons/X";
import Home from "../../ui/icons/Home";
import Group from "../../ui/icons/Group";
import QuestionCircle from "../../ui/icons/QuestionCircle";
import Discount from "../../ui/icons/Discount";
import List from "../../ui/icons/List";
import CaretDownOutline from "../../ui/icons/CaretDownOutline";
import Delete from "../../ui/icons/Delete";

interface ManageEventSidebarProps {
  fetchManageEventInfo: ({
    reset,
    showSpinner,
  }: FetchManageEventInfoOptions) => Promise<void>;
}

export default function ManageEventSidebar({
  fetchManageEventInfo,
}: ManageEventSidebarProps) {
  //Pathname function
  const pathname = usePathname();

  //Router function
  const router = useRouter();

  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Manage event redux state
  const manageEvent = useAppSelector((state) => state.manageEvent);

  //Nav height redux state
  const navHeight = useAppSelector((state) => state.navHeight.height);

  //States
  const [openEventInfo, setOpenEventInfo] = useState<boolean>(false);

  //Loading states
  const [isPublishingEvent, setIsPublishingEvent] = useState<boolean>(false);
  const [isDraftingEvent, setIsDraftingEvent] = useState<boolean>(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState<boolean>(false);

  //Function to publish a drafted event
  const handlePublishEvent = async () => {
    //Return if active
    if (isPublishingEvent) return;

    setIsPublishingEvent(true);

    try {
      const response = await publishEvent(manageEvent.event?._id || "");

      if (response.success === true) {
        toast.success(response.message);

        //Re-fetch manage event info
        await fetchManageEventInfo({ reset: false, showSpinner: false });
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsPublishingEvent(false);
    }
  };

  //Function to draft a live event
  const handleDraftEvent = async () => {
    //Return if active
    if (isDraftingEvent) return;

    setIsDraftingEvent(true);

    try {
      const response = await draftEvent(manageEvent.event?._id || "");

      if (response.success === true) {
        toast.success(response.message);

        //Re-fetch manage event info
        await fetchManageEventInfo({ reset: false, showSpinner: false });
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsDraftingEvent(false);
    }
  };

  //Function to delete an event
  const handleDeleteEvent = async () => {
    //Return if active
    if (isDeletingEvent) return;

    setIsDeletingEvent(true);

    try {
      const response = await deleteEvent(manageEvent.event?._id || "");

      if (response.success === true) {
        toast.success(response.message);

        //Route to my events page
        router.replace("/my-events");
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } finally {
      setIsDeletingEvent(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-blur-black overflow-hidden z-50 transition-all duration-400 flex lg:shadow-[0_1px_8px_0_rgba(28,35,43,.15)] ${
        manageEvent.openSidebar
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } lg:!opacity-100 lg:!pointer-events-auto lg:w-max lg:relative lg:flex-1`}
      style={{
        height:
          windowWidth < 1000
            ? `${windowHeight}px`
            : `${windowHeight - navHeight}px`,
      }}
    >
      {/** Main inner layer*/}
      <main
        className={`h-full w-full max-w-[700px] flex flex-col bg-white transition-transform duration-500 overflow-y-auto ${
          manageEvent.openSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:!translate-x-0 lg:!w-[300px]`}
      >
        {/** Header */}
        <header>
          {/** Event name */}
          <div className="p-4">
            <p className="text-black-2 text-[18px] font-medium">
              {manageEvent.event?.basics.name}
            </p>
          </div>

          {/** Tools */}
          <div className="w-full border-t-[1px] border-[#e2e5e7] p-4">
            {/** Publish event */}
            {manageEvent.event?.status === "drafted" && (
              <button
                className="w-full h-[37px] p-1.5 border-[1px] border-teal rounded-[6px] flex items-center justify-center text-[15px] text-teal font-medium hover:bg-teal hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                disabled={isPublishingEvent}
                onClick={handlePublishEvent}
              >
                {isPublishingEvent ? <Tadpole size="15" /> : "Publish event"}
              </button>
            )}

            {/** Draft event */}
            {manageEvent.event?.status !== "drafted" && (
              <button
                className="w-full h-[37px] p-1.5 border-[1px] border-teal rounded-[6px] flex items-center justify-center text-[15px] text-teal font-medium hover:bg-teal hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                disabled={
                  isDraftingEvent ||
                  manageEvent.event?.status !== "live" ||
                  manageEvent.event?.tickets.hasSoldTickets
                }
                onClick={handleDraftEvent}
              >
                {isDraftingEvent ? <Tadpole size="15" /> : "Draft event"}
              </button>
            )}

            <div className="flex items-center gap-x-3 mt-4">
              {/** Preview */}
              <Link
                href={`/events/${manageEvent.event?.alias}`}
                className="w-full h-[37px] p-1.5 border-[1px] border-[#e2e5e7] rounded-[6px] text-black-2 text-[15px] flex items-center justify-center   hover:bg-[#e2e5e7a9]"
              >
                Preview
              </Link>

              {/** Save */}
              <button className="w-full h-[37px] p-1.5 border-[1.5px] border-teal bg-teal rounded-[6px] flex items-center justify-center text-[15px] text-white font-medium hover:opacity-80">
                Save
              </button>
            </div>
          </div>
        </header>

        {/** Event manager */}
        <section className="w-full border-t-[1px] border-[#e2e5e7] p-4">
          <h6 className="px-4 font-semibold text-[13.5px]">EVENT MANAGER</h6>

          <div className="mt-4 space-y-1">
            {/** Overview */}
            <Link
              href={`/events/manage/${manageEvent.event?.alias}/overview`}
              className={`pl-8 pr-4 py-3 flex gap-x-3 items-center text-[15.5px] rounded-[6px] hover:bg-[#f5f5f5] ${
                pathname ===
                `/events/manage/${manageEvent.event?.alias}/overview`
                  ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                  : "text-black-2 font-medium"
              }`}
            >
              <Home size="16.5" />

              <p>Overview</p>
            </Link>

            {/** Orders and attendees */}
            <Link
              href={`/events/manage/${manageEvent.event?.alias}/orders-and-attendees`}
              className={`pl-8 pr-4 py-3 flex gap-x-3 items-center text-[15.5px] rounded-[6px] hover:bg-[#f5f5f5] ${
                pathname ===
                `/events/manage/${manageEvent.event?.alias}/orders-and-attendees`
                  ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                  : "text-black-2 font-medium"
              }`}
            >
              <Group size="16.5" />

              <p>Orders & Attendees</p>
            </Link>
          </div>
        </section>

        {/** Event editor */}
        <section className="w-full border-t-[1px] border-[#e2e5e7] p-4">
          <h6 className="px-4 font-semibold text-[13.5px]">EVENT EDITOR</h6>

          <div className="mt-4 space-y-1">
            {/** Event Information */}
            <div className="py-3 cursor-pointer">
              {/** Header */}
              <header
                className="pl-8 pr-4 flex items-center justify-between text-black-2 text-[15.5px] font-medium"
                onClick={() => setOpenEventInfo((prev) => !prev)}
              >
                <div className="flex items-center gap-x-3">
                  <List size="16.5" />

                  <p>Event Information</p>
                </div>

                {/** Caret */}
                <span
                  className={`inline-block  ${
                    openEventInfo ? "rotate-0" : "rotate-270"
                  }`}
                >
                  <CaretDownOutline size="16" />
                </span>
              </header>

              {/** Main */}
              {openEventInfo && (
                <main className="mt-2 space-y-1 text-[15px]">
                  {/** Basics */}
                  <Link
                    href={`/events/manage/${manageEvent.event?.alias}/info/basics`}
                    className={`block ml-8 mr-4 pl-[28.5px] pr-4 py-2 rounded-[6px] hover:bg-[#f5f5f5] ${
                      pathname ===
                      `/events/manage/${manageEvent.event?.alias}/info/basics`
                        ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                        : "text-gray-500 font-medium"
                    }`}
                  >
                    Basics
                  </Link>

                  {/** Time and Location
                   * FOR REGULAR EVENTS
                   */}
                  {manageEvent.event?.type === "regular" && (
                    <Link
                      href={`/events/manage/${manageEvent.event?.alias}/info/time-and-location`}
                      className={`block ml-8 mr-4 pl-[28.5px] pr-4 py-2 rounded-[6px] hover:bg-[#f5f5f5] ${
                        pathname ===
                        `/events/manage/${manageEvent.event?.alias}/info/time-and-location`
                          ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                          : "text-gray-500 font-medium"
                      }`}
                    >
                      Time and Location
                    </Link>
                  )}

                  {/** Schedules
                   * FOR TIMED-ENTRY EVENTS
                   */}
                  {manageEvent.event?.type === "timed-entry" && (
                    <Link
                      href={`/events/manage/${manageEvent.event?.alias}/info/schedules`}
                      className={`block ml-8 mr-4 pl-[28.5px] pr-4 py-2 rounded-[6px] hover:bg-[#f5f5f5] ${
                        pathname ===
                        `/events/manage/${manageEvent.event?.alias}/info/schedules`
                          ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                          : "text-gray-500 font-medium"
                      }`}
                    >
                      Schedules
                    </Link>
                  )}

                  {/** Tickets */}
                  <Link
                    href={`/events/manage/${manageEvent.event?.alias}/info/tickets`}
                    className={`block ml-8 mr-4 pl-[28.5px] pr-4 py-2 rounded-[6px] hover:bg-[#f5f5f5] ${
                      pathname ===
                      `/events/manage/${manageEvent.event?.alias}/info/tickets`
                        ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                        : "text-gray-500 font-medium"
                    }`}
                  >
                    Tickets
                  </Link>

                  {/** Additional details */}
                  <Link
                    href={`/events/manage/${manageEvent.event?.alias}/info/additional-details`}
                    className={`block ml-8 mr-4 pl-[28.5px] pr-4 py-2 rounded-[6px] hover:bg-[#f5f5f5] ${
                      pathname ===
                      `/events/manage/${manageEvent.event?.alias}/info/additional-details`
                        ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                        : "text-gray-500 font-medium"
                    }`}
                  >
                    Additional Details
                  </Link>
                </main>
              )}
            </div>

            {/** Checkout questions */}
            <Link
              href={`/events/manage/${manageEvent.event?.alias}/checkout-questions`}
              className={`pl-8 pr-4 py-3 flex gap-x-3 items-center text-[15.5px] rounded-[6px] hover:bg-[#f5f5f5] ${
                pathname ===
                `/events/manage/${manageEvent.event?.alias}/checkout-questions`
                  ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                  : "text-black-2 font-medium"
              }`}
            >
              <QuestionCircle size="16.5" />

              <p>Checkout Questions</p>
            </Link>

            {/** Discount codes */}
            <Link
              href={`/events/manage/${manageEvent.event?.alias}/discount-codes`}
              className={`pl-8 pr-4 py-3 flex gap-x-3 items-center text-[15.5px] rounded-[6px] hover:bg-[#f5f5f5] ${
                pathname ===
                `/events/manage/${manageEvent.event?.alias}/discount-codes`
                  ? "text-teal font-semibold bg-[#f5f5f5] lg:bg-transparent"
                  : "text-black-2 font-medium"
              }`}
            >
              <Discount size="16.5" />

              <p>Discount Codes</p>
            </Link>
          </div>
        </section>

        {/** Footer */}
        <footer className="mt-auto w-full border-t-[1px] border-[#e2e5e7] px-4 py-8">
          <button
            className={`w-full pl-8 pr-4 py-3 flex gap-x-3 items-center text-[15.5px] text-black-2 font-medium rounded-[6px] cursor-pointer hover:bg-[#f5f5f5] ${
              isDeletingEvent &&
              "disabled:opacity-40 disabled:pointer-events-none"
            }`}
            disabled={
              isDeletingEvent || manageEvent.event?.tickets.hasSoldTickets
            }
            onClick={handleDeleteEvent}
          >
            <Delete size="16.5" />

            {isDeletingEvent ? <Tadpole size="16" /> : <p>Delete</p>}
          </button>
        </footer>
      </main>

      {/** X Icon */}
      <div
        className="flex w-[80px] md:w-[140px] lg:hidden"
        onClick={() => dispatch(setOpenSidebar(false))}
      >
        <span className="inline-block pt-6 mx-auto text-white">
          <X size="24" />
        </span>
      </div>
    </div>
  );
}
