"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from "./select";



export function AppSelect({ listLabel, label, requiredField = false, listItems, placeholder, value, onChange, width = 'w-full', triggerStyle = 'border-gray-300' }: {
  listLabel?: string,
  label?: string,
  requiredField?: boolean,
  listItems: { label: string, value: string }[],
  placeholder?: string,
  value?: string
  onChange: (value: string) => void,
  width?: string,
  triggerStyle?: string
}) {
  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <div className={`flex flex-col gap-2 ${width}`}>
        {label && (
          <p
            className={`text-xs font-semibold flex justify-start w-full ${requiredField ? 'after:content-["*"] after:text-red-500 after:ml-1 after:font-bold' : ""}`}
          >
            {label}
          </p>
        )}

        <SelectTrigger
          className={`${triggerStyle} h-[34px] text-xs transition-all duration-300 placeholder:text-gray-400 outline-none focus focus:ring-1 focus:ring-offset-0 focus:ring-primary ${width}`}
        >
          <SelectValue
            className="placeholder:text-gray-400 text-xs placeholder:text-xs"
            placeholder={<p className="text-gray-400 text-xs">{placeholder}</p>}
            defaultValue={value}
          />
        </SelectTrigger>

        <SelectContent className="bg-white p-0">
          <SelectGroup className="flex flex-col justify-start p-0 text-xs">
            {listItems.length > 0 && listLabel ? (
              <SelectLabel className="text-xs px-2">{listLabel}</SelectLabel>
            ) : null}

            {listItems.map((item) => (
              <SelectItem
                key={item.value}
                className="hover:bg-gray-300 hover:rounded-md cursor-pointer text-xs px-2"
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </div>
    </Select>
  );
}
