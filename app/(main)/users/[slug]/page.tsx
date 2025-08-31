import { getProfileBySlug } from "@/app/api/users/get-profile-by-slug";

import UserProfilePage from "@/app/components/users/UseProfilePage";

type paramsType = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: paramsType }) {
  const { slug } = await params;

  try {
    //Fetch profile
    const profile = await getProfileBySlug(slug);

    //User display name
    const displayName =
      profile?.info?.organizationName || profile?.info?.firstName || "User";

    //User cover photo
    const coverImage = profile?.images?.coverPhoto
      ? profile?.images.coverPhoto
      : "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1748962908/music-cover_mpc6mw.jpg";

    return {
      title: `${displayName}'s profile on EventOrbit`,
      description: `See ${displayName}'s profile on EventOrbit`,
      openGraph: {
        title: `User Profile: ${displayName}`,
        description: `Explore events and profile details of ${displayName}`,
        url: `https://eventorbit.vercel.app/users/${slug}`,
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 400,
            alt: `${displayName}'s cover photo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${displayName}'s profile on EventOrbit`,
        description: `See ${displayName}'s profile on EventOrbit`,
        images: [coverImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for slug:", slug, error);
    return {
      title: "User's profile on EventOrbit",
      description: "See this user's profile on EventOrbit",
      openGraph: {
        title: "User Profile",
        description: "Explore events and profile details",
        url: `https://eventorbit.vercel.app/users/${slug}`,
        images: [
          {
            url: "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1748962908/music-cover_mpc6mw.jpg",
            width: 1200,
            height: 400,
            alt: "Default cover photo",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "User's profile on EventOrbit",
        description: "See this user's profile on EventOrbit",
        images: [
          "https://res.cloudinary.com/ddcjuf3hq/image/upload/v1748962908/music-cover_mpc6mw.jpg",
        ],
      },
    };
  }
}

export default function Page() {
  return <UserProfilePage />;
}
