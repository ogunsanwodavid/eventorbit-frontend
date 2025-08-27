"use client";

import { FormEvent, useState } from "react";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { useAppDispatch } from "@/app/hooks/global/redux";

import { updateLocation } from "@/app/api/settings/account/update-location";

import { fetchAccount } from "@/app/actions/settings/account/fetchAccount";

import { toast } from "sonner";

import Button from "../Button";

import Input from "../../ui/global/Input";

interface LocationBoxProps {
  location: string;
}

export default function LocationBox({ location }: LocationBoxProps) {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Input values and errors
  const [locationInputValue, setLocationInputValue] =
    useState<string>(location);

  const [errors, setErrors] = useState<FlatErrors>({});

  const locationInputValueError = errors?.location?.at(0);

  //Loading states
  const [isUpdatingLocation, setIsUpdatingLocation] = useState<boolean>(false);

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingLocation(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("location", locationInputValue);

    //Call the update location function
    const result = await updateLocation(formData);

    //Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      //Refresh account state in Redux
      await dispatch(fetchAccount());
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUpdatingLocation(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">Location</h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Location input */}
        <Input
          name="location"
          label="Location"
          value={locationInputValue}
          setValue={setLocationInputValue}
          error={locationInputValueError}
          disabled={isUpdatingLocation}
        />

        {/** Submit button */}
        <div className="mt-[9px] w-[132px] ml-auto">
          <Button
            isLoading={isUpdatingLocation}
            text="save location"
            disabled={!locationInputValue || isUpdatingLocation}
          />
        </div>
      </form>
    </section>
  );
}
