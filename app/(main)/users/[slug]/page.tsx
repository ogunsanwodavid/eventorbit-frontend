import type { Metadata } from "next";

import { getProfileBySlug } from "@/app/api/users/get-profile-by-slug";

import UserProfilePage from "@/app/components/users/UseProfilePage";

type Props = {
  params: { slug: string };
};

// Dynamic metadata per user profile
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  //Fetch profile
  const profile = await getProfileBySlug(params.slug);

  //Display name
  const displayName =
    profile?.info.organizationName || profile?.info.firstName || "User";

  //Cover image
  const coverImage = profile?.images?.coverPhoto || "/public/logo-teal.png";

  return {
    title: `${displayName}'s profile on EventOrbit`,
    description: `See ${displayName}'s profile on EventOrbit`,
    openGraph: {
      title: `User Profile: ${displayName}`,
      description: `Explore events and profile details of ${displayName}`,
      url: `https://eventorbit.com/users/${params.slug}`, // ✅ correct page URL
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
}

export default function Page({ params }: Props) {
  return <UserProfilePage slug={params.slug} />;
}
