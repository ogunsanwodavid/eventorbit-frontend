"use client";

import { FormEvent, useState } from "react";

import { redirect, useSearchParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { signUp } from "@/app/actions/auth/sign-up";

import { googleSignIn } from "@/app/actions/auth/google-sign-in";

import { UserType } from "@/app/models/auth";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { useGeolocation } from "@/app/hooks/global/useGeoLocation";

import getSafeRedirect from "@/app/utils/helpers/global/getSafeRedirect";

import { toast } from "sonner";

import Input from "@/app/components/auth/Input";
import Button from "@/app/components/auth/Button";

import CheckBox from "@/app/components/ui/icons/CheckBox";
import CheckBoxOutlineBlank from "@/app/components/ui/icons/CheckBoxOutlineBlank";
import Google from "@/app/components/ui/icons/Google";

import Tadpole from "@/app/components/ui/spinners/TadPole";

import tealLogo from "@/public/images/logo-teal.png";

export default function SignUp() {
  //Search parameters
  const searchParams = useSearchParams();

  //Page redirection route
  const pageRedirect = getSafeRedirect(searchParams.get("redirect"));

  //State of the inputs and errors of the form
  const [userType, setUserType] = useState<UserType>("individual");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [receiveEmails, setReceiveEmails] = useState<boolean>(false);
  const [errors, setErrors] = useState<FlatErrors>({});

  //User type: either individual or organization
  const isIndividual = userType === "individual";
  const isOrganization = userType === "organization";

  //Function to set user type
  function handleSetUserType(type: UserType, e: FormEvent) {
    e.preventDefault();

    setUserType(type);
  }

  //Get user's location by lat and long
  const { latitude, longitude } = useGeolocation();

  //Error states of form
  const firstNameInputError = errors?.firstName?.at(0);
  const lastNameInputError = errors?.lastName?.at(0);
  const organizationNameInputError = errors?.organizationName?.at(0);
  const emailInputError = errors?.email?.at(0);
  const passwordInputError = errors?.password?.at(0);

  //Loading state of signup
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isGoogleSigningUp, setIsGoogleSigningUp] = useState<boolean>(false);

  //Function to submit signup form
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsSigningUp(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("userType", userType);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("organizationName", organizationName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("pageRedirect", pageRedirect);

    //Call the sign up function
    //Redirect too
    const result = await signUp(formData);

    // Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      //Redirect to home page
      redirect("/");
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsSigningUp(false);
  };

  //Function to sign up with Google
  const handleGoogleSignUp = (e: FormEvent) => {
    //Prevent default
    e.preventDefault();

    setIsGoogleSigningUp(true);

    //Redirect to backend auth route
    googleSignIn(latitude, longitude, pageRedirect);
  };

  return (
    <div className="w-full bg-white">
      {/** Header */}
      <header className="w-full p-6 pb-0 text-center space-y-1">
        {/** Logo */}
        <Image
          src={tealLogo}
          className="w-[150px] mx-auto"
          alt="eventorbit teal logo"
        />

        {/** Texts */}
        <h4 className="text-black text-[21px] font-semibold">
          Step into a world of possibilities.
        </h4>
        <h5 className="text-gray text-base">
          Already have an account?{" "}
          <Link href="/sign-in" className="inline-block text-teal font-medium">
            Log in
          </Link>
        </h5>
      </header>

      {/** Form */}
      <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
        {/** Individual or Organization select*/}
        <section
          className="w-full flex text-black rounded-[6px] overflow-hidden border-[1px] border-[#e2e5e7]"
          aria-label="select"
        >
          {/** Individual button */}
          <button
            className="w-1/2 z-2 bg-[#f5f5f5] py-3 px-4 text-base"
            style={{
              backgroundColor: isIndividual ? "#f5f5f5" : "#fff",
              boxShadow: isIndividual
                ? "0 0 0 1px #E2E5E7, inset 0 2px 5px 0 rgba(28, 35, 43, .15)"
                : "0 0 0 1px #E2E5E7",
            }}
            onClick={(e) => handleSetUserType("individual", e)}
          >
            Individual
          </button>

          {/** Organization button */}
          <button
            className="w-1/2 z-2 bg-[#f5f5f5] py-3 px-4 text-base"
            style={{
              backgroundColor: isOrganization ? "#f5f5f5" : "#fff",
              boxShadow: isOrganization
                ? "0 0 0 1px #E2E5E7, inset 0 2px 5px 0 rgba(28, 35, 43, .15)"
                : "0 0 0 1px #E2E5E7",
            }}
            onClick={(e) => handleSetUserType("organization", e)}
          >
            Organization
          </button>
        </section>

        {/** Inputs */}
        <section>
          {isIndividual && (
            <div className="grid grid-cols-2 gap-2">
              {/** First name input */}
              <Input
                name="firstName"
                label="First name"
                placeholder="Enter your first name"
                value={firstName}
                setValue={setFirstName}
                error={firstNameInputError}
                disabled={isSigningUp}
              />

              {/** Last name input */}
              <Input
                name="lastName"
                label="Last name"
                placeholder="Enter your last name"
                value={lastName}
                setValue={setLastName}
                error={lastNameInputError}
                disabled={isSigningUp}
              />
            </div>
          )}

          {/** Organization name input */}
          {isOrganization && (
            <Input
              name="organizationName"
              label="Organization name"
              placeholder="Enter your organization name"
              value={organizationName}
              setValue={setOrganizationName}
              error={organizationNameInputError}
              disabled={isSigningUp}
            />
          )}

          {/** Email input */}
          <Input
            name="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            setValue={setEmail}
            error={emailInputError}
            disabled={isSigningUp}
          />

          {/** Password input */}
          <Input
            name="password"
            label="Password"
            placeholder="Minimum 6 characters"
            value={password}
            setValue={setPassword}
            error={passwordInputError}
            isSecret
            disabled={isSigningUp}
          />
        </section>

        {/** Receive emails checkbox */}
        <div
          className="flex gap-x-2"
          onClick={() => setReceiveEmails((prevState) => !prevState)}
        >
          {/** Checkbox */}
          <span>
            {receiveEmails ? (
              <CheckBox size="20" fill="#008080" />
            ) : (
              <CheckBoxOutlineBlank size="20" fill="#E2E5E7" />
            )}
          </span>

          {/** Text */}
          <span className="text-[13px] text-gray -mt-0.5">
            I&apos;d like to get emails about events, resources, and product
            news from EventOrbit.
          </span>
        </div>

        {/** Terms of Service */}
        <div className="text-[13px] text-gray mt-6">
          By continuing, you agree to{" "}
          <Link href="#" className="inline text-teal">
            EventOrbit&apos;s Terms of Service
          </Link>
        </div>

        {/** Submit Button */}
        <Button
          isLoading={isSigningUp}
          text="continue"
          disabled={isGoogleSigningUp || isSigningUp}
        />
      </form>

      {/** Footer */}
      <footer className="w-full p-6 bg-[#fafafa] border-t-[1px] border-t-[#e2e5e7] flex flex-col gap-3">
        {/** Sign up with Google button */}
        <button
          className="w-full bg-white py-2 px-3 text-base text-black-2 flex items-center justify-center gap-x-2 hover:bg-[#f5f5f5]"
          style={{
            boxShadow: "0 0 0 1px #E2E5E7",
          }}
          disabled={isGoogleSigningUp || isSigningUp}
          onClick={(e) => handleGoogleSignUp(e)}
        >
          {!isGoogleSigningUp ? (
            <>
              {/** Google icon */}
              <Google size="16" />

              <span>Sign up with Google</span>
            </>
          ) : (
            <Tadpole size="20" />
          )}
        </button>
      </footer>
    </div>
  );
}
