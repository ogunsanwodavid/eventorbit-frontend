import { getEventByAlias } from "@/app/api/events/get-event-by-alias";

import EventPage from "@/app/components/events/EventPage";

type paramsType = Promise<{ alias: string }>;

export async function generateMetadata({ params }: { params: paramsType }) {
  //Params
  const { alias } = await params;

  try {
    //Fetch event
    const { event, host } = await getEventByAlias(alias);

    //User cover photo
    const coverImage = event.additionalDetails.socialMediaPhoto;

    if (event.status === "drafted") {
      throw new Error("Event is drafted and not live");
    }

    return {
      title: `${event.basics.name} by ${
        host.info.userType === "individual"
          ? `${host.info.firstName} ${host.info.lastName}`
          : `${host.info.organizationName}`
      } is live`,
      description: `You can now purchase your tickets on EventOrbit today. ${event.basics.description}`,
      openGraph: {
        title: `${event.basics.name} is live`,
        description: `You can now purchase your tickets on EventOrbit today. ${event.basics.description}`,
        url: `https://eventorbit.vercel.app/events/${alias}`,
        images: [
          {
            url: coverImage,
            width: 400,
            height: 400,
            alt: `${event.basics.name}'s cover photo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.basics.name} is live`,
        description: `You can now purchase your tickets on EventOrbit today. ${event.basics.description}`,
        images: [coverImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for alias:", alias, error);
    return {
      title: "EventOrbit: Evergreen event management solutions",
      description:
        "Host your event on EventOrbit and let millions purchase your tickets",
      openGraph: {
        title: "EventOrbit: Evergreen event management solutions",
        description:
          "Host your event on EventOrbit and let millions purchase your tickets",
        url: `https://eventorbit.vercel.app/events/${alias}`,
        images: [
          {
            url: "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1748962908/music-cover_mpc6mw.jpg",
            width: 400,
            height: 400,
            alt: "Default cover photo",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "EventOrbit: Evergreen event management solutions",
        description:
          "Host your event on EventOrbit and let millions purchase your tickets",
        images: [
          "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1748962908/music-cover_mpc6mw.jpg",
        ],
      },
    };
  }
}

export default function EventDisplayPage() {
  return <EventPage />;
}
