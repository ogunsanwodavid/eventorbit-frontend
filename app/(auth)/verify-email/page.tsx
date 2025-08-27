"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { redirect, useSearchParams } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { verifyEmail } from "@/app/api/auth/verify-email";

import getSafeRedirect from "@/app/utils/helpers/global/getSafeRedirect";

import Button from "@/app/components/auth/Button";

import MailFilled from "@/app/components/ui/icons/MailFilled";
import MailCheckmarkFilled from "@/app/components/ui/icons/MailCheckmarkFilled";
import MailDismissFilled from "@/app/components/ui/icons/MailDismissFilled";

import tealLogo from "@/public/images/logo-teal.png";

export default function VerifyEmail() {
  //Auth context variables
  const { refreshAuth } = useAuth();

  //Search parameters
  const searchParams = useSearchParams();

  //Token from query params
  //::Or empty string
  const token = searchParams.get("token") || "";

  //Page redirect from query params
  const pageRedirect = decodeURIComponent(
    getSafeRedirect(searchParams.get("redirect"))
  );

  //Verification status
  const [isVerified, setIsVerified] = useState<boolean>(false);

  //Loading state of verify email
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  //VERIFY EMAIL
  useEffect(() => {
    //No token; return early
    if (!token) return;

    const verify = async () => {
      try {
        //Set loading state true
        setIsVerifyingEmail(true);

        const result = await verifyEmail(token);

        //Check if successful
        if (result.success) {
          //Set verification status true
          setIsVerified(true);

          //Refresh auth status
          await refreshAuth({ setLoading: false });
        } else {
          //Set verification status false
          setIsVerified(false);
        }
      } finally {
        //Set loading state false
        setIsVerifyingEmail(false);
      }
    };

    verify();
  }, [token]);

  //Size of filled email icon
  const [mailFilledIconSize, setMailFilledIconSize] = useState<number>(32);

  //Effect for filled email icon animation
  useEffect(() => {
    let growing = true;

    const interval = setInterval(() => {
      setMailFilledIconSize((prev) => {
        if (growing) {
          if (prev >= 48) growing = false;
          return prev + 1;
        } else {
          if (prev <= 32) growing = true;
          return prev - 1;
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white p-6 flex flex-col items-center justify-center gap-y-3 text-black">
      {/** Logo */}
      <Image
        src={tealLogo}
        className="w-[135px] mx-auto lg:w-[150px]"
        alt="eventorbit teal logo"
      />
      {/** Verifying email UI */}
      {isVerifyingEmail && (
        <>
          <div className="h-12 flex items-center justify-center">
            <MailFilled size={String(mailFilledIconSize)} />
          </div>

          <div className="font-semibold text-lg lg:text-[22px]">
            Verifying email...
          </div>

          <div className="flex flex-col text-[15px] text-center font-medium">
            <p>We are verifying your email address</p>
            <p>This may take a few seconds</p>
          </div>
        </>
      )}

      {/** Verification successful UI */}
      {isVerified && !isVerifyingEmail && (
        <>
          <div className="text-success-green">
            <MailCheckmarkFilled size="48" />
          </div>

          <div className="font-semibold text-lg lg:text-[22px]">
            Email successfully verified
          </div>

          <div className="flex flex-col text-[15px] text-center font-medium">
            <p>We have verified your email address</p>
          </div>

          {/** Continue */}
          <div
            className="block w-full mt-3"
            onClick={() => redirect(pageRedirect)}
          >
            <Button isLoading={false} text="Continue" />
          </div>
        </>
      )}

      {/** Verification failed UI */}
      {!isVerified && !isVerifyingEmail && (
        <>
          <div className="text-error-red">
            <MailDismissFilled size="48" />
          </div>

          <div className="font-semibold text-lg lg:text-[22px]">
            Email verification failed
          </div>

          <div className="flex flex-col text-[15px] text-center font-medium">
            <p>We have failed to verify your email address</p>
          </div>

          {/** Buttons */}
          {/** Try again
           * Refreshes the page and tries to verify email again
           */}
          <div className="w-full mt-3" onClick={() => window.location.reload()}>
            <Button isLoading={false} text="Try again" />
          </div>

          {/** Go to home */}
          <Link href="/" className="block w-full">
            <Button
              isLoading={false}
              text="Go to Home"
              className="!bg-[#fafafa] !text-black-2 shadow-[0_0_0_1px_#E2E5E7]"
            />
          </Link>
        </>
      )}
    </div>
  );
}
