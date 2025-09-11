import { Dispatch, ReactNode, SetStateAction, useState } from "react";

import { startOfDay, formatDate as formatDateFns } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/shadcn-ui/ui/popover";

import { Calendar } from "@/app/shadcn-ui/ui/calendar";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/app/shadcn-ui/ui/button";

interface DatePickerProps {
  label: string | ReactNode;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
  disabledDates?: (arg: Date) => boolean;
}

export default function DatePicker({
  label,
  date,
  setDate,
  disabledDates,
}: DatePickerProps) {
  //Focus state
  const [isDateInputFocused, setIsDateInputFocused] = useState<boolean>(false);

  //Popover states
  const [showPopover, setShowPopover] = useState<boolean>(false);

  //Handle open change
  function handlePopoverOpenChange(open: boolean) {
    setShowPopover(open);
    setIsDateInputFocused(open);
  }

  return (
    <div className="flex flex-col gap-y-1 cursor-pointer">
      {/** Label */}
      <div>{label}</div>

      {/** Input box */}
      <main className="w-full">
        {/** Raw date picker */}
        <Popover open={showPopover} onOpenChange={handlePopoverOpenChange}>
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(date) => {
                setDate(date ?? null);
                setShowPopover(false); //close popover after selecting
                setIsDateInputFocused(false);
              }}
              disabled={
                disabledDates
                  ? disabledDates
                  : (date) => date < startOfDay(new Date())
              }
              captionLayout="dropdown"
              className="!w-full !font-quicksand"
              endMonth={new Date(2099, 0)}
            />
          </PopoverContent>

          <PopoverTrigger className="!w-full" style={{ width: "100%" }} asChild>
            <Button
              variant={"outline"}
              className={`!h-[42px] !justify-start !gap-x-4 pl-2 text-left font-normal !text-[15px] !text-black-2 !shadow-none border-[1px] rounded-[6px] !font-quicksand hover:bg-white ${
                isDateInputFocused ? "border-teal" : "border-[#e2e5e7]"
              }`}
            >
              <CalendarIcon className="h-3 w-3 text-gray" />

              {date ? (
                <span className="text-black-2">
                  {formatDateFns(date, "MMM")} {date.getDate()},{" "}
                  {date.getFullYear()}
                </span>
              ) : (
                <span className="text-gray">Select a date</span>
              )}
            </Button>
          </PopoverTrigger>
        </Popover>
      </main>
    </div>
  );
}
