"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/app/contexts/AuthContext";

import ProfileBox from "@/app/components/settings/profile/ProfileBox";
import SocialChannelsBox from "@/app/components/settings/profile/SocialChannelsBox";

import BlocksShuffle3 from "@/app/components/ui/spinners/BlocksShuffle3";

export default function ProfileSettings() {
  //Auth context variables
  const { refreshAuth } = useAuth();

  //Loading states
  const [loading, setLoading] = useState<boolean>(false);

  //Refresh auth on mount
  useEffect(() => {
    const refresh = async () => {
      setLoading(true);

      try {
        await refreshAuth({ setLoading: false });
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

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
      {/** Profile Box */}
      <ProfileBox />

      {/** Social Channels Box */}
      <SocialChannelsBox />
    </div>
  );
}
