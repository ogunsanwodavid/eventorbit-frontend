"use client";

import { useState } from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/app/hooks/global/redux";

import { EventType } from "@/app/models/events";

import { updateEventType } from "@/app/redux/slices/create/createEventSlice";

import Button from "@/app/components/create/Button";

import CheckRadioUnchecked from "@/app/components/ui/icons/CheckRadioUnchecked";
import CheckRadioChecked from "@/app/components/ui/icons/CheckRadioChecked";

import regularEventImg from "@/static/create/regular.png";
import timedEntryEventImg from "@/static/create/timed-entry.png";

export default function CreateEvent() {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Event type
  const [eventType, setEventType] = useState<EventType>("regular");

  //Type status
  const isRegular = eventType === "regular";
  const isTimedEntry = eventType === "timed-entry";

  //Handle continue
  function handleContinue() {
    //Dispatch event type
    dispatch(updateEventType(eventType));

    //Route to event creation step UI
    router.push(`/create/${eventType}/1`);
  }

  return (
    <div className="w-full px-5 mb-16 lg:px-0">
      {/** Inner */}
      <main className="w-full max-w-[900px] mx-auto mt-8">
        {/** Event type picker box */}
        <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-6">
          {/** Header */}
          <h2 className="text-black-2 text-[20px] font-bold">
            Select how best to set up your event
          </h2>

          {/** Type picker */}
          <section className="mt-6 cursor-pointer md:flex">
            {/** Regular */}
            <div
              className={`p-4 rounded-t-[6px] space-y-4 border-[1px] md:rounded-none md:rounded-l-[6px] ${
                isRegular
                  ? "border-teal"
                  : "border-[#e2e5e7] border-b-0 md:border-b-[1px] md:border-r-0"
              }`}
              onClick={() => setEventType("regular")}
            >
              {/** Header */}
              <header className="flex gap-x-3">
                {/** Radio */}
                <span className="text-teal">
                  {isRegular ? (
                    <CheckRadioChecked size="20" />
                  ) : (
                    <CheckRadioUnchecked size="20" />
                  )}
                </span>

                {/** Texts */}
                <div
                  className={`-mt-1 ${
                    isRegular ? "text-teal" : "text-black-2"
                  }`}
                >
                  <p className="text-[17px] font-semibold">Regular</p>
                  <p className="text-[15px]">
                    One-time events, in-person or virtual
                  </p>
                  <p className="text-[15px] text-gray">
                    Best for: concerts, festivals, shows
                  </p>
                </div>
              </header>

              {/** Image */}
              <Image
                className="w-full"
                src={regularEventImg}
                alt="regular events"
              />
            </div>

            {/** Timed-entry */}
            <div
              className={`p-4 rounded-b-[6px] space-y-4 border-[1px] md:rounded-none md:rounded-r-[6px] ${
                isTimedEntry
                  ? "border-teal"
                  : "border-[#e2e5e7] border-t-0 md:border-t-[1px] md:border-l-0"
              }`}
              onClick={() => setEventType("timed-entry")}
            >
              {/** Header */}
              <header className="flex gap-x-3">
                {/** Radio */}
                <span className="text-teal">
                  {isTimedEntry ? (
                    <CheckRadioChecked size="20" />
                  ) : (
                    <CheckRadioUnchecked size="20" />
                  )}
                </span>

                {/** Texts */}
                <div
                  className={`-mt-1 ${
                    isTimedEntry ? "text-teal" : "text-black-2"
                  }`}
                >
                  <p className="text-[17px] font-semibold">Timed-entry</p>
                  <p className="text-[15px]">
                    Recurring events, spanning days or months
                  </p>
                  <p className="text-[15px] text-gray">
                    Best for: exhibits, seasonal attractions, tours
                  </p>
                </div>
              </header>

              {/** Image */}
              <Image
                className="w-full"
                src={timedEntryEventImg}
                alt="timed-entry events"
              />
            </div>
          </section>
        </section>

        {/** Continue button */}
        <Button
          text="Continue"
          className="sticky bottom-2 mt-8 md:relative  md:w-max md:ml-auto"
          onClick={handleContinue}
        />
      </main>
    </div>
  );
}
