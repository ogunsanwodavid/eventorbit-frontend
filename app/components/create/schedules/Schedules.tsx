import { useState } from "react";

import { useRouter } from "next/navigation";

import { EventType, Schedule } from "@/app/models/events";

import { useAppDispatch, useAppSelector } from "@/app/hooks/global/redux";

import {
  updateCurrentStep,
  updateSchedules,
} from "@/app/redux/slices/create/createEventSlice";

import { eachDayOfInterval } from "date-fns";

import { toast } from "sonner";

import Select from "../Select";
import Button from "../Button";

import TimeSlotAdder, { TimeSlotAdderMode } from "./TimeSlotAdder";
import SchedulesTable from "./SchedulesTable";
import SchedulesCalendar from "./SchedulesCalendar";

import Plus from "../../ui/icons/Plus";

interface SchedulesProps {
  type: EventType;
}

export default function Schedules({ type }: SchedulesProps) {
  //Router function
  const router = useRouter();

  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Create event step state from redux
  const createEvent = useAppSelector((state) => state.createEvent);

  //Input values
  const [timeDisplay, setTimeDisplay] = useState<string>("start-and-end");
  const [schedules, setSchedules] = useState<Omit<Schedule, "_id" | "sold">[]>(
    createEvent.event.schedules || []
  );

  //Other states
  const [showTimeSlotAdder, setShowTimeSlotAdder] = useState<boolean>(false);
  const [timeSlotAdderMode, setTimeSlotAdderMode] =
    useState<TimeSlotAdderMode>("add");
  const [editedScheduleIndex, setEditedScheduleIndex] = useState<number | null>(
    null
  );

  //Time display options
  const timeDisplayOptions = [
    { value: "start-and-end", label: "Start and end time" },
    { value: "start-only", label: "Start time only" },
  ];

  //Calculate number of  timeslots for a schedule
  function calculateTimeSlots(schedule: Omit<Schedule, "_id" | "sold">) {
    //Week day map
    const weekdayMap: Record<string, number> = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    if (!schedule.startDate || schedule.timeSlots.length === 0) return 0;

    if (!schedule.repeatDays) return schedule.timeSlots.length;

    //Repeat case
    if (schedule.repeatDays && schedule.endDate) {
      const days = eachDayOfInterval({
        start: schedule.startDate,
        end: schedule.endDate,
      });

      const repeatDayIndexes = schedule.repeatDays.map((d) => weekdayMap[d]);

      //Count days matching repeatDays
      const matchingDays = days.filter((d) =>
        repeatDayIndexes.includes(d.getDay())
      );

      //Each valid day contributes all defined timeSlots
      return matchingDays.length * schedule.timeSlots.length;
    }

    return 0;
  }

  //Calculate total timeslots for all schedules
  function calculateTotalTimeSlots() {
    let total = 0;

    schedules.map((schedule) => {
      total += calculateTimeSlots(schedule);
    });

    return total;
  }

  //Handle continue
  function handleContinue() {
    if (schedules.length === 0) {
      toast.dismiss();
      toast.error("Please add schedule time slots");
      return;
    }

    if (calculateTotalTimeSlots() > 2000) {
      toast.dismiss();
      toast.error("Maximum of 2000 time slots");
      return;
    }

    //Update create event redux state
    dispatch(updateCurrentStep(3));
    dispatch(updateSchedules(schedules));

    //Route to next step
    router.push(`/create/${type}/3`);
  }

  return (
    <>
      <div className="space-y-6">
        {/** Main content */}
        <main className="space-y-6 md:space-y-0 lg:flex lg:flex-row-reverse lg:gap-x-6">
          {/** Schedule timeslots */}
          <section className="w-full bg-white rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] pb-6">
            {/** Header */}
            <header className="space-y-3 p-6">
              <h2 className="text-black-2 text-[20px] font-bold">
                Schedule timeslots for your event
              </h2>

              <h6 className="text-black-2 text-[15px]">
                Create groups of timeslots across multiple days based on rules
                you define. You will be able to edit your schedules at any time
                in Event Manager.
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
                triggerClassName="!max-w-[200px] !text-[15px] !p-4"
              />

              <p className="text-gray text-[14.5px]">
                If “Start time only” is selected, timeslot end times will be
                hidden from guest tickets and in checkout.
              </p>
            </section>

            {/** Table of schedules */}
            {schedules.length > 0 && (
              <SchedulesTable
                schedules={schedules}
                setSchedules={setSchedules}
                setShowTimeSlotAdder={setShowTimeSlotAdder}
                setTimeSlotAdderMode={setTimeSlotAdderMode}
                setEditedScheduleIndex={setEditedScheduleIndex}
              />
            )}

            {/** Add timeslot */}
            <section
              className="w-full bg-[#fafafa] border-b-[1px] border-[#e2e5e7] p-6"
              onClick={() => setShowTimeSlotAdder(true)}
            >
              <button className="w-full max-w-[450px] mx-auto py-2 px-4 rounded-[6px] border-[1px] border-teal text-teal text-[15px] font-medium flex items-center justify-center gap-x-2 transition-all duration-250 hover:bg-teal hover:text-white lg:w-max">
                {/** Plus icon */}
                <Plus size="16" />

                <span>Add timeslot(s)</span>
              </button>
            </section>
          </section>

          {/** Schedule calendar */}
          <SchedulesCalendar schedules={schedules} />
        </main>

        {/** Continue button */}
        <Button
          text="Continue to Tickets"
          className="sticky bottom-2 mt-8 md:relative  md:w-max md:ml-auto"
          onClick={handleContinue}
        />
      </div>

      {/** TimeSlot Adder */}
      {showTimeSlotAdder && (
        <TimeSlotAdder
          setShowTimeSlotAdder={setShowTimeSlotAdder}
          schedules={schedules}
          setSchedules={setSchedules}
          mode={timeSlotAdderMode}
          editedScheduleIndex={
            editedScheduleIndex !== null ? editedScheduleIndex : undefined
          }
          setTimeSlotAdderMode={setTimeSlotAdderMode}
          setEditedScheduleIndex={setEditedScheduleIndex}
        />
      )}
    </>
  );
}
