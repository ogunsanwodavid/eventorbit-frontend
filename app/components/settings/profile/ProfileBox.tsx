"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "@/app/contexts/AuthContext";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { updateProfileInfo } from "@/app/api/settings/profile/update-profile-info";

import { UserType } from "@/app/models/auth";

import { toast } from "sonner";

import Input from "../../ui/global/Input";

import Button from "../Button";

import ProfileVisibilitySelect from "./ProfileVisibilitySelect";

export default function ProfileBox() {
  //Auth variables
  const { profile, refreshAuth } = useAuth();

  //Input values and errors
  const [userType, setUserType] = useState<UserType>(
    profile?.info.userType || "individual"
  );
  const [firstName, setFirstName] = useState<string>(
    profile?.info.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(
    profile?.info.lastName || ""
  );
  const [organizationName, setOrganizationName] = useState<string>(
    profile?.info.organizationName || ""
  );
  const [description, setDescription] = useState<string>(
    profile?.info.description || ""
  );
  const [profileSlug, setProfileSlug] = useState<string>(
    profile?.info.profileSlug || ""
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(
    profile?.info.isPrivate || false
  );
  const [isABusinessSeller, setIsABusinessSeller] = useState<boolean>(
    profile?.info.isABusinessSeller || false
  );
  const [businessAddress, setBusinessAddress] = useState<string>(
    profile?.info.businessAddress || ""
  );
  const [businessEmail, setBusinessEmail] = useState<string>(
    profile?.info.businessEmail || ""
  );
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>(
    profile?.info.businessPhoneNumber || ""
  );

  const [errors, setErrors] = useState<FlatErrors>({});

  const firstNameInputError = errors?.firstName?.at(0);
  const lastNameInputError = errors?.lastName?.at(0);
  const organizationNameInputError = errors?.organizationName?.at(0);
  const profileSlugInputError = errors?.profileSlug?.at(0);
  const businessAddressInputError = errors?.businessAddress?.at(0);
  const businessEmailInputError = errors?.businessEmail?.at(0);
  const businessPhoneNumberInputError = errors?.businessPhoneNumber?.at(0);

  //Useful variables
  const isOrganization: boolean = userType === "organization";

  //Loading states
  const [isUpdatingProfileInfo, setIsUpdatingProfileInfo] =
    useState<boolean>(false);

  //Function to toggle user type
  function handleToggleUserType() {
    //Return if currently updating
    if (isUpdatingProfileInfo) return;

    if (userType === "individual") {
      setUserType("organization");
    } else {
      setUserType("individual");
    }
  }

  //Function to toggle business seller status
  function handleToggleBusinessSeller() {
    //Return if currently updating
    if (isUpdatingProfileInfo) return;

    setIsABusinessSeller((prevState) => !prevState);
  }

  //Function to determine disabled state of submit button
  function handleSubmitButtonDisability(): boolean {
    let isDisabled: boolean = false;

    if (isUpdatingProfileInfo) {
      isDisabled = true;
    }

    if (isOrganization) {
      isDisabled = !organizationName;
    }

    if (!isOrganization) {
      isDisabled = !firstName || !lastName;
    }

    if (!profileSlug) {
      isDisabled = true;
    }

    if (isABusinessSeller) {
      isDisabled = !businessAddress || !businessEmail || !businessPhoneNumber;
    }

    return isDisabled;
  }

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingProfileInfo(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("userType", userType);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("organizationName", organizationName);
    formData.append("description", description);
    formData.append("profileSlug", profileSlug);
    formData.append("isPrivate", String(isPrivate));
    formData.append("isABusinessSeller", String(isABusinessSeller));
    formData.append("businessAddress", businessAddress);
    formData.append("businessEmail", businessEmail);
    formData.append("businessPhoneNumber", businessPhoneNumber);

    //Call the update profile info function
    const result = await updateProfileInfo(formData);

    //Set validation errors if any
    setErrors(result?.validationErrors || {});

    //Check if request is successful
    if (result.success === true) {
      //Refresh auth
      //::Hence profile information
      await refreshAuth({ setLoading: false });

      //Toast success
      toast.success(result.message);
    } else if (result.success === false) {
      //Toast error
      toast.error(result.message);
    }

    //Set loading state false
    setIsUpdatingProfileInfo(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">Profile</h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Organization account toggler */}
        <section
          className="w-max flex items-center gap-x-2 text-[15px] cursor-pointer mb-[15px]"
          onClick={handleToggleUserType}
        >
          {/** Toggler */}
          <div
            className={`w-[33px] h-[20px] p-0.25 bg-[#a9b0b7] rounded-full transition-all duration-250 ${
              isOrganization && "!bg-teal"
            }`}
          >
            <div
              className={`h-[18px] w-[18px] bg-white rounded-full ml-0 transition-all duration-250 ${
                isOrganization && "!ml-auto"
              }`}
            ></div>
          </div>

          <p>Organization account</p>
        </section>

        {/** First name & Last name inputs */}
        {!isOrganization && (
          <section className="flex items-center gap-x-4">
            <Input
              name="firstName"
              label={
                <div>
                  First name <span className="text-error-red-2">*</span>
                </div>
              }
              value={firstName}
              setValue={setFirstName}
              error={firstNameInputError}
              disabled={isUpdatingProfileInfo}
            />

            <Input
              name="lastName"
              label={
                <div>
                  Last name <span className="text-error-red-2">*</span>
                </div>
              }
              value={lastName}
              setValue={setLastName}
              error={lastNameInputError}
              disabled={isUpdatingProfileInfo}
            />
          </section>
        )}

        {/** Organization name input */}
        {isOrganization && (
          <Input
            name="organizationName"
            label={
              <div>
                Business or Organization name{" "}
                <span className="text-error-red-2">*</span>
              </div>
            }
            value={organizationName}
            setValue={setOrganizationName}
            error={organizationNameInputError}
            disabled={isUpdatingProfileInfo}
          />
        )}

        {/** Description input */}
        <Input
          textarea
          name="description"
          label="Description"
          value={description}
          setValue={setDescription}
          disabled={isUpdatingProfileInfo}
        />

        {/** Profile URL input */}
        <div className="w-full text-[15px] text-black-2 mb-[15px]">
          {/** Label*/}
          <label
            htmlFor="profileSlug"
            className={`block mb-2 ${
              profileSlugInputError && "text-error-red"
            }`}
          >
            Profile URL <span className="text-error-red">*</span>
          </label>

          {/** Main */}
          <main className="h-[42px] w-full bg-white flex">
            {/** Base url */}
            <div className="w-max p-2 bg-[#fafafa] border-[1px] border-[#E2E5E7] border-r-0 rounded-l-[6px] cursor-pointer">
              eventorbit.vercel.app/
            </div>

            {/** Input */}
            <input
              type="text"
              name="profileSlug"
              value={profileSlug}
              onChange={(e) => setProfileSlug(e.target.value)}
              className={`w-full h-full p-2 border-[1px] border-[#E2E5E7] rounded-r-[6px] focus:border-teal ${
                profileSlugInputError && "border-error-red"
              }`}
              disabled={isUpdatingProfileInfo}
            />
          </main>

          {profileSlugInputError && (
            <span className="text-error-red-2 text-[14px] mt-[5px]">
              {profileSlugInputError}
            </span>
          )}
        </div>

        {/** Profile visibility select */}
        <div className="w-full text-[15px] text-black-2 mb-[15px]">
          {/** Label */}
          <label htmlFor="isPrivate" className="block mb-2">
            Profile Visibility
          </label>

          {/** Select */}
          <ProfileVisibilitySelect
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            disabled={isUpdatingProfileInfo}
          />
        </div>

        {/** Business Seller toggler */}
        <section
          className="w-max flex items-center gap-x-2 text-[15px] cursor-pointer mb-[15px]"
          onClick={handleToggleBusinessSeller}
        >
          {/** Toggler */}
          <div
            className={`w-[33px] h-[20px] p-0.25 bg-[#a9b0b7] rounded-full transition-all duration-250 ${
              isABusinessSeller && "!bg-teal"
            }`}
          >
            <div
              className={`h-[18px] w-[18px] bg-white rounded-full ml-0 transition-all duration-250 ${
                isABusinessSeller && "!ml-auto"
              }`}
            ></div>
          </div>

          <p>I am a registered Business Seller</p>
        </section>

        {/** Business Seller details */}
        {isABusinessSeller && (
          <section>
            {/** Header */}
            <header className="">
              <h6 className="text-[15px] text-black-2">
                Business Seller details
              </h6>
              <p className="text-[13px] text-[#677077]">
                As a Business Seller, you must provide buyers with your contact
                information. This information will appear publicly in the order
                confirmation email sent to buyers. You can update it anytime in
                the profile section of your Settings.
              </p>
            </header>

            {/** Inputs */}
            <main className="mt-[15px]">
              {/** Business Address */}
              <Input
                name="businessAddress"
                label={
                  <div>
                    Business address <span className="text-error-red-2">*</span>
                  </div>
                }
                value={businessAddress}
                setValue={setBusinessAddress}
                error={businessAddressInputError}
                disabled={isUpdatingProfileInfo}
              />

              {/** Business Email */}
              <Input
                name="businessEmail"
                label={
                  <div>
                    Business email <span className="text-error-red-2">*</span>
                  </div>
                }
                value={businessEmail}
                setValue={setBusinessEmail}
                error={businessEmailInputError}
                disabled={isUpdatingProfileInfo}
              />

              {/** Business Phone number */}
              <Input
                name="businessPhoneNUmber"
                label={
                  <div>
                    Business phone number{" "}
                    <span className="text-error-red-2">*</span>
                  </div>
                }
                value={businessPhoneNumber}
                setValue={setBusinessPhoneNumber}
                error={businessPhoneNumberInputError}
                disabled={isUpdatingProfileInfo}
              />
            </main>
          </section>
        )}

        {/** Submit button */}
        <div className="mt-[9px] w-[116px] ml-auto">
          <Button
            isLoading={isUpdatingProfileInfo}
            text="save profile"
            disabled={handleSubmitButtonDisability()}
          />
        </div>
      </form>
    </section>
  );
}
