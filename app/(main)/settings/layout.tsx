"use client";

import { ReactNode } from "react";

import TabLink from "@/app/components/auth/TabLink";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-[860px] py-[30px] px-5 overflow-auto flex flex-col lg:px-10">
      {/** Header */}
      <header className="flex flex-col gap-y-4 mb-6 lg:gap-y-6">
        {/** Heading */}
        <h2 className="text-black-2 text-[30px] font-bold">Settings</h2>

        {/** Tab Menu */}
        <section className="w-full flex gap-x-8 border-b-[1px] border-b-[#d4d4d5] overflow-y-auto">
          {/** Account */}
          <TabLink href="/settings/account">Account</TabLink>

          {/** Profile */}
          <TabLink href="/settings/profile">Profile</TabLink>

          {/** Email preferences */}
          <TabLink href="/settings/email-preferences">
            Email preferences
          </TabLink>
        </section>
      </header>

      {/** Tab display */}
      <main className="w-full flex-1 flex flex-col">{children}</main>
    </div>
  );
}
