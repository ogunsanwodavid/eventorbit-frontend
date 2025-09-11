import { Dispatch, SetStateAction, useState } from "react";

import { Schedule } from "@/app/models/events";

import { eachDayOfInterval, format as formatDateFns } from "date-fns";

import { TimeSlotAdderMode } from "./TimeSlotAdder";

import EditSolid from "../../ui/icons/EditSolid";
import Delete from "../../ui/icons/Delete";
import { InfoIcon } from "lucide-react";

interface SchedulesTableProps {
  schedules: Omit<Schedule, "_id" | "sold">[];
  setSchedules: Dispatch<SetStateAction<Omit<Schedule, "_id" | "sold">[]>>;
  setShowTimeSlotAdder: Dispatch<SetStateAction<boolean>>;
  setTimeSlotAdderMode: Dispatch<SetStateAction<TimeSlotAdderMode>>;
  setEditedScheduleIndex: Dispatch<SetStateAction<number | null>>;
}

export default function SchedulesTable({
  schedules,
  setSchedules,
  setShowTimeSlotAdder,
  setTimeSlotAdderMode,
  setEditedScheduleIndex,
}: SchedulesTableProps) {
  //States
  const [showMaxTimeSlotsModal, setShowMaxTimeSlotsModal] =
    useState<boolean>(false);

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

  //Handle edit schedule
  function handleEditSchedule(index: number) {
    setTimeSlotAdderMode("edit");
    setEditedScheduleIndex(index);
    setShowTimeSlotAdder(true);
  }

  //Handle delete schedule
  function handleDeleteSchedule(scheduleIndex: number) {
    setSchedules((prev) =>
      prev.filter((schedule, index) => index !== scheduleIndex)
    );
  }

  return (
    <>
      <div aria-label="table" className="mx-6 mb-4 overflow-x-auto">
        {/** Header */}
        <header className="w-full grid grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(70px,0.5fr)] gap-x-1 pb-2 text-[15px] text-black-2 font-medium border-b-[1px] border-[#e2e5e7] md:grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(70px,0.5fr)_40px_40px]">
          {/** S/N */}
          <div className=""></div>

          {/** Time and date */}
          <div className="">Time and date</div>

          {/** Repititon */}
          <div className="">Repitition</div>

          {/** Timeslots */}
          <div className="">Timeslots</div>
        </header>

        {/** Main content */}
        <main>
          {schedules.map((schedule, index) => {
            return (
              <section
                className="flex flex-col gap-4 pt-4 pb-1 text-[14.5px] text-black-2 md:flex-row md:gap-0"
                key={index}
              >
                {/** Upper segment */}
                <div className="w-full grid grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(70px,0.5fr)] gap-x-1 ">
                  {/** S /N */}
                  <p className="">{index + 1}</p>

                  <div className="space-y-1">
                    {/** Timeslots / day */}
                    <p>
                      {schedule.timeSlots.length} timeslot
                      {schedule.timeSlots.length > 1 && "s"}/day
                    </p>

                    {/** Date */}
                    <p className="text-[13px] text-gray">
                      {schedule.endDate
                        ? `${formatDateFns(
                            schedule.startDate,
                            "MMM do, yyyy"
                          )}${
                            schedule.endDate
                              ? ` - ${formatDateFns(
                                  schedule.endDate,
                                  "MMM do, yyyy"
                                )}`
                              : ""
                          }`
                        : formatDateFns(schedule.startDate, "MMMM do, yyyy")}
                    </p>
                  </div>

                  {/** Repitiion */}
                  <div className="space-y-1">
                    {/** Days / week */}
                    <p>
                      {!schedule.repeatDays
                        ? "No repeat"
                        : `${schedule.repeatDays.length} day${
                            schedule.repeatDays.length > 1 && "s"
                          }/week`}
                    </p>

                    {/** Days repeated */}
                    {schedule.repeatDays && (
                      <p className="text-[13px] text-gray">
                        {schedule.repeatDays.map((day, index) => {
                          return (
                            <span key={index} className="capitalize">
                              {index !== 0 && ", "}
                              {day.slice(0, day.length - 1)}
                            </span>
                          );
                        })}
                      </p>
                    )}
                  </div>

                  {/** Timeslots */}
                  <div className="">{calculateTimeSlots(schedule)}</div>
                </div>

                {/** Lower segment */}
                <div className="flex items-center gap-x-5 md:gap-x-0">
                  {/** Edit button */}
                  <button
                    className="w-[200px] flex items-center justify-center border-[1px] border-[#e2e5e7] py-1 text-gray rounded-[6px] md:w-[40px] md:border-0"
                    onClick={() => handleEditSchedule(index)}
                  >
                    <EditSolid size="16" />
                  </button>

                  {/** Delete icon */}
                  <span
                    className="text-gray cursor-pointer md:inline-flex md:w-[40px] md:items-center md:justify-center"
                    onClick={() => handleDeleteSchedule(index)}
                  >
                    <Delete size="18" />
                  </span>
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/** Footer */}
      <footer className="mx-6 mb-4 mt-5 z-2 flex items-center justify-between text-[15px] pt-5 border-t-[1px] border-[#e2e5e7]">
        {/** Number of timeslots */}
        <div className="flex items-center gap-x-2">
          <p>Total timeslots:</p>
          <p
            className={`font-medium ${
              calculateTotalTimeSlots() > 2000 && "text-error-red"
            }`}
          >
            {calculateTotalTimeSlots()}
          </p>
        </div>

        {/** Max timeslots */}
        <div
          className="relative cursor-pointer"
          onClick={() => setShowMaxTimeSlotsModal((prev) => !prev)}
        >
          {/** Texts */}
          <main
            className="flex items-center gap-x-1 text-gray font-medium "
            onMouseEnter={() => setShowMaxTimeSlotsModal(true)}
            onMouseLeave={() => setShowMaxTimeSlotsModal(false)}
          >
            <p className="mt-0.75">Max. 2000</p>

            <InfoIcon className="h-4 w-4" />
          </main>

          {/** Info modal */}
          <div
            className={`${
              !showMaxTimeSlotsModal && "hidden"
            } absolute w-[220px] z-2 right-0 bottom-[calc(100%+20px)] bg-black-2 text-white text-[13px] p-3 rounded-[6px] rounded-br-none duration-250 transition-all`}
          >
            <p>
              The total number of timeslots for your event (past and future)
              cannot exceed this number.
            </p>

            <div
              className="absolute right-0 -bottom-[7px] rotate-180 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent 
  border-b-[8px] border-b-black-2"
            ></div>
          </div>
        </div>
      </footer>
    </>
  );
}
