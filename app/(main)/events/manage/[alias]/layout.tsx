"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useParams } from "next/navigation";

//import { useAuth } from "@/app/contexts/AuthContext";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import {
  initialState,
  resetState,
  setState,
} from "@/app/redux/slices/manage/manageEventSlice";

import { getEventByAlias } from "@/app/api/events/get-event-by-alias";

import { getCheckoutQuestions } from "@/app/api/events/manage/get-checkout-questions";
import { getDiscountCodes } from "@/app/api/events/manage/get-discount-codes";

import ManageEventSidebar from "@/app/components/events/manage/ManageEventSidebar";

import BlocksShuffle3 from "@/app/components/ui/spinners/BlocksShuffle3";

import eventNotFoundImg from "@/static/events/event-not-found.svg";

export interface FetchManageEventInfoOptions {
  reset?: boolean;
  showSpinner?: boolean;
}

export default function ManageEventLayout() {
  //Params
  const { alias } = useParams<{ alias: string }>();

  //Auth tools
  //const { isAuthenticated, profile } = useAuth();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Redux state
  const manageEvent = useAppSelector((state) => state.manageEvent);

  //States
  const [fetchError, setFetchError] = useState<string | null>(null);

  //Loading states
  const [isFetchingManageEventInfo, setIsFetchingManageEventInfo] =
    useState<boolean>(false);

  //Function to get manage event info
  const getManageEventInfo = async () => {
    const getEventRes = await getEventByAlias(alias);

    //Return initial state if no event
    if (!getEventRes.event) {
      return { error: "Event not found." };
    }

    //Check if user is host of the event
    /* const isUserHost =
      isAuthenticated && profile?.userId === getEventRes.event.hostId; */

    //Return initial state if user isn't host
    /* if (!isUserHost) {
      return { error: "You don't have permission to manage this event." };
    } */

    //Fetch checkout questions and discount codes
    const getCheckoutQuestionsRes = await getCheckoutQuestions(
      getEventRes.event._id!
    );

    const getDiscountCodesRes = await getDiscountCodes(getEventRes.event._id!);

    //Return initial state if checkout questions not fetched successfully
    if (!getCheckoutQuestionsRes) {
      return { error: "Failed to fetch." };
    }

    return {
      error: null,
      manageEvent: {
        ...initialState,
        event: getEventRes.event,
        checkoutQuestions: getCheckoutQuestionsRes || null,
        discountCodes: getDiscountCodesRes || null,
      },
    };
  };

  //Fetch manage event info
  const fetchManageEventInfo = async ({
    reset,
    showSpinner,
  }: FetchManageEventInfoOptions) => {
    //Reset manage event state
    if (reset) dispatch(resetState());

    setIsFetchingManageEventInfo(showSpinner || false);

    try {
      const res = await getManageEventInfo();

      setFetchError(res.error);

      if (res.manageEvent) {
        dispatch(setState(res.manageEvent));
      }
    } finally {
      setIsFetchingManageEventInfo(false);
    }
  };

  //Fetch  on mount
  useEffect(() => {
    fetchManageEventInfo({ reset: true, showSpinner: true });
  }, []);

  //Return block shuffle spinner while fetching page
  if (isFetchingManageEventInfo)
    return (
      <div className="flex-1 flex items-center justify-center text-teal">
        <span className="inline-block mt-0">
          <BlocksShuffle3 size="45" />
        </span>
      </div>
    );

  //Fetch error UI
  if (!isFetchingManageEventInfo && !manageEvent.event)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        {/** SVG */}
        <Image
          src={eventNotFoundImg}
          className="w-full max-w-[200px]"
          alt="event not found"
        />

        <p className="text-center text-base text-gray font-medium">
          {fetchError}
        </p>

        {/** Button to refetch page*/}
        <button
          className="mt-2 py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white cursor-pointer"
          onClick={() =>
            fetchManageEventInfo({ reset: true, showSpinner: true })
          }
        >
          Try again
        </button>
      </div>
    );

  return (
    <div className="flex-1">
      {/** Sidebar */}
      <ManageEventSidebar fetchManageEventInfo={fetchManageEventInfo} />
    </div>
  );
}
