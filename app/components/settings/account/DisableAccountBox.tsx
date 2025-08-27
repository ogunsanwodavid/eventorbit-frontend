"use cient";

import { useState } from "react";

import DisableAccountModal from "./DisableAccountModal";

import Button from "../Button";

export default function DisableAccountBox() {
  //State of disable account modal
  const [showDisableAccountModal, setShowDisableAccountModal] =
    useState<boolean>(false);

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col gap-y-6 md:flex-row md:items-center md:justify-between lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">
        Disable your account
      </h3>

      {/** Button to trigger disable modal */}
      <div className="w-full md:w-max">
        <Button
          text="disable account"
          className="!border-error-red !text-error-red hover:!bg-error-red hover:!text-white"
          onClick={() => setShowDisableAccountModal(true)}
        />
      </div>

      {/** Update Email Modal */}
      {showDisableAccountModal && (
        <DisableAccountModal
          setShowDisableAccountModal={setShowDisableAccountModal}
        />
      )}
    </section>
  );
}
