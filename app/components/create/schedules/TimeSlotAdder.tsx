import { Dispatch, SetStateAction, useEffect, useState } from "react";

import useWindowDimensions from "@/app/hooks/global/useWindowDimensions";

import { Schedule, TimeSlot, WeekDay } from "@/app/models/events";

import { eachDayOfInterval, startOfDay } from "date-fns";

import Select from "../Select";

import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";

import X from "../../ui/icons/X";
import Plus from "../../ui/icons/Plus";
import CheckBox from "../../ui/icons/CheckBox";
import CheckBoxOutlineBlank from "../../ui/icons/CheckBoxOutlineBlank";

export type TimeSlotAdderMode = "add" | "edit";

interface TimeSlotAdderProps {
  setShowTimeSlotAdder: Dispatch<SetStateAction<boolean>>;
  schedules: Omit<Schedule, "_id" | "sold">[];
  setSchedules: Dispatch<SetStateAction<Omit<Schedule, "_id" | "sold">[]>>;
  mode?: TimeSlotAdderMode;
  editedScheduleIndex?: number;
  setTimeSlotAdderMode: Dispatch<SetStateAction<TimeSlotAdderMode>>;
  setEditedScheduleIndex: Dispatch<SetStateAction<number | null>>;
}

export default function TimeSlotAdder({
  setShowTimeSlotAdder,
  schedules,
  setSchedules,
  mode,
  editedScheduleIndex,
  setTimeSlotAdderMode,
  setEditedScheduleIndex,
}: TimeSlotAdderProps) {
  //Window dimensions
  const { windowWidth, windowHeight } = useWindowDimensions();

  //Time zone
  const timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //Edited schedule
  const editedSchedule =
    mode === "edit" && editedScheduleIndex !== undefined
      ? schedules[editedScheduleIndex]
      : null;

  //Input values
  const [startDate, setStartDate] = useState<Date | null>(
    editedSchedule?.startDate || null
  );
  const [timeSlots, setTimeSlots] = useState<(TimeSlot | null)[]>(
    editedSchedule?.timeSlots || [null]
  );
  const [repeat, setRepeat] = useState<string>(
    editedSchedule?.repeatDays
      ? editedSchedule?.repeatDays.length === 7
        ? "repeated-everyday"
        : "repeat-selected-days"
      : "no-repeat"
  );
  const [repeatDays, setRepeatDays] = useState<WeekDay[] | null>(
    editedSchedule?.repeatDays || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    editedSchedule?.endDate || null
  );

  //Repeat days options
  const repeatDaysOptions: WeekDay[] = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  //Repeat select options
  const repeatSelectOptions = [
    { value: "no-repeat", label: "No repeat" },
    { value: "repeat-everyday", label: "Repeat everyday until..." },
    {
      value: "repeat-selected-days",
      label: "Repeat on selected days of the week until...",
    },
  ];

  useEffect(() => {
    //Set repeat days on repeat change
    if (repeat === "repeat-everday" || "repeat-selected-days") {
      setRepeatDays(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]);
    } else {
      setRepeatDays(null);
    }
  }, [repeat]);

  //Handle adding an empty null timeslot
  function handleEmptyTimeSlot() {
    setTimeSlots((prev) => [...prev, null]);
  }

  //Calculate number of timeslots
  function calculateTimeSlots() {
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

    if (
      !startDate ||
      timeSlots.length === 0 ||
      timeSlots.some((timeSlot) => timeSlot === null) ||
      (repeat !== "no-repeat" &&
        (!repeatDays || repeatDays.length === 0 || !endDate))
    )
      return 0;

    if (repeat === "no-repeat") return timeSlots.length;

    //Repeat case
    if (repeatDays && endDate) {
      const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      const repeatDayIndexes = repeatDays.map((d) => weekdayMap[d]);

      //Count days matching repeatDays
      const matchingDays = days.filter((d) =>
        repeatDayIndexes.includes(d.getDay())
      );

      //Each valid day contributes all defined timeSlots
      return matchingDays.length * timeSlots.length;
    }

    return 0;
  }

  //Handle close modal
  function handleCloseModal() {
    setShowTimeSlotAdder(false);
    setEditedScheduleIndex(null);
    setTimeSlotAdderMode("add");
  }

  //Handle add timeslots
  function handleAddTimeSlots() {
    if (mode !== "add" || calculateTimeSlots() === 0) return;

    //Add timeslots to schedules
    setSchedules((prev) => [
      ...prev,
      {
        startDate: startDate!,
        endDate: repeat !== "no-repeat" ? endDate! : undefined,
        timeSlots: timeSlots.filter((t): t is TimeSlot => t !== null),
        repeatDays: repeat !== "no-repeat" ? repeatDays : undefined,
      } as Omit<Schedule, "_id" | "sold">,
    ]);

    //Close modal
    handleCloseModal();
  }

  //Handle edit time slots
  function handleEditTimeSlots() {
    if (mode !== "edit" || calculateTimeSlots() === 0) return;

    //Edit timeslots in schedules
    setSchedules((prev) =>
      prev.map((item, index) => {
        return index === editedScheduleIndex
          ? ({
              startDate: startDate!,
              endDate: repeat !== "no-repeat" ? endDate! : undefined,
              timeSlots: timeSlots.filter((t): t is TimeSlot => t !== null),
              repeatDays: repeat !== "no-repeat" ? repeatDays : undefined,
            } as Omit<Schedule, "_id" | "sold">)
          : item;
      })
    );

    //Close modal
    handleCloseModal();
  }

  return (
    <div
      className="fixed top-0 right-0 bg-blur-black overflow-hidden z-50 transition-opacity duration-400 py-5 px-5 flex items-center justify-center"
      style={{
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
    >
      {/** Main content */}
      <main className="w-full max-h-full max-w-[780px] mx-auto bg-white rounded-[6px] overflow-y-auto">
        {/** Header */}
        <header className="space-y-5 p-6 pb-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[19px] text-black-2 font-bold">
              <span className="capitalize">{mode || "Add"}</span> timeslot(s)
            </h3>

            <span
              className="text-gray cursor-pointer"
              onClick={handleCloseModal}
            >
              <X size="22" />
            </span>
          </div>

          {mode === "add" && (
            <p className="text-[15px] text-black-2">
              Add timeslot(s) for your attendees
            </p>
          )}
        </header>

        {/** Start date */}
        <section className="mt-5 px-6 md:pr-0 md:w-[259px]">
          <DatePicker
            label={
              <div className="text-[15px]">
                Date <span className="text-error-red-2">*</span>
              </div>
            }
            date={startDate}
            setDate={setStartDate}
          />
        </section>

        {/** Time slots */}
        <section className="mt-4 pt-3 pb-5 px-6 border-y-[1px] border-gray-300 md:pt-5">
          {timeSlots &&
            timeSlots.length > 0 &&
            timeSlots.map((timeSlot, index) => {
              return (
                <TimeSlotPicker
                  key={index}
                  timeSlotIndex={index}
                  timeZone={timeZone}
                  timeSlot={timeSlot}
                  timeSlots={timeSlots}
                  setTimeSlots={setTimeSlots}
                  startDate={startDate}
                />
              );
            })}

          {/** Add a new empty timeslot */}
          <div
            className="w-max text-teal text-[15px] font-semibold flex items-center gap-x-2 cursor-pointer"
            onClick={handleEmptyTimeSlot}
          >
            {/** Plus icon */}
            <Plus size="18" />

            <p>Add a timeslot</p>
          </div>
        </section>

        {/** Repeat days */}
        <section className="p-6 border-b-[1px] border-gray-300 space-y-4">
          {/** Repeat select */}
          <div className="space-y-2">
            <p className="text-[15px] font-medium">
              Do these timeslots repeat on other days?{" "}
              <span className="text-error-red">*</span>
            </p>

            <Select
              value={repeat}
              setValue={setRepeat}
              items={repeatSelectOptions}
              triggerClassName="!w-max"
            />
          </div>

          {/** Select days of the week checkboxes
           * SHOW ONLY IF TO REPEAT ON SELECTED DAYS
           */}
          {repeat === "repeat-selected-days" && (
            <div className="space-y-2">
              <p className="text-[15px] font-medium">
                Selected days of the week{" "}
                <span className="text-error-red">*</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {repeatDaysOptions.map((day, index) => {
                  //Handle click
                  function handleClick() {
                    //Add day if not in repeat days
                    if (repeatDays && !repeatDays.includes(day)) {
                      setRepeatDays([...repeatDays, day]);
                    }

                    //Remove day if in repeat days
                    if (repeatDays && repeatDays.includes(day)) {
                      setRepeatDays(
                        repeatDays?.filter((repeatDay) => repeatDay !== day)
                      );
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="inline-flex items-center gap-x-1"
                      onClick={handleClick}
                    >
                      {/** Checkbox */}
                      {repeatDays && repeatDays.includes(day) ? (
                        <span className="text-teal">
                          <CheckBox size="18" />
                        </span>
                      ) : (
                        <CheckBoxOutlineBlank size="18" />
                      )}

                      <span className="capitalize text-[15px] text-black-2">
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/** Last occurence */}
          {repeat !== "no-repeat" && (
            <DatePicker
              label={
                <div className="text-[15px]">
                  Last occurence <span className="text-error-red-2">*</span>
                </div>
              }
              date={endDate}
              setDate={setEndDate}
              disabledDates={(date) =>
                //Disable dates 24 hours after start date or otherwise curren date
                date <
                startOfDay(
                  new Date(
                    (startDate ?? new Date()).getTime() + 24 * 60 * 60 * 1000
                  )
                )
              }
            />
          )}
        </section>

        {/** Footer */}
        <footer className="w-full p-6 space-y-4">
          <p className="text-gray text-[15px]">
            You may delete or modify individual timeslots after they are added.
          </p>

          {/** Add or edit time slots button */}
          <button
            className="block w-max ml-auto px-4 py-2 rounded-[6px] border-[1px] border-teal bg-teal text-white text-[15px] duration-250 transition-all hover:opacity-80 disabled:opacity-60"
            disabled={calculateTimeSlots() === 0}
            onClick={mode === "add" ? handleAddTimeSlots : handleEditTimeSlots}
          >
            <span className="capitalize">{mode}</span> {calculateTimeSlots()}{" "}
            timeslot{calculateTimeSlots() > 1 && "s"}
          </button>
        </footer>
      </main>
    </div>
  );
}
