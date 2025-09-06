import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  getAddressPredictions,
  PlacePrediction,
} from "@/app/api/create/basics/get-address-predictions";
import { getPredictionDetails } from "@/app/api/create/basics/get-prediction-details";

import Input from "../../ui/global/Input";

import Tadpole from "../../ui/spinners/TadPole";

import AddressMap from "./AddressMap";

interface PredictionDetails {
  latitude?: number;
  longitude?: number;
}

interface AddressFormProps {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  addressInputError: string | undefined;
  venueName: string;
  setVenueName: Dispatch<SetStateAction<string>>;
  venueNameInputError: string | undefined;
}

export default function AddressForm({
  address,
  setAddress,
  addressInputError,
  venueName,
  setVenueName,
  venueNameInputError,
}: AddressFormProps) {
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
  }, [selectedPrediction, setAddress, setVenueName]);

  return (
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
          error={addressInputError}
        />

        {/** Address predictions bar */}
        {isAddressInputFocused && (
          <div className="absolute left-0 z-2 top-full mt-2 w-full max-h-[180px] space-y-[2px] bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-2 overflow-y-auto cursor-pointer md:max-h-[270px]">
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
                          index === 0 ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                        key={index}
                        onMouseDown={() => {
                          setSelectedPrediction(prediction);
                          setIsAddressInputFocused(false); //Close dropdown
                          setAddressPredictions([prediction]);
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
                      No results found.
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
        error={venueNameInputError}
      />

      {/** Map */}
      <AddressMap
        latitude={selectedPredictionDetails?.latitude}
        longitude={selectedPredictionDetails?.longitude}
      />
    </form>
  );
}
