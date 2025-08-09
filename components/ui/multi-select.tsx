"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string };

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = React.useCallback(
    (val: string) => {
      onChange(
        value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
      );
    },
    [value, onChange]
  );

  return (
    <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
      <SelectPrimitive.Trigger
        aria-haspopup="listbox"
        className={cn(
          "inline-flex w-full min-h-10 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          value.length === 0 && "text-muted-foreground"
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {value.length > 0 ? (
            options
              .filter((o) => value.includes(o.value))
              .map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center rounded bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                >
                  {opt.label}
                </span>
              ))
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDownIcon className="h-4 w-4 opacity-50 ml-2" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          style={{ width: "var(--radix-select-trigger-width)" }}
          className="overflow-hidden z-[100] rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          <SelectPrimitive.ScrollUpButton />
          <SelectPrimitive.Viewport className="p-1 max-h-[var(--radix-select-content-available-height)]">
            {options.map(({ value: val, label }) => {
              const isSelected = value.includes(val);

              return (
                <SelectPrimitive.Item
                  key={val}
                  value={val}
                  onPointerDown={(e) => {
                    e.preventDefault(); // stops Radix’s single‑select logic
                    toggleValue(val); // update your array
                    setOpen(true); // keep the dropdown open
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-8 py-2 text-sm outline-none",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                  {isSelected && (
                    <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <CheckIcon className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  )}
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
