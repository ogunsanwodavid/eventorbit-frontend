import { Dispatch, SetStateAction } from "react";

import { Schedule } from "@/app/models/events";

interface SchedulesTableProps {
  schedules: Omit<Schedule, "_id" | "sold">[];
  setSchedules: Dispatch<SetStateAction<Omit<Schedule, "_id" | "sold">[]>>;
}

export default function SchedulesTable({}: SchedulesTableProps) {
  return (
    <div aria-label="table" className="px-6 mb-4 overflow-x-auto">
      {/** Header */}
      <header className="w-full grid grid-cols-[40px_200px_125px_110px] pb-[2px] text-[15px] text-black-2 border-b-[1px] border-[#e2e5e7]">
        {/** S/N */}
        <div className="w-full"></div>

        {/** Time and date */}
        <div>Time and date</div>

        {/** Repititon */}
        <div>Repitition</div>

        {/** Timeslots */}
        <div>Timeslots</div>
      </header>
    </div>
  );
}
