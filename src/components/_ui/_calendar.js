// components/ui/calendar.js
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";
import { cn } from "../../lib/utils";

export function _calendar({ mode = "single", selected, onSelect, className }) {
  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      locale={ko}
      className={cn("bg-white p-4 rounded-xl shadow-md", className)}
      modifiersClassNames={{
        selected: "bg-blue-500 text-white",
        today: "text-blue-600 font-bold",
      }}
      captionLayout="dropdown"
      fromYear={2020}
      toYear={2030}
    />
  );
}