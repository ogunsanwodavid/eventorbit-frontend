import { Dispatch, SetStateAction } from "react";

import { Schedule } from "@/app/models/events";

import { eachDayOfInterval, format as formatDateFns } from "date-fns";

import { TimeSlotAdderMode } from "./TimeSlotAdder";

import EditSolid from "../../ui/icons/EditSolid";
import Delete from "../../ui/icons/Delete";

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
    <div aria-label="table" className="mx-6 mb-4 overflow-x-auto">
      {/** Header */}
      <header className="w-full grid grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(70px,0.5fr)] gap-x-1 pb-[2px] text-[15px] text-black-2 font-medium border-b-[1px] border-[#e2e5e7]">
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
              className="flex flex-col gap-y-4 py-2 text-[14.5px] text-black-2"
              key={index}
            >
              {/** Upper segment */}
              <div className="grid grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(70px,0.5fr)] gap-x-1">
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
                      ? `${formatDateFns(schedule.startDate, "MMM do, yyyy")}${
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
              <div className="flex items-center gap-x-5">
                {/** Edit button */}
                <button
                  className="w-[200px] flex items-center justify-center border-[1px] border-[#e2e5e7] py-1 text-gray rounded-[6px]"
                  onClick={() => handleEditSchedule(index)}
                >
                  <EditSolid size="16" />
                </button>

                {/** Delete icon */}
                <span
                  className="text-gray"
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
  );
}
