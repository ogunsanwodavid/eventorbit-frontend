"use client";

import { useState } from "react";

import Link from "next/link";

export default function Signin() {
  //Type of the error state of the form
  type LoginFormErrors = {
    email?: string[];
    password?: string[];
  } | null;

  //States of the inputs and errors of the form
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginFormErrors>(null);

  //Error states of form
  const emailInputError = errors?.email?.at(0);
  const passwordInputError = errors?.password?.at(0);

  //Loading state of form
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  //Function to submit form
  const handleSubmit = async (e: React.FormEvent) => {
    //Set Loading state true
    setIsLoggingIn(true);

    //Prevent default
    e.preventDefault();

    // Collect form data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    /*     // Call the login function
    const result = await login(formData);

    //Set errors is it exists else set to null
    if (result?.errors) {
      setErrors(result.errors);
    } else {
      setErrors(null);
    }

    //Check for error from server
    if (result?.error) {
      //Toast error
      toast.error(result.error);
    }

    //Check if request is successful
    if (result.success) {
      //Toast success
      toast.success("Login successful!");
    } */

    //Set Loading state false
    setIsLoggingIn(false);
  };

  return (
    <>
      {/** Header */}
      <header className="w-full p-6 pb-0 text-center space-y-1">
        <h4 className="text-black text-[22px] font-semibold">
          Log in to EventOrbit
        </h4>
        <h5 className="text-gray text-base">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="inline-block text-teal font-medium">
            Sign Up
          </Link>
        </h5>
      </header>

      {/** Form */}
      <form onSubmit={handleSubmit} className="w-full p-6 space-y-4"></form>
    </>
  );
}
