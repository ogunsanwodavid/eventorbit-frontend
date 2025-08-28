"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "@/app/contexts/AuthContext";

import { FlatErrors } from "@/app/utils/helpers/auth/flattenTreeErrors";

import { updateProfileSocialUrls } from "@/app/api/settings/profile/update-profile-social-urls";

import { toast } from "sonner";

import Input from "../../ui/global/Input";

import Button from "../Button";

export default function SocialChannelsBox() {
  //Auth variables
  const { profile, refreshAuth } = useAuth();

  //Input values and errors
  const [website, setWebsite] = useState<string>(
    profile?.socialUrls?.website || ""
  );
  const [facebook, setFacebook] = useState<string>(
    profile?.socialUrls?.facebook || ""
  );
  const [x, setX] = useState<string>(profile?.socialUrls?.x || "");
  const [instagram, setInstagram] = useState<string>(
    profile?.socialUrls?.instagram || ""
  );

  const [errors, setErrors] = useState<FlatErrors>({});

  const websiteInputError = errors?.website?.at(0);
  const facebookInputError = errors?.facebook?.at(0);
  const xInputError = errors?.x?.at(0);
  const instagramInputError = errors?.instagram?.at(0);

  //Loading states
  const [isUpdatingProfileSocialUrls, setIsUpdatingProfileSocialUrls] =
    useState<boolean>(false);

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    //Set loading state true
    setIsUpdatingProfileSocialUrls(true);

    //Prevent default
    e.preventDefault();

    //Collect form data
    const formData = new FormData();
    formData.append("website", website);
    formData.append("facebook", facebook);
    formData.append("x", x);
    formData.append("instagram", instagram);

    //Call the update profile social urls function
    const result = await updateProfileSocialUrls(formData);

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
    setIsUpdatingProfileSocialUrls(false);
  };

  return (
    <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] py-6 px-4 flex flex-col lg:px-6">
      {/** Heading */}
      <h3 className="text-black text-[19px] font-semibold">
        Display your social channels
      </h3>

      {/** Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/** Website input */}
        <Input
          name="website"
          label="Website"
          placeholder="Website URL"
          value={website}
          setValue={setWebsite}
          error={websiteInputError}
          disabled={isUpdatingProfileSocialUrls}
        />

        {/** Facebook input */}
        <Input
          name="facebook"
          label="Facebook"
          placeholder="Facebook URL"
          value={facebook}
          setValue={setFacebook}
          error={facebookInputError}
          disabled={isUpdatingProfileSocialUrls}
        />

        {/** X input */}
        <Input
          name="x"
          label="X"
          placeholder="X URL"
          value={x}
          setValue={setX}
          error={xInputError}
          disabled={isUpdatingProfileSocialUrls}
        />

        {/** Instagram input */}
        <Input
          name="instagram"
          label="Instagram"
          placeholder="Instagram URL"
          value={instagram}
          setValue={setInstagram}
          error={instagramInputError}
          disabled={isUpdatingProfileSocialUrls}
        />

        {/** Submit button */}
        <div className="mt-[9px] w-[181px] ml-auto">
          <Button
            isLoading={isUpdatingProfileSocialUrls}
            text="save social channels"
            disabled={isUpdatingProfileSocialUrls}
          />
        </div>
      </form>
    </section>
  );
}
