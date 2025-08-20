"use client";

import { FormEvent, useState } from "react";

import { redirect, useSearchParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { forgotPassword } from "@/app/actions/auth/forgot-password";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import getSafeRedirect from "@/app/utils/helpers/global/getSafeRedirect";

import { toast } from "sonner";

import Input from "@/app/components/auth/Input";
import Button from "@/app/components/auth/Button";

import tealLogo from "@/public/images/logo-teal.png";

export default function ForgotPassword() {
  //Search parameters
  const searchParams = useSearchParams();

  //Page redirection route
  const pageRedirect = getSafeRedirect(searchParams.get("redirect"));

  //State of the inputs and errors of the form
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FlatErrors>({});

  //Error states of form
  const emailInputError = errors?.email?.at(0);

  //Loading state of sending reset email
  const [isSendingResetLink, setIsSendingResetLink] = useState<boolean>(false);

  //Function to submit password reset form
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsSendingResetLink(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("pageRedirect", pageRedirect);

    //Call the forgot password function
    const result = await forgotPassword(formData);

    //Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      //Redirect to home
      redirect("/");
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsSendingResetLink(false);
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
          Forgot your password?
        </h4>
        <h5 className="text-gray text-base">
          Or you wanted to{" "}
          <Link href="/sign-up" className="inline-block text-teal font-medium">
            sign up
          </Link>{" "}
          or{" "}
          <Link href="/sign-in" className="inline-block text-teal font-medium">
            log in
          </Link>
          ?
        </h5>
      </header>

      {/** Form */}
      <form onSubmit={handleSubmit} className="w-full p-6 space-y-6">
        {/** Email input */}
        <Input
          name="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          setValue={setEmail}
          error={emailInputError}
          disabled={isSendingResetLink}
        />

        {/** Submit Button */}
        <Button
          isLoading={isSendingResetLink}
          text="send password reset link"
          disabled={isSendingResetLink}
        />
      </form>
    </div>
  );
}
