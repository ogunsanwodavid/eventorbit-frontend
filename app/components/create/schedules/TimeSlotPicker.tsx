import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TimeSlot } from "@/app/models/events";

import moment from "moment-timezone";

import {
  format as formatDateFns,
  addMinutes,
  startOfDay,
  isToday,
  isBefore,
} from "date-fns";

import Select from "../Select";

import AlarmClock from "../../ui/icons/AlarmClock";
import Delete from "../../ui/icons/Delete";

interface TimeSlotPickerProps {
  timeZone: string;
  timeSlotIndex: number;
  timeSlot: TimeSlot | null;
  timeSlots: (TimeSlot | null)[];
  setTimeSlots: Dispatch<SetStateAction<(TimeSlot | null)[]>>;
  startDate: Date | null;
}

export default function TimeSlotPicker({
  timeZone,
  timeSlotIndex,
  //timeSlot,
  timeSlots,
  setTimeSlots,
  startDate,
}: TimeSlotPickerProps) {
  //Input values
  const [startTime, setStartTime] = useState<string>("");
  const [durationValue, setDurationValue] = useState<number | null>(null);
  const [durationUnit, setDurationUnit] = useState<string>("hours");

  //Duration unit options
  const durationUnitOptions = [
    {
      value: "hours",
      label: "Hours",
    },
    {
      value: "mins",
      label: "Mins",
    },
  ];

  //Focus states
  const [isStartTimeInputFocused, setIsStartTimeInputFocused] =
    useState<boolean>(false);

  //Generate times from 00:00 to 23:30 in 30-min intervals (HH:mm format)
  function generateTimeOptions(startDate: Date | null): string[] {
    const times: string[] = [];
    const baseDate = startDate ?? new Date();
    let current = startOfDay(baseDate);

    for (let i = 0; i < 48; i++) {
      //Generate time after current time only if start date is today
      if (!isToday(baseDate) || !isBefore(current, new Date())) {
        times.push(formatDateFns(current, "HH:mm"));
      }
      current = addMinutes(current, 30);
    }

    return times;
  }

  //Start time select options
  const [startTimeSelectOptions, setStartTimeSelectOptions] = useState<
    string[]
  >([]);

  useEffect(() => {
    //Generate start time select options based on start date
    const options = generateTimeOptions(startDate);

    //Set start time select options based on raw date
    setStartTimeSelectOptions(options);

    //Reset time if current start time not in the new options
    if (!options.includes(startTime)) {
      setStartTime("");
    }
  }, [startDate, startTime]);

  //Convert "HH:mm" (24h) back to "hh:mm a"
  function formatTo12Hour(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m);
    return formatDateFns(date, "hh:mm a");
  }

  //Format time zone abbreviation (e.g. America/New_York -> EST/EDT)
  function formatTimeZone(timeZone: string): string {
    const now = moment().tz(timeZone);
    return now.format("z");
  }

  //Delete time slot
  function handleDeleteTimeSlot() {
    if (!timeSlots || timeSlots.length === 0) return;

    setTimeSlots(timeSlots.filter((_, index) => index !== timeSlotIndex));
  }

  useEffect(() => {
    //Set time slot if all paramaters complete
    //::Else, set to null
    if (startTime && durationValue && durationUnit) {
      setTimeSlots((prev) =>
        prev.map((timeSlot, index) => {
          return index === timeSlotIndex
            ? {
                startTime: {
                  hours: Number(startTime.slice(0, 2)),
                  minutes: Number(startTime.slice(3, 5)),
                  timeZone,
                },
                duration: {
                  value: durationValue,
                  unit: durationUnit as "hours" | "mins",
                },
              }
            : timeSlot;
        })
      );
    } else {
      setTimeSlots((prev) =>
        prev.map((timeSlot, index) => {
          return index === timeSlotIndex ? null : timeSlot;
        })
      );
    }
  }, [
    startTime,
    durationValue,
    durationUnit,
    timeZone,
    timeSlotIndex,
    setTimeSlots,
  ]);

  return (
    <div className="mb-4 space-y-4 border-b-[1px] border-[#e2e5e7 pb-3 md:space-y-0 md:flex md:gap-x-3 md:items-end md:pb-5">
      {/** Start Time */}
      <section className="space-y-1">
        {/** Label */}
        <div className="text-[15px]">
          Start time <span className="text-error-red-2">*</span>
        </div>

        <main className="relative flex md:max-w-[235px]">
          {/** Start time */}
          <div
            className={`w-full h-[42px] p-2 border-[1px] flex items-center gap-x-4 justify-center rounded-l-[6px] duration-250 transition-all ${
              isStartTimeInputFocused ? "border-teal" : "border-[#e2e5e7]"
            }`}
          >
            {/** Clock icon */}
            <span className="text-gray">
              <AlarmClock size="14" />
            </span>

            {/** Input select */}
            <input
              type="text"
              value={startTime ? formatTo12Hour(startTime) : ""}
              className="w-full h-full text-[15px] border-0 outline-0 cursor-pointer"
              onFocus={() => setIsStartTimeInputFocused(true)}
              onBlur={() => setIsStartTimeInputFocused(false)}
              readOnly
            />
          </div>

          {/** Time zone */}
          <div className="w-max shrink-0 h-[42px] bg-[#fafafa] py-2 px-3  border-[1px] border-[#e2e5e7] border-l-0 rounded-r-[6px] text-black-2 text-[15px] font-medium uppercase">
            {formatTimeZone(timeZone)}
          </div>

          {/** Select options */}
          {isStartTimeInputFocused && (
            <div className="absolute bg-white top-full mt-2 w-full h-[144px] space-y-1 overflow-y-auto z-2 rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-2 text-[15px] cursor-pointer">
              {startTimeSelectOptions.map((option, index) => {
                //Handle select option
                function handleSelect() {
                  setStartTime(option);
                }

                return (
                  <div
                    className={`h-[40px] py-2 px-4 rounded-[6px] hover:bg-gray-100 ${
                      !startTime && index === 0 && "!bg-gray-200"
                    } ${startTime && option === startTime && "!bg-gray-200"}`}
                    key={index}
                    onMouseDown={handleSelect}
                  >
                    {formatTo12Hour(option)}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </section>

      {/** Duration */}
      <section className="space-y-1">
        {/** Label */}
        <div className="text-[15px]">
          Duration <span className="text-error-red-2">*</span>
        </div>

        <main className="relative flex h-[42px] md:max-w-[235px]">
          {/** Duration value input */}
          <input
            type="text"
            value={
              durationValue && durationValue > 0 ? String(durationValue) : ""
            }
            className="w-full h-full p-2 text-[15px] text-black-2 border-[1px] border-[#e2e5e7] rounded-l-[6px] focus:border-teal"
            inputMode="numeric"
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, ""); //remove non-digits
              if (val.startsWith("0")) {
                val = val.replace(/^0+/, ""); //strip leading zeros
              }
              setDurationValue(Number(val));
            }}
          />

          {/** Duration unit select */}
          <Select
            value={durationUnit}
            setValue={setDurationUnit}
            items={durationUnitOptions}
            triggerClassName="!max-w-[90px] !h-full !border-[#e2e5e7] !border-l-0 !rounded-l-none"
          />
        </main>
      </section>

      {/** Delete */}
      <div
        className="w-max shrink-0 ml-auto text-gray-500 md:!ml-3 md:mb-3"
        onClick={handleDeleteTimeSlot}
      >
        <Delete size="19" />
      </div>
    </div>
  );
}
