"use client";

import * as Popover from "@radix-ui/react-popover";
import { DayPicker, DateRange } from "react-day-picker";
import dayjs from "dayjs";
import "react-day-picker/dist/style.css";

export default function DateRangeSelector({
  selectedRange,
  onChange,
}: {
  selectedRange: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, "month");

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="border rounded-md px-4 py-2 text-sm bg-white shadow-md">
          {selectedRange?.from && selectedRange?.to
            ? `${dayjs(selectedRange.from).format("MMM D, YYYY")} - ${dayjs(
                selectedRange.to
              ).format("MMM D, YYYY")}`
            : "Select Date Range"}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white p-4 rounded-md shadow-md z-50">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onChange(range);
              }
            }}
            numberOfMonths={2}
            defaultMonth={oneMonthAgo.toDate()}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
