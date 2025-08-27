"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import { fetchAccount } from "@/app/actions/settings/account/fetchAccount";

import EmailAddressBox from "@/app/components/settings/account/EmailAddressBox";
import PasswordBox from "@/app/components/settings/account/PasswordBox";
import LocationBox from "@/app/components/settings/account/LocationBox";
import PoliciesBox from "@/app/components/settings/account/PoliciesBox";
import DisableAccountBox from "@/app/components/settings/account/DisableAccountBox";

import BlocksShuffle3 from "@/app/components/ui/spinners/BlocksShuffle3";

export default function AccountSettings() {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Account state variables
  const { account, loading } = useAppSelector((state) => state.account);

  //Fetch account on mount and dispatch
  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  //Return Block shuffle spinner
  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center text-teal">
        <span className="inline-block -mt-[100px]">
          <BlocksShuffle3 size="40" />
        </span>
      </div>
    );

  return (
    <div className="flex flex-col gap-y-6">
      {/** Email address box*/}
      <EmailAddressBox email={account?.email || ""} />

      {/** Password Box */}
      <PasswordBox />

      {/** Location Box */}
      <LocationBox location={account?.location || ""} />

      {/** Policies Box */}
      <PoliciesBox policies={account?.policies} />

      {/** Disable Account Box */}
      <DisableAccountBox />
    </div>
  );
}
