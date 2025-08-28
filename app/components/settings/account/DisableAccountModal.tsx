import { FormEvent, useState } from "react";

import { redirect } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { disableAccount } from "@/app/api/settings/account/disable-account";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { toast } from "sonner";

import Button from "../Button";

import Input from "../../ui/global/Input";

import X from "../../ui/icons/X";

interface DisableAccountModalProps {
  setShowDisableAccountModal: (arg: boolean) => void;
}

export default function DisableAccountModal({
  setShowDisableAccountModal,
}: DisableAccountModalProps) {
  //Auth context tools
  const { refreshAuth } = useAuth();

  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  //Input values and errors
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FlatErrors>({});
  const passwordInputError = errors?.password?.at(0);

  //Loading states
  const [isDisablingAccount, setIsDisablingAccount] = useState<boolean>(false);

  //Close modal function
  function handleCloseModal() {
    setShowDisableAccountModal(false);
  }

  //Cancel function
  function handleCancel(e: FormEvent) {
    //Prevent default
    e.preventDefault();

    //Close modal
    handleCloseModal();
  }

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsDisablingAccount(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("password", password);

    //Call the disable account function
    const result = await disableAccount(formData);

    // Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Refresh auth
      await refreshAuth({ setLoading: false });

      //Toast success
      toast.success(result.message);

      //Redirect to home
      redirect("/");
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsDisablingAccount(false);
  };

  return (
    <div
      className="fixed top-0 left-0 bg-blur-black flex items-center justify-center px-5 lg:px-10"
      style={{
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
    >
      <main className="w-full max-w-[600px] bg-white p-6 rounded-[6px]">
        {/** Header */}
        <header className="flex flex-col gap-y-3">
          {/** X icon */}
          <span
            className="inline-block w-max ml-auto text-gray"
            onClick={handleCloseModal}
          >
            <X size="21" />
          </span>

          {/** Texts */}
          <div className="space-y-1">
            <h4 className="text-black text-[19px] font-semibold">
              Are you sure you want to disable your account?
            </h4>

            <p className="text-black-2 text-[14px] font-medium">
              Your account will remain inactive until you contact support or
              request reactivation.
            </p>
          </div>
        </header>

        {/** Form */}
        <form onSubmit={handleSubmit} className="flex flex-col mt-[17px]">
          {/** Password input */}
          <Input
            name="password"
            label={
              <div>
                Password <span className="text-error-red-2">*</span>
              </div>
            }
            value={password}
            setValue={setPassword}
            error={passwordInputError}
            isSecret
            disabled={isDisablingAccount}
          />

          {/** Buttons */}
          <div className="mt-[4px] w-max ml-auto flex items-center gap-x-3">
            {/** Cancel */}
            <button
              className="w-[82px] py-2 px-4 text-black-2 text-[15px] shadow-[inset_0_0_0_1px_#e2e5e7] rounded-[6px]"
              onClick={handleCancel}
            >
              Cancel
            </button>

            {/** Submit */}
            <Button
              isLoading={isDisablingAccount}
              text="disable"
              className="!w-[82px] !bg-error-red !border-error-red !text-white"
              disabled={!password || isDisablingAccount}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
