"use client";

import { FormEvent, useState } from "react";

import Link from "next/link";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { Account } from "@/app/models/settings";

import { useAppDispatch } from "@/app/hooks/global/redux";

import { updatePolicies } from "@/app/api/settings/account/update-policies";

import { fetchAccount } from "@/app/actions/settings/account/fetchAccount";

import { toast } from "sonner";

import Button from "../Button";

import Input from "../../ui/global/Input";

interface PoliciesBoxProps {
  policies: Account["policies"];
}

export default function PoliciesBox({ policies }: PoliciesBoxProps) {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Input values and errors
  const [termsAndConditionsInputValue, setTermsAndConditionsInputValue] =
    useState<string>(policies?.termsAndConditions || "");
  const [privacyPolicyInputValue, setPrivacyPolicyInputValue] =
    useState<string>(policies?.privacyPolicy || "");

  const [errors, setErrors] = useState<FlatErrors>({});

  const termsAndConditionsInputValueError = errors?.termsAndConditions?.at(0);
  const privacyPolicyInputValueError = errors?.privacyPolicy?.at(0);

  //Loading states
  const [isUpdatingPolicies, setIsUpdatingPolicies] = useState<boolean>(false);

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingPolicies(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("termsAndConditions", termsAndConditionsInputValue);
    formData.append("privacyPolicy", privacyPolicyInputValue);

    //Call the update location function
    const result = await updatePolicies(formData);

    //Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Refresh account state in Redux
      await dispatch(fetchAccount());

      //Toast success
      toast.success(result.message);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUpdatingPolicies(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">
        Policies for your events
      </h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Terms and conditions input */}
        <Input
          name="termsAndConditions"
          label={
            <>
              <span className="block font-medium">Terms & conditions</span>
              <span className="block text-[13px] text-[#677077]">
                Terms & Conditions let you clearly outline the rules,
                guidelines, and expectations for your event.
              </span>
            </>
          }
          value={termsAndConditionsInputValue}
          setValue={setTermsAndConditionsInputValue}
          error={termsAndConditionsInputValueError}
          disabled={isUpdatingPolicies}
        />

        {/** Privacy policy input */}
        <Input
          name="privacyPolicy"
          label={
            <>
              <span className="block font-medium">Privacy policy</span>
              <span className="block text-[13px] text-[#677077]">
                A Privacy policy explains how you, as the host, collect, use,
                and protect attendees&apos; personal information. A valid
                privacy policy is required to enable Universe&apos;s Waitlist
                Contacts tool.{" "}
                <Link href="#" className="inline text-teal">
                  Learn more.
                </Link>
              </span>
            </>
          }
          value={privacyPolicyInputValue}
          setValue={setPrivacyPolicyInputValue}
          error={privacyPolicyInputValueError}
          disabled={isUpdatingPolicies}
        />

        {/** Submit button */}
        <div className="mt-[9px] w-[123px] ml-auto">
          <Button
            isLoading={isUpdatingPolicies}
            text="save policies"
            disabled={
              (!termsAndConditionsInputValue && !privacyPolicyInputValue) ||
              isUpdatingPolicies
            }
          />
        </div>
      </form>
    </section>
  );
}
