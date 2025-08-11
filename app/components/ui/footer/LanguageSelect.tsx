import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn-ui/ui/select";
import { useState } from "react";

export default function LanguageSelect() {
  //Select value
  //::English as default
  const [value, setValue] = useState<string>("english");

  //Select items
  const items = [{ value: "english", label: "English" }];

  return (
    <Select value={value} onValueChange={(val) => setValue(val)}>
      <SelectTrigger className="w-full text-[15px] text-[#0e0e0e] !ring-0 data-[state=open]:border-[2px] data-[state=open]:border-black focus:border-[2px] focus:border-black">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="text-[15px] text-[#0e0e0e]">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className={`
                ${
                  value === item.value
                    ? "!bg-teal !font-medium !text-white"
                    : ""
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
