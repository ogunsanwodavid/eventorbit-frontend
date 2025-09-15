import { useEffect, useState } from "react";

import { Schedule, TimeSlot, WeekDay } from "@/app/models/events";

import {
  format as formatDateFns,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

import { Calendar } from "@/app/shadcn-ui/ui/calendar";

interface SchedulesCalendarProps {
  schedules: Omit<Schedule, "_id" | "sold">[];
}

export default function SchedulesCalendar({
  schedules,
}: SchedulesCalendarProps) {
  //States
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formattedSchedules, setFormattedSchedules] = useState<
    Record<string, string[]>
  >({});
  const [displayedSchedule, setDisplayedSchedule] = useState<string[] | null>(
    null
  );

  //Format time slot object
  //eg to "5am for 2 hours"
  function formatTimeSlot(slot: TimeSlot): string {
    const { startTime, duration } = slot;
    const date = new Date();
    date.setHours(startTime.hours, startTime.minutes, 0, 0);

    const timeStr = formatDateFns(date, "h:mm a"); // e.g. "6:00 PM"
    const durationStr = `${duration.value} ${
      duration.value > 1
        ? duration.unit
        : duration.unit.slice(0, duration.unit.length - 1)
    }`;
    return `${timeStr} for ${durationStr}`;
  }

  useEffect(() => {
    //Week day map
    const dayMap: WeekDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    //Format schedules to an array that maps every day in the timeslot range and formatted time slots assigned to it
    function formatSchedules(
      schedules: Omit<Schedule, "_id" | "sold">[]
    ): Record<string, string[]> {
      const result: Record<string, string[]> = {};

      for (const schedule of schedules) {
        const { startDate, endDate, timeSlots, repeatDays } = schedule;

        //If no endDate:: only include startDate
        if (!endDate) {
          const key = formatDateFns(startDate, "dd-MM-yyyy");
          result[key] = (result[key] || []).concat(
            timeSlots.map(formatTimeSlot)
          );
          continue;
        }

        //Iterate all days between startDate and endDate
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        for (const day of days) {
          const weekday = dayMap[day.getDay()];

          if (repeatDays?.includes(weekday)) {
            const key = formatDateFns(day, "dd-MM-yyyy");
            result[key] = (result[key] || []).concat(
              timeSlots.map(formatTimeSlot)
            );
          }
        }
      }

      return result;
    }

    //Set formmated schedules
    setFormattedSchedules(formatSchedules(schedules));
  }, [schedules]);

  useEffect(() => {
    //Set displayed schedule
    if (selectedDate) {
      setDisplayedSchedule(
        formattedSchedules[formatDateFns(selectedDate, "dd-MM-yyyy")]
      );
    } else {
      setDisplayedSchedule(null);
    }

    //If selected date not in formatted schedules
    if (
      selectedDate &&
      !formattedSchedules[formatDateFns(selectedDate, "dd-MM-yyyy")]
    ) {
      //Clear selected date
      setSelectedDate(null);
    }
  }, [selectedDate, formattedSchedules]);

  return (
    <div className="w-full h-max bg-white rounded-[15px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] overflow-hidden lg:max-w-[310px] lg:shrink-0">
      {/** Calendar */}
      <main className="max-w-[500px] mx-auto">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => {
            if (!date) return;

            setSelectedDate(date);
          }}
          onDayClick={(date) => {
            if (!date) return;

            if (selectedDate && isSameDay(selectedDate, date)) {
              setSelectedDate(null);
            }
          }}
          disabled={(date) =>
            !formattedSchedules[formatDateFns(date, "dd-MM-yyyy")]
          }
          captionLayout="dropdown"
          className="schedule-calendar !w-full !font-quicksand !p-8 !text-[17px] lg:!py-5"
          classNames={{
            selected: "selected-day",
          }}
          endMonth={new Date(2099, 0)}
        />
      </main>

      {/** Displayed schedule for selected date */}
      {displayedSchedule && displayedSchedule.length > 0 && (
        <section className="w-full border-t-[1px] border-[#e2e5e7] px-8 py-4">
          {displayedSchedule.map((schedule, index) => {
            return (
              <span
                key={index}
                className="text-[14px] text-black-2 font-medium"
              >
                {index === 0 ? "" : ", "}
                {schedule}
              </span>
            );
          })}
        </section>
      )}
    </div>
  );
}
