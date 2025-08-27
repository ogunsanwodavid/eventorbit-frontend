"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn-ui/ui/select";

interface ProfileVisbilitySelectProps {
  isPrivate: boolean;
  setIsPrivate: (arg: boolean) => void;
  disabled?: boolean;
}

export default function ProfileVisibilitySelect({
  isPrivate,
  setIsPrivate,
  disabled,
}: ProfileVisbilitySelectProps) {
  //Select items
  const items = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  return (
    <Select
      value={isPrivate ? "private" : "public"}
      onValueChange={(val) => setIsPrivate(val === "private")}
      disabled={disabled}
    >
      <SelectTrigger className="w-full text-[15px] text-black-2 !ring-0 data-[state=open]:border-[1px] data-[state=open]:border-teal focus:border-[1px] focus:border-teal">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="cursor-pointer">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className={`!text-[15px] !text-black-2
                ${
                  (isPrivate ? "private" : "public") === item.value &&
                  " !text-teal "
                }
              `}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
