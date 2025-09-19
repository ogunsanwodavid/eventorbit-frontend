import { Dispatch, SetStateAction } from "react";

import { Pagination as PaginationModel } from "@/app/models/global";

import ArrowLeft from "../icons/ArrowLeft";

interface PaginationProps {
  pagination: PaginationModel;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function Pagination({ pagination, setPage }: PaginationProps) {
  //Get pagination range
  function getPaginationRange(
    currentPage: number, //Current page
    totalPages: number, //Total number of pages
    delta: number //Number of pages to show before first ellipsis and after the last ellipsis
  ): (number | string)[] {
    const boundaryCount = 1;

    const range: (number | string)[] = [];

    const left = Math.max(currentPage - delta, boundaryCount + 1);
    const right = Math.min(currentPage + delta, totalPages - boundaryCount);

    //Left boundary pages
    for (let i = 1; i <= boundaryCount; i++) {
      range.push(i);
    }

    //Ellipsis if gap exists on the left
    if (left > boundaryCount + 1) {
      range.push("···");
    }

    //Middle pages
    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    //Ellipsis if gap exists on the right
    if (right < totalPages - boundaryCount) {
      range.push("···");
    }

    //Right boundary pages
    for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
      if (i > boundaryCount) range.push(i); //Avoid duplication
    }

    return range;
  }

  //Pagination range
  const paginationRange = getPaginationRange(
    pagination.page,
    pagination.pages,
    1
  );

  //Handle previous
  function handlePrevious() {
    if (pagination.page === 1) return;

    setPage((prev) => prev - 1);
  }

  //Handle next
  function handleNext() {
    if (pagination.page === pagination.pages) return;

    setPage((prev) => prev + 1);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:w-max md:ml-auto">
      {/** Previous */}
      <div
        className={`flex-shrink-0 h-[35px] w-[35px] rounded-[6px] text-teal text-[15px] flex items-center justify-center p-1 border-[1px] border-teal cursor-pointer md:h-[40px] md:w-[40px] md:text-[16px] ${
          pagination.page === 1 &&
          "!border-gray !text-gray opacity-50 !cursor-not-allowed"
        }`}
        onClick={handlePrevious}
      >
        <ArrowLeft size="15.5" />
      </div>

      {/** Numbering */}
      {paginationRange.map((page, index) => {
        return (
          <div
            key={index}
            className={`flex-shrink-0 h-[35px] w-[35px] rounded-[6px] text-teal text-[15px] flex items-center justify-center p-1 border-[1px] border-teal cursor-pointer md:h-[40px] md:w-[40px] md:text-[16px] ${
              page !== "···" && "hover:bg-teal hover:text-white"
            } ${page === pagination.page && "bg-teal text-white"}`}
          >
            <span>{page}</span>
          </div>
        );
      })}

      {/** Next */}
      <div
        className={`flex-shrink-0 h-[35px] w-[35px] rounded-[6px] text-teal text-[15px] flex items-center justify-center p-1 border-[1px] border-teal cursor-pointer md:h-[40px] md:w-[40px] md:text-[16px] ${
          pagination.page === pagination.pages &&
          "!border-gray !text-gray opacity-50 !cursor-not-allowed"
        }`}
        onClick={handleNext}
      >
        <span className="inline-block rotate-180">
          <ArrowLeft size="15.5" />
        </span>
      </div>
    </div>
  );
}
