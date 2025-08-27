"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import { fetchEmailPreferences } from "@/app/actions/settings/email-preferences/fetchEmailPreferences";

import EmailNotificationsBox from "@/app/components/settings/email-preferences/EmailNotificationsBox";

import BlocksShuffle3 from "@/app/components/ui/spinners/BlocksShuffle3";

export default function EmailPreferencesSettings() {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Email Preferences state variables
  const { emailPreferences, loading } = useAppSelector(
    (state) => state.emailPreferences
  );

  //Fetch email preferences on mount and dispatch
  useEffect(() => {
    dispatch(fetchEmailPreferences());
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
      {/** Email Notifications Box */}
      <EmailNotificationsBox emailPreferences={emailPreferences} />
    </div>
  );
}
