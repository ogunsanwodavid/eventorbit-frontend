"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import z from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import {
  updateCurrentStep,
  updateBasics,
  updateLocation,
} from "@/app/redux/slices/create/createEventSlice";

import flattenTreeErrors, {
  FlatErrors,
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

import AboutYourEventFormSchema from "@/app/libs/definitions/create/basics/about-your-event";
import EventLocationFormSchema from "@/app/libs/definitions/create/basics/where-is-your-event";

import { EventType, EventVisibility } from "@/app/models/events";

import Input from "../../ui/global/Input";

import Select, { SelectItems } from "../Select";
import Button from "../Button";
import AddressForm from "./AddressForm";

interface BasicsProps {
  type: EventType;
}

export default function Basics({ type }: BasicsProps) {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Create event step state from redux
  const createEvent = useAppSelector((state) => state.createEvent);

  //Input states
  const [name, setName] = useState<string>(createEvent.event.basics.name);
  const [description, setDescription] = useState<string>(
    createEvent.event.basics.description
  );
  const [category, setCategory] = useState<string>(
    createEvent.event.basics.category
  );
  const [visibility, setVisibility] = useState<EventVisibility>(
    createEvent.event.basics.visibility
  );
  const [address, setAddress] = useState<string>(
    createEvent.event.basics.location.address || ""
  );
  const [venueName, setVenueName] = useState<string>(
    createEvent.event.basics.location.venueName || ""
  );

  //Error states
  const [aboutYourEventErrors, setAboutYourEventErrors] =
    useState<FlatErrors | null>(null);
  const [eventLocationErrors, setEventLocationErrors] =
    useState<FlatErrors | null>(null);
  const nameInputError = aboutYourEventErrors?.name?.at(0);
  const descriptionInputError = aboutYourEventErrors?.description?.at(0);
  const categoryInputError = aboutYourEventErrors?.category?.at(0);
  const addressInputError = eventLocationErrors?.address?.at(0);
  const venueNameInputError = eventLocationErrors?.venueName?.at(0);

  //Categories
  const categories: SelectItems[] = [
    { value: "food and drinks", label: "Food & Drinks" },
    { value: "social", label: "Social" },
    { value: "music", label: "Music" },
    { value: "crafts", label: "Crafts" },
    { value: "sports", label: "Sports" },
    { value: "comedy", label: "Comedy" },
    { value: "film", label: "Film" },
    { value: "performances", label: "Performances" },
    { value: "fashion", label: "Fashion" },
    { value: "galleries", label: "Galleries" },
    { value: "tech", label: "Tech" },
    { value: "business", label: "Business" },
    { value: "others", label: "Others" },
  ];

  //Handle continue
  function handleContinue() {
    //Validate "about your event"
    const validatedAboutYourEventFields = AboutYourEventFormSchema.safeParse({
      name,
      description,
      category,
    });

    let hasAboutYourEventErrors = false;
    if (!validatedAboutYourEventFields.success) {
      const treeErrors = z.treeifyError(
        validatedAboutYourEventFields.error
      ) as ZodErrorTree;
      const flatErrors = flattenTreeErrors(treeErrors);

      setAboutYourEventErrors(flatErrors);
      hasAboutYourEventErrors = true;
    } else {
      setAboutYourEventErrors(null);
    }

    //Validate "where is your event" (timed-entry only)
    let hasEventLocationErrors = false;
    if (type === "timed-entry") {
      const validatedEventLocationFields = EventLocationFormSchema.safeParse({
        address,
        venueName,
      });

      if (!validatedEventLocationFields.success) {
        const treeErrors = z.treeifyError(
          validatedEventLocationFields.error
        ) as ZodErrorTree;
        const flatErrors = flattenTreeErrors(treeErrors);

        setEventLocationErrors(flatErrors);
        hasEventLocationErrors = true;
      } else {
        setEventLocationErrors(null);
      }
    }

    //Check for errors
    if (
      !hasAboutYourEventErrors &&
      (!hasEventLocationErrors || type !== "timed-entry")
    ) {
      //Set current step to 2
      dispatch(updateCurrentStep(2));

      //Update create event redux state
      dispatch(updateBasics({ name, description, category, visibility }));
      dispatch(updateLocation({ address, venueName }));

      //Route to next step
      router.push(`/create/${type}/2`);
    }
  }

  return (
    <div className="space-y-6">
      {/** Tell the world about your event box */}
      <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-6">
        {/** Header */}
        <h2 className="text-black-2 text-[20px] font-bold">
          Tell the world about your event
        </h2>

        {/** Form */}
        <form className="mt-4 flex flex-col gap-y-5">
          {/** Name input */}
          <Input
            name="eventName"
            label={
              <main className="w-full flex items-center justify-between font-medium">
                <div className="w-max">
                  What is your event name?{" "}
                  <span className="text-error-red-2">*</span>
                </div>

                {/** Character count */}
                <div className="w-max !text-gray">{name.length}/75</div>
              </main>
            }
            className="!mb-0"
            placeholder="Make it short and catchy"
            value={name}
            setValue={setName}
            maxLength={75}
            error={nameInputError}
          />

          {/** Description input */}
          <Input
            name="eventDescription"
            label={
              <div className="font-medium">
                Describe your event <span className="text-error-red-2">*</span>
              </div>
            }
            className="!mb-0"
            inputClassName="min-h-[150px] max-h-[280px]"
            value={description}
            setValue={setDescription}
            maxLength={75}
            textarea
            error={descriptionInputError}
          />

          {/** Category select */}
          <div className="w-full">
            <header className="mb-2">
              <h6
                className={`text-[15px] text-black-2 font-medium ${
                  categoryInputError && "!text-error-red-2"
                }`}
              >
                Select a category for your event{" "}
                <span className="text-error-red-2">*</span>
              </h6>
              <p className="text-gray text-[14px]">
                This will help others find your event
              </p>
            </header>

            <Select
              value={category}
              setValue={setCategory}
              error={categoryInputError}
              placeholder="Select a category"
              items={categories}
            />
          </div>

          {/** Visibility picker */}
          <div className="w-full">
            <header className="mb-2">
              <h6 className=" text-[15px] text-black-2 font-medium">
                Select who can see your event
              </h6>
              <p className="text-gray text-[14px]">
                {visibility === "public"
                  ? "Anyone can see and search for public events"
                  : "Only people with your event URL can see this event"}
              </p>
            </header>

            {/** Picker */}
            <main className="w-full flex text-[15px] cursor-pointer">
              {/** Public */}
              <div
                className={`w-full px-4 py-2 border-[1px] border-[#e2e5e7] text-center rounded-l-[6px] ${
                  visibility === "public" ? "border-teal" : "border-r-0"
                }`}
                onClick={() => setVisibility("public")}
              >
                Public
              </div>

              {/** Unlisted */}
              <div
                className={`w-full px-4 py-2 border-[1px] border-[#e2e5e7] text-center rounded-r-[6px] ${
                  visibility === "unlisted" ? "border-teal" : "border-l-0"
                }`}
                onClick={() => setVisibility("unlisted")}
              >
                Unlisted
              </div>
            </main>
          </div>
        </form>
      </section>

      {/** Where is your event box */}
      {type === "timed-entry" && (
        <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-6">
          {/** Header */}
          <h2 className="text-black-2 text-[20px] font-bold">
            Where is your event?
          </h2>

          {/** Form */}
          <AddressForm
            address={address}
            setAddress={setAddress}
            addressInputError={addressInputError}
            venueName={venueName}
            setVenueName={setVenueName}
            venueNameInputError={venueNameInputError}
          />
        </section>
      )}

      {/** Continue button */}
      <Button
        text={`Continue to ${
          type === "regular" ? "Time and Location" : "Schedules"
        }`}
        className="sticky bottom-2 mt-8 md:relative  md:w-max md:ml-auto"
        onClick={handleContinue}
      />
    </div>
  );
}
