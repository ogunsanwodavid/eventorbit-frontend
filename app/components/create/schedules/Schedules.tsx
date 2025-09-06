import { useEffect, useState } from "react";

import { EventType, Schedule } from "@/app/models/events";

import Select from "../Select";

import TimeSlotAdder from "./TimeSlotAdder";
import SchedulesTable from "./SchedulesTable";

import Plus from "../../ui/icons/Plus";

interface SchedulesProps {
  type: EventType;
}

export default function Schedules({}: SchedulesProps) {
  //Input values
  const [timeDisplay, setTimeDisplay] = useState<string>("start-and-end");
  const [schedules, setSchedules] = useState<Omit<Schedule, "_id" | "sold">[]>(
    []
  );

  //Other states
  const [showTimeSlotAdder, setShowTimeSlotAdder] = useState<boolean>(false);

  //Time display options
  const timeDisplayOptions = [
    { value: "start-and-end", label: "Start and end time" },
    { value: "start-only", label: "Start time only" },
  ];

  useEffect(() => {
    console.log(schedules);
  }, [schedules]);

  return (
    <>
      <div className="space-y-6">
        {/** Schedule timeslots */}
        <main className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] pb-6">
          {/** Header */}
          <header className="space-y-3 p-6">
            <h2 className="text-black-2 text-[20px] font-bold">
              Schedule timeslots for your event
            </h2>

            <h6 className="text-black-2 text-[15px]">
              Create groups of timeslots across multiple days based on rules you
              define. You will be able to edit your schedules at any time in
              Event Manager.
            </h6>
          </header>

          {/** Time display format select */}
          <section className="w-full border-t-[1px] border-[#e2e5e7] p-6 pb-7 space-y-3">
            <p className="text-black-2 text-[15px]">
              Time displayed on ticket and checkout
            </p>

            {/** Select */}
            <Select
              value={timeDisplay}
              setValue={setTimeDisplay}
              items={timeDisplayOptions}
              triggerClassName="!max-w-[225px] !text-[16px] !p-5"
            />

            <p className="text-gray text-[14.5px]">
              If “Start time only” is selected, timeslot end times will be
              hidden from guest tickets and in checkout.
            </p>
          </section>

          {/** Table of schedules */}
          {schedules.length > 0 && (
            <SchedulesTable schedules={schedules} setSchedules={setSchedules} />
          )}

          {/** Add timeslot */}
          <section
            className="w-full bg-[#fafafa] border-b-[1px] border-[#e2e5e7] p-6"
            onClick={() => setShowTimeSlotAdder(true)}
          >
            <button className="w-full py-2 px-4 rounded-[6px] border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 transition-all duration-250 hover:bg-teal hover:text-white lg:w-max lg:mx-auto">
              {/** Plus icon */}
              <Plus size="16" />

              <span>Add timeslot(s)</span>
            </button>
          </section>
        </main>
      </div>

      {/** TimeSlot Adder */}
      {showTimeSlotAdder && (
        <TimeSlotAdder
          setShowTimeSlotAdder={setShowTimeSlotAdder}
          schedules={schedules}
          setSchedules={setSchedules}
        />
      )}
    </>
  );
}
