import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";
import { cn } from "../../_lib/_utils";

export function _Calendar({ mode = "single", selected, onSelect, className }) {
  const handleSelect = (range) => {
    if (mode === "range" && range?.from && !range.to) {
      range.to = range.from;
    }
    onSelect?.(range);
  };

  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={handleSelect} // ✅ 수정된 핸들러 사용
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