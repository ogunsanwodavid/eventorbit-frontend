"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn-ui/ui/select";

interface CategorySelectProps {
  category: string;
  setCategory: (arg: string) => void;
  disabled?: boolean;
}

export default function CategorySelect({
  category,
  setCategory,
  disabled,
}: CategorySelectProps) {
  //Select items
  const items = [
    { value: "food and drinks", label: "Food & Drinks" },
    { value: "social", label: "Social" },
    { value: "music", label: "Music" },
    { value: "crafts", label: "Crafts" },
    { value: "sports", label: "Sports" },
    { value: "comedy", label: "Comedy" },
    { value: "film", label: "Film" },
    { value: "performances", label: "Performances" },
    { value: "fashion", label: "Fashion" },
    { value: "galleries", label: "Galleries" },
    { value: "tech", label: "Tech" },
    { value: "business", label: "Business" },
    { value: "others", label: "Others" },
  ];

  return (
    <Select
      value={category}
      onValueChange={(val) => setCategory(val)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full text-[15px] text-black-2 !ring-0 data-[state=open]:border-[1px] data-[state=open]:border-teal focus:border-[1px] focus:border-teal">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="cursor-pointer">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className={`!text-[15px] !text-black-2
                ${category === item.value && " !text-teal "}
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
