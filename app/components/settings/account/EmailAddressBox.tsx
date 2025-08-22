"use client";

import { FormEvent, useState } from "react";

import z from "zod";

import flattenTreeErrors, {
  FlatErrors,
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

import TriggerUpdateEmailFormSchema from "@/app/libs/definitions/settings/account/trigger-update-email";

import UpdateEmailModal from "./UpdateEmailModal";

import Input from "@/app/components/ui/global/Input";

import Button from "@/app/components/settings/Button";

interface EmailAddressBoxProps {
  email: string;
}

export default function EmailAddressBox({ email }: EmailAddressBoxProps) {
  //Input values and errors
  const [emailInputValue, setEmailInputValue] = useState<string>(email);
  const [errors, setErrors] = useState<FlatErrors>({});
  const emailInputError = errors?.email?.at(0);

  //State of update email modal
  const [showUpdateEmailModal, setShowUpdateEmailModal] =
    useState<boolean>(false);

  //Handle submit function
  function handleSubmit(e: FormEvent) {
    //Prevent default
    e.preventDefault();

    //Validate form fields
    const validatedFields = TriggerUpdateEmailFormSchema.safeParse({
      email: emailInputValue,
    });

    //If any form fields are invalid; set errors and return early
    if (!validatedFields.success) {
      const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
      const flatErrors = flattenTreeErrors(treeErrors);

      setErrors(flatErrors);

      return;
    }

    //Set error if email hasn't changed
    if (emailInputValue === email) {
      setErrors({ email: ["New email is same as current email"] });

      return;
    }

    //Otherwise, clear errros and show update email modal
    setErrors({});
    setShowUpdateEmailModal(true);
  }

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">Email Address</h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Email input */}
        <Input
          name="email"
          label="Email"
          value={emailInputValue}
          setValue={setEmailInputValue}
          error={emailInputError}
        />

        {/** Submit button */}
        <div className="mt-[9px] w-max ml-auto">
          <Button
            isLoading={false}
            text="update email"
            disabled={!emailInputValue}
          />
        </div>
      </form>

      {/** Update Email Modal */}
      {showUpdateEmailModal && (
        <UpdateEmailModal
          email={emailInputValue}
          setShowUpdateEmailModal={setShowUpdateEmailModal}
        />
      )}
    </section>
  );
}
