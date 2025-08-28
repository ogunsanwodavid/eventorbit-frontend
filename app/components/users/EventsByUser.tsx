import { useState } from "react";

import { Profile } from "@/app/models/auth";

import NoEventError from "./NoEventError";
import PrivatePageError from "./PrivatePageError";

type ActiveEventsTab = "upcoming" | "past";

interface EventsByUsersProps {
  pageProfile: Profile | null;
  isOwnProfile: boolean;
}

export default function EventsByUser({
  pageProfile,
  isOwnProfile,
}: EventsByUsersProps) {
  //Active tab of events menu
  const [activeEventsTab, setActiveEventsTab] =
    useState<ActiveEventsTab>("upcoming");

  const upcomingEvents = [];
  const pastEvents = [];

  return (
    <div className="w-full">
      {/** Header
       * show only if not private when user not visiting own profile
       */}
      {!(!isOwnProfile && pageProfile?.info.isPrivate) && (
        <header className="w-full px-5 md:pl-0">
          <h2 className="text-black-2 text-2xl font-medium">
            Events By{" "}
            {pageProfile?.info.organizationName || pageProfile?.info.firstName}
          </h2>

          {/** Events tab menu */}
          <section className="mt-6 -mb-0.5 w-full flex gap-x-6 overflow-x-auto cursor-pointer">
            {/** Upcoming events */}
            <div
              className={`w-max z-2 px-1 pb-3 text-black-2 text-[16px] text-nowrap border-b-2 border-b-transparent hover:text-teal hover:border-b-teal hover:font-medium ${
                activeEventsTab === "upcoming" &&
                "!text-teal !border-b-teal font-medium"
              }`}
              onClick={() => setActiveEventsTab("upcoming")}
            >
              Upcoming events
            </div>

            {/** Past events */}
            <div
              className={`w-max z-2 px-1 pb-3 text-black-2 text-[16px] text-nowrap border-b-2 border-b-transparent hover:text-teal hover:border-b-teal hover:font-medium ${
                activeEventsTab === "past" &&
                "!text-teal !border-b-teal font-medium"
              }`}
              onClick={() => setActiveEventsTab("past")}
            >
              Past events
            </div>
          </section>

          {/** Tab menu underline */}
          <div className="w-full h-[2px] bg-[#eee]"></div>
        </header>
      )}

      {/** Main display of events */}
      <main
        className={`mt-6 w-full bg-white px-6 py-30 flex flex-col items-center justify-center shadow-[0_0_8px_0_rgba(0,0,0,.1)] cursor-pointer ${
          !isOwnProfile && pageProfile?.info.isPrivate && "!mt-0"
        }`}
      >
        {/** Page is private error if user not visiting own profile */}
        {!isOwnProfile && pageProfile?.info.isPrivate && <PrivatePageError />}

        {/** Upcoming events */}
        {activeEventsTab === "upcoming" &&
          !(!isOwnProfile && pageProfile?.info.isPrivate) && (
            <>
              {upcomingEvents.length > 0 ? (
                <div></div>
              ) : (
                <NoEventError
                  text={
                    isOwnProfile
                      ? "You do not have any upcoming event"
                      : "No upcoming event to display"
                  }
                />
              )}
            </>
          )}

        {/** Past events */}
        {activeEventsTab === "past" &&
          !(!isOwnProfile && pageProfile?.info.isPrivate) && (
            <>
              {pastEvents.length > 0 ? (
                <div></div>
              ) : (
                <NoEventError
                  text={
                    isOwnProfile
                      ? "You do not have any past event"
                      : "No past event to display"
                  }
                />
              )}
            </>
          )}
      </main>
    </div>
  );
}
