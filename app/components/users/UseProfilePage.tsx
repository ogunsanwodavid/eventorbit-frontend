"use client";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";

import { Profile } from "@/app/models/auth";

import { useNavFooterVisibility } from "@/app/contexts/NavFooterVisibilityContext";

import { getProfileBySlug } from "@/app/api/users/get-profile-by-slug";
import { uploadCoverPhoto } from "@/app/api/users/upload-cover-photo";
import { uploadProfilePicture } from "@/app/api/users/upload-profile-picture";

import { toast } from "sonner";

import EventsByUser from "@/app/components/users/EventsByUser";

import BlocksShuffle3 from "@/app/components/ui/spinners/BlocksShuffle3";
import Tadpole from "@/app/components/ui/spinners/TadPole";

import EditSolid from "@/app/components/ui/icons/EditSolid";
import Camera from "@/app/components/ui/icons/Camera";
import Location from "@/app/components/ui/icons/Location";

import profileNotFoundImg from "@/static/users/profile-not-found.svg";

export default function UserProfilePage() {
  //Router function
  const router = useRouter();

  //Auth context variables
  const { profile, isAuthenticated } = useAuth();

  //Nav footer visibility variables
  const { setShowFooter } = useNavFooterVisibility();

  //Params
  const { slug } = useParams<{ slug: string }>();

  //Page profile
  const [pageProfile, setPageProfile] = useState<Profile | null>(null);

  //Check if authenticated user is visiting own profile
  const isOwnProfile =
    isAuthenticated && profile?.userId === pageProfile?.userId;

  //Input refs
  const coverPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const profilePictureInputRef = useRef<HTMLInputElement | null>(null);

  //Loading states
  const [isGettingPageProfile, setIsGettingPageProfile] =
    useState<boolean>(false);
  const [isUploadingCoverPhoto, setIsUploadingCoverPhoto] =
    useState<boolean>(false);
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
    useState<boolean>(false);
  const isUploading = isUploadingCoverPhoto || isUploadingProfilePicture;

  //Function to get page profile
  const getPageProfile = async () => {
    const response = await getProfileBySlug(slug);

    setPageProfile(response || null);

    return response;
  };

  //Fetch page profile
  const fetchProfile = async () => {
    setShowFooter(false); // hide footer while fetching
    setIsGettingPageProfile(true);

    try {
      const res = await getPageProfile();

      if (res) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    } catch {
      setShowFooter(false); // hide footer on error
    } finally {
      setIsGettingPageProfile(false);
    }
  };

  //Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  //Toast info about the page being private if user viewing own profile
  useEffect(() => {
    if (isOwnProfile && pageProfile?.info.isPrivate) {
      toast.dismiss();

      toast.info(
        "Your profile is set to private. Only you can see the information on this page",
        {
          duration: Infinity,
          position: "top-right",
          dismissible: true,
        }
      );
    }

    //Dismiss all toasts on unmount
    return () => {
      toast.dismiss();
    };
  }, [isOwnProfile, pageProfile]);

  //Handle edit profile
  function handleEditProfile(e: MouseEvent<HTMLDivElement>) {
    //Stop event propagation from parent
    e.stopPropagation();

    //Return early
    if (isUploading) return;

    //Route to edit profile page
    router.push("/settings/profile");
  }

  //Handle trigger cover photo photo input
  function handleTriggerCoverPhotoInput() {
    //Return early
    if (isUploading) return;

    //Trigger input
    coverPhotoInputRef.current?.click();
  }

  //Handle trigger profile picture input
  function handleTriggerProfilePictureInput() {
    //Return early
    if (isUploading) return;

    //Trigger input
    profilePictureInputRef.current?.click();
  }

  //Handle cover photo input change
  async function handleCoverPhotoInputChange(e: ChangeEvent<HTMLInputElement>) {
    //Uploaded file
    const file = e.target.files?.[0];

    //Return if none uploaded
    if (!file) return;

    //Allow only images files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images allowed");
      return;
    }

    //Max size of 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB");
      return;
    }

    //Set loading state true
    setIsUploadingCoverPhoto(true);

    //Call upload server function
    const result = await uploadCoverPhoto(file);

    //Check if request is successful
    if (result.success === true) {
      //Refetch page profile
      await getPageProfile();

      //Toast success
      toast.success(result.message);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUploadingCoverPhoto(false);
  }

  //Handle profile picture input change
  async function handleProfilePicInputChange(e: ChangeEvent<HTMLInputElement>) {
    //Uploaded file
    const file = e.target.files?.[0];

    //Return if none uploaded
    if (!file) return;

    //Allow only images files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images allowed");
      return;
    }

    //Max size of 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB");
      return;
    }

    //Set loading state true
    setIsUploadingProfilePicture(true);

    //Call upload server function
    const result = await uploadProfilePicture(file);

    //Check if request is successful
    if (result.success === true) {
      //Refetch page profile
      await getPageProfile();

      //Toast success
      toast.success(result.message);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUploadingProfilePicture(false);
  }

  //Return Block shuffle spinner while fetching page
  if (isGettingPageProfile)
    return (
      <div className="flex-1 flex items-center justify-center text-teal">
        <span className="inline-block mt-0">
          <BlocksShuffle3 size="45" />
        </span>
      </div>
    );

  //Error UI when profile not fetched
  if (!isGettingPageProfile && !pageProfile)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        {/** SVG */}
        <Image
          src={profileNotFoundImg}
          className="w-full max-w-[200px]"
          alt="profile not found"
        />

        <p className="text-base text-gray font-medium">Profile not found</p>

        {/** Button to refetch page profile */}
        <button
          className="mt-2 py-2 px-4 border-[1px] border-teal text-[14px] text-teal font-semibold rounded-[6px] duration-250 transition-all hover:bg-teal hover:text-white cursor-pointer"
          onClick={fetchProfile}
        >
          Try again
        </button>
      </div>
    );

  return (
    <div className="w-full bg-[#fafafa] pb-24">
      <main className="inner-screen-max">
        {/** Header */}
        <header className="relative w-full h-[230px] bg-emerald-600 cursor-pointer md:h-[350px] md:rounded-b-[12px] md:!overflow-hidden">
          {/** Cover photo
           * show if profile isn't private when not visiting own profile
           */}
          {pageProfile?.images?.coverPhoto &&
            (isOwnProfile || !pageProfile.info.isPrivate) && (
              <Image
                fill
                className="absolute top-0 left-0 w-full h-full z-1 object-cover object-center"
                src={pageProfile.images.coverPhoto || ""}
                alt={`${
                  pageProfile.info.firstName ||
                  pageProfile.info.organizationName
                }'s cover photo`}
              />
            )}

          {/** Blur black overlay
           * allow only when user on own profile
           */}
          {isOwnProfile && (
            <section
              className={`relative w-full h-full bg-[rgba(25,26,25,0.7)] z-2 p-5 flex flex-col justify-between duration-250 transition-all group lg:p-8 lg:bg-transparent lg:hover:bg-[rgba(25,26,25,0.7)] lg:justify-start ${
                isUploadingCoverPhoto && "lg:!bg-[rgba(25,26,25,0.7)]"
              }`}
              onClick={handleTriggerCoverPhotoInput}
            >
              {/** Edit profile */}
              <div
                className="bg-black-2 rounded-[6px] p-[10px] flex items-center justify-center gap-x-3 text-[#fafafa] text-[15px] font-medium md:w-max md:p-3"
                onClick={handleEditProfile}
              >
                {/** Edit icon */}
                <EditSolid size="15" />

                <span>Edit Profile</span>
              </div>

              {/** Change cover photo */}
              <div
                className={`w-full h-full text-white flex flex-col items-center justify-center text-center duration-250 transition-all lg:flex-1 lg:hidden lg:items-center lg:justify-center lg:group-hover:flex ${
                  isUploadingCoverPhoto && "lg:!flex"
                }`}
              >
                {isUploadingCoverPhoto ? (
                  <span>
                    <Tadpole size="30" />
                  </span>
                ) : (
                  <>
                    {/** Camera icon */}
                    <Camera size="16" />
                    <p className="text-[15px]">Change cover photo</p>
                    <p className="text-[14px] -mt-1">
                      Utilize this area to showcase your events! (max 2MB)
                    </p>
                  </>
                )}
              </div>

              {/** Cover photo upload input */}
              <input
                name="coverPhoto"
                type="file"
                ref={coverPhotoInputRef}
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleCoverPhotoInputChange}
                className="hidden"
              />
            </section>
          )}
        </header>

        {/** Main section */}
        <section className="flex flex-col gap-6 md:flex-row md:mt-8 md:px-5 xl:px-0">
          {/** User info */}
          <div className="w-full shrink-0 h-max bg-white p-6 flex flex-col items-center justify-center shadow-[0_0_8px_0_rgba(0,0,0,.1)] cursor-pointer md:w-[245px] lg:w-[300px]">
            {/** Avatar */}
            <div className="relative w-20 h-20 rounded-full bg-emerald-500 overflow-hidden">
              {/** Image or substitute avata
               * show if profile isn't private when not visiting own profile
               */}
              {pageProfile?.images?.profilePicture &&
              (isOwnProfile || !pageProfile.info.isPrivate) ? (
                <Image
                  fill
                  className="absolute top-0 left-0 w-full h-full z-1 object-cover object-center"
                  src={pageProfile.images.profilePicture}
                  alt={`${
                    pageProfile.info.organizationName ||
                    pageProfile.info.firstName
                  }'s avatar`}
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full rounded-fulll flex items-center justify-center bg-transparent text-4xl text-white font-semibold">
                  <span>
                    {pageProfile?.info.organizationName?.charAt(0) ||
                      pageProfile?.info.firstName?.charAt(0)}
                  </span>
                </div>
              )}

              {/** Blur black overlay
               * allow only when user on own profile
               */}
              {isOwnProfile && (
                <section
                  className={`relative w-full h-full bg-[rgba(25,26,25,0.7)] z-2 p-2 flex flex-col justify-between duration-250 transition-all group lg:bg-transparent lg:hover:bg-[rgba(25,26,25,0.7)] lg:justify-start ${
                    isUploadingProfilePicture && "lg:!bg-[rgba(25,26,25,0.7)]"
                  }`}
                  onClick={handleTriggerProfilePictureInput}
                >
                  {/** Change avatar */}
                  <div
                    className={`h-full w-full text-white flex flex-col items-center justify-center text-center duration-250 transition-all lg:flex-1 lg:hidden lg:items-center lg:justify-center lg:group-hover:flex ${
                      isUploadingProfilePicture && "lg:!flex"
                    }`}
                  >
                    {isUploadingProfilePicture ? (
                      <span>
                        <Tadpole size="25" />
                      </span>
                    ) : (
                      <>
                        {/** Camera icon */}
                        <Camera size="16" />
                        <p className="text-[14px]">Change avatar</p>
                      </>
                    )}
                  </div>

                  {/** Profile picture upload input */}
                  <input
                    name="profilePicture"
                    type="file"
                    ref={profilePictureInputRef}
                    accept=".png, .jpg, .jpeg, .webp"
                    onChange={handleProfilePicInputChange}
                    className="hidden"
                  />
                </section>
              )}
            </div>

            {/** Name */}
            <p className="text-black-2 text-2xl font-medium mt-4">
              {pageProfile?.info.userType === "individual"
                ? `${pageProfile.info.firstName} ${pageProfile.info.lastName}`
                : `${pageProfile?.info.organizationName}`}
            </p>

            {/** Location */}
            {pageProfile?.info.location && (
              <div className="w-max mt-2 flex items-center gap-x-1.5">
                {/** Location icon */}
                <span className="text-gray">
                  <Location size="20" />
                </span>

                <p className="text-black-2 text-base">
                  {pageProfile?.info.location}
                </p>
              </div>
            )}
          </div>

          {/** Events By Users*/}
          <EventsByUser pageProfile={pageProfile} isOwnProfile={isOwnProfile} />
        </section>
      </main>
    </div>
  );
}
