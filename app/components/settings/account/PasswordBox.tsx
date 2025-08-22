"use client";

import { FormEvent, useState } from "react";

import { redirect } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { updatePassword } from "@/app/api/settings/account/update-password";

import { toast } from "sonner";

import Button from "../Button";

import Input from "../../ui/global/Input";

export default function PasswordBox() {
  //Auth context tools
  const { refreshAuth } = useAuth();

  //Input values and errors
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [errors, setErrors] = useState<FlatErrors>({});

  const currentPasswordInputError = errors?.currentPassword?.at(0);
  const newPasswordInputError = errors?.newPassword?.at(0);
  const confirmNewPasswordInputError = errors?.confirmNewPassword?.at(0);

  //Loading states
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingPassword(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);

    //Call the update password function
    const result = await updatePassword(formData);

    // Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Toast success
      toast.success(result.message);

      //Refresh auth
      await refreshAuth();

      //Redirect to sign in
      redirect("/sign-in");
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUpdatingPassword(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">Password</h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Current Password input */}
        <Input
          name="currentPassword"
          label="Current password"
          value={currentPassword}
          setValue={setCurrentPassword}
          error={currentPasswordInputError}
          isSecret
          disabled={isUpdatingPassword}
        />

        {/** New Password input */}
        <Input
          name="newPassword"
          label="New password"
          value={newPassword}
          setValue={setNewPassword}
          error={newPasswordInputError}
          isSecret
          disabled={isUpdatingPassword}
        />

        {/** Set New Password input */}
        <Input
          name="confirmNewPassword"
          label="Confirm new password"
          value={confirmNewPassword}
          setValue={setConfirmNewPassword}
          error={confirmNewPasswordInputError}
          isSecret
          disabled={isUpdatingPassword}
        />

        {/** Submit button */}
        <div className="mt-[9px] w-[157px] ml-auto">
          <Button
            isLoading={isUpdatingPassword}
            text="update password"
            disabled={
              (!currentPassword && !newPassword && !confirmNewPassword) ||
              isUpdatingPassword
            }
          />
        </div>
      </form>
    </section>
  );
}
