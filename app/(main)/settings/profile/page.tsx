import ProfileBox from "@/app/components/settings/profile/ProfileBox";
import SocialChannelsBox from "@/app/components/settings/profile/SocialChannelsBox";

export default function ProfileSettings() {
  return (
    <div className="flex flex-col gap-y-6">
      {/** Profile Box */}
      <ProfileBox />

      {/** Social Channels Box */}
      <SocialChannelsBox />
    </div>
  );
}
