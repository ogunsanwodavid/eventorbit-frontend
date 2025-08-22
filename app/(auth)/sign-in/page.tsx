"use client";

import { FormEvent, useState } from "react";

import { redirect, useSearchParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/app/contexts/AuthContext";

import { signIn } from "@/app/api/auth/sign-in";

import { googleSignIn } from "@/app/api/auth/google-sign-in";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { useGeolocation } from "@/app/hooks/global/useGeoLocation";

import getSafeRedirect from "@/app/utils/helpers/global/getSafeRedirect";

import { toast } from "sonner";

import Input from "@/app/components/ui/global/Input";

import Button from "@/app/components/auth/Button";

import Google from "@/app/components/ui/icons/Google";

import Tadpole from "@/app/components/ui/spinners/TadPole";

import tealLogo from "@/public/images/logo-teal.png";

export default function Signin() {
  //Auth context tools
  const { refreshAuth } = useAuth();

  //Search parameters
  const searchParams = useSearchParams();

  //Page redirection route
  const pageRedirect = getSafeRedirect(searchParams.get("redirect"));

  //State of the inputs and errors of the form
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FlatErrors>({});

  //Get user's location by lat and long
  const { latitude, longitude } = useGeolocation();

  //Error states of form
  const emailInputError = errors?.email?.at(0);
  const passwordInputError = errors?.password?.at(0);

  //Loading state of sign in
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState<boolean>(false);

  //Function to submit sign in form
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsSigningIn(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("pageRedirect", pageRedirect);

    //Call the sign in function
    const result = await signIn(formData);

    // Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      await refreshAuth();

      //Redirect
      redirect(pageRedirect);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsSigningIn(false);
  };

  //Function to sign up with Google
  const handleGoogleSignIn = (e: FormEvent) => {
    //Prevent default
    e.preventDefault();

    setIsGoogleSigningIn(true);

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
          Your gateway to new opportunities
        </h4>
        <h5 className="text-gray text-base">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="inline-block text-teal font-medium">
            Sign up
          </Link>
        </h5>
      </header>

      {/** Form */}
      <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
        {/** Inputs */}
        <section>
          {/** Email input */}
          <Input
            name="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            setValue={setEmail}
            error={emailInputError}
            disabled={isSigningIn}
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
            disabled={isSigningIn}
            labelRightComponent={
              <Link
                href="/forgot-password"
                className="text-[15px] text-teal mb-2 font-medium"
              >
                Forgot Password?
              </Link>
            }
          />
        </section>

        {/** Submit Button */}
        <Button
          isLoading={isSigningIn}
          text="log in"
          disabled={isGoogleSigningIn || isSigningIn}
        />
      </form>

      {/** Footer */}
      <footer className="w-full p-6 bg-[#fafafa] border-t-[1px] border-t-[#e2e5e7] flex flex-col gap-3">
        {/** Sign in with Google button */}
        <button
          className="w-full bg-white py-2 px-3 text-base text-black-2 flex items-center justify-center gap-x-2 hover:bg-[#f5f5f5]"
          style={{
            boxShadow: "0 0 0 1px #E2E5E7",
          }}
          disabled={isGoogleSigningIn || isSigningIn}
          onClick={(e) => handleGoogleSignIn(e)}
        >
          {!isGoogleSigningIn ? (
            <>
              {/** Google icon */}
              <Google size="16" />

              <span>Sign in with Google</span>
            </>
          ) : (
            <Tadpole size="20" />
          )}
        </button>
      </footer>
    </div>
  );
}
