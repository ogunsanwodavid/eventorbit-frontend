"use client";

import { useState } from "react";

import { EventVisibility } from "@/app/models/events";

import Input from "../ui/global/Input";

import CategorySelect from "./CategorySelect";

interface BasicsProps {
  type: string;
}

export default function Basics({ type }: BasicsProps) {
  //Input states and errors
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibility] = useState<EventVisibility>("public");

  return (
    <div className="space-y-6">
      {/** Tell the world about your event box */}
      <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-6">
        {/** Header */}
        <h2 className="text-black-2 text-[20px] font-bold">
          Tell the world about your event
        </h2>

        {/** Form */}
        <form className="mt-4 space-y-2">
          {/** Name input */}
          <Input
            name="eventName"
            label={
              <main className="w-full flex items-center justify-between font-medium">
                <div className="w-max">
                  What is your event name?{" "}
                  <span className="text-error-red-2">*</span>
                </div>

                {/** Character count */}
                <div className="w-max !text-gray">{name.length}/75</div>
              </main>
            }
            placeholder="Make it short and catchy"
            value={name}
            setValue={setName}
            maxLength={75}
          />

          {/** Category select */}
          <div className="w-full mb-[15px]">
            <header className="mb-2">
              <h6 className=" text-[15px] text-black-2 font-medium">
                Select a category for your event{" "}
                <span className="text-error-red-2">*</span>
              </h6>
              <p className="text-gray text-[14px]">
                This will help others find your event
              </p>
            </header>

            <CategorySelect category={category} setCategory={setCategory} />
          </div>

          {/** Visibility picker */}
          <div className="w-full mb-[15px]">
            <header className="mb-2">
              <h6 className=" text-[15px] text-black-2 font-medium">
                Select who can see your event
              </h6>
              <p className="text-gray text-[14px]">
                {visibility === "public"
                  ? "Anyone can see and search for public events"
                  : "Only people with your event URL can see this event"}
              </p>
            </header>

            {/** Picker */}
            <main className="w-full flex text-[15px] cursor-pointer">
              {/** Public */}
              <div
                className={`w-full px-4 py-2 border-[1px] border-[#e2e5e7] text-center rounded-l-[6px] ${
                  visibility === "public" ? "border-teal" : "border-r-0"
                }`}
                onClick={() => setVisibility("public")}
              >
                Public
              </div>

              {/** Unlisted */}
              <div
                className={`w-full px-4 py-2 border-[1px] border-[#e2e5e7] text-center rounded-r-[6px] ${
                  visibility === "unlisted" ? "border-teal" : "border-l-0"
                }`}
                onClick={() => setVisibility("unlisted")}
              >
                Unlisted
              </div>
            </main>
          </div>
        </form>
      </section>
    </div>
  );
}
