"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import z from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import { EventType } from "@/app/models/events";

import {
  updateCurrentStep,
  updateTimeFormat,
  updateDuration,
  updateLocation,
} from "@/app/redux/slices/create/createEventSlice";

import flattenTreeErrors, {
  FlatErrors,
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

import TimeAndPlaceFormSchema from "@/app/libs/definitions/create/time-and-location/time-and-place";

import Select from "../Select";
import Button from "../Button";

import DatePicker from "./DatePicker";

import AddressForm from "../basics/AddressForm";

import Input from "../../ui/global/Input";

interface TimeAndLocationProps {
  type: EventType;
}

export default function TimeAndLocation({ type }: TimeAndLocationProps) {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Create event step state from redux
  const createEvent = useAppSelector((state) => state.createEvent);

  //Time zone
  const timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //Input states
  const [startDate, setStartDate] = useState<Date | null>(
    createEvent.event.duration?.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    createEvent.event.duration?.endDate || null
  );
  const [timeFormat, setTimeFormat] = useState<string>(createEvent.timeFormat);
  const [isVirtual, setIsVirtual] = useState<boolean>(
    createEvent.event.basics.location.isVirtual
  );
  const [address, setAddress] = useState<string>(
    createEvent.event.basics.location.address || ""
  );
  const [venueName, setVenueName] = useState<string>(
    createEvent.event.basics.location.venueName || ""
  );
  const [organizerAddress, setOrganizerAddress] = useState<string>(
    createEvent.event.basics.location.organizerAddress || ""
  );
  const [connectionDetails, setConnnectionDetails] = useState<string>(
    createEvent.event.basics.location.connectionDetails || ""
  );

  //Error states
  const [pageErrors, setPageErrors] = useState<FlatErrors | null>(null);
  const startDateInputError = pageErrors?.startDate?.at(0);
  const endDateInputError = pageErrors?.endDate?.at(0);
  const addressInputError = pageErrors?.address?.at(0);
  const venueNameInputError = pageErrors?.venueName?.at(0);
  const organizerAddressInputError = pageErrors?.organizerAddress?.at(0);
  const connectionDetailsInputError = pageErrors?.connectionDetails?.at(0);

  //Time format items
  const timeFormatItems = [
    { value: "full", label: "Date and time in full" },
    { value: "time-only", label: "Start time only" },
    { value: "hide", label: "Hide event time" },
  ];

  //Toggle virtual event status
  function handleToggleVirtualEvent() {
    setIsVirtual((prevState) => !prevState);
  }

  //Handle continue
  function handleContinue() {
    //Check if page has errors
    let hasPageErrors = false;

    //Validate fields
    const validatedFields = TimeAndPlaceFormSchema.safeParse({
      startDate,
      endDate,
      address: !isVirtual ? address : undefined,
      venueName: !isVirtual ? venueName : undefined,
      organizerAddress: isVirtual ? organizerAddress : undefined,
      connectionDetails: isVirtual ? connectionDetails : undefined,
    });

    if (!validatedFields.success) {
      const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
      const flatErrors = flattenTreeErrors(treeErrors);

      setPageErrors(flatErrors);
      hasPageErrors = true;
    } else {
      setPageErrors(null);
    }

    //Check for errors
    if (!hasPageErrors) {
      //Update create event redux state
      dispatch(updateCurrentStep(3));
      dispatch(updateTimeFormat(timeFormat));
      dispatch(
        updateDuration({
          startDate: startDate ?? new Date(),
          endDate: endDate ?? new Date(),
          timeZone,
        })
      );
      dispatch(
        updateLocation({
          address,
          venueName,
          isVirtual,
          organizerAddress,
          connectionDetails,
        })
      );

      //Route to next step
      router.push(`/create/${type}/3`);
    }
  }

  return (
    <div className="space-y-6">
      <main className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5]">
        {/** Upper section */}
        <section className="p-6 pb-8">
          {/** Header */}
          <h2 className="text-black-2 text-[20px] font-bold">
            Choose a time and place for your event
          </h2>

          {/** Form */}
          <form className="mt-4 space-y-[17px]">
            {/** Date pickers */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/** Start */}
              <DatePicker
                label={
                  <div className="text-[15px]">
                    Start <span className="text-error-red-2">*</span>
                  </div>
                }
                date={startDate}
                setDate={setStartDate}
                timeZone={timeZone}
                error={startDateInputError}
              />

              {/** End */}
              <DatePicker
                label={
                  <div className="text-[15px]">
                    End <span className="text-error-red-2">*</span>
                  </div>
                }
                date={endDate}
                setDate={setEndDate}
                timeZone={timeZone}
                error={endDateInputError}
              />
            </section>

            {/** Time display format select */}
            <section className="w-full max-w-[280px] space-y-2">
              {/** Label */}
              <div className="text-[15px]">
                Time displayed on ticket and checkout
              </div>

              {/** Select */}
              <Select
                value={timeFormat}
                setValue={setTimeFormat}
                items={timeFormatItems}
              />
            </section>
          </form>
        </section>

        {/** Lower section */}
        <section className="border-t-[1px] border-[#e2e5e7] p-6 pb-8">
          {/** Virtual event toggler */}
          <div
            className="w-max flex items-center gap-x-2 text-[15px] cursor-pointer mb-8"
            onClick={handleToggleVirtualEvent}
          >
            {/** Toggler */}
            <div
              className={`w-[33px] h-[20px] p-0.25 bg-[#a9b0b7] rounded-full transition-all duration-250 ${
                isVirtual && "!bg-teal"
              }`}
            >
              <div
                className={`h-[18px] w-[18px] bg-white rounded-full ml-0 transition-all duration-250 ${
                  isVirtual && "!ml-auto"
                }`}
              ></div>
            </div>

            <p>This is a virtual event</p>
          </div>

          {/** Address form
           * display only if non-virtual event
           */}
          {!isVirtual && (
            <AddressForm
              address={address}
              setAddress={setAddress}
              addressInputError={addressInputError}
              venueName={venueName}
              setVenueName={setVenueName}
              venueNameInputError={venueNameInputError}
            />
          )}

          {/** Organizer info
           * display if virtual event
           */}
          {isVirtual && (
            <div className="flex flex-col gap-y-5">
              {/** Organizer's address input */}
              <Input
                name="organizerAddress"
                label={
                  <main>
                    <div className="w-max">
                      Organizer&apos;s address{" "}
                      <span className="text-error-red-2">*</span>
                    </div>

                    <p className="text-gray text-[14px]">
                      Location is required for time calculation, localization
                      and tax purposes. It will not be visible to the buyer.
                    </p>
                  </main>
                }
                className="!mb-0"
                placeholder="e.g. Park 3, MaulHoard, Bourdillon"
                value={organizerAddress}
                setValue={setOrganizerAddress}
                error={organizerAddressInputError}
                isLocation
              />

              {/** Connection details input */}
              <Input
                name="connectionDetails"
                label={
                  <main>
                    <div className="w-max">
                      Connection details{" "}
                      <span className="text-error-red-2">*</span>
                    </div>

                    <p className="text-gray text-[14px]">
                      This information will be included in the ticket for your
                      buyers.
                    </p>
                  </main>
                }
                className="!mb-0"
                inputClassName="!min-h-[140px] !max-h-[200px]"
                placeholder="You can access the stream directly at https://youtube.com/myevent"
                value={connectionDetails}
                setValue={setConnnectionDetails}
                error={connectionDetailsInputError}
                textarea
              />
            </div>
          )}
        </section>
      </main>

      {/** Continue button */}
      <Button
        text="Continue to Tickets"
        className="sticky bottom-2 mt-8 md:relative  md:w-max md:ml-auto"
        onClick={handleContinue}
      />
    </div>
  );
}
