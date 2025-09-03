"use client";

import { useEffect, useState } from "react";

import { EventVisibility } from "@/app/models/events";

import {
  getAddressPredictions,
  PlacePrediction,
} from "@/app/api/create/basics/get-address-predictions";

import { getPredictionDetails } from "@/app/api/create/basics/get-prediction-details";

import CategorySelect from "./CategorySelect";
import AddressMap from "./AddressMap";

import Input from "../../ui/global/Input";

import Tadpole from "../../ui/spinners/TadPole";

interface BasicsProps {
  type: string;
}

interface PredictionDetails {
  latitude?: number;
  longitude?: number;
}

export default function Basics({ type }: BasicsProps) {
  //Input states and errors
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibility] = useState<EventVisibility>("public");
  const [address, setAddress] = useState<string>("");
  const [venueName, setVenueName] = useState<string>("");

  const [isAddressInputFocused, setIsAddressInputFocused] =
    useState<boolean>(false);

  //Loading states
  const [isGettingPredictions, setIsGettingPredictions] =
    useState<boolean>(false);

  //Google maps states
  const [addressPredictions, setAddressPredictions] = useState<
    PlacePrediction[]
  >([]);
  const [selectedPrediction, setSelectedPrediction] =
    useState<PlacePrediction | null>(null);
  const [selectedPredictionDetails, setSelectedPredictionDetails] =
    useState<PredictionDetails | null>(null);

  //Get address predictions
  useEffect(() => {
    if (address.length < 3) return;

    const getPredictions = setTimeout(async () => {
      setIsGettingPredictions(true);

      try {
        const res = await getAddressPredictions(address);
        setAddressPredictions(res);
      } finally {
        setIsGettingPredictions(false);
      }
    }, 500); //Wait 500ms after user stops typing (NECESSARY DEBOUNCING)

    return () => {
      clearTimeout(getPredictions); //Cleanup old timer if user keeps typing
    };
  }, [address]);

  //Get detail of selected prediction
  useEffect(() => {
    if (!selectedPrediction) return;

    const getDetails = async () => {
      const res = await getPredictionDetails(
        selectedPrediction?.placePrediction.placeId
      );

      setAddress(res.formattedAddress);
      setVenueName(res.displayName.text);
      setSelectedPredictionDetails({
        latitude: res.location.latitude,
        longitude: res.location.longitude,
      });
    };

    getDetails();
  }, [selectedPrediction]);

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
          />

          {/** Category select */}
          <div className="w-full">
            <header className="mb-2">
              <h6 className=" text-[15px] text-black-2 font-medium">
                Select a category for your event{" "}
                <span className="text-error-red-2">*</span>
              </h6>
              <p className="text-gray text-[14px]">
                This will help others find your event
              </p>
            </header>

            <CategorySelect category={category} setCategory={setCategory} />
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
          <form className="mt-4 flex flex-col gap-y-5">
            {/** Address */}
            <section className="relative w-full">
              {/** Address input */}
              <Input
                name="address"
                label={
                  <div className="font-medium">
                    Address <span className="text-error-red-2">*</span>
                  </div>
                }
                className="!mb-0"
                placeholder="e.g. Park 3, MaulHoard, Bourdillon"
                value={address}
                setValue={setAddress}
                isLocation
                setIsInputFocused={setIsAddressInputFocused}
              />

              {/** Address predictions bar */}
              {isAddressInputFocused && (
                <div className="absolute left-0 top-full mt-2 w-full max-h-[130px] space-y-[2px] bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-2 overflow-y-auto cursor-pointer md:max-h-[200px]">
                  {/** Loading spinner */}
                  {isGettingPredictions && (
                    <div className="text-black-2 flex items-center justify-center py-2">
                      <Tadpole size="20" />
                    </div>
                  )}

                  {/** Predictions list */}
                  {!isGettingPredictions && (
                    <>
                      {addressPredictions && addressPredictions.length > 0 ? (
                        addressPredictions.map((prediction, index) => {
                          return (
                            <div
                              className={`w-full py-2 px-4 text-[15px] rounded-[6px] transition-all duration-250 ${
                                index === 0
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-100"
                              }`}
                              key={index}
                              onMouseDown={() => {
                                setSelectedPrediction(prediction);
                                setIsAddressInputFocused(false); //Close dropdown
                              }}
                            >
                              {prediction.placePrediction.text.text}
                            </div>
                          );
                        })
                      ) : (
                        <>
                          {/** If no results found */}
                          <span className="font-semibold text-[15px]">
                            No result found.
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </section>

            {/** Venue name input */}
            <Input
              name="venueName"
              label={
                <div className="font-medium">
                  Venue name <span className="text-error-red-2">*</span>
                </div>
              }
              className="!mb-0"
              placeholder="e.g. Maryland Theatre"
              value={venueName}
              setValue={setVenueName}
            />

            {/** Map */}
            <AddressMap
              latitude={selectedPredictionDetails?.latitude}
              longitude={selectedPredictionDetails?.longitude}
            />
          </form>
        </section>
      )}
    </div>
  );
}
