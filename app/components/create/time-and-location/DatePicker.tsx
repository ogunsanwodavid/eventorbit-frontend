"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import {
  format as formatDateFns,
  addMinutes,
  startOfDay,
  isToday,
  isBefore,
} from "date-fns";

import { fromZonedTime, toZonedTime } from "date-fns-tz";

import moment from "moment-timezone";

import { Button } from "@/app/shadcn-ui/ui/button";

import { Calendar } from "@/app/shadcn-ui/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/shadcn-ui/ui/popover";

import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  label: string | ReactNode;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
  timeZone: string;
  error?: string;
}

//Split zoned time to raw date and time using provided time zone
function splitDateTime(
  date: Date | null,
  timeZone: string
): { rawDate: Date | null; time: string } {
  if (!date || !timeZone) return { rawDate: null, time: "" };

  //Convert to zoned time
  const zoned = toZonedTime(date, timeZone);

  //Raw date
  const rawDate = startOfDay(zoned);

  //Time (HH:mm)
  const time = formatDateFns(zoned, "HH:mm");

  return { rawDate, time };
}

export default function DatePicker({
  label,
  date,
  setDate,
  error,
  timeZone,
}: DatePickerProps) {
  //Initial values
  const { rawDate: rawDateInitial, time: timeInital } = splitDateTime(
    date,
    timeZone
  );

  //Inputs
  const [rawDate, setRawDate] = useState<Date | null>(rawDateInitial);
  const [time, setTime] = useState<string>(timeInital);

  //Focus states
  const [isRawDateInputFocused, setIsRawDateInputFocused] =
    useState<boolean>(false);
  const [isTimeInputFocused, setIsTimeInputFocused] = useState<boolean>(false);

  //Other states
  const [showPopover, setShowPopover] = useState<boolean>(false);

  //Handle open change
  function handlePopoverOpenChange(open: boolean) {
    setShowPopover(open);
    setIsRawDateInputFocused(open);
  }

  //Generate times from 00:00 to 23:30 in 30-min intervals (HH:mm format)
  function generateTimeOptions(rawDate: Date | null): string[] {
    const times: string[] = [];
    const baseDate = rawDate ?? new Date();
    let current = startOfDay(baseDate);

    for (let i = 0; i < 48; i++) {
      //Generate time after current time only if date is today
      if (!isToday(baseDate) || !isBefore(current, new Date())) {
        times.push(formatDateFns(current, "HH:mm"));
      }
      current = addMinutes(current, 30);
    }

    return times;
  }

  //Convert "HH:mm" (24h) back to "hh:mm a"
  function formatTo12Hour(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m);
    return formatDateFns(date, "hh:mm a");
  }

  //Time select options
  const [timeSelectOptions, setTimeSelectOptions] = useState<string[]>([]);

  useEffect(() => {
    //Generate time select options based on raw date
    const options = generateTimeOptions(rawDate);

    //Set time select options based on raw date
    setTimeSelectOptions(options);

    //Reset time if current time not in the new options
    if (!options.includes(time)) {
      setTime("");
    }
  }, [rawDate, time]);

  //Format time zone abbreviation (e.g. America/New_York -> EST/EDT)
  function formatTimeZone(timeZone: string): string {
    const now = moment().tz(timeZone);
    return now.format("z");
  }

  //Set date if rawDate, time and time zone exist
  useEffect(() => {
    //Combine rawDate, time and timeZone
    function combineDateTime(
      date: Date,
      time: string, //"HH:mm"
      timeZone: string //e.g., "America/New_York"
    ): Date {
      const [hours, minutes] = time.split(":").map(Number);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateTimeString = `${year}-${month}-${day}T${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(2, "0")}:00`;
      return fromZonedTime(dateTimeString, timeZone);
    }

    if (rawDate && time && timeZone) {
      const combinedDate = combineDateTime(rawDate, time, timeZone);

      setDate(combinedDate);
    } else {
      setDate(null);
    }
  }, [rawDate, time, timeZone, setDate]);

  return (
    <div className="flex flex-col gap-y-2 cursor-pointer">
      {/** Label */}
      <div>{label}</div>

      {/** Input box */}
      <main className="w-full grid grid-cols-2">
        {/** Raw date picker */}
        <Popover open={showPopover} onOpenChange={handlePopoverOpenChange}>
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={rawDate || undefined}
              onSelect={(date) => {
                setRawDate(date ?? null);
                setShowPopover(false);
                setIsRawDateInputFocused(false);
              }}
              disabled={(date) => date < startOfDay(new Date())}
              captionLayout="dropdown"
              className="!w-full !font-quicksand"
              endMonth={new Date(2099, 0)}
            />
          </PopoverContent>

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`!h-[42px] w-full !justify-start !gap-x-4 pl-3 text-left font-normal !text-[16px] !text-black-2 !shadow-none border-[1px]  !rounded-l-[6px] !rounded-r-none !font-quicksand hover:bg-white ${
                isTimeInputFocused && "border-r-0"
              } ${isRawDateInputFocused ? "border-teal" : "border-[#e2e5e7]"} ${
                error && "!border-error-red !bg-error-red-3 border-r-0"
              }`}
            >
              <CalendarIcon className="h-4 w-4 text-gray" />

              {rawDate ? (
                <span className="text-black-2">
                  {formatDateFns(rawDate, "MMM")} {rawDate.getDate()},{" "}
                  {rawDate.getFullYear()}
                </span>
              ) : (
                <span className="text-gray">Date</span>
              )}
            </Button>
          </PopoverTrigger>
        </Popover>

        <section className="relative flex">
          {/** Time select */}
          <div className="w-full">
            {/** Input */}
            <input
              type="text"
              value={time ? formatTo12Hour(time) : ""}
              className={`w-full h-full p-2 border-[1px] border-[#e2e5e7] border-l-0 text-[16px] focus:border-teal focus:border-l-[1px] ${
                error && "!border-error-red !bg-error-red-3 border-l-[1px]"
              }`}
              placeholder="Time"
              onFocus={() => setIsTimeInputFocused(true)}
              onBlur={() => setIsTimeInputFocused(false)}
              readOnly
            />

            {/** Select options */}
            {isTimeInputFocused && (
              <div className="absolute bg-white top-full mt-2 w-full h-[144px] space-y-1 overflow-y-auto z-2 rounded-[6px] shadow-[0_1px_3px_0_#d4d4d5,_0_0_0_0_#d4d4d5] p-2 text-[15px] cursor-pointer">
                {timeSelectOptions.map((option, index) => {
                  //Handle select option
                  function handleSelect() {
                    setTime(option);
                  }

                  return (
                    <div
                      className={`h-[40px] py-2 px-4 rounded-[6px] hover:bg-gray-100 ${
                        !time && index === 0 && "!bg-gray-200"
                      } ${time && option === time && "!bg-gray-200"}`}
                      key={index}
                      onMouseDown={handleSelect}
                    >
                      {formatTo12Hour(option)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/** Time zone */}
          <div className="w-max shrink-0 h-[42px] bg-[#fafafa] p-2  border-[1px] border-[#e2e5e7] border-l-0 rounded-r-[6px] text-black-2 text-[15px] uppercase">
            {formatTimeZone(timeZone)}
          </div>
        </section>
      </main>

      {/** Error */}
      <div className="text-[13px] text-error-red">{error}</div>
    </div>
  );
}
