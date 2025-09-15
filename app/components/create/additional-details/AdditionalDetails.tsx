import { ChangeEvent, useRef, useState } from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import z from "zod";

import { nanoid } from "nanoid";

import { EventStatus, EventType } from "@/app/models/events";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import {
  updateAdditionalDetails,
  updateEventStatus,
} from "@/app/redux/slices/create/createEventSlice";

import flattenTreeErrors, {
  FlatErrors,
  ZodErrorTree,
} from "@/app/utils/helpers/auth/flattenTreeErrors";

import AdditionalDetailsFormSchema from "@/app/libs/definitions/create/additional-details";

import { createEvent } from "@/app/api/create/create-event";

import { toast } from "sonner";

import Button from "../Button";

import Input from "../../ui/global/Input";

import Delete from "../../ui/icons/Delete";
import Tadpole from "../../ui/spinners/TadPole";

interface AdditonalDetailsProps {
  type: EventType;
}

export default function AdditionalDetails({}: AdditonalDetailsProps) {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Create event step state from redux
  const createEventState = useAppSelector((state) => state.createEvent);

  //Input states
  const [contactDetails, setContactDetails] = useState<string>(
    createEventState.event.additionalDetails.contact
  );
  const [orderMessage, setOrderMessage] = useState<string>(
    createEventState.event.additionalDetails.orderMessage
  );
  const [socialMediaPhoto, setSocialMediaPhoto] = useState<string>(
    createEventState.event.additionalDetails.socialMediaPhoto || ""
  );
  const [eventCoverPhoto, setEventCoverPhoto] = useState<string>(
    createEventState.event.additionalDetails.eventCoverPhoto || ""
  );
  const [additionalPhotos, setAdditionalPhotos] = useState<
    { id: string; photo: string }[]
  >(
    createEventState.event.additionalDetails.additionalPhotos
      ? createEventState.event.additionalDetails.additionalPhotos.map(
          (photo) => {
            return {
              id: nanoid(),
              photo,
            };
          }
        )
      : []
  );

  //Error states
  const [pageErrors, setPageErrors] = useState<FlatErrors | null>(null);
  const contactDetailsInputError = pageErrors?.contactDetails?.at(0);
  const orderMessageInputError = pageErrors?.orderMessage?.at(0);

  //Input refs
  const socialMediaPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const eventCoverPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const additionalPhotosInputRef = useRef<HTMLInputElement | null>(null);

  //Laoding states
  const [isDraftingEvent, setIsDraftingEvent] = useState<boolean>(false);
  const [isCreatingLiveEvent, setIsCreatingLiveEvent] =
    useState<boolean>(false);

  //Function to upload an image file
  function handleBase64ImageUpload(
    maxSize: number, //in MB
    file: File,
    onSuccess: (binaryString: string) => void,
    onError: (error: string) => void
  ) {
    //Max size
    const MAX_SIZE = maxSize * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      onError(`File size exceeds ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      //This gives Base64 string
      const result = reader.result as string;
      onSuccess(result);
    };

    reader.onerror = () => {
      onError("Failed to read file");
    };

    //Convert file to Base64 string
    reader.readAsDataURL(file);
  }

  //Handle trigger social media photo file input
  function handleTriggerSocialMediaInput() {
    //Return early
    if (isCreatingLiveEvent || isDraftingEvent) return;

    //Trigger input
    socialMediaPhotoInputRef.current?.click();
  }

  //Handle social media photo input change
  const handleSocialMediaPhotoInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    //Uploaded file
    const file = e.target.files?.[0];

    //Return if none uploaded
    if (!file) return;

    //Allow only images files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      //Toast error
      toast.error("Only JPEG, PNG, or WEBP images allowed");

      return;
    }

    //Upload base 64 image
    handleBase64ImageUpload(
      2,
      file,
      (binary) => {
        //Set social media photo
        setSocialMediaPhoto(binary);

        //Reset file input
        e.target.value = "";
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  //Handle trigger cover photo file input
  function handleTriggerEventCoverPhotoInput() {
    //Return early
    if (isCreatingLiveEvent || isDraftingEvent) return;

    //Trigger input
    eventCoverPhotoInputRef.current?.click();
  }

  //Handle cover photo input change
  const handleEventCoverPhotoInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    //Uploaded file
    const file = e.target.files?.[0];

    //Return if none uploaded
    if (!file) return;

    //Allow only images files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      //Toast error
      toast.error("Only JPEG, PNG, or WEBP images allowed");

      return;
    }

    //Upload base 64 image
    handleBase64ImageUpload(
      4,
      file,
      (binary) => {
        //Set cover photo
        setEventCoverPhoto(binary);

        //Reset file input
        e.target.value = "";
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  //Handle trigger additional photos file input
  function handleTriggerAdditionalPhotosInput() {
    //Return early
    if (isCreatingLiveEvent || isDraftingEvent) return;

    //Trigger input
    additionalPhotosInputRef.current?.click();
  }

  //Handle additional photos input change
  const handleAdditionalPhotosInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    //Uploaded file
    const file = e.target.files?.[0];

    //Return if none uploaded
    if (!file) return;

    //Allow only images files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      //Toast error
      toast.error("Only JPEG, PNG, or WEBP images allowed");

      return;
    }

    //Upload base 64 image
    handleBase64ImageUpload(
      2,
      file,
      (binary) => {
        //Add image to additonal photos array
        setAdditionalPhotos((prev) => [
          ...prev,
          {
            id: nanoid(),
            photo: binary,
          },
        ]);

        //Reset file input
        e.target.value = "";
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  //Function to create a live or a drafted event
  async function handleCreateEvent(status: EventStatus) {
    //Check if page has errors
    let hasPageErrors = false;

    //Validate fields
    const validatedFields = AdditionalDetailsFormSchema.safeParse({
      contactDetails,
      orderMessage,
    });

    if (!validatedFields.success) {
      const treeErrors = z.treeifyError(validatedFields.error) as ZodErrorTree;
      const flatErrors = flattenTreeErrors(treeErrors);

      setPageErrors(flatErrors);
      hasPageErrors = true;
    } else {
      setPageErrors(null);
    }

    //Check for errors
    if (!hasPageErrors) {
      const payload = {
        ...createEventState.event,
        additionalDetails: {
          contact: contactDetails,
          orderMessage,
          socialMediaPhoto: socialMediaPhoto || undefined,
          eventCoverPhoto: eventCoverPhoto || undefined,
          additionalPhotos:
            additionalPhotos.length > 0
              ? additionalPhotos.map((photoObj) => photoObj.photo)
              : undefined,
        },
      };

      //Update Redux create event state
      dispatch(updateEventStatus(status));
      dispatch(updateAdditionalDetails(payload.additionalDetails));

      //Set loading states true
      if (status === "live") setIsCreatingLiveEvent(true);
      if (status === "drafted") setIsDraftingEvent(true);

      //Call API immediately with latest data
      const result = await createEvent(payload);

      //Check if request is successful
      if (result.success === true) {
        //Toast success
        toast.success(result.message);

        //Route to created event page
        router.replace(`/events/${result.event?.alias}`);
      } else if (result.success === false) {
        //Toast error
        toast.error(result.message);
      }

      //Set loading states false
      setIsCreatingLiveEvent(false);
      setIsDraftingEvent(false);
    }
  }

  return (
    <div className="space-y-6">
      <main className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5]">
        {/** First section */}
        <section className="p-6 space-y-4">
          {/** Header */}
          <header>
            <h2 className="text-black-2 text-[20px] font-bold">
              Add any additional details
            </h2>
          </header>

          {/** Contact details input */}
          <div>
            <Input
              name="contactDetails"
              label={
                <main>
                  <div className="w-max">
                    Contact details <span className="text-error-red-2">*</span>
                  </div>

                  <p className="text-gray text-[14px]">
                    Your contact information is kept private and shown only to
                    attendees who book a ticket.
                  </p>
                </main>
              }
              className="!mb-0"
              placeholder="Enter an email address or phone number"
              value={contactDetails}
              setValue={setContactDetails}
              error={contactDetailsInputError}
              disabled={isDraftingEvent || isCreatingLiveEvent}
            />
          </div>

          {/** Order message input */}
          <div>
            <Input
              name="orderMessage"
              label={
                <main>
                  <div className="w-max">
                    Additonal order message{" "}
                    <span className="text-error-red-2">*</span>
                  </div>

                  <p className="text-gray text-[14px]">
                    This message will appear on the ticket confirmation email
                    and on the ticket itself.
                  </p>
                </main>
              }
              className="!mb-0"
              inputClassName="!min-h-[140px] !max-h-[200px]"
              value={orderMessage}
              setValue={setOrderMessage}
              error={orderMessageInputError}
              disabled={isDraftingEvent || isCreatingLiveEvent}
              textarea
            />
          </div>
        </section>

        {/** Second section */}
        <section className="p-6 space-y-4 border-t-[1px] border-[#e2e5e7]">
          <div className="w-full space-y-6 md:space-y-0 md:flex md:flex-row md:gap-x-10">
            {/** Social media photo */}
            <section className="w-max space-y-2">
              <header>
                <div className="w-max text-[15px] text-black-2">
                  Social media photo
                </div>

                <p className="text-gray text-[14px]">
                  (min 100px × 100px, max 2MB)
                </p>
              </header>

              {/** Photo picker and display */}
              <main className="w-[215px] h-[215px] border-[1px] border-[#e2e5e7] border-dashed bg-[#fafafa] rounded-[6px] overflow-hidden cursor-pointer hover:border-gray">
                {/** Add photo */}
                {!socialMediaPhoto && (
                  <div
                    className="w-full h-full px-4 flex items-center justify-center cursor-pointer"
                    onClick={handleTriggerSocialMediaInput}
                  >
                    <button className="w-full py-2 px-4 border-[1px] border-[#e2e5e7] bg-white text-[15px] text-black-2 font-medium rounded-[6px] hover:bg-gray-50">
                      Add Photo
                    </button>
                  </div>
                )}

                {/** Display preview when UPLOADED */}
                {socialMediaPhoto && (
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                    {/** Upload preview */}
                    <Image
                      fill
                      src={socialMediaPhoto}
                      className="absolute top-0 left-0 w-full h-full object-cover object-center"
                      alt="social media photo"
                    />

                    {/** Updating tools */}
                    <div className="relative w-full h-full p-4 flex flex-col justify-between">
                      <div className="w-max ml-auto flex items-center gap-x-3">
                        {/** Delete */}
                        <div
                          className="bg-blur-black p-1.5 rounded-[6px] text-white"
                          onClick={() => setSocialMediaPhoto("")}
                        >
                          <Delete size="16" />
                        </div>
                      </div>

                      <button
                        className="w-full py-2 px-4 border-[1px] border-[#e2e5e7] bg-white text-[14px] text-black-2 font-medium rounded-[6px] hover:bg-gray-50"
                        onClick={handleTriggerSocialMediaInput}
                      >
                        Change photo
                      </button>
                    </div>
                  </div>
                )}

                {/** Social media photo upload input
                 * HIDDEN!!!
                 */}
                <input
                  name="socialMediaPhoto"
                  type="file"
                  ref={socialMediaPhotoInputRef}
                  accept=".png, .jpg, .jpeg, .webp"
                  onChange={handleSocialMediaPhotoInputChange}
                  className="hidden"
                />
              </main>
            </section>

            {/** Cover photo */}
            <section className="space-y-2 md:w-[calc(100%-255px)]">
              <header>
                <div className="w-max text-[15px] text-black-2">
                  Event page cover photo
                </div>

                <p className="text-gray text-[14px] md:truncate">
                  (min 1000px × 400px, max 4MB, avoid including any text on the
                  photo)
                </p>
              </header>

              {/** Photo picker and display */}
              <main className="w-full h-[215px] border-[1px] border-dashed bg-[#fafafa] rounded-[6px] overflow-hidden cursor-pointer hover:border-gray">
                {/** Add photo */}
                {!eventCoverPhoto && (
                  <div
                    className="w-full h-full px-4 flex items-center justify-center cursor-pointer"
                    onClick={handleTriggerEventCoverPhotoInput}
                  >
                    <button className="w-full py-2 px-4 border-[1px] border-[#e2e5e7] bg-white text-[15px] text-black-2 font-medium rounded-[6px] hover:bg-gray-50">
                      Add Photo
                    </button>
                  </div>
                )}

                {/** Display preview when UPLOADED */}
                {eventCoverPhoto && (
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                    {/** Upload preview */}
                    <Image
                      fill
                      src={eventCoverPhoto}
                      className="absolute top-0 left-0 w-full h-full object-cover object-center"
                      alt="cover photo"
                    />

                    {/** Updating tools */}
                    <div className="relative  w-full h-full p-4 flex flex-col justify-between">
                      <div className="w-max ml-auto flex items-center gap-x-3">
                        {/** Delete */}
                        <div
                          className="bg-blur-black p-1.5 rounded-[6px] text-white"
                          onClick={() => setEventCoverPhoto("")}
                        >
                          <Delete size="16" />
                        </div>
                      </div>

                      <button
                        className="w-full max-w-[182px] ml-auto py-2 px-4 border-[1px] border-[#e2e5e7] bg-white text-[14px] text-black-2 font-medium rounded-[6px] hover:bg-gray-50"
                        onClick={handleTriggerEventCoverPhotoInput}
                      >
                        Change photo
                      </button>
                    </div>
                  </div>
                )}

                {/** Cover photo upload input
                 * HIDDEN!!!
                 */}
                <input
                  name="eventCoverPhoto"
                  type="file"
                  ref={eventCoverPhotoInputRef}
                  accept=".png, .jpg, .jpeg, .webp"
                  onChange={handleEventCoverPhotoInputChange}
                  className="hidden"
                />
              </main>
            </section>
          </div>

          {/** Additional photos */}
          <section className="space-y-2">
            <header>
              <div className="w-max text-[15px] text-black-2">
                Additional photos
              </div>

              <p className="text-gray text-[14px]">
                Upload additional photos to help attendees imagine coming to
                your event like promotional photos, venue photos, etc. (Maximum
                of 3 photos and max 2MB each)
              </p>
            </header>

            <main className="w-full p-4 border-[1px] border-dashed bg-[#fafafa] rounded-[6px] overflow-hidden cursor-pointer grid grid-cols-1 gap-4 hover:border-gray md:grid-cols-2 lg:grid-cols-3">
              {/** Display preview of additional photos */}
              {additionalPhotos.map((preview) => {
                //Delete a photo
                function handleDeletePhoto(id: string) {
                  setAdditionalPhotos((prev) =>
                    prev.filter((preview) => preview.id !== id)
                  );
                }

                return (
                  <div
                    key={preview.id}
                    className="h-[250px] w-[250px] p-3 border-[#f5f5f5] shadow-[0_1px_8px_0_rgba(28,35,43,.15)] rounded-[6px] overflow-hidden"
                  >
                    {/** Inner white component */}
                    <div className="relative bg-white h-full w-full">
                      {/** Upload preview */}
                      <Image
                        fill
                        src={preview.photo}
                        className="absolute top-0 left-0 w-full h-full object-cover object-center"
                        alt="preview photo"
                      />

                      {/** Updating tools */}
                      <div className="relative w-full h-full p-3 flex flex-col justify-between">
                        <div
                          className="w-max ml-auto flex items-center gap-x-3"
                          onClick={() => handleDeletePhoto(preview.id)}
                        >
                          {/** Delete */}
                          <div className="bg-blur-black p-1.5 rounded-[6px] text-white">
                            <Delete size="16" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/** Add photo
               * Maximum of 3 photos to be added
               */}
              {additionalPhotos.length < 3 && (
                <div
                  className="w-full h-[250px] p-3 border-[#f5f5f5] bg-white shadow-[0_1px_8px_0_rgba(28,35,43,.15)] rounded-[6px] md:w-[250px]"
                  onClick={handleTriggerAdditionalPhotosInput}
                >
                  <div className="w-full h-full bg-[#fafafa] flex items-center justify-center rounded-[6px]">
                    <button className="w-max py-2 px-4 border-[1px] border-[#e2e5e7] bg-white text-[15px] text-black-2 font-medium rounded-[6px] hover:bg-gray-50">
                      Add Photo
                    </button>
                  </div>
                </div>
              )}

              {/** Additional photos upload input
               * HIDDEN!!!
               */}
              <input
                name="additionalPhotos"
                type="file"
                ref={additionalPhotosInputRef}
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleAdditionalPhotosInputChange}
                className="hidden"
              />
            </main>
          </section>
        </section>
      </main>

      {/** Buttons */}
      <section className="z-3 bg-white sticky flex items-center gap-x-3 bottom-2 mt-8 md:relative md:w-max md:ml-auto">
        {/** Save as draft */}
        <button
          className="w-[130px] h-[39px] shrink-0 py-2 px-4 flex items-center justify-center bg-[rgba(0,128,128,0.2)] border-[1px] border-teal text-teal text-[15px] font-medium rounded-[6px] hover:bg-teal hover:text-white"
          onClick={() => handleCreateEvent("drafted")}
          disabled={isDraftingEvent}
        >
          {isDraftingEvent ? <Tadpole size="18" /> : "Save as Draft"}
        </button>

        {/** Create live event */}
        <Button
          text="Create live event"
          className="!w-full h-[39px] md:!w-[169px]"
          onClick={() => handleCreateEvent("live")}
          isLoading={isCreatingLiveEvent}
          disabled={isCreatingLiveEvent}
        />
      </section>
    </div>
  );
}
