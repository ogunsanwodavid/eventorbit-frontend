"use client";

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn-ui/ui/select";

export interface SelectItems {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  defaultValue?: string;
  setValue: (arg: string) => void;
  items: SelectItems[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export default function Select({
  value,
  defaultValue,
  setValue,
  placeholder,
  items,
  disabled,
  error,
  triggerClassName,
  contentClassName,
  itemClassName,
}: SelectProps) {
  return (
    <ShadcnSelect
      value={value}
      onValueChange={(val) => setValue(val)}
      disabled={disabled}
    >
      <SelectTrigger
        className={`w-full text-[15px] text-black-2 !ring-0 data-[state=open]:border-[1px] data-[state=open]:border-teal rounded-[6px] !shadow-none focus:border-[1px] focus:border-teal ${
          error && "!border-error-red !bg-error-red-3"
        } ${triggerClassName}`}
      >
        <SelectValue placeholder={placeholder} defaultValue={defaultValue} />
      </SelectTrigger>

      {items.length > 0 && (
        <SelectContent className={`cursor-pointer ${contentClassName}`}>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className={`text-[15px] text-black-2
                ${value === item.value && " !text-teal"} ${itemClassName}
              `}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      )}
    </ShadcnSelect>
  );
}
