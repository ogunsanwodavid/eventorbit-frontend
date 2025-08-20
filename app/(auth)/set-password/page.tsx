"use client";

import { FormEvent, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { redirect, useSearchParams } from "next/navigation";

import { setPassword } from "@/app/actions/auth/set-password";

import { validateResetToken } from "@/app/actions/auth/validate-reset-token";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { toast } from "sonner";

import Input from "@/app/components/auth/Input";
import Button from "@/app/components/auth/Button";

import Warning from "@/app/components/ui/icons/Warning";

import Tadpole from "@/app/components/ui/spinners/TadPole";

import tealLogo from "@/public/images/logo-teal.png";

export default function SetPassword() {
  //Search parameters
  const searchParams = useSearchParams();

  //Reset token
  const token = searchParams.get("token");

  //State of the inputs and errors of the form
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<FlatErrors>({});

  //Error states of form
  const emailInputError = errors?.email?.at(0);
  const newPasswordInputError = errors?.newPassword?.at(0);
  const confirmNewPasswordInputError = errors?.confirmNewPassword?.at(0);

  //Token validity state
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  //Loading states
  const [isValidatingResetToken, setIsValidatingResetToken] =
    useState<boolean>(false);
  const [isSettingPassword, setIsSettingPassword] = useState<boolean>(false);

  //Set token validity false if null
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
    }
  }, [token]);

  //Validate reset token on mount
  useEffect(() => {
    //No token; return early
    if (!token) return;

    //Validate function
    const validate = async () => {
      try {
        //Set loading state true
        setIsValidatingResetToken(true);

        const result = await validateResetToken(token);

        //Check if successful
        if (result.success) {
          //Set token validiity true
          setIsTokenValid(true);

          //Set email input
          setEmail(String(result?.email));
        } else {
          //Set token validiity false
          setIsTokenValid(false);
        }
      } finally {
        //Set loading state false
        setIsValidatingResetToken(false);
      }
    };

    validate();
  }, [token]);

  //Function to submit set password form
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsSettingPassword(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);

    //Call the forgot password function
    const result = await setPassword(formData);

    //Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      //Redirect to sign in page
      redirect("/sign-in");
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsSettingPassword(false);
  };

  //Return tadepole spinner when validating reset token
  if (isValidatingResetToken)
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <Tadpole size="47" />
      </div>
    );

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

        {/** Token Valid UI */}
        {isTokenValid && (
          <>
            {/** Texts */}
            <h4 className="text-black text-[21px] font-semibold">
              Set up a password
            </h4>

            <h5 className="text-gray text-base">
              Complete your account setup to access and manage your tickets.
            </h5>
          </>
        )}
      </header>

      {/** Verification failed UI */}
      {!isTokenValid && !isValidatingResetToken && (
        <div className="p-6 flex flex-col items-center justify-center gap-y-3 text-black">
          <>
            <div className="text-error-red">
              <Warning size="48" />
            </div>

            <div className="font-semibold text-lg lg:text-[22px]">
              Invalid or expired token
            </div>

            <div className="flex flex-col text-[15px] text-center font-medium">
              <p>
                We have failed to validate your reset token. You can request for
                another below.
              </p>
            </div>

            {/** Buttons */}
            {/** Request new reset link
             */}
            <Link href="/forgot-password" className="w-full mt-3">
              <Button isLoading={false} text="send me a new link" />
            </Link>

            {/** Go to home */}
            <Link href="/" className="block w-full">
              <Button
                isLoading={false}
                text="Go to Home"
                className="!bg-[#fafafa] !text-black-2 shadow-[0_0_0_1px_#E2E5E7]"
              />
            </Link>
          </>
        </div>
      )}

      {/** Form
       * Display only when token's valid
       */}
      {isTokenValid && (
        <form onSubmit={handleSubmit} className="w-full p-6 space-y-6">
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
              disabled
            />

            {/** New Password input */}
            <Input
              name="newPassword"
              label="New password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              setValue={setNewPassword}
              error={newPasswordInputError}
              isSecret
              disabled={isSettingPassword}
            />

            {/** Confirm New Password input */}
            <Input
              name="confirmNewPassword"
              label="Confirm password"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              setValue={setConfirmNewPassword}
              error={confirmNewPasswordInputError}
              isSecret
              disabled={isSettingPassword}
            />
          </section>

          {/** Submit Button */}
          <Button
            isLoading={isSettingPassword}
            text="set password"
            disabled={isSettingPassword}
          />
        </form>
      )}
    </div>
  );
}
